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
  const commonFaxRecipients = JSON.stringify(req.body);
  fs.readFile(
    "../commonFaxRecipients.json",
    "utf8",
    function readFileCallback(err, data) {
      if (err) {
        res.status(500).send("Error reading files");
      } else {
        const parsedData = JSON.parse(data);
        const recipients = parsedData.faxRecipients;

        recipients.push(JSON.parse(commonFaxRecipients));
        fs.writeFile(
          "../commonFaxRecipients.json",
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

export default router;