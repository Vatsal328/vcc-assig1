// order-service/index.js

const express = require('express');
const axios = require('axios');
const app = express();
app.use(express.json());

// In-memory orders store
let orders = [];

// The Product Service URL (adjust the IP address to match your Product Service VM)
const PRODUCT_SERVICE_URL = process.env.PRODUCT_SERVICE_URL || 'http://198.168.100.5:3000';

// Get all orders
app.get('/orders', (req, res) => {
  res.json(orders);
});

// Get an order by ID
app.get('/orders/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const order = orders.find(o => o.id === id);
  if (!order) {
    return res.status(404).json({ error: 'Order not found' });
  }
  res.json(order);
});

// Place a new order
app.post('/orders', async (req, res) => {
  const { productId, quantity } = req.body;

  // Validate product existence via Product Service
  try {
    const response = await axios.get(`${PRODUCT_SERVICE_URL}/products/${productId}`);
    if (!response.data) {
      return res.status(404).json({ error: 'Product not found in Product Service' });
    }
  } catch (error) {
    console.error('Error communicating with Product Service:', error.message);
    return res.status(500).json({ error: 'Failed to validate product with Product Service' });
  }

  const newOrder = {
    id: orders.length + 1,
    productId,
    quantity,
    status: 'created'
  };
  orders.push(newOrder);
  res.status(201).json(newOrder);
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Order Service is listening on port ${PORT}`);
});
