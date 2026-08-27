import Notification from '../models/Notification.js';

export async function createNotification({ recipient, actor, type, post = null, message = '' }) {
  if (!recipient || String(recipient) === String(actor)) return null;
  return Notification.create({ recipient, actor, type, post, message });
}

export async function removeNotification({ recipient, actor, type, post = null }) {
  const filter = { recipient, actor, type };
  if (post) filter.post = post;
  await Notification.deleteMany(filter);
}
