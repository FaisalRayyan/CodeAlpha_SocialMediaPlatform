export const populatePost = (query) => query
  .populate('author', 'name username avatar')
  .populate('comments.user', 'name username avatar');

export function serializePost(post, viewer) {
  const object = post?.toObject ? post.toObject() : { ...post };
  const postId = String(object._id);
  const viewerId = String(viewer?._id || '');
  const savedPosts = viewer?.savedPosts || [];
  return {
    ...object,
    likedByMe: Boolean(viewerId) && (object.likes || []).some((id) => String(id?._id || id) === viewerId),
    savedByMe: savedPosts.some((id) => String(id?._id || id) === postId),
  };
}
