title: "Scaling Yummyever: Real-World Architecture for 100+ Multi-Tenant Restaurants"
date: "Feb 15, 2026"
category: "Architecture"

# Scaling Yummyever: Real-World Architecture for 100+ Multi-Tenant Restaurants

When my co-founder and I launched [Yummyever](https://app.yummyever.com), our initial MVP was a straightforward monolithic web app. We wanted a clean QR-code ordering system and IRD-compliant (Inland Revenue Department) billing for local restaurants. It worked wonderfully when we had three cafes running on it during beta testing.

Then, we scaled to 10 restaurants. Then 40. Then past 100.

At 100+ active venues, Friday night peak service isn't a theoretical load test—it's thousands of customers simultaneously scanning table QR codes, waiters firing Kitchen Order Tickets (KOT) on tablets, and cashiers generating fiscal invoices every second. If your database locks up for 8 seconds, kitchen tickets get delayed, hungry patrons get furious, and restaurant managers call your phone in a panic.

Here is the unfiltered engineering breakdown of how we re-architected Yummyever from an MVP into a resilient multi-tenant SaaS platform capable of sustaining high concurrency during peak dining rush.

---

## 1. The Multi-Tenancy Bottleneck: Tenant Isolation & Routing

In early versions, every SQL query had a `WHERE restaurant_id = ?` clause appended manually. While fine for 5 restaurants, this approach is a disaster waiting to happen:

1. **Human Error**: One forgotten `WHERE` clause in a complex report query could leak financial or menu data between competing restaurants.
2. **Database Contention**: High-volume restaurants with 2,000 daily orders ran on the same database tables as small coffee shops, causing noisy neighbor issues and query cache churn.

### Our Solution: Hybrid Schema-Per-Tenant with Dynamic Connection Pooling

We moved to a hybrid multi-tenant model in PostgreSQL. Metadata (tenants, subscriptions, global user accounts) lives in a shared `public` schema, while tenant-specific operational data (orders, inventory, tables, KOTs) lives in dedicated tenant schemas (`tenant_restaurant_a`, `tenant_restaurant_b`).

In FastAPI, we resolve the tenant dynamically via custom subdomains or request headers through a dependency injection pipeline:

```python
# app/core/dependencies.py
from fastapi import Request, HTTPException, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from app.db.session import async_session_factory

async def get_tenant_schema(request: Request) -> str:
    # Resolve from custom domain or subdomain (e.g. cafe-urban.yummyever.com)
    host = request.headers.get("host", "")
    subdomain = host.split(".")[0]
    
    tenant = await resolve_tenant_cache(subdomain)
    if not tenant or not tenant.is_active:
        raise HTTPException(status_code=404, detail="Restaurant tenant not found or inactive")
        
    return f"tenant_{tenant.slug}"

async def get_db_session(schema: str = Depends(get_tenant_schema)) -> AsyncSession:
    async with async_session_factory() as session:
        # Set PostgreSQL search_path dynamically for this connection
        await session.execute(f"SET search_path TO {schema}, public;")
        yield session
```

By setting the PostgreSQL `search_path` per request session, application queries don't even need to know the tenant exists. Running `SELECT * FROM orders` automatically queries only that specific restaurant's isolated schema. Complete data isolation with zero chance of cross-tenant leaks.

---

## 2. Replacing REST Polling with Redis Pub/Sub WebSockets

In our early MVP, kitchen display screens and waiter handhelds polled `GET /api/orders/pending` every 3 seconds. With 100 restaurants having 4 screens each, that equaled over **8,000 HTTP requests per minute** hitting the database just to ask "is there anything new?" 99% of the time, the answer was "no".

During peak dinner hours, this pointless polling ate 80% of our CPU.

### The Real-Time WebSocket Hub

We killed polling completely and built an asynchronous WebSocket gateway using FastAPI and Redis Pub/Sub:

```
[ Customer Phone / Table QR ] ───> [ POST /orders ]
                                          │
                                          ▼
                                   [ Save to Postgres ]
                                          │
                                          ▼
                              [ Publish to Redis Channel: ]
                              [ "events:{restaurant_id}" ]
                                          │
                  ┌───────────────────────┴───────────────────────┐
                  ▼                                               ▼
      [ Kitchen Display Screen ]                      [ Waiter Tablet ]
      (WebSocket: /ws/{tenant})                       (WebSocket: /ws/{tenant})
```

Here is a simplified look at our WebSocket manager handling tenant-scoped broadcasts:

```python
# app/services/websocket_manager.py
import asyncio
from typing import Dict, Set
from fastapi import WebSocket
import redis.asyncio as aioredis

class RestaurantConnectionManager:
    def __init__(self):
        self.active_connections: Dict[str, Set[WebSocket]] = {}
        self.redis_client = aioredis.from_url("redis://localhost:6379")

    async def connect(self, restaurant_id: str, websocket: WebSocket):
        await websocket.accept()
        if restaurant_id not in self.active_connections:
            self.active_connections[restaurant_id] = set()
            # Start background subscriber for this restaurant if first connection
            asyncio.create_task(self._listen_to_channel(restaurant_id))
        self.active_connections[restaurant_id].add(websocket)

    async def broadcast_order(self, restaurant_id: str, message: dict):
        # Publish to Redis so all worker processes/instances receive the update
        await self.redis_client.publish(f"kot:{restaurant_id}", json.dumps(message))

    async def _listen_to_channel(self, restaurant_id: str):
        pubsub = self.redis_client.pubsub()
        await pubsub.subscribe(f"kot:{restaurant_id}")
        async for msg in pubsub.listen():
            if msg["type"] == "message":
                data = msg["data"].decode("utf-8")
                # Broadcast immediately to all connected screens in this restaurant
                dead_sockets = set()
                for ws in self.active_connections.get(restaurant_id, set()):
                    try:
                        await ws.send_text(data)
                    except Exception:
                        dead_sockets.add(ws)
                self.active_connections[restaurant_id] -= dead_sockets
```

**Result**: Latency from a customer hitting "Confirm Order" on their smartphone to the kitchen printer spitting out the receipt dropped from **3–5 seconds down to under 40 milliseconds**. Database CPU usage plummeted from 85% to less than 12%.

---

## 3. High-Speed Digital Menus with Next.js ISR & Edge Caching

When a restaurant gets packed with 80 tables and customers sit down, they all scan the table QR code at the same time. Having 80 mobile devices hit an API that executes complex joins (`categories` -> `items` -> `modifiers` -> `pricing` -> `allergens`) is an inefficient waste of computing power.

Menu data changes maybe once a week, yet it was being queried hundreds of times an hour.

We leveraged Next.js **Incremental Static Regeneration (ISR)** and Stale-While-Revalidate caching:

```typescript
// app/[tenant]/menu/page.tsx
export const revalidate = 1800 // Revalidate cache in background every 30 minutes

export async function generateStaticParams() {
  const tenants = await getActiveRestaurantSlugs()
  return tenants.map((tenant) => ({ tenant }))
}

export default async function MenuPage({ params }: { params: { tenant: string } }) {
  const menuData = await getCachedMenu(params.tenant)
  
  return (
    <main className="menu-container">
      <MenuHeader restaurant={menuData.restaurant} />
      <CategoryNav categories={menuData.categories} />
      <MenuList items={menuData.items} />
    </main>
  )
}
```

Whenever a chef modifies an item price or marks a dish as "Sold Out" from their dashboard, we dispatch an on-demand revalidation webhook:

```typescript
// app/api/revalidate/route.ts
import { revalidatePath } from 'next/cache'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  const { tenant, secret } = await req.json()
  
  if (secret !== process.env.REVALIDATION_SECRET) {
    return NextResponse.json({ message: 'Invalid token' }, { status: 401 })
  }

  // Purge only this specific restaurant's menu from the Next.js cache
  revalidatePath(`/${tenant}/menu`)
  return NextResponse.json({ revalidated: true, now: Date.now() })
}
```

Customers get blazing-fast sub-50ms static HTML loads directly from memory or CDN cache, while restaurant managers still enjoy instant updates when marking a dish out-of-stock.

---

## 4. Offline Resilience & IRD Fiscal Compliance

In our market, government regulations require strict fiscal compliance: every invoice generated must be cryptographically hashed, sequentially numbered without gaps, and reported to the tax authority's sync server. 

The catch? Restaurant Wi-Fi goes down all the time. Kitchens have dead zones. If internet drops and your POS stops working, customers can't pay their bill and leave.

We engineered an **offline-first queue using IndexedDB and Service Workers on the cashier client**:

1. **Local State Engine**: The POS UI operates against an in-browser SQLite / IndexedDB layer. If the internet dies, cashiers can continue taking orders and printing physical tax bills uninterrupted.
2. **Deterministic Sequence Generator**: Invoice counters are reserved in lease blocks (e.g. client is granted invoice numbers #5001 to #5100).
3. **Background Reconciliation with BullMQ**: Once connection restores, the client batches pending invoices to `/api/fiscal/sync`. On the server, a **BullMQ job queue with Redis** validates each receipt, stamps it with the IRD digital signature, and synchronizes with the tax department asynchronously with automated retries and exponential backoff.

```typescript
// BullMQ worker configuration for background IRD reporting
import { Worker } from 'bullmq'
import { submitFiscalInvoiceToGovernment } from './taxApi'

export const fiscalSyncWorker = new Worker(
  'fiscal-sync-queue',
  async (job) => {
    const { invoiceId, restaurantId, retryCount } = job.data
    const invoice = await getInvoice(invoiceId, restaurantId)
    
    // Remote government tax portal endpoint
    const response = await submitFiscalInvoiceToGovernment(invoice)
    if (!response.success) {
      throw new Error(`Tax portal returned status: ${response.code}`)
    }
    
    await markInvoiceSynced(invoiceId, response.fiscalHash)
  },
  {
    connection: { host: 'localhost', port: 6379 },
    concurrency: 5,
    limiter: { max: 20, duration: 1000 }, // Prevent throttling from tax API
  }
)
```

---

## 5. Production Infrastructure: Zero-Downtime Linux VPS Setup

Running a multi-tenant POS platform means maintenance windows don't exist. When breakfast restaurants close at 11 PM, late-night bars are operating at peak capacity until 3 AM.

We host Yummyever across dedicated Linux VPS instances using Docker Compose, reverse-proxied behind Nginx with automated SSL via Certbot.

### Key Nginx Optimizations:
- **WebSocket Upgrade Headers**:
  ```nginx
  proxy_http_version 1.1;
  proxy_set_header Upgrade $http_upgrade;
  proxy_set_header Connection "upgrade";
  proxy_read_timeout 86400s; # Keep WebSocket alive without timeouts
  ```
- **Micro-caching of API responses**: Cache static assets and menu payloads for 60 seconds at the Nginx layer with `proxy_cache_use_stale updating;`.
- **Systemd & PM2 Watchdogs**: Auto-restarting services on unexpected memory pressure with zero client impact.

---

## Conclusion & What’s Next

Scaling Yummyever from a weekend prototype to 100+ daily restaurant venues taught me that architecture isn't about choosing the trendiest buzzwords—it's about understanding failure modes.

- Isolate your tenants early to prevent noisy neighbors and data leaks.
- Replace polling with Pub/Sub WebSockets the moment concurrency matters.
- Never trust client internet connections in brick-and-mortar retail; build offline queues.
- Let Next.js and static caches handle the read-heavy traffic so your database can focus purely on transactional integrity.

Today, Yummyever processes tens of thousands of orders weekly across Nepal, and this architecture has given us the foundation to scale to our next milestone of 500+ restaurants without breaking a sweat.
