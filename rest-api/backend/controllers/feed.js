const fs = require('fs');
const path = require('path');

const { validationResult } = require('express-validator');

const Post = require('../models/post');

const getPosts = (req, res, next) => {
  const { page: currentPage } = req.query || 1;
  const pageSize = 2;
  let totalItems;

  Post.find()
    .countDocuments()
    .then((count) => {
      totalItems = count;
      return Post.find()
        .skip((currentPage - 1) * pageSize)
        .limit(pageSize);
    })
    .then((posts) => {
      res
        .status(200)
        .json({ message: 'Post fetched successfully.', posts, totalItems });
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

  if (!req.file) {
    const error = new Error('No image provided.');
    error.statusCode = 422;
    throw error;
  }

  const imageUrl = req.file.path;
  const { title, content } = req.body;
  const post = new Post({
    title,
    imageUrl,
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

const updatePost = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const error = new Error('Validation error, incorrect data');
    error.statusCode = 422;
    throw error;
  }

  const {
    params: { postId },
    body: { title, content, image },
    file
  } = req;

  let imageUrl = image;

  if (file) {
    imageUrl = file.path;
  }

  if (!imageUrl) {
    const error = new Error('No image selected!');
    error.statusCode = 422;
    throw error;
  }

  Post.findById(postId)
    .then((post) => {
      if (!post) {
        const error = new Error('Post not found!');
        error.statusCode = 404;
        throw error;
      }
      if (imageUrl !== post.imageUrl) {
        clearImage(post.imageUrl);
      }

      post.title = title;
      post.content = content;
      post.imageUrl = imageUrl;
      return post.save();
    })
    .then((result) => {
      res.status(200).json({ message: 'Post updated!', post: result });
    })
    .catch((err) => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    });
};

const deletePost = (req, res, next) => {
  const { postId } = req.params;

  Post.findById(postId)
    .then((post) => {
      if (!post) {
        const error = new Error('Post not found!');
        error.statusCode = 404;
        throw error;
      }
      // Check logged in user
      clearImage(post.imageUrl);
      return Post.findByIdAndDelete(postId);
    })
    .then((result) => {
      console.log(result);
      res.status(200).json({ message: 'Post deleted!' });
    })
    .catch((err) => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    });
};

module.exports = { getPosts, createPost, getPostById, updatePost, deletePost };

const clearImage = (filePath) => {
  filePath = path.join(__dirname + '..' + filePath);
  fs.unlink(filePath, (err) => console.log(err));
};
