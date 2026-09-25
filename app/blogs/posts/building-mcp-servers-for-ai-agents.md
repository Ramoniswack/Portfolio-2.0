title: "Building Production-Ready MCP Servers for Autonomous AI Agents"
date: "Feb 22, 2026"
category: "AI & Engineering"

# Building Production-Ready MCP Servers for Autonomous AI Agents

For the past year, the industry approached AI agent integration with a fragmented mess of custom REST wrappers, OpenAI function schemas, and ad-hoc webhook endpoints. Every time you wanted Claude, ChatGPT, or Cursor to query your database or interact with your backend service, you had to reinvent tool definitions, write custom OpenAPI glue, and pray the model understood your arbitrary JSON formats.

Then came Anthropic's open-source **Model Context Protocol (MCP)**.

MCP is to AI agents what Language Server Protocol (LSP) was to code editors. Instead of building bespoke API bridges for every single model and tool, MCP establishes a universal, bi-directional standard: you build an MCP server once, and any compliant agent (Claude Desktop, Cursor, Zed, custom LangChain/CrewAI agents) can discover tools, read context resources, and execute commands safely.

In this deep dive, I'll walk you through building a production-ready, secure MCP server in TypeScript that connects an AI agent directly to a live PostgreSQL database and internal microservices.

---

## 1. Understanding the Core MCP Architecture

An MCP implementation revolves around three fundamental primitives:

1. **Resources**: Passive, read-only data that the agent can inspect as background context (e.g. database schemas, log files, system metrics).
2. **Prompts**: Pre-structured prompt templates that guide the agent on how to approach domain-specific workflows.
3. **Tools**: Executable functions that allow the agent to perform actions or fetch computed data (e.g. executing parameterized SQL queries, triggering deployments, sending invoices).

Communication happens over either **stdio** (standard input/output, ideal for local desktop clients like Cursor or Claude Desktop) or **SSE (Server-Sent Events) over HTTP** (ideal for remote servers and distributed agents).

```
┌────────────────────────────────────────────────────────┐
│                      Host / Client                     │
│               (Cursor / Claude Desktop / Agent)        │
└──────────────────────────┬─────────────────────────────┘
                           │  JSON-RPC 2.0 (stdio or SSE)
                           ▼
┌────────────────────────────────────────────────────────┐
│                   Custom MCP Server                    │
│   ┌──────────────┐   ┌──────────────┐   ┌──────────┐   │
│   │  Resources   │   │    Tools     │   │ Prompts  │   │
│   │ (DB Schemas) │   │ (Safe Query) │   │ (Guides) │   │
│   └──────┬───────┘   └──────┬───────┘   └──────────┘   │
└──────────┼──────────────────┼──────────────────────────┘
           │                  │
           ▼                  ▼
   [ PostgreSQL ]      [ Internal APIs ]
```

---

## 2. Setting Up the TypeScript MCP Server

Let's initialize our project with the official `@modelcontextprotocol/sdk` and `zod` for strict runtime schema validation:

```bash
mkdir db-mcp-server && cd db-mcp-server
npm init -y
npm install @modelcontextprotocol/sdk zod pg dotenv
npm install -D typescript @types/node @types/pg tsx
npx tsc --init
```

Now, let's build `src/server.ts`:

```typescript
// src/server.ts
import { Server } from "@modelcontextprotocol/sdk/server/index.js"
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js"
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
  ListResourcesRequestSchema,
  ReadResourceRequestSchema,
} from "@modelcontextprotocol/sdk/types.js"
import { z } from "zod"
import pg from "pg"
import dotenv from "dotenv"

dotenv.config()

const { Pool } = pg
const db = new Pool({
  connectionString: process.env.DATABASE_URL,
  max: 10,
  idleTimeoutMillis: 30000,
})

// Initialize the MCP server instance
const server = new Server(
  {
    name: "enterprise-db-agent",
    version: "1.0.0",
  },
  {
    capabilities: {
      tools: {},
      resources: {},
    },
  }
)
```

---

## 3. Registering Read-Only Context Resources

Before an agent can write accurate queries or reason about your database, it needs to know what tables and columns exist without hallucinating column names.

We register a resource URI (`postgres://schema`) that provides live database DDL metadata:

```typescript
// Expose database schema as a discoverable resource
server.setRequestHandler(ListResourcesRequestSchema, async () => {
  return {
    resources: [
      {
        uri: "postgres://schema/public",
        name: "Public Database Schema DDL",
        mimeType: "text/plain",
        description: "PostgreSQL table definitions, foreign keys, and indexes",
      },
    ],
  }
})

server.setRequestHandler(ReadResourceRequestSchema, async (request) => {
  if (request.params.uri === "postgres://schema/public") {
    const ddlQuery = `
      SELECT table_name, column_name, data_type, is_nullable
      FROM information_schema.columns
      WHERE table_schema = 'public'
      ORDER BY table_name, ordinal_position;
    `
    const { rows } = await db.query(ddlQuery)
    
    // Group and format as readable markdown table definitions
    const schemaSummary = rows.reduce((acc, row) => {
      acc[row.table_name] = acc[row.table_name] || []
      acc[row.table_name].push(`  - ${row.column_name}: ${row.data_type} (nullable: ${row.is_nullable})`)
      return acc
    }, {} as Record<string, string[]>)

    const textPayload = Object.entries(schemaSummary)
      .map(([table, cols]) => `TABLE ${table}:\n${cols.join("\n")}`)
      .join("\n\n")

    return {
      contents: [
        {
          uri: request.params.uri,
          mimeType: "text/plain",
          text: textPayload,
        },
      ],
    }
  }

  throw new Error(`Resource not found: ${request.params.uri}`)
})
```

