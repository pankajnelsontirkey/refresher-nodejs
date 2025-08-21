const getPosts = (req, res) => {
  res.status(200).json({
    posts: [
      {
        _id: 1,
        title: 'First Post',
        content: 'This is the first post!',
        imageUrl: 'images/typewriter.jpg',
        creator: { name: 'Pankaj' },
        createdAt: new Date()
      }
    ]
  });
};

const createPost = (req, res) => {
  const { title, content } = req.body;

  // Create post in db
  res.status(201).json({
    message: 'Post created successfully!',
    post: {
      _id: new Date().toISOString(),
      title,
      content,
      creator: { name: 'Nelson' },
      createdAt: new Date()
    }
  });
};

module.exports = { getPosts, createPost };
