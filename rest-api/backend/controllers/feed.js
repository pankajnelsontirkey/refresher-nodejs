const { validationResult } = require('express-validator');

const Post = require('../models/post');

const getPosts = (req, res, next) => {
  Post.find()
    .then((posts) => {
      res.status(200).json({ message: 'Post fetched successfully.', posts });
    })
    .catch((err) => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    });
};

const createPost = (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    const error = new Error('Validation error, incorrect data');
    error.statusCode = 422;
    throw error;
  }

  const { title, content } = req.body;
  const post = new Post({
    title,
    imageUrl: 'images/typewriter.jpg',
    content,
    creator: { name: 'Nelson' }
  });

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
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    });
};

const getPostById = (req, res, next) => {
  const { postId } = req.params;

  Post.findById(postId)
    .then((post) => {
      if (!post) {
        const error = new Error('Post not found!');
        error.statusCode = 404;
        throw error;
      }
      res.status(200).json({ message: 'Post found.', post });
    })
    .catch((err) => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    });
};

module.exports = { getPosts, createPost, getPostById };
