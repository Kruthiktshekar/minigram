import { Post } from '../../models/postModel.js';
import { User } from '../../models/userModel.js';
import { CONTROLLERS, USER_ERROR_MESSAGE } from './constants.js';
import { CustomError } from './errorCatch.js';
const { USER_NOT_FOUND, POST_NOT_FOUND, INTERNAL_SERVER_ERROR } =
  USER_ERROR_MESSAGE;

const { USER, POST, FOLLOW, COMMENT, LIKE } = CONTROLLERS;

/**
 * This function is used to update user || movie || post || comment || like || follow  and returns successfull response
 * @param {Object} req - request function of the controller, which contains request data
 * @param {String} controllerName - it would be USER, POST, COMMENT, LIKE, FOLLOW
 * @returns
 */
export const updateController = async (req, res, controllerName) => {
  try {
    switch (controllerName) {
      case USER: {
        const id = req.userId;
        const data = req.body;
        if (req.file) {
          data.profilePic = req.file.path;
        }
        const updatedUser = await User.findByIdAndUpdate(id, data, {
          new: true,
        });
        if (!updatedUser) {
          throw new CustomError(404, USER_NOT_FOUND);
        }
        return updatedUser;
      }
      case FOLLOW: {
        let userToFollow = await User.findById(req.params.id);
        const currentUser = await User.findById(req.userId);
        if (!userToFollow) {
          throw new CustomError(404, USER_NOT_FOUND);
        }
        if (currentUser.following.includes(userToFollow._id)) {
          if (!userToFollow) {
            throw new CustomError(404, USER_NOT_FOUND);
          }

          currentUser.following = currentUser.following.filter(
            (userId) => userId.toString() !== userToFollow._id.toString()
          );
          userToFollow.followers = userToFollow.followers.filter(
            (userId) => userId.toString() !== currentUser._id.toString()
          );

          await currentUser.save();
          await userToFollow.save();
        } else {
          currentUser.following.push(userToFollow._id);
          userToFollow.followers.push(currentUser._id);

          await currentUser.save();
          await userToFollow.save();
        }
        return userToFollow._id;
      }
      case COMMENT: {
        const id = req.params.id;
        const data = {
          user: req.userId,
          text: req.body.text,
        };
        const post = await Post.findById(id);
        if (!post) {
          throw new CustomError(404, POST_NOT_FOUND);
        }
        post.comments.unshift(data);
        await post.save();
        const updatedCmt = await Post.findById(id).populate(
          'comments.user',
          'username'
        );
        return updatedCmt.comments[0];
      }
      case LIKE: {
        const id = req.params.id;
        const userId = req.userId;
        const post = await Post.findById(id);
        if (!post) {
          throw new CustomError(404, POST_NOT_FOUND);
        }
        const hasliked = post.postlikes.includes(userId);
        if (!hasliked) {
          post.postlikes.push(userId);
          await post.save();
        } else {
          post.postlikes = post.postlikes.filter(
            (likedUser) => likedUser.toString() !== userId.toString()
          );
          await post.save();
        }

        const updatedPost = await Post.findById(id).populate(
          'postlikes',
          'username'
        );
        const resPost = updatedPost.postlikes.find(
          (ele) => ele._id.toString() == req.userId.toString()
        );
        const response = resPost || { _id: req.userId };
        return response;
      }
      case POST: {
        const postId = req.params.id;
        const userId = req.userId;
        const data = req.body;
        if (req.file) {
          data.mediaUrl = req.file.path;
        }
        const post = await Post.findOneAndUpdate(
          { _id: postId, user: userId },
          data,
          { new: true }
        );
        if (!post) {
          throw new CustomError(404, POST_NOT_FOUND);
        }
        return post;
      }
    }
  } catch (error) {
    throw new CustomError(
      error.statusCode ?? 500,
      error.message ?? INTERNAL_SERVER_ERROR
    );
  }
};
