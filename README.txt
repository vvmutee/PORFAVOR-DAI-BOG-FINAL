PORFAVOR demo site
Instructions:
- Put your images in static/images/ (logo.png, look1.jpg ... look6.jpg, spot1.gif)
- Run locally: python -m http.server 8000
- For Stripe payments: deploy server/server.js on a node host or Vercel, set STRIPE_SECRET_KEY and DOMAIN env vars.
- For CDEK PVZ: order.js uses public API; if CORS blocks, deploy a serverless proxy.
