const mongoose = require('mongoose');

const pageSchema = new mongoose.Schema(
  {
    uri: { type: String, required: true, unique: true },
    html: String
  },
  {
    timestamps: {
      updatedAt: 'updated_at',
      createdAt: 'created_at'
    }
  }
);

pageSchema.index({ uri: 1 });

module.exports = mongoose.model('Page', pageSchema);
