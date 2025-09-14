import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import "./cron-jobs/cron.js"; //import để chạy cron
import { initSocket } from "./socket/socket.js";
import http from "http";
import path from 'path';

// Solution for __dirname in ESM
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

dotenv.config();
//
import RootRouter from "./routes/index.js";

await mongoose.connect(process.env.MONGO_URL).then(() => {
  console.log("Connected database!");
});

const app = express();
app.use(express.json());
app.use(cors());

const server = http.createServer(app);
initSocket(server); // Truyền server HTTP vào

// app.get("", (req, res) => {
//   res.send({
//     message: "Connected!",
//   });
// });

app.use("/api", RootRouter);

// Fix: __dirname is now defined above for ESM
if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, '../frontend/dist')));

  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend/dist/index.html'));
  });  
}

const PORT = process.env.PORT || 8080; 
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

