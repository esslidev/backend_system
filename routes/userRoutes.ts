import express from "express";

const userController = require("../controllers/userController");

const userRouter = express.Router();

// Define the route for the "Hello, World!" API endpoint
userRouter.get("/getUser", userController.getUser);
userRouter.post("/setUser", userController.setUser);
userRouter.put("/updateUser", userController.updateUser);

export default userRouter;
