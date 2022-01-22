import { randomUUID } from 'crypto';
import { Router } from 'express';
import fs from "fs";
import path from "path";
import { permitted } from "../middlewares/permitted.js";

const __dirname = path.resolve();
const router = Router();

router.get("/", permitted, (req, res) => {
  return res.sendFile(path.join(__dirname, "commonFaxRecipients.json"));
});

router.put("/", permitted, (req, res) => {
  const commonFaxRecipients = req.body;
  fs.readFile(
    path.join(__dirname, "commonFaxRecipients.json"),
    "utf8",
    function readFileCallback(err, data) {
      if (err) {
        res.status(500).send("Error reading files");
      } else {
        const parsedData = JSON.parse(data);
        const uuid = randomUUID();
        const recipients = parsedData.faxRecipients;
        const faxRecipients = {...commonFaxRecipients, uuid: uuid};

        recipients.push(faxRecipients);
        fs.writeFile(
          path.join(__dirname, "commonFaxRecipients.json"),
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

router.delete("/:uuid", permitted, (req, res) => {
  const uuid = req.params.uuid;
  fs.readFile(
    path.join(__dirname, "commonFaxRecipients.json"),
    "utf8",
    function readFileCallback(err, data) {
      if (err) {
        res.status(500).send("Error reading files");
      } else {
        const parsedData = JSON.parse(data);
        const recipients = parsedData.faxRecipients;
        const filteredRecipients = recipients.filter(
          (faxRecipient) => faxRecipient.uuid !== uuid
        );
        fs.writeFile(
          path.join(__dirname, "commonFaxRecipients.json"),
          JSON.stringify({ faxRecipients: filteredRecipients }),
          "utf8",
          (err) => {
            if (err) throw err;
          }
        );
        res.sendStatus(200);
      }
    }
  );
})

export default router;