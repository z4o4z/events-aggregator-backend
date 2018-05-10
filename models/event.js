const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema(
  {
    uri: { type: String, required: true, unique: true },
    geo: {
      latitude: { type: String },
      longitude: { type: String }
    },
    tags: [String],
    link: { type: String, required: true },
    price: { type: String },
    title: { type: String, required: true, unique: true },
    content: { type: String, required: true },
    address: { type: String },
    organizer: { type: String },
    start_time: { type: String },
    start_date: { type: Date, required: true },
    finish_time: { type: String },
    finish_date: { type: Date, required: true },
    phone_number: { type: String },
    hero_image_url: { type: String }
  },
  {
    timestamps: {
      updatedAt: 'updated_at',
      createdAt: 'created_at'
    }
  }
);

eventSchema.index({ title: 'text', address: 'text' });

module.exports = mongoose.model('Event', eventSchema);
