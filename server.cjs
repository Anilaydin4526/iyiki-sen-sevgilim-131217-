const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static('dist'));

// Content data file path
const DATA_PATH = path.join(__dirname, 'src/api/content-data.json');

// Helper functions
function readData() {
  if (!fs.existsSync(DATA_PATH)) {
    const defaultData = {
      title: "İyiki Sen Sevgilim",
      description: "Birlikte geçirdiğimiz her an, bu sitede sonsuza dek yaşayacak...",
      bannerText: "Birlikte her an, sonsuz bir masal gibi...",
      welcomeMessage: "Hoş geldin Gülüm…",
      gallery: [],
      music: [],
      timeline: []
    };
    fs.writeFileSync(DATA_PATH, JSON.stringify(defaultData, null, 2));
    return defaultData;
  }
  return JSON.parse(fs.readFileSync(DATA_PATH, 'utf-8'));
}

function writeData(data) {
  fs.writeFileSync(DATA_PATH, JSON.stringify(data, null, 2));
}

// API Routes
app.get('/api/content', (req, res) => {
  try {
    const data = readData();
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: 'Failed to read content' });
  }
});

app.patch('/api/content', (req, res) => {
  try {
    const current = readData();
    const updated = { ...current, ...req.body };
    writeData(updated);
    res.json(updated);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update content' });
  }
});

// Serve React app for non-API GET requests
app.get(/^\/(?!api).*/, (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
}); 