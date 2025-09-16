require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const { createProxyMiddleware } = require('http-proxy-middleware');
const placesRouter = require('./routes/places');

const app = express();
const PORT = process.env.PORT || 3001;

// Trust proxy for Replit environment
app.set('trust proxy', 1);

// Middleware
app.use(helmet());
// Allow all origins for n8n integration
app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});
app.use(limiter);

// Routes
app.use('/api/places', placesRouter);

app.get('/health', (req, res) => {
  res.json({ status: 'OK', message: 'Google Maps Scraper API is running' });
});


app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on http://0.0.0.0:${PORT}`);
  console.log(`Google Places API Key configured: ${process.env.GOOGLE_PLACES_API_KEY ? 'Yes' : 'No'}`);
});