import { User } from "../models/user-model.js";
import bcryptjs from "bcryptjs";
import jwt from "jsonwebtoken";
import sendOtp from "../middlewares/nodemailer.js";
import { validationResult } from "express-validator";

// create new user - signup
const createUser = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  const data = req.body;
  try {
    const salt = await bcryptjs.genSalt();
    const hashed = await bcryptjs.hash(data.password, salt);
    data.password = hashed;
    data.verified = false;
    const user = await User.create(data);
    if (!user) {
      return res.status(401).json({ msg: "user not created" });
    }
    await sendOtp(user._id, user.email);
    if (!sendOtp) {
      return res.status(500).json({ msg: "error in sending OTP" });
    }
    res.status(200).json({ msg: "OTP sent successfully" });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ msg: error.message });
  }
};

// to verify otp
const verifyUser = async (req, res) => {
  const data = req.body;
  console.log(data)
  try {
    const user = await User.findOne({ email: data.email });
    console.log(user)
    if (!user) {
      return res.status(404).json({ msg: "user not found" });
    }
    const otp = bcryptjs.compare(data.otp, user.otp);
    if (!otp || user.otpExpires < Date.now()) {
      User.findOneAndDelete({ email: data.email });
      return res.status(400).json({ msg: "Invalid or expired OTP" });
    }
    user.verified = true;
    user.otp = undefined;
    user.otpExpires = undefined;
    await user.save();
    return res.status(200).json({ msg: "User verified" });
  } catch (error) {
    return res.status(500).json({ msg: error.message });
  }
};

// user login - sign-in
const loginUser = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  const data = req.body;
  try {
    const user = await User.findOne({ username: data.username });
  console.log(user)
    if (!user) {
      return res.status(404).json({ msg: "User not found" });
    }
    if (!user.verified) {
      return res.status(404).json({ msg: "User not found" });
    }
    const passwordVerify = await bcryptjs.compare(data.password, user.password);
    if (!passwordVerify) {
      return res.status(401).json({ msg: "email or password is incorrect" });
    }
    const tokenData = { userId: user._id };
    const token = jwt.sign(tokenData, process.env.JWT_SCRETE, {
      expiresIn: "1d",
    });
    return res.status(200).json({ token: token });
  } catch (error) {
    return res.status(500).json({ msg: error.message });
  }
};

// get singel user
const getUser = async (req, res) => {
  const id = req.userId;
  try {
    const user = await User.findById(id).select("-password");
    if (!user) {
      return res.status(404).json("User not found");
    }
    return res.status(200).json(user);
  } catch (error) {
    return res.status(500).json({ msg: error.message });
  }
};
//get all users

const getAllUsers = async (req, res) => {
  const id = req.userId;
  try {
    const users = await User.find({ _id: { $ne: id } }).select(
      "-password -email"
    );
    if (users.length == 0) {
      return res.status(404).json({ msg: "user not found" });
    }
    return res.status(200).json(users);
  } catch (error) {
    console.log(error);
    return res.status(500).json(error);
  }
};

// to update user
const updateUser = async (req, res) => {
  const data = req.body;
  if (req.file) {
    data.profilePic = req.file.path;
  }
  const id = req.userId;
  try {
    const updatedUser = await User.findByIdAndUpdate(id, data, { new: true });
    if (!updatedUser) {
      return res.status(404).json("User Not Found");
    }
    return res.status(200).json(updatedUser);
  } catch (error) {
    return res.status(500).json({ msg: error.message });
  }
};

// to delete user
const deleteUser = async (req, res) => {
  const id = req.userId;
  try {
    const deletedUser = await User.findByIdAndDelete(id);
    if (!deletedUser) {
      return res.status(404).json();
    }
    return res.status(200).json(deletedUser);
  } catch (error) {
    return res.status(500).json({ msg: error.message });
  }
};

// to follow or unfollow
const followOrUnfollow = async (req, res) => {
  let userToFollow = await User.findById(req.params.id);
  const currentUser = await User.findById(req.userId);
  const data = req.body;
  let msg = "";
  try {
    if (!userToFollow) {
      return res.status(404).json({ msg: "User Not Found" });
    }
    if (currentUser.following.includes(userToFollow._id)) {
      if (!userToFollow) {
        return res.status(404).json({ msg: "User Not Found" });
      }

      currentUser.following = currentUser.following.filter(
        (userId) => userId.toString() !== userToFollow._id.toString()
      );
      userToFollow.followers = userToFollow.followers.filter(
        (userId) => userId.toString() !== currentUser._id.toString()
      );

      await currentUser.save();
      await userToFollow.save();
      msg = `you unfollowed ${userToFollow.username}`;
    } else {
      currentUser.following.push(userToFollow._id);
      userToFollow.followers.push(currentUser._id);

      await currentUser.save();
      await userToFollow.save();
      msg = `you started following ${userToFollow.username}`;
    }
    return res.status(200).json(userToFollow._id);
  } catch (error) {
    console.log(error);
    return res.status(500).json("internal server error");
  }
};

export const userController = {
  create: async (req, res) => {
    return await createUser(req, res);
  },
  verify: async (req, res) => {
    return await verifyUser(req, res);
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
