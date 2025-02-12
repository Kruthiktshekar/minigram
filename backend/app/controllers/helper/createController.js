import { validationResult } from 'express-validator';
import { CONTROLLERS, USER_ERROR_MESSAGE } from './constants.js';
import { CustomError } from './errorCatch.js';
import hashData from './bcryptHash.js';
import sendOtp from '../../middlewares/nodemailer.js';
import { Post } from '../../models/postModel.js';
import { Chat } from '../../models/chatModel.js';
import { User } from '../../models/userModel.js';

const { INTERNAL_SERVER_ERROR, SOMETHING_WENT_WRONG, MAIL_ERROR } =
  USER_ERROR_MESSAGE;

const { USER, POST, CHAT } = CONTROLLERS;

/**
 * This function is used to create user || post || chat message and returns successfull response
 * @param {Object} req - request function of the controller, which contains request data
 * @param {Object} res - response function of the controller
 * @param {String} controllerName - it would be USER, POST ,CHAT
 * @returns
 */
export const createController = async (req, res, controllerName) => {
  try {
    switch (controllerName) {
      case USER: {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
          throw new CustomError(401, errors.array()[0].msg);
        }
        const data = req.body;
        const hashedData = await hashData(data.password);
        data.password = hashedData;
        const user = await User.create(data);
        if (!user) {
          throw new CustomError(404, SOMETHING_WENT_WRONG);
        }
        await sendOtp(user._id, user.email);
        if (!sendOtp) {
          throw new CustomError(404, MAIL_ERROR);
        }
        const otpMessage = { msg: 'OTP sent successfully' };
        return otpMessage;
      }
      case POST: {
        const data = req.body;
        data.mediaUrl = req.file.path;
        data.user = req.userId;
        const newPost = new Post(data);
        await newPost.save();
        if (!newPost) {
          throw new CustomError(400, SOMETHING_WENT_WRONG);
        }
        return newPost;
      }
      case CHAT: {
        const { to, message } = req.body;
        console.log(req.body);
        const from = req.userId;
        const formData = {
          message: { text: message },
          users: [from, to],
          sender: from,
        };
        const data = await Chat.create(formData);
        console.log(data);
        if (data) {
          return data;
        }
        throw new CustomError(400, SOMETHING_WENT_WRONG);
      }
    }
  } catch (error) {
    console.log('[ERROR] error in createController', error);
    if (error instanceof CustomError) {
      throw error;
    }
    throw new Error({ statusCode: 500, message: INTERNAL_SERVER_ERROR });
  }
};
