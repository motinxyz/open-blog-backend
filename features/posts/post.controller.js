import { validationResult } from "express-validator";
import { createPost, fetchAllPosts } from "./post.service.js";
// import { json } from "express";

export const handleCreatePost = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({
      message: "Validation failed.",
      errors: errors.array(),
    });
  }

  try {
    const postData = {
      ...req.body,
      author: req.session.user._id, // Securely get author from the session
    };
    const newPost = await createPost(postData);
    res
      .status(201)
      .json({ message: "Post created successfully!", post: newPost });
  } catch (error) {
    next(error);
  }
};

export const getAllPosts = async (req, res, next) => {
  try {
    const limit = parseInt(req.query.limit) || 20;
    const cursor = req.query.cursor || null;

    const result = await fetchAllPosts({ limit, cursor });
    // console.log(json(result));
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};
