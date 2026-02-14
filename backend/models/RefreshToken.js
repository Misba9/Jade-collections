import mongoose from 'mongoose';

const refreshTokenSchema = new mongoose.Schema(
  {
    token: { type: String, required: true, unique: true },
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    admin: { type: mongoose.Schema.Types.ObjectId, ref: 'Admin' },
    expiresAt: { type: Date, required: true },
  },
  { timestamps: true }
);

refreshTokenSchema.pre('save', function (next) {
  if (!this.user && !this.admin) {
    next(new Error('RefreshToken must have user or admin'));
  } else {
    next();
  }
});

// TTL index - auto-delete expired tokens
refreshTokenSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

const RefreshToken = mongoose.model('RefreshToken', refreshTokenSchema);

export default RefreshToken;
