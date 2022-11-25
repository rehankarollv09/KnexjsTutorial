import axios from "axios";
import jwt from "jsonwebtoken";
import FormData from "form-data";
import fetch from "node-fetch";
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

export const verifyRecaptcha = async (req, res, next) => {
  try {
    let url = "https://www.google.com/recaptcha/api/siteverify";
    const secretKey = process.env.RECAPTCHA_SECRET_KEY;
    const token = req.headers["g-recaptcha-response"];
    if (!token) {
      console.log("im here");
      return res.status(400).json({ message: "Recaptcha Verification Failed" });
    }
    if (token) {
      const formData = new FormData();
      formData.append("secret", secretKey);
      formData.append("response", token);
      const response = await axios.post(url, formData, {
        headers: formData.getHeaders(),
      });
      if (!response.data.success) {
        return res.status(400).json({ message: "Something went wrong" });
      }
      next();
    }
  } catch (err) {
    console.log(err);
  }
};
