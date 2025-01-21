const express = require('express');
const News = require('../models/News'); // Ensure the path to your News model is correct
const router = express.Router();

// Fetch all news items
router.get('/', async (req, res) => {
  try {
    const news = await News.find(); // Fetch all news items from the database
    res.status(200).json(news); // Send them as a response
  } catch (err) {
    console.error('Error fetching news:', err);
    res.status(500).json({ error: 'Failed to fetch news.' });
  }
});

// Handle reactions (like or dislike) to a news item
router.post('/:id/react', async (req, res) => {
  const { id } = req.params;
  const { reaction } = req.body; // Expect 'like' or 'dislike' as the reaction

  try {
    // Find the specific news item by ID
    const newsItem = await News.findById(id);
    if (!newsItem) {
      return res.status(404).json({ error: 'News item not found' });
    }

    // Update the likes or dislikes count based on the reaction
    if (reaction === 'like') {
      newsItem.likes += 1;
    } else if (reaction === 'dislike') {
      newsItem.dislikes += 1;
    } else {
      return res.status(400).json({ error: 'Invalid reaction' });
    }

    // Save the updated news item
    await newsItem.save();

    // Emit the updated news to all connected clients via socket.io
    const updatedNews = await News.find(); // Fetch all news items again with updated reactions
    req.app.get('io').emit('news-update', updatedNews); // Emit the updated news to all clients

    // Send the updated news item back as a response
    res.status(200).json(newsItem);
  } catch (err) {
    console.error('Error handling reaction:', err);
    res.status(500).json({ error: 'Error handling reaction' });
  }
});

module.exports = router;
