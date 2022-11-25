import express from "express";
const app = express();
import cors from "cors";
import knex from "../db/db.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import env from "dotenv";
import { authenticateUser, verifyRecaptcha } from "../src/middleware/index.js";
import { generateAccessToken } from "../src/helpers/index.js";
env.config();
app.use(express.json());
app.use(
  cors({
    origin: "*",
    allowedHeaders: ["g-recaptcha-response", "Content-Type"],
  })
);
let refreshTokens = [];
app.listen("8080", () => {
  console.log("Server started on port 8080");
});
app.get("/getAllEmployees", (req, res) => {
  knex.raw("select * from employee").then((employee) => {
    return res.send(employee.rows);
  });
});
app.post("/refreshToken", (req, res) => {
  const refreshToken = req.body.refreshToken;
  if (!refreshToken) return res.json({ message: "Invalid payload" });
  jwt.verify(refreshToken, process.env.REFRESH_TOKEN, (err, user) => {
    if (err) return res.status(401).json({ message: "Unauthorized " });
    const payload = {
      userId: user.userId,
      email: user.email,
    };
    const accessToken = generateAccessToken({ ...payload });
    return res.status(200).json({ accessToken: accessToken });
  });
});
app.get("/getEmployee/:id", authenticateUser, (req, res) => {
  const id = req.params.id;
  console.log(req.user);
  knex
    .select()
    .from("employee")
    .where("id", id)
    .then((employee) => {
      return res.send(employee);
    });
});
app.post("/addBlog", authenticateUser, async (req, res, ctx) => {
  try {
    const payload = {
      id: req.body.id,
      description: req.body.description,
      employee_id: req.user.userId,
    };
    console.log(req.user.userId);
    //await knex("blog").insert({ ...payload });
    await knex.raw(
      "insert into blog(id,description,employee_id) values(?,?,?)",
      [payload.id, payload.description, payload.employee_id]
    );
    return res.status(200).json({ message: "Blog Created" });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "Something Went Wrong" });
  }
});
app.post("/employee/SignUp", verifyRecaptcha, async (req, res, ctx) => {
  try {
    const { rowCount } = await knex.raw(
      "select email from employee where email=?",
      [req.body.email]
    );
    console.log(rowCount);
    if (rowCount === 0) {
      const password = await bcrypt.hash(req.body.password, 10);
      const payload = {
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        email: req.body.email,
        password: password,
      };
      await knex.raw(
        "insert into employee(firstName,lastName,email,password) values(?,?,?,?)",
        [payload.firstName, payload.lastName, payload.email, payload.password]
      );

      return res.status(201).json({ message: "User created" });
    } else {
      return res.status(400).json({ message: "Email already exist" });
    }
  } catch (err) {
    return res.status(500).json({ message: "Something Went Wrong" });
  }
});
app.put("/updateEmployee/:id", (req, res, ctx) => {
  knex("employee")
    .where("id", req.params.id)
    .update({
      id: req.body.id,
      first_name: req.body.first_name,
      last_name: req.body.last_name,
      email: req.body.email,
      password: req.body.password,
    })
    .then(() => {
      return res.json({ message: "success", status: "ok" });
    })
    .catch((err) => console.log(err));
});
app.delete("/deleteEmployee/:id", (req, res, ctx) => {
  knex("employee")
    .where("id", req.params.id)
    .delete()
    .then(() => {
      return res.json({ message: "success", status: "ok" });
    })
    .catch((err) => console.log(err));
});
app.get("/allBlogsofUser/:id", async (req, res, ctx) => {
  try {
    const response = await knex.raw(
      "select * from blog b inner join employee e on b.employee_id=e.id where b.employee_id=?",
      [req.params.id]
    );
    console.log(response);
    return res.status(200).json({ data: response.rows });
  } catch (err) {
    return res.status(500).json({ message: "Something Went Wrong" });
  }
  /* knex
    .from("blog")
    .innerJoin("employee", "blog.employee_id", "employee.id")
    .where("blog.employee_id", req.params.id)
    .then((blog) => {
      return res.send(blog);
    }); */
});
app.post("/employee/login", verifyRecaptcha, async (req, res, ctx) => {
  try {
    const email = req.body.email;
    const user = await knex
      .select()
      .from("employee")
      .where("email", email)
      .first();
    if (user) {
      const password = await bcrypt.compare(req.body.password, user.password);
      if (password) {
        const payload = { userId: user.id, email: user.email };
        const accessToken = generateAccessToken({ ...payload });
        const refreshToken = jwt.sign(
          { ...payload },
          process.env.REFRESH_TOKEN
        );
        refreshTokens.push(refreshToken);
        return res.status(200).json({
          accessToken: accessToken,
          refreshToken: refreshToken,
          message: "You have been successfully login",
        });
      } else {
        return res.status(401).json({ message: "Password Incorrect" });
      }
    }
    return res.status(400).json({ message: "User not found" });
  } catch (err) {
    return res.status(500).json({ message: "Something Went Wrong" });
  }
});
