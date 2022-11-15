import jwt from "jsonwebtoken";
export const authenticateUser = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader ? authHeader.split(" ")[1] : undefined;
  if (!token) return res.status(401).json({ message: "Unauthorized user" });
  jwt.verify(token, process.env.ACCESS_PRIVATE_KEY, (err, user) => {
    if (err) return res.status(401).json({ message: "Token expired" });
    req.user = user;
    next();
  });
};
