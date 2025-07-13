import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import { v4 as uuidv4 } from 'uuid';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const app = express();
const PORT = process.env.PORT || 3001;
const JWT_SECRET = 'your-secret-key';

// Middleware
app.use(helmet());
app.use(compression());
app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// In-memory data stores (for demo purposes)
const users = new Map();
const products = new Map();
const orders = new Map();
const cart = new Map();

// Initialize sample data
const initializeData = () => {
  // Sample products
  for (let i = 1; i <= 1000; i++) {
    products.set(`prod_${i}`, {
      id: `prod_${i}`,
      name: `Product ${i}`,
      price: Math.floor(Math.random() * 500) + 10,
      category: ['Electronics', 'Clothing', 'Books', 'Home'][Math.floor(Math.random() * 4)],
      stock: Math.floor(Math.random() * 100) + 1,
      description: `High-quality Product ${i} with excellent features`,
      rating: (Math.random() * 2 + 3).toFixed(1),
      reviews: Math.floor(Math.random() * 500) + 10
    });
  }

  // Sample users
  for (let i = 1; i <= 100; i++) {
    const hashedPassword = bcrypt.hashSync('password123', 10);
    users.set(`user_${i}`, {
      id: `user_${i}`,
      username: `user${i}`,
      email: `user${i}@example.com`,
      password: hashedPassword,
      profile: {
        name: `User ${i}`,
        address: `${i} Test Street, Test City`,
        phone: `555-000-${String(i).padStart(4, '0')}`
      },
      createdAt: new Date().toISOString()
    });
  }
};

// Utility functions
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Access token required' });
  }

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ error: 'Invalid token' });
    }
    req.user = user;
    next();
  });
};

const simulateProcessingDelay = (min = 10, max = 100) => {
  return new Promise(resolve => {
    setTimeout(resolve, Math.floor(Math.random() * (max - min + 1)) + min);
  });
};

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ 
    status: 'healthy', 
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    memory: process.memoryUsage()
  });
});

// Authentication endpoints
app.post('/api/auth/register', async (req, res) => {
  await simulateProcessingDelay(50, 200);
  
  try {
    const { username, email, password } = req.body;
    
    if (!username || !email || !password) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // Check if user exists
    for (const [, user] of users) {
      if (user.username === username || user.email === email) {
        return res.status(409).json({ error: 'User already exists' });
      }
    }

    const userId = uuidv4();
    const hashedPassword = await bcrypt.hash(password, 10);
    
    const newUser = {
      id: userId,
      username,
      email,
      password: hashedPassword,
      profile: {
        name: username,
        address: '',
        phone: ''
      },
      createdAt: new Date().toISOString()
    };

    users.set(userId, newUser);

    const token = jwt.sign({ userId, username }, JWT_SECRET, { expiresIn: '24h' });

    res.status(201).json({
      message: 'User registered successfully',
      token,
      user: {
        id: userId,
        username,
        email,
        profile: newUser.profile
      }
    });
  } catch (error) {
    res.status(500).json({ error: 'Registration failed' });
  }
});

app.post('/api/auth/login', async (req, res) => {
  await simulateProcessingDelay(100, 300);
  
  try {
    const { username, password } = req.body;
    
    if (!username || !password) {
      return res.status(400).json({ error: 'Username and password required' });
    }

    let user = null;
    for (const [, u] of users) {
      if (u.username === username || u.email === username) {
        user = u;
        break;
      }
    }

    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const token = jwt.sign({ userId: user.id, username: user.username }, JWT_SECRET, { expiresIn: '24h' });

    res.json({
      message: 'Login successful',
      token,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        profile: user.profile
      }
    });
  } catch (error) {
    res.status(500).json({ error: 'Login failed' });
  }
});

