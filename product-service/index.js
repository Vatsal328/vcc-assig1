// product-service/index.js

const express = require('express');
const app = express();
app.use(express.json());

// In-memory product catalog
let products = [
  { id: 1, name: 'Product A', price: 10.99, description: 'Description of Product A' },
  { id: 2, name: 'Product B', price: 15.99, description: 'Description of Product B' },
];

// Get all products
app.get('/products', (req, res) => {
  res.json(products);
});

// Get a product by ID
app.get('/products/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const product = products.find(p => p.id === id);
  if (!product) {
    return res.status(404).json({ error: 'Product not found' });
  }
  res.json(product);
});

// Add a new product
app.post('/products', (req, res) => {
  const { name, price, description } = req.body;
  const newProduct = {
    id: products.length + 1,
    name,
    price,
    description,
  };
  products.push(newProduct);
  res.status(201).json(newProduct);
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Product Service is listening on port ${PORT}`);
});
