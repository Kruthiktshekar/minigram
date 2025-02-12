import { Post } from '../../models/postModel.js';
import { User } from '../../models/userModel.js';
import { CONTROLLERS, USER_ERROR_MESSAGE } from './constants.js';
import { CustomError } from './errorCatch.js';
const { USERS_NOT_FOUND, INTERNAL_SERVER_ERROR, POST_NOT_FOUND } =
  USER_ERROR_MESSAGE;

const { USER, POST } = CONTROLLERS;

/**
 * This function is used to fetch all user || post and returns successfull response
 * @param {String} controllerName - it would be USER, POST
 * @returns
 */
export const getAllController = async (req, res, controllerName) => {
  try {
    switch (controllerName) {
      case USER: {
        const id = req.userId;
        console.log(id);
        const users = await User.find({ _id: { $ne: id } });
        console.log(users);
        if (users.length == 0) {
          throw new CustomError(404, USERS_NOT_FOUND);
        }
        return users;
      }
      case POST: {
        const posts = await Post.find()
          .populate('user', 'username')
          .populate('postlikes', 'username')
          .populate('comments.user', 'username')
          .sort({ createdAt: -1 });
        if (!posts) {
          throw new CustomError(404, POST_NOT_FOUND);
        }
        return posts;
      }
    }
  } catch (error) {
    throw new CustomError(
      error.statusCode ?? 500,
      error.message ?? INTERNAL_SERVER_ERROR
    );
  }
};
