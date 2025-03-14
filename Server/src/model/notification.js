const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const notificationSchema = new Schema({
  title: {
    type: String,
    required: true,
    trim: true,
    maxLength: 100
  },
  message: {
    type: String,
    required: true,
    trim: true,
    maxLength: 1000
  },
  type: {
    type: String,
    required: true,
    enum: ['belt-test', 'tournament', 'general', 'fees'],
    default: 'general'
  },
  dojoId: {
    type: Schema.Types.ObjectId,
    ref: 'Dojo',
    default: null
  },
  createdBy: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now,
    required: true
  },
  active: {type: Boolean,default: true},

  forRoles: [{
    type: String,
    required: true,
    enum: ['Master',  'Parent']
  }],
  readBy: [{
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    readAt: {
      type: Date,
      default: Date.now,
      required: true
    }
  }]
}, {
  timestamps: true,
  versionKey: false
});

const Notification = mongoose.model('Notification', notificationSchema);

module.exports = Notification;