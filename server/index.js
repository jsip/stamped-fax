import dotenv, { config } from "dotenv";
import express from "express";
import multer from "multer";
import cors from "cors";
import { createFax } from "./lib/phaxio.js";
import path from "path";
import { auth } from "./middleware/auth.js";
import fs from "fs";
import { permitted } from "./middleware/permitted.js";
import rateLimit from "express-rate-limit";

// dotenv config
config();

// dirname assignment
const __dirname = path.resolve();

// express app initialization
const app = express();

// rate limiter for api calls
const apiLimiter = rateLimit({
	windowMs: 15 * 60 * 1000, // 15 minutes
	max: 100, // Limit each IP to 100 requests per `window` (here, per 15 minutes)
	standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
	legacyHeaders: false, // Disable the `X-RateLimit-*` headers
})

// express app config for request handling
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// express app config to serve assets
app.use(express.static(path.join(__dirname, "..", "build")));
app.use(express.static("public"));

// express app config for rate limiting
app.use('/api', apiLimiter)
app.set('trust proxy', 1)

// express app config for cors
app.use(cors({ origin: "*" }));
app.options("*", cors());

// file storage config and initialization
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads"),
  filename: (req, file, cb) => cb(null, file.originalname + "-" + Date.now()),
});
const upload = multer({ storage: storage });

// login route
app.use("/login", auth);

// SPA route
app.get("/", permitted, (req, res) => {
  res.sendFile(path.join(__dirname, "..", "build", "index.html"));
});

// common fax recipients endpoint
app.get("/api/commonFaxRecipients", permitted, (req, res) => {
  res.sendFile(path.join(__dirname, "commonFaxRecipients.json"));
});

// add common fax recipients endpoint
app.put("/api/commonFaxRecipients", permitted, (req, res) => {
  const commonFaxRecipients = JSON.stringify(req.body);
  fs.readFile(
    "./commonFaxRecipients.json",
    "utf8",
    function readFileCallback(err, data) {
      if (err) {
        res.status(500).send("Error reading files");
      } else {
        const parsedData = JSON.parse(data);
        const recipients = parsedData.faxRecipients;

        recipients.push(JSON.parse(commonFaxRecipients));
        fs.writeFile(
          "./commonFaxRecipients.json",
          JSON.stringify({ faxRecipients: recipients }),
          "utf8",
          (err) => {
            if (err) throw err;
          }
        );
        res.sendStatus(200);
      }
    }
  );
});

// fax endpoint
app.post("/api/fax", permitted, upload.array("faxFiles"), (req, res, next) => {
  const files = req.files;
  const faxNumber = req.body.faxNumber;

  if (!files || !faxNumber) {
    const error = new Error("Please send the necessary information.");
    error.httpStatusCode = 400;
    return next(error);
  }

  createFax({ files, faxNumber })
    .then((faxRes) => {
      res.status(res.statusCode).send(faxRes);
    })
    .catch((err) => {
      res.status(err.statusCode).send(err);
    });
});

app.listen(process.env.PORT, () =>
  console.log(`live at http://localhost:${process.env.PORT}`)
);
