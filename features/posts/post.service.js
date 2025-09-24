import Post from "./post.model.js";
import User from "../auth/user.model.js";

export const createPost = async (postData) => {
  const post = new Post(postData);
  await post.save();

  // After creating the post, add its ID to the author's `posts` array.
  // This creates a two-way relationship.
  await User.findByIdAndUpdate(postData.author, {
    $push: { posts: post._id },
  });

  return post;
};

export const fetchAllPosts = async ({ limit = 20, cursor = null }) => {
  // if a cursor is provided, find posts with an ID less than the cursor's ID
  const query = cursor ? { _id: { $lt: cursor } } : {};

  // Fetch one more than the limit to check if there are more posts
  const posts = await Post.find(query)
    .sort({ _id: -1 }) // Sort by ObjectID descending (chronological)
    .limit(limit + 1)
    .populate("author", "firstName lastName");

  const hasMore = posts.length > limit;
  if (hasMore) {
    posts.pop(); // Remove the extra item used for the check
  }

  const nextCursor = hasMore ? posts[posts.length - 1]._id : null;

  return {
    posts,
    nextCursor,
    hasMore,
  };
};
