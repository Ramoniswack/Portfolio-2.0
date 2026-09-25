title: "I Got Tired of Gluing REST APIs to AI Models, So I Built an MCP Server"
date: "Feb 22, 2026"
category: "AI & Engineering"

# I Got Tired of Gluing REST APIs to AI Models, So I Built an MCP Server

For the past year, my workflow for building AI features was starting to feel like a glorified plumbing job.

Every time I wanted Claude or Cursor or an internal script to interact with our database, I found myself doing the exact same tedious dance: writing custom OpenAI function calling schemas, stringifying JSON payloads, building a temporary webhook, and praying the model didn't hallucinate an invalid parameter.

If I wanted the same tool to work inside Cursor and then test it in Claude Desktop, I had to rewrite the integration almost from scratch.

Then Anthropic announced the **Model Context Protocol (MCP)**. 

At first, I rolled my eyes. "Great, another AI abstraction layer we definitely didn't ask for." But out of curiosity over the weekend, I decided to build a simple MCP server that would let Claude safely query our development database.

Two hours later, I was genuinely blown away. Here’s what MCP actually is, how it works in practice, and the dumb mistakes I made while getting it running.

## What is MCP, Plain and Simple?

Think about how Language Server Protocol (LSP) revolutionized code editors a few years ago. Before LSP, if someone made a new language, they had to write separate plugins for VS Code, Sublime Text, Vim, and IntelliJ. With LSP, you write the language server once, and any editor that supports LSP gets autocomplete, definitions, and diagnostics for free.

MCP is doing the exact same thing, but for AI agents.

Instead of writing custom API bridges for every single AI app, you write an **MCP Server** that exposes:
1. **Resources**: Passive background context (like your database schema or logs).
2. **Tools**: Functions the AI is allowed to call (like running a safe SQL query or sending a Slack message).

Any MCP-compatible client—whether it's Claude Desktop, Cursor, Zed, or a custom script—can instantly connect to your server, discover what it can do, and use it safely.

## Building a Dead-Simple Database MCP Server

Let's build a practical MCP server in TypeScript that gives an AI model read-only access to a PostgreSQL database so you can ask natural-language questions about your data.

First, set up a basic Node/TypeScript project:

```bash
mkdir my-db-mcp && cd my-db-mcp
npm init -y
npm install @modelcontextprotocol/sdk pg zod dotenv
npm install -D typescript @types/node @types/pg tsx
```

### The Server Code

Here is the clean implementation in `src/index.ts`:

```typescript
import { Server } from "@modelcontextprotocol/sdk/server/index.js"
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js"
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} from "@modelcontextprotocol/sdk/types.js"
import { z } from "zod"
import pg from "pg"
import dotenv from "dotenv"

dotenv.config()

const pool = new pg.Pool({
  connectionString: process.env.DATABASE_URL,
})

const server = new Server(
  { name: "postgres-inspector", version: "1.0.0" },
  { capabilities: { tools: {} } }
)

// 1. Tell the AI what tools are available
server.setRequestHandler(ListToolsRequestSchema, async () => {
  return {
    tools: [
      {
        name: "query_database",
        description: "Runs a safe, read-only SELECT query against the database.",
        inputSchema: {
          type: "object",
          properties: {
            sql: {
              type: "string",
              description: "The SELECT query to run.",
            },
          },
          required: ["sql"],
        },
      },
    ],
  }
})

// 2. Handle the tool call when the AI invokes it
server.setRequestHandler(CallToolRequestSchema, async (request) => {
  if (request.params.name === "query_database") {
    const { sql } = z.object({ sql: z.string() }).parse(request.params.arguments)

    // Basic safety guard: reject anything modifying data
    const dangerousWords = ["insert", "update", "delete", "drop", "alter", "truncate"]
    const lower = sql.toLowerCase()
    if (dangerousWords.some((word) => lower.includes(word))) {
      return {
        isError: true,
        content: [{ type: "text", text: "Security block: Only read-only queries are allowed." }],
      }
    }

    try {
      const result = await pool.query(sql)
      return {
        content: [
          {
            type: "text",
            text: JSON.stringify(result.rows.slice(0, 50), null, 2),
          },
        ],
      }
    } catch (err: any) {
      return {
        isError: true,
        content: [{ type: "text", text: `Database error: ${err.message}` }],
      }
    }
  }

  throw new Error("Tool not found")
})

async function run() {
  const transport = new StdioServerTransport()
  await server.connect(transport)
}

run()
```

## Hooking It Up to Claude Desktop

Connecting your new server to Claude Desktop takes about 30 seconds. 

Open your Claude Desktop config file (on Windows, it’s at `%APPDATA%\Claude\claude_desktop_config.json`, or on Mac `~/Library/Application Support/Claude/claude_desktop_config.json`) and add your server:

```json
{
  "mcpServers": {
    "my-database": {
      "command": "npx",
      "args": ["-y", "tsx", "C:/path/to/my-db-mcp/src/index.ts"],
      "env": {
        "DATABASE_URL": "postgresql://postgres:password@localhost:5432/mydb"
      }
    }
  }
}
```

Restart Claude Desktop, and you’ll see a little hammer icon in the bottom right corner of the chat box.

Now, instead of writing SQL queries in pgAdmin or Beekeeper, you can simply type:
> *"What were our top 5 best-selling menu items last Tuesday, and what was the average bill total?"*

Claude inspects the tool, writes the exact SQL join, runs it through your local MCP server, and presents the answer in clean bullet points. It feels like having a junior data analyst sitting right next to you.

## The Gotchas That Took Me Way Too Long to Figure Out

Here are two things that tripped me up during my first evening with MCP:

### 1. The Console.log Trap
This cost me an hour of debugging. If you run your server over `stdio` (which is standard for desktop apps), **you cannot use `console.log()` anywhere in your code**. 

Why? Because the MCP client and your server communicate by reading and writing raw JSON messages over standard output. If you add a stray `console.log("Connected to DB!")`, your server prints a plain text string instead of valid JSON, and Claude Desktop will immediately throw a handshake parsing error and disconnect.

If you need debug logs, write them to standard error instead:
```typescript
process.stderr.write("Connected to database successfully\n")
```

### 2. Context Windows Fill Up Fast
If your query returns 5,000 rows of user data, dumping all that JSON directly into the tool response will either blow past the model’s context limit or cost you a fortune in tokens. Always add a `LIMIT` clause or truncate the results to the first 50 rows.

## Why I'm Sold on MCP

I went into MCP expecting hype, but came out convinced it’s the direction all developer tooling is heading. 

Instead of treating AI models as chat boxes that live in a separate browser tab, MCP turns models into active teammates that can safely inspect your codebase, query your test environments, and run diagnostics without you having to copy-paste context back and forth all day.

If you build tools for developers or internal teams, spend an afternoon playing with the MCP SDK. It might just save you hundreds of hours of glue-code down the road.
