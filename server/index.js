import dotenv, { config } from 'dotenv';
import express from 'express';
import multer from 'multer';
import cors from 'cors';
import { createFax } from './lib/phaxio.js';
import path from 'path';
import { auth } from './middleware/auth.js';
import fs from 'fs';
import { permitted } from './middleware/permitted.js';

// dotenv config
config();

// dirname assignment
const __dirname = path.resolve();

// express app initialization
const app = express();

// express app config
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "..", "build")));
app.use(express.static("public"));
app.use(cors({ origin: '*' }));
app.options('*', cors());

// file storage config and initialization
const storage = multer.diskStorage(
  {
    destination: ((req, file, cb) => cb(null, 'uploads')),
    filename: ((req, file, cb) => cb(null, file.originalname + '-' + Date.now())),
  }
);
const upload = multer({ storage: storage });

// login route
app.use('/login', auth, (req, res) => {
  console.log('Inside GET /login callback')
})

// SPA route
app.get('/', permitted, (req, res) => {
  res.sendFile(path.join(__dirname, "..", "build", "index.html"));
});

// common fax recipients endpoint
app.get('/api/commonFaxRecipients', (req, res) => {
  res.sendFile(path.join(__dirname, "commonFaxRecipients.json"));
});

app.put('/api/commonFaxRecipients', permitted, (req, res) => {
  const commonFaxRecipients = JSON.stringify(req.body);
  fs.readFile("./commonFaxRecipients.json", 'utf8', function readFileCallback(err, data) {
    if (err) {
      console.log(err);
    } else {
      const parsedData = JSON.parse(data);
      const recipients = parsedData.faxRecipients;

      recipients.push(JSON.parse(commonFaxRecipients));
      fs.writeFile("./commonFaxRecipients.json", JSON.stringify({ "faxRecipients": recipients }), 'utf8', err => {
        if (err) throw err;
        console.log('File has been saved!');
      });
    }
  });
  res.sendStatus(200);
});

app.post('/api/fax', permitted, upload.array('faxFiles'), (req, res, next) => {
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