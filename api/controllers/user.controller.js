
import User from '../models/user.model.js';
import Listing from '../models/listing.model.js';
import { errorHandler } from '../utils/error.js';

// Test user route
export const test = (req, res) => {
  res.status(200).json({
    message: 'User route is working!',
  });
};

// Update user
export const updateUser = async (req, res, next) => {
  if (req.user.id !== req.params.id) {
    return next(errorHandler(401, 'You can only update your own account!'));
  }

  try {
    const { username, email, avatar } = req.body;

    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      {
        $set: {
          username,
          email,
          avatar,
        },
      },
      {
        new: true,
        runValidators: true,
      }
    );

    if (!updatedUser) {
      return next(errorHandler(404, 'User not found!'));
    }

    const { password, ...rest } = updatedUser._doc;

    res.status(200).json(rest);
  } catch (error) {
    next(error);
  }
};

// Delete user
export const deleteUser = async (req, res, next) => {
  if (req.user.id !== req.params.id) {
    return next(errorHandler(401, 'You can only delete your own account!'));
  }

  try {
    const deletedUser = await User.findByIdAndDelete(req.params.id);

    if (!deletedUser) {
      return next(errorHandler(404, 'User not found!'));
    }

    res.clearCookie('access_token');

    res.status(200).json('User has been deleted!');
  } catch (error) {
    next(error);
  }
};

// Get user's listings
export const getUserListings = async (req, res, next) => {
  if (req.user.id !== req.params.id) {
    return next(errorHandler(401, 'You can only view your own listings!'));
  }

  try {
    const listings = await Listing.find({
      userRef: req.params.id,
    });

    res.status(200).json(listings);
  } catch (error) {
    next(error);
  }
};
