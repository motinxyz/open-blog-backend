// external modules
import express from "express";
import cors from "cors";
import session from "express-session";
import connectMongoDBSession from "connect-mongodb-session";
import helmet from "helmet";

// local modules
import { logIncomingRequest } from "./utils/reqLogger.js";
import postRouter from "./features/posts/post.routes.js";
import authRouter from "./features/auth/auth.routes.js";
import globalErrorHandler from "./utils/globalErrorHandler.js";
import { ERROR_MESSAGES, SUCCESS_MESSAGES } from "./constants/messages.js";

const app = express();
const DB_URL = process.env.DB_URL;

// --- Core Middleware Setup ---

// Set security-related HTTP headers
app.use(helmet());

// Enable CORS for routes
const allowedOrigins = process.env.ALLOWED_ORIGINS?.split(",");
const corsOptions = {
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error(ERROR_MESSAGES.CORS_NOT_ALLOWED));
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
  res.status(200).json({ message: SUCCESS_MESSAGES.API_RUNNING });
});

app.use("/api/auth", authRouter);
app.use("/api/posts", postRouter);

// --- Global Error Handling ---
// This middleware must be last.
app.use(globalErrorHandler);

export default app;
