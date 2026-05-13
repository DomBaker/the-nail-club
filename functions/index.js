const { onCall, HttpsError } = require('firebase-functions/v2/https')
const { defineSecret } = require('firebase-functions/params')

const stripeSecret = defineSecret('STRIPE_SECRET')

exports.createPaymentIntent = onCall(
  { region: 'europe-west2', secrets: [stripeSecret], invoker: 'public' },
  async (request) => {
    if (!request.auth) {
      throw new HttpsError('unauthenticated', 'Must be logged in')
    }

    const stripe = require('stripe')(stripeSecret.value())

    const paymentIntent = await stripe.paymentIntents.create({
      amount: 1000, // £10.00 in pence
      currency: 'gbp',
      metadata: {
        serviceName: request.data.serviceName,
        customerName: request.data.customerName,
        userId: request.auth.uid,
      }
    })

    return { clientSecret: paymentIntent.client_secret }
  }
)
