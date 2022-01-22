import { Router } from 'express';
import multer from "multer";
import { permitted } from "../middlewares/permitted.js";
import { createFax } from "../lib/phaxio.js";

const router = Router();

// File storage config and initialization

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads"),
  filename: (req, file, cb) => cb(null, file.originalname + "-" + Date.now()),
});

const upload = multer({ storage: storage });

router.post("/", permitted, upload.array("faxFiles"), (req, res, next) => {
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


export default router;