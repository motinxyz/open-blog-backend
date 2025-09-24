import express from "express";
import {  getAllPosts, handleCreatePost } from "./post.controller.js";
import { postValidators } from "./post.validators.js";
import { isAuthenticated } from "../../services/isAuthenticated.middleware.js";

const postRouter = express.Router();

postRouter.post("/new", isAuthenticated, postValidators, handleCreatePost);
postRouter.get("/",  getAllPosts);

export default postRouter;
