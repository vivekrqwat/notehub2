// Updated Directory Schema with upvote support

const mongoose = require("mongoose");

const topicSchema = new mongoose.Schema({
  noteId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true
  }
});

const DirectorySchema = new mongoose.Schema({
  uid: {
    type: String,
    required: true
  },
  Dirname: {
    type: String,
    required: true,
    ref: "Directory"
  },
  desc: {
    type: String,
    maxlength: [100, "Description should not be more than 100 characters"]
  },
  topic: {
    type: [topicSchema],
    default: []
  },
  grade: {
    type: String,
    default: "green"
  },
  isPublic: {
    type: Boolean,
    default: true
  },
  // Upvote fields
  upvotes: {
    type: Number,
    default: 0,
    min: 0
  },
  upvoterIds: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  // Tracking fields
  views: {
    type: Number,
    default: 0
  },
  
}, { timestamps: true });

// Index for better query performance
DirectorySchema.index({ upvotes: -1 });
DirectorySchema.index({ createdAt: -1 });
DirectorySchema.index({ isPublic: 1, upvotes: -1 });
DirectorySchema.index({ Dirname: 1 });

const Directorymodel = mongoose.model('Directory', DirectorySchema);

module.exports = Directorymodel;