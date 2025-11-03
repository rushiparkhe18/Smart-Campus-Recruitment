const CodeSnippet = require('../models/CodeSnippet');
const crypto = require('crypto');

// @desc    Save code snippet
// @route   POST /api/code/save
// @access  Private
const saveCode = async (req, res) => {
  try {
    const { title, description, language, code, htmlCode, cssCode, jsCode, isPublic, tags } = req.body;

    const snippetData = {
      user: req.user.id,
      title,
      description,
      language,
      code,
      htmlCode,
      cssCode,
      jsCode,
      isPublic,
      tags
    };

    // Generate share token if public
    if (isPublic) {
      snippetData.shareToken = crypto.randomBytes(16).toString('hex');
    }

    const snippet = await CodeSnippet.create(snippetData);

    res.status(201).json({
      status: 'success',
      message: 'Code snippet saved successfully',
      data: { snippet }
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: error.message
    });
  }
};

// @desc    Get my snippets
// @route   GET /api/code/mine
// @access  Private
const getMySnippets = async (req, res) => {
  try {
    const snippets = await CodeSnippet.find({ user: req.user.id })
      .sort('-createdAt')
      .select('-code -htmlCode -cssCode -jsCode');

    res.status(200).json({
      status: 'success',
      data: { snippets, count: snippets.length }
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: error.message
    });
  }
};

// @desc    Get snippet by ID
// @route   GET /api/code/snippet/:id
// @access  Private
const getSnippet = async (req, res) => {
  try {
    const snippet = await CodeSnippet.findById(req.params.id)
      .populate('user', 'name');

    if (!snippet) {
      return res.status(404).json({
        status: 'error',
        message: 'Snippet not found'
      });
    }

    // Check access
    if (snippet.user._id.toString() !== req.user.id && !snippet.isPublic) {
      return res.status(403).json({
        status: 'error',
        message: 'Access denied'
      });
    }

    // Increment views
    snippet.views += 1;
    await snippet.save();

    res.status(200).json({
      status: 'success',
      data: { snippet }
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: error.message
    });
  }
};

// @desc    Get public snippet by share token
// @route   GET /api/code/share/:token
// @access  Public
const getSharedSnippet = async (req, res) => {
  try {
    const snippet = await CodeSnippet.findOne({ shareToken: req.params.token })
      .populate('user', 'name');

    if (!snippet || !snippet.isPublic) {
      return res.status(404).json({
        status: 'error',
        message: 'Snippet not found'
      });
    }

    snippet.views += 1;
    await snippet.save();

    res.status(200).json({
      status: 'success',
      data: { snippet }
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: error.message
    });
  }
};

// @desc    Delete snippet
// @route   DELETE /api/code/:id
// @access  Private
const deleteSnippet = async (req, res) => {
  try {
    const snippet = await CodeSnippet.findById(req.params.id);

    if (!snippet) {
      return res.status(404).json({
        status: 'error',
        message: 'Snippet not found'
      });
    }

    if (snippet.user.toString() !== req.user.id) {
      return res.status(403).json({
        status: 'error',
        message: 'Not authorized'
      });
    }

    await snippet.deleteOne();

    res.status(200).json({
      status: 'success',
      message: 'Snippet deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: error.message
    });
  }
};

module.exports = {
  saveCode,
  getMySnippets,
  getSnippet,
  getSharedSnippet,
  deleteSnippet
};
