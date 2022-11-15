import jwt from "jsonwebtoken";
export const generateAccessToken = (user) => {
  return jwt.sign(user, process.env.ACCESS_PRIVATE_KEY,{expiresIn:"30m"});
};
