const mongoose = require('mongoose');

const codeSnippetSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  title: {
    type: String,
    required: true,
    trim: true,
    maxlength: 100
  },
  description: {
    type: String,
    maxlength: 500
  },
  language: {
    type: String,
    enum: ['html', 'css', 'javascript', 'python', 'java', 'cpp'],
    default: 'javascript'
  },
  code: {
    type: String,
    required: true
  },
  htmlCode: String,
  cssCode: String,
  jsCode: String,
  isPublic: {
    type: Boolean,
    default: false
  },
  shareToken: {
    type: String,
    unique: true,
    sparse: true
  },
  tags: [String],
  likes: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  likesCount: {
    type: Number,
    default: 0
  },
  views: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
});

codeSnippetSchema.index({ user: 1 });
codeSnippetSchema.index({ shareToken: 1 });
codeSnippetSchema.index({ isPublic: 1, likesCount: -1 });

const CodeSnippet = mongoose.model('CodeSnippet', codeSnippetSchema);

module.exports = CodeSnippet;
