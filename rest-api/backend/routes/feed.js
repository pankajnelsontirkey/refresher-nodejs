const express = require('express');
const { body } = require('express-validator');

const {
  getPosts,
  createPost,
  getPostById,
  updatePost,
  deletePost
} = require('../controllers/feed');

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

// GET /feed/post/:postId
router.get('/post/:postId', getPostById);

// PUT /feed/post/:postId
router.put(
  '/post/:postId',
  [
    body('title').trim().isLength({ min: 5 }),
    body('content').trim().isLength({ min: 5 })
  ],
  updatePost
);

// DELETE /feed/post/:postId
router.delete('/post/:postId', deletePost);

module.exports = router;
