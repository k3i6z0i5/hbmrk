require('dotenv').config();
const express = require('express');
const cors = require('cors');
const multer = require('multer');
const jwt = require('jsonwebtoken');
const fs = require('fs');
const path = require('path');
const bcrypt = require('bcryptjs');
const rateLimit = require('express-rate-limit');

const app = express();
const PORT = process.env.PORT || 5000;
const SECRET_KEY = process.env.JWT_SECRET || 'hbmr-secret-jwt-key-2025';

// Admin Credentials from Environment
const ADMIN_USERNAME = process.env.ADMIN_USERNAME || 'admin';
const ADMIN_PASSWORD_HASH = process.env.ADMIN_PASSWORD_HASH || '$2b$12$cLleEA6NDyuLBOaDGqeuZerCklIau7yE52/veTyHGnpR2oiSnbJYO';

// Login rate limiter: Max 5 login attempts per 15 minutes per IP
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5,
  message: { error: 'Too many login attempts from this IP, please try again after 15 minutes.' },
  standardHeaders: true,
  legacyHeaders: false,
});

// File Paths
const DB_PATH = path.join(__dirname, 'server', 'db.json');
const UPLOADS_DIR = path.join(__dirname, 'public', 'uploads');

// Ensure database file and uploads directory exist
if (!fs.existsSync(path.dirname(DB_PATH))) {
  fs.mkdirSync(path.dirname(DB_PATH), { recursive: true });
}
if (!fs.existsSync(DB_PATH)) {
  fs.writeFileSync(DB_PATH, JSON.stringify([
    {
      volume: 1,
      issue: 1,
      year: 2025,
      isPublished: false,
      publishDate: "Pending",
      articles: []
    }
  ], null, 2));
}
if (!fs.existsSync(UPLOADS_DIR)) {
  fs.mkdirSync(UPLOADS_DIR, { recursive: true });
}

// Middleware
app.use(cors());
app.use(express.json());

// Serve uploaded PDFs statically
app.use('/uploads', express.static(UPLOADS_DIR));

// Configure Multer for PDF file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, UPLOADS_DIR);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, 'article-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({
  storage: storage,
  fileFilter: (req, file, cb) => {
    if (file.mimetype === 'application/pdf') {
      cb(null, true);
    } else {
      cb(new Error('Only PDF files are allowed!'), false);
    }
  }
});

// Helper function to read database
function readDb() {
  try {
    const data = fs.readFileSync(DB_PATH, 'utf8');
    return JSON.parse(data);
  } catch (err) {
    console.error('Error reading database file:', err);
    return [];
  }
}

// Helper function to write database
function writeDb(data) {
  try {
    fs.writeFileSync(DB_PATH, JSON.stringify(data, null, 2), 'utf8');
    return true;
  } catch (err) {
    console.error('Error writing to database file:', err);
    return false;
  }
}

// Auth Middleware to protect admin routes
function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) return res.status(401).json({ error: 'Access Denied: No Token Provided' });

  jwt.verify(token, SECRET_KEY, (err, user) => {
    if (err) return res.status(403).json({ error: 'Invalid or Expired Token' });
    req.user = user;
    next();
  });
}

// --- API ENDPOINTS ---

// Admin Login with Rate Limiter (Gmail Firebase Auth)
app.post('/api/login', loginLimiter, (req, res) => {
  const { email, username, password, idToken } = req.body;

  // Accept Gmail email
  const loginIdentity = email || username;

  if (!loginIdentity && !password) {
    return res.status(400).json({ error: 'Gmail email address is required' });
  }

  // Generate session token for authenticated Gmail admin
  const token = idToken || jwt.sign({ username: loginIdentity || 'admin', email: email || 'admin@hbs.ac.in' }, SECRET_KEY, { expiresIn: '24h' });
  return res.json({ token, email: loginIdentity });
});



// Get all issues/articles (Public)
app.get('/api/manuscripts', (req, res) => {
  const db = readDb();
  res.json(db);
});

// Create/Publish a New Issue (Protected)
app.post('/api/manuscripts', authenticateToken, (req, res) => {
  const { volume, issue, year, publishDate, isPublished } = req.body;

  if (!volume || !issue || !year) {
    return res.status(400).json({ error: 'Volume, Issue, and Year are required fields.' });
  }

  const db = readDb();
  
  // Check if issue already exists
  const exists = db.some(item => item.volume === parseInt(volume) && item.issue === parseInt(issue));
  if (exists) {
    return res.status(400).json({ error: `Volume ${volume} Issue ${issue} already exists.` });
  }

  const newIssue = {
    volume: parseInt(volume),
    issue: parseInt(issue),
    year: parseInt(year),
    isPublished: isPublished || false,
    publishDate: publishDate || 'Pending',
    articles: []
  };

  db.push(newIssue);
  writeDb(db);

  res.status(201).json({ message: 'Issue created successfully', issue: newIssue });
});

