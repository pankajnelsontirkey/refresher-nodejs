const fs = require('fs');
const path = require('path');

const { validationResult } = require('express-validator');

const Post = require('../models/post');
const User = require('../models/user');
const { getIO } = require('../socket');

const getPosts = async (req, res, next) => {
  const { page: currentPage } = req.query || 1;
  const pageSize = 3;

  try {
    const totalItems = await Post.find().countDocuments();

    const posts = await Post.find()
      .populate({ path: 'creator', select: 'name email' })
      .skip((currentPage - 1) * pageSize)
      .limit(pageSize);

    res
      .status(200)
      .json({ message: 'Post fetched successfully.', posts, totalItems });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

const createPost = async (req, res, next) => {
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

  const {
    userId,
    body: { title, content },
    file: { path: imageUrl }
  } = req;

  const post = new Post({
    title,
    imageUrl,
    content,
    creator: userId
  });

  try {
    const newPost = await post.save();

    const user = await User.findById(userId);
    user.posts.push(newPost);

    await user.save();

    const io = getIO();

    io.emit('post', {
      action: 'create',
      data: { post: newPost, creator: { name: user.name } }
    });

    res.status(201).json({
      message: 'Post created successfully!',
      post: newPost,
      creator: { name: user.name }
    });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

const getPostById = async (req, res, next) => {
  const { postId } = req.params;

  try {
    const post = await Post.findById(postId).populate({
      path: 'creator',
      select: 'name email'
    });

    if (!post) {
      const error = new Error('Post not found!');
      error.statusCode = 404;
      throw error;
    }

    res.status(200).json({ message: 'Post found.', post });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }

    next(err);
  }
};

const updatePost = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const error = new Error('Validation error, incorrect data');
    error.statusCode = 422;
    throw error;
  }

  const {
    params: { postId },
    body: { title, content, image },
    file,
    userId
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

  try {
    const post = await Post.findById(postId).populate({
      path: 'creator',
      select: 'name email'
    });
    if (!post) {
      const error = new Error('Post not found!');
      error.statusCode = 404;
      throw error;
    }

    if (post.creator._id.toString() !== userId) {
      const error = new Error('Not Authorized');
      error.statusCode = 403;
      throw error;
    }

    if (imageUrl !== post.imageUrl) {
      clearImage(post.imageUrl);
    }

    post.title = title;
    post.content = content;
    post.imageUrl = imageUrl;

    const result = await post.save();

    const io = getIO();

    io.emit('post', { action: 'update', data: { post: result } });

    res.status(200).json({ message: 'Post updated!', post: result });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

const deletePost = async (req, res, next) => {
  const {
    params: { postId },
    userId
  } = req;

  try {
    const post = await Post.findById(postId);

    if (!post) {
      const error = new Error('Post not found!');
      error.statusCode = 404;
      throw error;
    }

    if (post.creator.toString() !== userId) {
      const error = new Error('Not Authorized');
      error.statusCode = 403;
      throw error;
    }

    clearImage(post.imageUrl);

    await Post.findByIdAndDelete(postId);

    const user = await User.findById(userId);
    user.posts.pull(postId);

    await user.save();

    io.emit('post', { action: 'delete', data: { post: postId } });

    res.status(200).json({ message: 'Post deleted!' });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

const getStatus = async (req, res, next) => {
  const { userId } = req;

  try {
    const user = await User.findById(userId);
    if (!user) {
      const error = new Error('User not found!');
      error.statusCode = 404;
      throw error;
    }

    res
      .status(200)
      .json({ message: 'Fetched user status.', status: user.status });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

const updateStatus = async (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    const error = new Error('Validation failed');
    error.statusCode = 422;
    error.data = errors.array();
    throw error;
  }

  const {
    body: { status },
    userId
  } = req;

  try {
    const user = await User.findById(userId);
    if (!user) {
      const error = new Error('User not found!');
      error.statusCode = 404;
      throw error;
    }

    user.status = status;
    await user.save();

    res.status(201).json({ message: 'User status updated successfully.' });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

module.exports = {
  getPosts,
  createPost,
  getPostById,
  updatePost,
  deletePost,
  getStatus,
  updateStatus
};

const clearImage = (filePath) => {
  filePath = path.join(__dirname + '..' + filePath);
  fs.unlink(filePath, (err) => console.log(err));
};
