const News = require('../models/News');

// Get All News
exports.getAllNews = async (req, res) => {
  try {
    const news = await News.find();
    res.status(200).json(news);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch news' });
  }
};

// Add News
exports.addNews = async (req, res) => {
  const { title, description, image } = req.body;
  try {
    const news = await News.create({ title, description, image });
    res.status(201).json(news);
  } catch (err) {
    res.status(400).json({ error: 'Failed to add news' });
  }
};

// Like or Dislike News
exports.reactToNews = async (req, res) => {
  const { id } = req.params;
  const { reaction } = req.body;
  try {
    const news = await News.findById(id);
    if (reaction === 'like') news.likes += 1;
    if (reaction === 'dislike') news.dislikes += 1;
    await news.save();
    res.status(200).json(news);
  } catch (err) {
    res.status(400).json({ error: 'Reaction failed' });
  }
};
