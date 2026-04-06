function buildInsights(entries) {
  if (!entries.length) {
    return [
      'No mood entries yet — add your first smile or thoughtful note to unlock insights.',
      'Try logging after exercise or rest to see your pattern over time.'
    ];
  }

  const countByActivity = entries.reduce((map, entry) => {
    entry.activities.forEach((activity) => {
      map[activity] = (map[activity] || 0) + 1;
    });
    return map;
  }, {});

  const moodScore = {
    '😍': 5,
    '😊': 4,
    '😐': 3,
    '😢': 2,
    '😡': 1,
    '😴': 2
  };

  const averageMood =
    entries.reduce((total, entry) => total + (moodScore[entry.mood] || 3), 0) / entries.length;

  const insight = [];

  if (countByActivity.exercise >= 2 && averageMood > 3.5) {
    insight.push('Great work! Fresh exercise days often match your happiest moods.');
  }

  if (countByActivity.sleep >= 2 && averageMood < 3.5) {
    insight.push('Rest matters — low mood shows up more often on rough sleep days.');
  }

  if (countByActivity.social >= 2 && averageMood > 3.8) {
    insight.push('Social moments are bright spots in your week. Keep them coming.');
  }

  if (!insight.length) {
    insight.push('Your mood story is still unfolding. Keep logging and the patterns will glow through.');
  }

  insight.push(`You have ${entries.length} happy little moments captured.`);

  return insight;
}

module.exports = { buildInsights };
