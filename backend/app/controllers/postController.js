import { getController } from './helper/getController.js';
import { getAllController } from './helper/getAllController.js';
import { updateController } from './helper/updateController.js';
import { deleteController } from './helper/deleteController.js';
import { errorCatchBlock } from './helper/errorCatch.js';
import { CONTROLLERS } from './helper/constants.js';
import { createController } from './helper/createController.js';

const { POST, COMMENT, LIKE } = CONTROLLERS;

/**
 * This function is used to create a post record in the table and return the successfull response
 * @param {Object} req - request function of the controller, which contains request data
 * @param {Object} res - response function of the controller
 * @returns
 */
const createPost = async (req, res) => {
  try {
    const userData = await createController(req, res, POST);
    return res.status(201).json(userData);
  } catch (error) {
    console.log('[ERROR] Error in create user', error, error.message);
    return errorCatchBlock(error, res);
  }
};

/**
 * This function is used to fetch all the posts
 * @param {Object} req - request function of the controller, which contains request data
 * @param {Object} res - response function of the controller
 * @returns
 */
const getPosts = async (req, res) => {
  try {
    const userData = await getAllController(req, res, POST);
    return res.status(200).json(userData);
  } catch (error) {
    console.log('[ERROR] Error in fetching user', error, error.message);
    return errorCatchBlock(error, res);
  }
};

/**
 * This function is used to fetch posts that posted by user
 * @param {Object} req - request function of the controller, which contains request data
 * @param {Object} res - response function of the controller
 * @returns
 */
const getUserPosts = async (req, res) => {
  try {
    const userData = await getController(req, res, POST);
    return res.status(200).json(userData);
  } catch (error) {
    console.log('[ERROR] Error in fetching user', error, error.message);
    return errorCatchBlock(error, res);
  }
};

/**
 * This function is used to add comment to the post
 * @param {Object} req - request function of the controller, which contains request data
 * @param {Object} res - response function of the controller
 * @returns
 */
const updateComments = async (req, res) => {
  try {
    const responseData = await updateController(req, res, COMMENT);
    return res.status(200).json(responseData);
  } catch (error) {
    console.log('[ERROR] Error in adding comment', error, error.message);
    return errorCatchBlock(error, res);
  }
};

/**
 * This function is used to like the post , if liked the post unlike the post
 * @param {Object} req - request function of the controller, which contains request data
 * @param {Object} res - response function of the controller
 * @returns
 */
const updateLikes = async (req, res) => {
  try {
    const responseData = await updateController(req, res, LIKE);
    return res.status(200).json(responseData);
  } catch (error) {
    console.log('[ERROR] Error in adding Like', error, error.message);
    return errorCatchBlock(error, res);
  }
};

/**
 * This function is used to update post
 * @param {Object} req - request function of the controller, which contains request data
 * @param {Object} res - response function of the controller
 * @returns
 */
const updatePost = async (req, res) => {
  try {
    const responseData = await updateController(req, res, POST);
    return res.status(200).json(responseData);
  } catch (error) {
    console.log('[ERROR] Error in updating post', error, error.message);
    return errorCatchBlock(error, res);
  }
};

/**
 * This function is used to delete post
 * @param {Object} req - request function of the controller, which contains request data
 * @param {Object} res - response function of the controller
 * @returns
 */
const deletePost = async (req, res) => {
  try {
    const responseData = await deleteController(req, res, POST);
    return res.status(200).json(responseData);
  } catch (error) {
    console.log('[ERROR] Error in deleting post', error, error.message);
    return errorCatchBlock(error, res);
  }
};

export const postController = {
  create: async (req, res) => {
    return await createPost(req, res);
  },
  getAll: async (req, res) => {
    return await getPosts(req, res);
  },
  get: async (req, res) => {
    return await getUserPosts(req, res);
  },
  comment: async (req, res) => {
    return await updateComments(req, res);
  },
  like: async (req, res) => {
    return await updateLikes(req, res);
  },
  update: async (req, res) => {
    return await updatePost(req, res);
  },
  delete: async (req, res) => {
    return await deletePost(req, res);
  },
};
