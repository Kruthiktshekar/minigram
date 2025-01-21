import express from 'express';
import { checkSchema } from 'express-validator';
import { userController } from '../app/controllers/userController.js';
import authenticateUser from '../app/middlewares/userAthenticate.js';
import { postController } from '../app/controllers/postController.js';
import upload from '../app/multerConfig/multer.js';
import chatController from '../app/controllers/chatController.js';
import {
  loginUserSchema,
  userRegisterSchema,
} from '../app/validators/userValidator.js';

export const route = express.Router();

// user routes
route.post(
  '/api/signup',
  checkSchema(userRegisterSchema),
  userController.create
);
route.post('/api/verify', userController.verify);
route.post('/api/login', checkSchema(loginUserSchema), userController.login);
route.get('/api/get-user', authenticateUser, userController.get);
route.get('/api/get-users', authenticateUser, userController.getAll);
route.put('/api/user-update', authenticateUser, upload, userController.update);
route.delete('/api/user-delete/:id', authenticateUser, userController.delete);
route.put('/api/follow/:id', authenticateUser, userController.follow);

// post routes
route.post('/api/post', authenticateUser, upload, postController.create);
route.get('/api/all-posts', authenticateUser, postController.getAll);
route.get('/api/user-posts', authenticateUser, postController.get);
route.put('/api/like-post/:id', authenticateUser, postController.like);
route.put('/api/comment-post/:id', authenticateUser, postController.comment);
route.put('/api/update/:id', authenticateUser, upload, postController.update);
route.delete('/api/post/:id', authenticateUser, upload, postController.delete);

// chat routes
route.post('/api/message', authenticateUser, chatController.add);
route.post('/api/messages', authenticateUser, chatController.receive);
