import "dotenv/config";
import mongoose from "mongoose";
import app from "./app.js";

const PORT = process.env.PORT || 3000;
const DB_URL = process.env.DB_URL;

async function startServer() {
  try {
    await mongoose.connect(DB_URL);
    console.log("Database got connected");
    app.listen(PORT, () => {
      console.log(`App is started on http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error("Failed to start server:", error);
    process.exit(1);
  }
}

startServer();
