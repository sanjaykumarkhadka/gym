import Stripe from "stripe";

if (!process.env.STRIPE_SECRET_KEY) {
  console.warn("Missing STRIPE_SECRET_KEY environment variable");
}

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "", {
  apiVersion: "2025-12-15.clover",
  typescript: true,
});

// Create a Stripe Connect account for a tenant
export async function createConnectedAccount(
  tenantId: string,
  email: string,
  businessName: string
) {
  const account = await stripe.accounts.create({
    type: "express",
    email,
    business_profile: {
      name: businessName,
    },
    metadata: {
      tenantId,
    },
    capabilities: {
      card_payments: { requested: true },
      transfers: { requested: true },
    },
  });

  return account;
}

// Get onboarding link for Stripe Connect
export async function getConnectOnboardingLink(
  accountId: string,
  returnUrl: string,
  refreshUrl: string
) {
  const accountLink = await stripe.accountLinks.create({
    account: accountId,
    refresh_url: refreshUrl,
    return_url: returnUrl,
    type: "account_onboarding",
  });

  return accountLink.url;
}

// Check if account is fully onboarded
export async function getAccountStatus(accountId: string) {
  const account = await stripe.accounts.retrieve(accountId);
  return {
    chargesEnabled: account.charges_enabled,
    payoutsEnabled: account.payouts_enabled,
    detailsSubmitted: account.details_submitted,
  };
}

// Create a product and price for a membership plan
export async function createStripeProduct(
  connectedAccountId: string,
  planName: string,
  priceInCents: number,
  interval: "week" | "month" | "year"
) {
  const product = await stripe.products.create(
    {
      name: planName,
    },
    {
      stripeAccount: connectedAccountId,
    }
  );

  const price = await stripe.prices.create(
    {
      product: product.id,
      unit_amount: priceInCents,
      currency: "usd",
      recurring: {
        interval,
      },
    },
    {
      stripeAccount: connectedAccountId,
    }
  );

  return { productId: product.id, priceId: price.id };
}

// Create a checkout session for subscription
export async function createCheckoutSession(
  connectedAccountId: string,
  priceId: string,
  customerId: string | undefined,
  customerEmail: string,
  successUrl: string,
  cancelUrl: string,
  metadata: Record<string, string>
) {
  const session = await stripe.checkout.sessions.create(
    {
      mode: "subscription",
      payment_method_types: ["card"],
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      ...(customerId
        ? { customer: customerId }
        : { customer_email: customerEmail }),
      success_url: successUrl,
      cancel_url: cancelUrl,
      metadata,
      subscription_data: {
        metadata,
      },
    },
    {
      stripeAccount: connectedAccountId,
    }
  );

  return session;
}

// Create or get customer on connected account
export async function getOrCreateCustomer(
  connectedAccountId: string,
  email: string,
  name: string,
  userId: string
) {
  // Check if customer already exists
  const customers = await stripe.customers.list(
    {
      email,
      limit: 1,
    },
    {
      stripeAccount: connectedAccountId,
    }
  );

  if (customers.data.length > 0) {
    return customers.data[0];
  }

  // Create new customer
  const customer = await stripe.customers.create(
    {
      email,
      name,
      metadata: {
        userId,
      },
    },
    {
      stripeAccount: connectedAccountId,
    }
  );

  return customer;
}

// Cancel a subscription
export async function cancelSubscription(
  connectedAccountId: string,
  subscriptionId: string
) {
  const subscription = await stripe.subscriptions.cancel(subscriptionId, {
    stripeAccount: connectedAccountId,
  });

  return subscription;
}

// Construct webhook event
export function constructWebhookEvent(
  payload: string | Buffer,
  signature: string,
  webhookSecret: string
) {
  return stripe.webhooks.constructEvent(payload, signature, webhookSecret);
}
