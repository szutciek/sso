import AppError from "../utils/AppError.js";

export const authenticate = async (req, _, next) => {
  try {
    const token = req.cookies.token;
    // decode jwt token and set req.user
    if (!token) {
      throw new AppError("Not authenticated", 401);
    }
    // decode jwt token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decoded._id;
    console.log(token);
  } catch (error) {
    next(error);
  }
};

export const restrictToAuthenticated = (req, _, next) => {
  if (!req.user) {
    throw new AppError("Not authenticated", 401);
  }
  req._authenticated = true;
  next();
};

export const restrictToSelf = (req, _, next) => {
  if (req._authenticated !== true) {
    throw new AppError("Not authenticated", 401);
  }
  if (req.user._id !== req.params._id) {
    throw new AppError("Not authorized to access this resource", 403);
  }
  next();
};
