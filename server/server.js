// server.js example for Stripe Checkout (Node/Express)
const express = require('express');
const app = express();
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
app.use(express.json());
app.post('/create-checkout-session', async (req, res) => {
  const {product} = req.body;
  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [{
        price_data: {
          currency: 'rub',
          product_data: {name: product.title},
          unit_amount: Math.round(product.price * 100)
        },
        quantity: 1
      }],
      mode: 'payment',
      success_url: process.env.DOMAIN + '/success.html',
      cancel_url: process.env.DOMAIN + '/order.html'
    });
    res.json({sessionId: session.id});
  } catch (err) {
    console.error(err);
    res.status(500).json({error: err.message});
  }
});
const port = process.env.PORT || 3000;
app.listen(port, ()=> console.log('Server running on', port));
