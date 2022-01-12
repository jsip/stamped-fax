import dotenv, { config } from 'dotenv';
import express from 'express';
import multer from 'multer';
import cors from 'cors';
import { createFax } from './lib/phaxio.js';
import path from 'path';

const storage = multer.diskStorage({
  destination: ((req, file, cb) => cb(null, 'uploads')),
  filename: ((req, file, cb) => cb(null, file.originalname + '-' + Date.now())),
})

const upload = multer({ storage: storage })
const app = express();
const __dirname = path.resolve();

config();

app.use(express.urlencoded({extended: true}));
app.use(express.static(path.join(__dirname, "..", "build")));
app.use(express.static("public"));
app.use(cors({
  origin: 'http://localhost:3000',
}));
app.options('*', cors());

app.get('/', (res) => {
  res.sendFile(path.join(__dirname, "..", "build", "index.html"));
});

app.get('/commonFaxRecipients', (req, res) => {
  res.sendFile(path.join(__dirname, "commonFaxRecipients.json"));
});

app.post('/fax', upload.array('faxFiles'), (req, res, next) => {
  const files = req.files;
  const faxNumber = req.body.faxNumber;

  if (!files || !faxNumber) {
    const error = new Error('Please send the necessary information.');
    error.httpStatusCode = 400;
    return next(error);
  }

  createFax({files, faxNumber}).then(faxRes => {
    const response = JSON.stringify(faxRes);
    res.send(response);
  }).catch(() => {
    const error = new Error('Something went wrong. Please try again.');
    error.httpStatusCode = 500;
    return next(error);
  });
});

app.listen(process.env.PORT, () =>
  console.log(`live at http://localhost:${process.env.PORT}`),
);