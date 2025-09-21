// external modules
import express from "express";
import cors from "cors";
import session from "express-session";
import connectMongoDBSession from "connect-mongodb-session";
import helmet from "helmet";

// local modules
import { logIncomingRequest } from "./utils/reqLogger.js";
// import postRouter from "./features/posts/post.routes.js";
import authRouter from "./features/auth/auth.routes.js";
import globalErrorHandler from "./utils/globalErrorHandler.js";

const app = express();
const DB_URL = process.env.DB_URL;

// --- Core Middleware Setup ---

// Set security-related HTTP headers
app.use(helmet());

// Enable CORS for routes
const allowedOrigins = ["http://localhost:5173"];
const corsOptions = {
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by cors"));
    }
  },
  credentials: true, // This is the crucial line to add
};
app.use(cors(corsOptions));

// Middleware to parse JSON bodies, which is needed for POST requests.
app.use(express.json());

// Log incoming requests
app.use(logIncomingRequest);

// --- Session Setup ---
const MongoDBStore = connectMongoDBSession(session);
const store = new MongoDBStore({
  uri: DB_URL,
  collection: "sessions",
});

// Catch errors on the session store
store.on("error", function (error) {
  console.error("Session store error:", error);
});

app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    // Set to false: only save sessions if they are modified.
    // This prevents creating empty session documents for every visitor.
    saveUninitialized: false,
    store,
  })
);

// --- Route Mounting ---
// Health check route
app.get("/api", (req, res) => {
  res.status(200).json({ message: "API is running." });
});

// All API routes will be prefixed with /api
// e.g., /api/auth/login
app.use("/api/auth", authRouter);
// app.use("/api/posts", postRouter); // When you're ready to add post routes

app.get("/api/wiring-test", (req, res, next) => {
  return res.status(200).json({ passed: true, message: "Wiring works fine!" });
});

// --- Global Error Handling ---
// This middleware must be last.
app.use(globalErrorHandler);

export default app;