// Product endpoints
app.get('/api/products', async (req, res) => {
  await simulateProcessingDelay(20, 100);
  
  try {
    const { page = 1, limit = 20, category, search, sort } = req.query;
    const offset = (page - 1) * limit;
    
    let productList = Array.from(products.values());
    
    // Filter by category
    if (category) {
      productList = productList.filter(p => p.category.toLowerCase() === category.toLowerCase());
    }
    
    // Search functionality
    if (search) {
      productList = productList.filter(p => 
        p.name.toLowerCase().includes(search.toLowerCase()) ||
        p.description.toLowerCase().includes(search.toLowerCase())
      );
    }
    
    // Sort functionality
    if (sort === 'price_asc') {
      productList.sort((a, b) => a.price - b.price);
    } else if (sort === 'price_desc') {
      productList.sort((a, b) => b.price - a.price);
    } else if (sort === 'rating') {
      productList.sort((a, b) => b.rating - a.rating);
    }
    
    const total = productList.length;
    const paginatedProducts = productList.slice(offset, offset + parseInt(limit));
    
    res.json({
      products: paginatedProducts,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch products' });
  }
});

app.get('/api/products/:id', async (req, res) => {
  await simulateProcessingDelay(30, 150);
  
  try {
    const product = products.get(req.params.id);
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }
    res.json(product);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch product' });
  }
});

// Cart endpoints
app.get('/api/cart', authenticateToken, async (req, res) => {
  await simulateProcessingDelay(50, 200);
  
  try {
    const userCart = cart.get(req.user.userId) || [];
    const cartWithDetails = userCart.map(item => ({
      ...item,
      product: products.get(item.productId)
    }));
    
    const total = cartWithDetails.reduce((sum, item) => 
      sum + (item.product.price * item.quantity), 0
    );
    
    res.json({
      items: cartWithDetails,
      total,
      itemCount: userCart.length
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch cart' });
  }
});

app.post('/api/cart', authenticateToken, async (req, res) => {
  await simulateProcessingDelay(100, 300);
  
  try {
    const { productId, quantity = 1 } = req.body;
    
    if (!productId) {
      return res.status(400).json({ error: 'Product ID required' });
    }
    
    const product = products.get(productId);
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }
    
    if (quantity > product.stock) {
      return res.status(400).json({ error: 'Insufficient stock' });
    }
    
    const userCart = cart.get(req.user.userId) || [];
    const existingItem = userCart.find(item => item.productId === productId);
    
    if (existingItem) {
      existingItem.quantity += quantity;
    } else {
      userCart.push({
        id: uuidv4(),
        productId,
        quantity,
        addedAt: new Date().toISOString()
      });
    }
    
    cart.set(req.user.userId, userCart);
    
    res.json({ message: 'Item added to cart', cartSize: userCart.length });
  } catch (error) {
    res.status(500).json({ error: 'Failed to add item to cart' });
  }
});

// Order endpoints
app.post('/api/orders', authenticateToken, async (req, res) => {
  await simulateProcessingDelay(200, 500);
  
  try {
    const userCart = cart.get(req.user.userId) || [];
    
    if (userCart.length === 0) {
      return res.status(400).json({ error: 'Cart is empty' });
    }
    
    const orderItems = userCart.map(item => ({
      ...item,
      product: products.get(item.productId)
    }));
    
    const total = orderItems.reduce((sum, item) => 
      sum + (item.product.price * item.quantity), 0
    );
    
    const orderId = uuidv4();
    const order = {
      id: orderId,
      userId: req.user.userId,
      items: orderItems,
      total,
      status: 'pending',
      createdAt: new Date().toISOString()
    };
    
    orders.set(orderId, order);
    cart.delete(req.user.userId); // Clear cart
    
    res.status(201).json({
      message: 'Order created successfully',
      order: {
        id: orderId,
        total,
        status: 'pending',
        itemCount: orderItems.length
      }
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to create order' });
  }
});

app.get('/api/orders', authenticateToken, async (req, res) => {
  await simulateProcessingDelay(100, 300);
  
  try {
    const userOrders = Array.from(orders.values())
      .filter(order => order.userId === req.user.userId)
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    
    res.json({
      orders: userOrders.map(order => ({
        id: order.id,
        total: order.total,
        status: order.status,
        itemCount: order.items.length,
        createdAt: order.createdAt
      }))
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch orders' });
  }
});

// Analytics endpoint (heavy computation simulation)
app.get('/api/analytics', authenticateToken, async (req, res) => {
  await simulateProcessingDelay(500, 1500); // Simulate heavy processing
  
  try {
    const analytics = {
      totalProducts: products.size,
      totalUsers: users.size,
      totalOrders: orders.size,
      totalRevenue: Array.from(orders.values()).reduce((sum, order) => sum + order.total, 0),
      averageOrderValue: orders.size > 0 ? 
        Array.from(orders.values()).reduce((sum, order) => sum + order.total, 0) / orders.size : 0,
      topCategories: ['Electronics', 'Clothing', 'Books', 'Home'].map(cat => ({
        category: cat,
        count: Array.from(products.values()).filter(p => p.category === cat).length
      })),
      recentActivity: Array.from(orders.values())
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
        .slice(0, 10)
        .map(order => ({
          type: 'order',
          amount: order.total,
          timestamp: order.createdAt
        }))
    };
    
    res.json(analytics);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch analytics' });
  }
});

// Error handling middleware
app.use((error, req, res, next) => {
  console.error(error);
  res.status(500).json({ error: 'Internal server error' });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({ error: 'Endpoint not found' });
});

// Initialize data and start server
initializeData();

app.listen(PORT, () => {
  console.log(`🚀 Test server running on port ${PORT}`);
  console.log(`📊 Loaded ${products.size} products and ${users.size} users`);
  console.log(`🔍 Health check: http://localhost:${PORT}/health`);
});

export default app;