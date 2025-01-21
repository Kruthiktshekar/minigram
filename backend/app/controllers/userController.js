import { createController } from './helper/createController.js';
import { loginController, verifyOtp } from '../middlewares/loginValidation.js';
import { deleteController } from './helper/deleteController.js';
import { getAllController } from './helper/getAllController.js';
import { getController } from './helper/getController.js';
import { updateController } from './helper/updateController.js';
import { errorCatchBlock } from './helper/errorCatch.js';
import { CONTROLLERS } from './helper/constants.js';

const { USER, FOLLOW } = CONTROLLERS;

/**
 * This function is used to create a user record in the table and return the successfull response
 * @param {Object} req - request function of the controller, which contains request data
 * @param {Object} res - response function of the controller
 * @returns
 */
const createUser = async (req, res) => {
  try {
    const userData = await createController(req, res, USER);
    return res.status(201).json(userData);
  } catch (error) {
    console.log('[ERROR] Error in create user', error, error.message);
    return errorCatchBlock(error, res);
  }
};

/**
 * This function is used to verify otp  and return the message as verified
 * @param {Object} req - request function of the controller, which contains request data
 * @param {Object} res - response function of the controller
 * @returns
 */
const otpVerify = async (req, res) => {
  try {
    const data = await verifyOtp(req, res);
    return res.status(200).json(data);
  } catch (error) {
    console.log('[ERROR] Error in verify user', error, error.message);
    return errorCatchBlock(error, res);
  }
};

/**
 * This function is used to login a user and return the token
 * @param {Object} req - request function of the controller, which contains request data
 * @param {Object} res - response function of the controller
 * @returns
 */
const loginUser = async (req, res) => {
  try {
    const token = await loginController(req, res);
    return res.status(200).json({ token });
  } catch (error) {
    console.log('[ERROR] Error in login user function', error, error.message);
    return errorCatchBlock(error, res);
  }
};

/**
 * This function is used to fetch single user and return successfull response
 * @param {Object} req - request function of the controller, which contains request data
 * @param {Object} res - response function of the controller
 * @returns
 */
const getUser = async (req, res) => {
  try {
    const userData = await getController(req, res, USER);
    return res.status(200).json(userData);
  } catch (error) {
    console.log('[ERROR] Error in fetching user', error, error.message);
    return errorCatchBlock(error, res);
  }
};

/**
 * This function is used to fetch all users and return successfull response
 * @param {Object} req - request function of the controller, which contains request data
 * @param {Object} res - response function of the controller
 * @returns
 */
const getAllUsers = async (req, res) => {
  try {
    const userData = await getAllController(req, res, USER);
    return res.status(200).json(userData);
  } catch (error) {
    console.log('[ERROR] Error in fetching user', error, error.message);
    return errorCatchBlock(error, res);
  }
};

/**
 * This function is used to update user data and return new data as a response
 * @param {Object} req - request function of the controller, which contains request data
 * @param {Object} res - response function of the controller
 * @returns
 */
const updateUser = async (req, res) => {
  try {
    const userData = await updateController(req, res, USER);
    return res.status(200).json(userData);
  } catch (error) {
    console.log('[ERROR] Error in update user', error, error.message);
    return errorCatchBlock(error, res);
  }
};

/**
 * This function is used to delete a user
 * @param {Object} req - request function of the controller, which contains request data
 * @param {Object} res - response function of the controller
 * @returns
 */
const deleteUser = async (req, res) => {
  try {
    const userData = await deleteController(req, res, USER);
    return res.status(200).json(userData);
  } catch (error) {
    console.log('[ERROR] Error in deleting user', error, error.message);
    return errorCatchBlock(error, res);
  }
};

/**
 * This function is used to update following and followers data
 * @param {Object} req - request function of the controller, which contains request data
 * @param {Object} res - response function of the controller
 * @returns
 */
const followOrUnfollow = async (req, res) => {
  try {
    const responseData = await updateController(req, res, FOLLOW);
    return res.status(200).json(responseData);
  } catch (error) {
    console.log('[ERROR] Error in follow or unfollowing', error, error.message);
    return errorCatchBlock(error, res);
  }
};

export const userController = {
  create: async (req, res) => {
    return await createUser(req, res);
  },
  verify: async (req, res) => {
    return await otpVerify(req, res);
  },
  login: async (req, res) => {
    return await loginUser(req, res);
  },
  get: async (req, res) => {
    return await getUser(req, res);
  },
  update: async (req, res) => {
    return await updateUser(req, res);
  },
  delete: async (req, res) => {
    return await deleteUser(req, res);
  },
  follow: async (req, res) => {
    return await followOrUnfollow(req, res);
  },
  getAll: async (req, res) => {
    return await getAllUsers(req, res);
  },
};
