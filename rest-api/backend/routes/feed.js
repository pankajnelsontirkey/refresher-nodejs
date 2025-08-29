const express = require('express');
const { body } = require('express-validator');

const {
  getPosts,
  createPost,
  getPostById,
  updatePost,
  deletePost,
  getStatus,
  updateStatus
} = require('../controllers/feed');
const checkAuth = require('../middleware/checkAuth');

const router = express.Router();

// GET /feed/posts
router.get('/posts', checkAuth, getPosts);

// POST /feed/posts
router.post(
  '/post',
  checkAuth,
  [
    body('title').trim().isLength({ min: 5 }),
    body('content').trim().isLength({ min: 5 })
  ],
  createPost
);

// GET /feed/post/:postId
router.get('/post/:postId', checkAuth, getPostById);

// PUT /feed/post/:postId
router.put(
  '/post/:postId',
  checkAuth,
  [
    body('title').trim().isLength({ min: 5 }),
    body('content').trim().isLength({ min: 5 })
  ],
  updatePost
);

// DELETE /feed/post/:postId
router.delete('/post/:postId', checkAuth, deletePost);

// GET /feed/status
router.get('/status', checkAuth, getStatus);

// PUT /feed/status
router.put(
  '/status',
  checkAuth,
  [body('status').trim().notEmpty().isLength({ min: 3, max: 120 })],
  updateStatus
);

module.exports = router;
