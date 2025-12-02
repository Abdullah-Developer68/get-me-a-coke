// This webhook is used for communication between stripe's server and our server
import { NextResponse } from "next/server";
import dbConnect from "@/db/dbConnect";
import { stripe } from "@/lib/stripe";
import Payment from "@/models/Payment";

// This is the route at which Stripe webhook sends the data to our server after successful processing on stripes server
export async function POST(request) {
  console.log("webhook has been received!");
  const signature = request.headers.get("stripe-signature");

  if (!process.env.STRIPE_WEBHOOK_SECRET || !process.env.STRIPE_SECRET_KEY) {
    // if the stripe webhook secret or secret key is missing just tell the stripe that the
    // webhook was received. So that it stops retrying. but we do not use it because we do not
    // have the right configuration. This will cause no errors to occur it will tell stripe that
    // their server is working fine and will tell us that the issue is in our configuration
    console.error("Missing Stripe configuration");
    return NextResponse.json({ ok: true });
  }

  let event;

  try {
    const body = await request.text();
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (err) {
    return new NextResponse(`Webhook Error: ${err.message}`, { status: 400 });
  }

  // Acknowledge webhook immediately (tells Stripe the request was received).
  // Note: Stripe only checks the HTTP status code. A 2xx (e.g. returned by
  // `NextResponse.json({ received: true })`) tells Stripe the event was received
  // successfully and Stripe will NOT retry that event because it has a time limit
  // of that and during a cold start if the database operations will occur then there
  // will be time out issue for webhook. If processing failed and
  // you want Stripe to retry, return a non-2xx (4xx/5xx) or let the handler error.
  //
  // Returning a response in Next.js ends the handler's execution; code after a
  // `return` will not run. In Express you can return/send a response and continue
  // running asynchronous work; in Next.js you must use explicit background
  // processing to run work after the response.
  // const acknowledgeResponse = NextResponse.json({ received: true });

  // For post-response background work you can use Next/Vercel background APIs
  // (for example `unstable_after`) or, preferably for production, a durable job
  // queue or Vercel Background Functions. `unstable_after` is experimental and
  // may change across Next.js releases, so treat it as unstable in production.

  // unstable_after(async () => { /* ... */ });

  // Process DB operations after acknowledgment
  try {
    await dbConnect();
    console.log("Payments are being registered in the database");
    // Handle events
    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object;

        // Persist donation/support in database (idempotent)
        try {
          // avoid duplicate records for the same Checkout Session
          const exists = await Payment.findOne({ oid: session.id });
          if (exists) break;

          const payment = {
            name: session.metadata?.supporter_name || "Someone",
            to_user: session.metadata?.username || "creator",
            oid: session.id,
            message:
              session.metadata?.supporter_message || session.description || "",
            // store amount in smallest currency unit (e.g. cents for USD)
            amount: Number(session.amount_total ?? 0),
            
          };

          console.log("saving payments in the data base");
          await Payment.create(payment);
        } catch (dbErr) {
          // Log error but don't fail the webhook response
          console.error("DB operation failed:", dbErr);
        }

        break;
      }
      default:
        break;
    }
  } catch (dbErr) {
    // Log error but don't fail the webhook response
    console.error("DB operation failed:", dbErr);
  }

  // if stripe receives this late due to cold start in vercel which causes timeout issues then use a background funtion in vercel
  return NextResponse.json({ received: true });
}

// These are Next.js file-level exports (evaluated at build/run time), not
// CommonJS `exports`. They tell Next.js how to run this route:
// - `runtime = "nodejs"` runs the handler in a Node.js server runtime (needed
//   by some parts of the Stripe SDK and for reliable raw-body handling).
// - `dynamic = "force-dynamic"` disables static generation/caching so this
//   route executes fresh on every request (required for real-time webhook
//   processing and exact signature verification).
export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// This is different from dynamic routing. This is dynamic rendering this specifically applies to the rendering behavior of the route,
// ensuring that it always runs on the server and never gets cached.

// On the other hand dynamic routing is this [...Stripe]/route.js this allows to create URL parameters.
