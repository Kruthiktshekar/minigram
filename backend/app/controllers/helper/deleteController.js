import { Post } from '../../models/postModel.js';
import { User } from '../../models/userModel.js';
import { CONTROLLERS, USER_ERROR_MESSAGE } from './constants.js';
import { CustomError } from './errorCatch.js';
const { USER_NOT_FOUND, POST_NOT_FOUND, INTERNAL_SERVER_ERROR } =
  USER_ERROR_MESSAGE;

const { USER, POST } = CONTROLLERS;

/**
 * This function is used to delete user || post and returns successfull response
 * @param {Object} req - request function of the controller, which contains request data
 * @param {String} controllerName - it would be USER, POST
 * @returns
 */
export const deleteController = async (req, res, controllerName) => {
  try {
    switch (controllerName) {
      case USER: {
        const id = req.userId;
        const user = await User.findByIdAndDelete(id);
        await Post.findOneAndDelete({ user: user._id });
        if (!user) {
          throw new CustomError(404, USER_NOT_FOUND);
        }
        return user;
      }
      case POST: {
        const postId = req.params.id;
        const userId = req.userId;
        const dltPost = await Post.findOneAndDelete({
          _id: postId,
          user: userId,
        });
        if (!dltPost) {
          throw new CustomError(404, POST_NOT_FOUND);
        }
        return dltPost;
      }
    }
  } catch (error) {
    throw new CustomError(
      error.statusCode ?? 500,
      error.message ?? INTERNAL_SERVER_ERROR
    );
  }
};
