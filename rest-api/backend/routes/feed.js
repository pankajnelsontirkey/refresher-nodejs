const express = require('express');
const { body } = require('express-validator');

const { getPosts, createPost, getPostById } = require('../controllers/feed');

const router = express.Router();

// GET /feed/posts
router.get('/posts', getPosts);

// POST /feed/posts
router.post(
  '/post',
  [
    body('title').trim().isLength({ min: 5 }),
    body('content').trim().isLength({ min: 5 })
  ],
  createPost
);

// GET /feed/post
router.get('/post/:postId', getPostById);

module.exports = router;
