import mongoose from 'mongoose';

const activityLogSchema = new mongoose.Schema(
  {
    action: {
      type: String,
      required: true,
      enum: {
        values: ['admin_login', 'product_create', 'product_update', 'product_delete', 'order_status_update'],
        message: '{VALUE} is not a valid activity action',
      },
    },
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    admin: { type: mongoose.Schema.Types.ObjectId, ref: 'Admin' },
    ip: {
      type: String,
      trim: true,
    },
    userAgent: {
      type: String,
      trim: true,
    },
    targetType: {
      type: String,
      enum: ['Product', 'Order', null],
    },
    targetId: {
      type: mongoose.Schema.Types.ObjectId,
      refPath: 'targetType',
    },
    details: {
      type: mongoose.Schema.Types.Mixed,
    },
  },
  { timestamps: true }
);

// Index for efficient queries
activityLogSchema.index({ createdAt: -1 });
activityLogSchema.index({ user: 1, createdAt: -1 });
activityLogSchema.index({ admin: 1, createdAt: -1 });
activityLogSchema.index({ action: 1, createdAt: -1 });

const ActivityLog = mongoose.model('ActivityLog', activityLogSchema);

export default ActivityLog;
