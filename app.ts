import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";
import cors from "cors";
import userRoutes from "./routes/userRoutes";
import userProgressRoutes from "./routes/userProgressRoutes";

require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 3000;

const corOptions = {
  origin: ["http://travinglo.esslidev.localhost"],
};

// this part is for initiating the socket.io
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: corOptions,
});

app.use(cors(corOptions));
app.use(express.json({ limit: "10mb" }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/api/users", authMiddleware, userRoutes);
app.get("/", async (req, res, next) => {
  res.send({ message: "Awesome it works  automatically🐻" });
});

function authMiddleware(request: express.Request, response: express.Response, next: express.NextFunction) {
  const apiKey = request.headers.apikey;

  // const token = authHeader && authHeader?.split(" ")[1];
  if (!apiKey || !process.env.API_KEY || apiKey != process.env.API_KEY)
    return response.status(401).json({
      error: "authorization-related issue,",
      message: "The request lacks valid authentication credentials for the target resource.",
    });
  setTimeout(() => {
    next();
  }, 0);
}

httpServer.listen(PORT, () => console.log(`🚀 listening to port :${PORT}`));
