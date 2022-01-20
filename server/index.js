import { config } from "dotenv";
import express from "express";
import multer from "multer";
import cors from "cors";
import { createFax } from "./lib/phaxio.js";
import path from "path";
import { auth } from "./middlewares/auth.js";
import fs from "fs";
import { permitted } from "./middlewares/permitted.js";
import { rateLimiterUsingThirdParty } from "./middlewares/rateLimiter.js";

// dotenv config
config();

// dirname assignment
const __dirname = path.resolve();

// express app initialization
const app = express();

// express app config for request handling
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// express app config to serve assets
app.use(express.static(path.join(__dirname, "..", "build")));
app.use(express.static("public"));

// express app config for rate limiting
app.use(rateLimiterUsingThirdParty);
app.set('trust proxy', 1)

// express app config for cors
const corsOptions = {
  origin: process.env.CLIENT_ORIGIN,
  methods: ["GET", "PUT", "POST", "OPTIONS"],
  allowedHeaders: ['Content-Type', 'Authorization', 'Accept', 'Origin'],
}
app.options('*', cors(corsOptions))

// file storage config and initialization
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads"),
  filename: (req, file, cb) => cb(null, file.originalname + "-" + Date.now()),
});
const upload = multer({ storage: storage });

app.use(function (req, res, next) {

  // Website you wish to allow to connect
  res.setHeader('Access-Control-Allow-Origin', 'http://127.0.0.1:3000');

  // Request methods you wish to allow
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT');

  // Request headers you wish to allow
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, Access-Control-Request-Method, Access-Control-Request-Headers');

  // Set to true if you need the website to include cookies in the requests sent
  // to the API (e.g. in case you use sessions)
  res.setHeader('Access-Control-Allow-Credentials', true);

  // Pass to next layer of middleware
  next();
});

// login endpoint
app.post("/login", auth, cors(corsOptions), (req, res) => {
  if (res.statusCode === 200) {
    res.sendStatus(200);
  } else {
    res.sendStatus(401);
  }
});

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
  console.log(`live at http://${process.env.HOST}:${process.env.PORT}`)
);