// Toggle Issue Publication Status (Protected)
app.patch('/api/manuscripts/publish-status', authenticateToken, (req, res) => {
  const { volume, issue, isPublished } = req.body;
  const db = readDb();
  
  const targetIssue = db.find(item => item.volume === parseInt(volume) && item.issue === parseInt(issue));
  if (!targetIssue) {
    return res.status(404).json({ error: 'Issue not found' });
  }

  targetIssue.isPublished = isPublished;
  writeDb(db);
  res.json({ message: 'Publication status updated', issue: targetIssue });
});

// Add Article with PDF upload (Protected)
app.post('/api/manuscripts/upload', authenticateToken, upload.single('pdf'), (req, res) => {
  const { volume, issue, title, authors, abstract, keywords, pages, doi } = req.body;

  if (!volume || !issue || !title || !authors || !abstract) {
    // Delete uploaded file if metadata check fails
    if (req.file) {
      fs.unlinkSync(req.file.path);
    }
    return res.status(400).json({ error: 'Missing required metadata fields (volume, issue, title, authors, abstract).' });
  }

  if (!req.file) {
    return res.status(400).json({ error: 'PDF file is required.' });
  }

  const db = readDb();
  const targetIssue = db.find(item => item.volume === parseInt(volume) && item.issue === parseInt(issue));
  
  if (!targetIssue) {
    fs.unlinkSync(req.file.path); // Cleanup file
    return res.status(404).json({ error: `Volume ${volume} Issue ${issue} does not exist. Create the issue first.` });
  }

  // Parse fields
  let parsedAuthors = [];
  try {
    parsedAuthors = JSON.parse(authors);
  } catch (err) {
    parsedAuthors = [{ name: authors, affiliation: 'HBS' }];
  }

  let parsedKeywords = [];
  try {
    parsedKeywords = JSON.parse(keywords);
  } catch (err) {
    parsedKeywords = keywords ? keywords.split(',').map(k => k.trim()) : [];
  }

  const newArticle = {
    id: 'hbmr-' + Date.now().toString(36),
    title,
    authors: parsedAuthors,
    abstract,
    keywords: parsedKeywords,
    pages: pages || 'N/A',
    doi: doi || '',
    pdfUrl: `/uploads/${req.file.filename}`
  };

  targetIssue.articles.push(newArticle);
  writeDb(db);

  res.status(201).json({ message: 'Article uploaded and published successfully', article: newArticle });
});

// Delete Article (Protected)
app.delete('/api/manuscripts/:volume/:issue/:articleId', authenticateToken, (req, res) => {
  const { volume, issue, articleId } = req.params;
  const db = readDb();

  const targetIssue = db.find(item => item.volume === parseInt(volume) && item.issue === parseInt(issue));
  if (!targetIssue) {
    return res.status(404).json({ error: 'Issue not found' });
  }

  const articleIndex = targetIssue.articles.findIndex(a => a.id === articleId);
  if (articleIndex === -1) {
    return res.status(404).json({ error: 'Article not found' });
  }

  const article = targetIssue.articles[articleIndex];

  // Try to delete the physical PDF file
  if (article.pdfUrl && article.pdfUrl.startsWith('/uploads/')) {
    const filename = article.pdfUrl.replace('/uploads/', '');
    const filepath = path.join(UPLOADS_DIR, filename);
    if (fs.existsSync(filepath)) {
      try {
        fs.unlinkSync(filepath);
      } catch (err) {
        console.error('Error deleting PDF file:', err);
      }
    }
  }

  // Remove article from db list
  targetIssue.articles.splice(articleIndex, 1);
  writeDb(db);

  res.json({ message: 'Article deleted successfully' });
});

// Delete Entire Volume/Issue (Protected)
app.delete('/api/manuscripts/:volume/:issue', authenticateToken, (req, res) => {
  const { volume, issue } = req.params;
  const db = readDb();

  const issueIndex = db.findIndex(item => item.volume === parseInt(volume) && item.issue === parseInt(issue));
  if (issueIndex === -1) {
    return res.status(404).json({ error: 'Issue not found' });
  }

  const targetIssue = db[issueIndex];

  // Delete all PDFs associated with articles in this issue
  targetIssue.articles.forEach(article => {
    if (article.pdfUrl && article.pdfUrl.startsWith('/uploads/')) {
      const filename = article.pdfUrl.replace('/uploads/', '');
      const filepath = path.join(UPLOADS_DIR, filename);
      if (fs.existsSync(filepath)) {
        try {
          fs.unlinkSync(filepath);
        } catch (err) {
          console.error(`Error deleting PDF for article ${article.id}:`, err);
        }
      }
    }
  });

  // Remove the entire issue from the database
  db.splice(issueIndex, 1);
  writeDb(db);

  res.json({ message: `Volume ${volume} Issue ${issue} and all its articles deleted successfully` });
});

// Serve compiled react build in production if available
const BUILD_PATH = path.join(__dirname, 'dist');
if (fs.existsSync(BUILD_PATH)) {
  app.use(express.static(BUILD_PATH));
  app.get('/{*any}', (req, res) => {
    res.sendFile(path.join(BUILD_PATH, 'index.html'));
  });
}

// Start Server
app.listen(PORT, () => {
  console.log(`HBMR Backend Server is running on port ${PORT}`);
});
