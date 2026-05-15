const Stripe = require('stripe');

module.exports = async (req, res) => {
  if (req.method !== 'POST') return res.status(405).end();

  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
  const { amount, name } = req.body;

  const session = await stripe.checkout.sessions.create({
    payment_method_types: ['card'],
    line_items: [{
      price_data: {
        currency: 'eur',
        product_data: {
          name: `Spende – ${process.env.EVENT_NAME || 'KFZ Marburg'}`,
        },
        unit_amount: amount * 100,
      },
      quantity: 1,
    }],
    mode: 'payment',
    success_url: `${process.env.BASE_URL}?success=1`,
    cancel_url: `${process.env.BASE_URL}?cancelled=1`,
    metadata: {
      donor_name: name || 'Anonym',
      amount: String(amount),
    },
  });

  res.json({ url: session.url });
};
