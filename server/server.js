import { config } from "dotenv";
import express from "express";
import cors from "cors";
import { rateLimiterUsingThirdParty } from "./middlewares/rateLimiter.js";
import routes from "./routes/index.js";

// Dotenv

config();

// Express app initialization

const app = express();

// Middleware for Content-Type handling

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Middleware for rate limiting

app.use(rateLimiterUsingThirdParty);
app.set("trust proxy", 1);

// CORS Middleware ---

const corsOptions = {
  origin: process.env.CLIENT_ORIGIN,
  methods: ["GET", "PUT", "POST", "OPTIONS", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization", "Accept", "Origin"],
};

app.use(cors(corsOptions), (req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", process.env.CLIENT_ORIGIN);
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS, PUT, DELETE");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Content-Type, Authorization, Access-Control-Request-Method, Access-Control-Request-Headers"
  );
  next();
});
app.options("*", cors(corsOptions));

// Routes

app.use('/api/health', routes.health);
app.use('/api/login', routes.login);
app.use('/api/commonFaxRecipients', routes.commonFaxRecipients);
app.use('/api/fax', routes.fax);

app.listen(process.env.PORT, () =>
  console.log(`live at http://${process.env.HOST}:${process.env.PORT}`)
);
