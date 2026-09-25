title: "What Happened When 100 Restaurants Started Using My App on a Friday Night"
date: "Feb 15, 2026"
category: "Architecture"

# What Happened When 100 Restaurants Started Using My App on a Friday Night

It was 8:45 PM on a Friday evening, and I was about to sit down for dinner when my phone started vibrating off the desk.

It was a restaurant manager in Pokhara. "Ramon, the kitchen tablet isn't showing the table 4 order, and the cashier screen is frozen." Two minutes later, another notification popped up from a cafe in Kathmandu. 

Friday night dinner rush had officially arrived, and our architecture was sweating bullets.

When my co-founder and I built [Yummyever](https://app.yummyever.com), everything was peaceful. We had three local cafes testing it out during our beta phase. The app was fast, our database queries were snappy, and we thought we had built something bulletproof. 

Then we grew. 10 restaurants became 30, and within a few months, we crossed 100 active restaurant clients. 

Here’s the story of what broke, the dumb mistakes we made, and how we actually fixed them so we could sleep through Friday nights again.

## Mistake #1: The Polling Nightmare

In the early prototype, I took the easiest path to get real-time kitchen tickets working. Every kitchen screen and waiter tablet ran a `setInterval` that polled our backend every 3 seconds:

```typescript
// Don't ever do this in production at scale
setInterval(async () => {
  const res = await fetch(`/api/orders/pending?restaurant_id=${id}`)
  const orders = await res.json()
  updateKitchenScreen(orders)
}, 3000)
```

It worked fine for 5 restaurants. But do the math when you have 100 restaurants, each with 3 or 4 screens (cashier, kitchen, bar, waiter phone). 

That’s around 400 client devices pinging our server every 3 seconds. That’s roughly **8,000 HTTP requests hitting the database every single minute**, with 99.9% of those requests returning an empty array because nobody placed an order in those 3 seconds.

During dinner rush, our database CPU was pegged at 95%, not because of real orders, but because hundreds of tablets were asking "Anything new yet? How about now? Now?"

### The Fix: Redis Pub/Sub and WebSockets

We threw away polling and replaced it with a persistent WebSocket connection backed by Redis Pub/Sub. 

Instead of clients constantly asking for data, the server stays dead silent until an order is actually placed. When a customer scans a table QR code and submits an order, our FastAPI backend saves it to Postgres and immediately publishes a tiny event to a Redis channel dedicated to that restaurant.

The difference was night and day. The moment a customer taps "Order" on their phone, the kitchen screen dings in about 35 milliseconds. And best of all, our database CPU dropped from 95% down to barely 10%.

## Mistake #2: The One Forgotten "WHERE" Clause

When we started, every database table had a `restaurant_id` column. Every single query looked something like:

```sql
SELECT * FROM orders WHERE restaurant_id = $1 AND status = 'pending';
```

One afternoon while building an analytics dashboard, I wrote a multi-table join and accidentally forgot the `restaurant_id` check in one subquery. While testing, I suddenly saw order totals from another restaurant flash on my screen. 

A cold sweat broke out. If I could make that mistake in development, one tired late-night deploy could accidentally leak financial data between two competing restaurants next door to each other.

### The Fix: Schema-Per-Tenant Isolation

We decided we needed a system where it was physically impossible to forget a tenant check. 

We stayed on PostgreSQL, but moved to a schema-per-tenant architecture. Every restaurant gets its own isolated PostgreSQL schema (`tenant_cafe_urban`, `tenant_lakeview`, etc.).

Whenever a request comes in, our backend inspects the subdomain or authorization token and sets the PostgreSQL search path:

```python
# FastAPI dependency
async def set_tenant_search_path(request: Request, db: AsyncSession = Depends(get_db)):
    subdomain = request.headers.get("host").split(".")[0]
    schema = f"tenant_{subdomain}"
    
    # Everything after this runs strictly inside this restaurant's sandbox
    await db.execute(f"SET search_path TO {schema}, public;")
    return db
```

Now, even if a query is written as plain `SELECT * FROM orders`, it cannot physically touch another restaurant's data because that table only exists inside their private schema. No more 2 AM paranoia about data leaks.

## Mistake #3: Trusting Restaurant Wi-Fi

Here's an uncomfortable reality about restaurant tech: restaurant Wi-Fi is terrible. 

Routers are shoved into metal cabinets behind espresso machines. Microwaves interfere with the signal. In Nepal, brief power cuts switch the router to an inverter, knocking the network offline for 30 seconds.

If your web POS requires an active internet connection to print an invoice, the entire restaurant grinds to a halt. Hungry customers want to pay their bill and catch a cab; they don't care about your cloud infrastructure.

### The Fix: Offline-First Queue

We redesigned the cashier terminal around an offline-first workflow using browser storage (IndexedDB). 

When a cashier clicks "Settle Bill", the invoice is generated and printed locally on the thermal receipt printer immediately. The transaction gets stored in a local queue in the browser. 

Once the Wi-Fi reconnects, a background sync service quietly ships the queued transactions to our server in batches, where our BullMQ queue processes the tax hashing and inventory deductions.

If the router catches fire, the restaurant can keep taking cash and printing bills for the rest of the evening without missing a beat.

## What Scaling Actually Taught Me

Before Yummyever hit 100+ clients, I used to think good software engineering was about writing clever algorithms or using the coolest new framework on Twitter.

It’s not. 

Real engineering is about making sure that when 100 busy kitchens are slammed on a chaotic Friday night, the software gets out of their way and just works. 

- Kill polling as soon as you have more than a handful of active users.
- Make multi-tenancy foolproof at the database level so human error can’t leak data.
- Never assume the client has a working internet connection.

We still have a long way to go, but knowing our servers barely flinch during peak hours makes that Friday evening coffee taste a whole lot better.