---

## 4. Defining Safe, Validated Tools with Zod

Giving an AI agent raw access to run `DROP TABLE` or mutate records without guardrails is a recipe for disaster. Production MCP servers must enforce:

- **Strict read-only transactions** for exploratory queries.
- **Query timeouts** to prevent unbounded joins from locking your database.
- **Max row limits** to avoid blowing up the LLM's context window.

Let's register two tools: `run_analytics_query` (read-only) and `get_customer_metrics` (parameterized):

```typescript
// 1. List available tools to the agent
server.setRequestHandler(ListToolsRequestSchema, async () => {
  return {
    tools: [
      {
        name: "run_read_only_sql",
        description: "Executes a SELECT query against PostgreSQL. Modifying statements (INSERT, UPDATE, DELETE, DROP) are strictly blocked.",
        inputSchema: {
          type: "object",
          properties: {
            sql: {
              type: "string",
              description: "The SQL SELECT statement to execute",
            },
            limit: {
              type: "number",
              description: "Max number of rows to return (default: 50, max: 200)",
            },
          },
          required: ["sql"],
        },
      },
      {
        name: "get_restaurant_kpis",
        description: "Fetches aggregated revenue, order count, and average order value for a given date range.",
        inputSchema: {
          type: "object",
          properties: {
            restaurant_id: { type: "string" },
            start_date: { type: "string", description: "ISO 8601 date string (YYYY-MM-DD)" },
            end_date: { type: "string", description: "ISO 8601 date string (YYYY-MM-DD)" },
          },
          required: ["restaurant_id", "start_date", "end_date"],
        },
      },
    ],
  }
})

// 2. Handle tool execution requests
server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const { name, arguments: args } = request.params

  if (name === "run_read_only_sql") {
    const input = z.object({
      sql: z.string(),
      limit: z.number().min(1).max(200).default(50),
    }).parse(args)

    // Security check: Block data manipulation keywords
    const forbidden = /\b(INSERT|UPDATE|DELETE|DROP|ALTER|TRUNCATE|GRANT|REVOKE)\b/i
    if (forbidden.test(input.sql)) {
      return {
        isError: true,
        content: [{ type: "text", text: "Security Error: Non-SELECT statements are forbidden." }],
      }
    }

    const client = await db.connect()
    try {
      // Force read-only transaction with a 3-second statement timeout
      await client.query("BEGIN READ ONLY;")
      await client.query("SET LOCAL statement_timeout = '3000ms';")
      
      const limitedSql = `SELECT * FROM (${input.sql}) AS subquery LIMIT ${input.limit};`
      const result = await client.query(limitedSql)
      await client.query("COMMIT;")

      return {
        content: [
          {
            type: "text",
            text: JSON.stringify({ rowCount: result.rowCount, data: result.rows }, null, 2),
          },
        ],
      }
    } catch (err: any) {
      await client.query("ROLLBACK;")
      return {
        isError: true,
        content: [{ type: "text", text: `SQL Execution Failed: ${err.message}` }],
      }
    } finally {
      client.release()
    }
  }

  throw new Error(`Tool not recognized: ${name}`)
})
```

---

## 5. Connecting Your MCP Server to Claude Desktop & Cursor

Once your server is built, you start the stdio transport in `server.ts`:

```typescript
async function main() {
  const transport = new StdioServerTransport()
  await server.connect(transport)
  // Note: NEVER use console.log in stdio servers! All stdout is reserved for JSON-RPC messages.
  process.stderr.write("Enterprise Database MCP Server running on stdio\n")
}

main().catch((err) => {
  process.stderr.write(`Fatal MCP Server Error: ${err.stack}\n`)
  process.exit(1)
})
```

To connect this server directly to **Claude Desktop**, add this snippet to your `claude_desktop_config.json`:

```json
{
  "mcpServers": {
    "enterprise-postgres": {
      "command": "npx",
      "args": ["-y", "tsx", "/path/to/db-mcp-server/src/server.ts"],
      "env": {
        "DATABASE_URL": "postgresql://postgres:secret@localhost:5432/production"
      }
    }
  }
}
```

When you launch Claude Desktop, a hammer icon appears. You can now prompt Claude:
> *"Inspect the public schema, find the top 5 restaurants by gross revenue in January 2026, and tell me which menu categories had the highest cancellations."*

Claude will inspect the schema resource, write the exact SQL query, execute it through your MCP tool in under 150ms, and return a synthesized analytical report with zero human intervention.

---

## 6. Real-World Gotchas & Lessons Learned

1. **Stdout is Sacred**: The most common beginner bug in MCP servers is writing `console.log("Connected to DB")`. Because stdio transport uses standard output for JSON-RPC frame delivery, any non-protocol text instantly crashes the connection. Always redirect internal logs to `process.stderr` or file-based loggers.
2. **Context Blowup**: Models can't digest 10,000 JSON rows without hallucinating or running out of context. Always enforce pagination and default limits (e.g. `LIMIT 50`) on your query tools.
3. **Transaction Timeouts**: AI agents will occasionally attempt accidental cross-joins or complex nested loops. Always set `statement_timeout = '3000ms'` inside your database session to keep rogue agent queries from starving production threads.

MCP bridges the gap between passive chat assistants and true autonomous software engineers. By building structured, secure servers with proper schema boundaries, you enable AI to interact with your real-world stack safely.
