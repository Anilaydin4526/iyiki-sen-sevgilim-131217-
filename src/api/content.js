const fs = require('fs');
const path = require('path');

const DATA_PATH = path.join(__dirname, 'content-data.json');

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

module.exports = (req, res) => {
  if (req.method === 'GET') {
    const data = readData();
    res.status(200).json(data);
  } else if (req.method === 'POST' || req.method === 'PATCH') {
    let body = req.body;
    if (typeof body === 'string') body = JSON.parse(body);
    const current = readData();
    const updated = { ...current, ...body };
    writeData(updated);
    res.status(200).json(updated);
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
}; 