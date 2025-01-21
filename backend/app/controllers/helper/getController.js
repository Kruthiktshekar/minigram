import { Chat } from '../../models/chatModel.js';
import { Post } from '../../models/postModel.js';
import { User } from '../../models/userModel.js';
import { CONTROLLERS, USER_ERROR_MESSAGE } from './constants.js';
import { CustomError } from './errorCatch.js';
const { USER_NOT_FOUND, INTERNAL_SERVER_ERROR } = USER_ERROR_MESSAGE;

const { USER, POST, CHAT } = CONTROLLERS;

/**
 * This function is used to fetch single user || post || chat and returns successfull response
 * @param {Object} req - request function of the controller, which contains request data
 * @param {String} controllerName - it would be USER, CHAT , POST
 * @returns
 */
export const getController = async (req, res, controllerName) => {
  try {
    switch (controllerName) {
      case USER: {
        const id = req.userId;
        const user = await User.findById(id).select('-password');
        if (!user) {
          throw new CustomError(404, USER_NOT_FOUND);
        }
        return user;
      }
      case POST: {
        const id = req.userId;
        const posts = await Post.find({ user: id }).sort({ createdAt: -1 });
        if (!posts) {
          return res.status(404).json({ msg: 'Not Found' });
        }
        return posts;
      }
      case CHAT: {
        const from = req.userId;
        const { to } = req.body;
        const messages = await Chat.find({
          users: {
            $all: [from, to],
          },
        }).sort({ updatedAt: 1 });
        const projectedMsgs = messages.map((msg) => {
          return {
            fromSelf: msg.sender.toString() === from,
            message: msg.message.text,
          };
        });
        return projectedMsgs;
      }
    }
  } catch (error) {
    throw new CustomError(
      error.statusCode ?? 500,
      error.message ?? INTERNAL_SERVER_ERROR
    );
  }
};
