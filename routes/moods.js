const express = require('express');
const fs = require('fs');
const path = require('path');
const auth = require('../middleware/auth');
const { buildInsights } = require('../utils/insights');

const router = express.Router();
const moodsFile = path.join(__dirname, '..', 'data', 'moods.json');

function loadMoods() {
  return JSON.parse(fs.readFileSync(moodsFile, 'utf8')) || [];
}

function saveMoods(moods) {
  fs.writeFileSync(moodsFile, JSON.stringify(moods, null, 2));
}

router.use(auth);

router.get('/', (req, res) => {
  const moods = loadMoods().filter((entry) => entry.userId === req.user.id);
  res.json({ entries: moods, insights: buildInsights(moods) });
});

router.post('/', (req, res) => {
  const { mood, note = '', activities = [] } = req.body;
  const moods = loadMoods();
  const newEntry = {
    id: `${Date.now()}`,
    userId: req.user.id,
    mood,
    note,
    activities,
    createdAt: new Date().toISOString()
  };

  moods.unshift(newEntry);
  saveMoods(moods);
  res.status(201).json({ entry: newEntry });
});

module.exports = router;
