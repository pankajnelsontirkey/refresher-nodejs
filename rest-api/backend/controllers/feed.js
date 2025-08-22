const { validationResult } = require('express-validator');

const Post = require('../models/post');

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
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(422).json({
      message: 'Validation error, incorrect data',
      errors: errors.array()
    });
  }

  const { title, content } = req.body;
  const post = new Post({
    title,
    imageUrl: 'images/typewriter.jpg',
    content,
    creator: { name: 'Nelson' }
  });

  // Create post in db
  post
    .save()
    .then((result) => {
      if (result) {
        res.status(201).json({
          message: 'Post created successfully!',
          post: result
        });
      }
    })
    .catch((err) => {
      console.log('error while saving post to database!', err);
      res.status(500).json({ message: 'Error', err });
    });
};

module.exports = { getPosts, createPost };
