import Notification from '../models/Notification.js';

export async function getNotifications(req, res) {
  const page = Math.max(Number(req.query.page) || 1, 1);
  const limit = Math.min(Math.max(Number(req.query.limit) || 20, 1), 50);
  const [notifications, unreadCount] = await Promise.all([
    Notification.find({ recipient: req.user._id })
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .populate('actor', 'name username avatar')
      .lean(),
    Notification.countDocuments({ recipient: req.user._id, read: false }),
  ]);

  res.json({ notifications, unreadCount, page, hasMore: notifications.length === limit });
}

export async function markAllRead(req, res) {
  await Notification.updateMany({ recipient: req.user._id, read: false }, { $set: { read: true } });
  res.json({ message: 'Notifications marked as read.' });
}

export async function markRead(req, res) {
  const notification = await Notification.findOneAndUpdate(
    { _id: req.params.notificationId, recipient: req.user._id },
    { $set: { read: true } },
    { new: true }
  );
  if (!notification) return res.status(404).json({ message: 'Notification not found.' });
  res.json({ notification });
}
