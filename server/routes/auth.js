import express from 'express';

const router = express.Router();

// Simple admin login (no real authentication)
router.post('/login', (req, res) => {
  const { username, password } = req.body;
  
  // Simple hardcoded credentials
  if (username === 'admin' && password === 'admin123') {
    res.json({ 
      success: true, 
      message: 'Login successful',
      user: { username: 'admin' }
    });
  } else {
    res.status(401).json({ 
      success: false, 
      message: 'Invalid credentials' 
    });
  }
});

export default router;