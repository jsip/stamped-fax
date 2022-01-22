import { config } from "dotenv";
import Phaxio from "phaxio-official";
import { validatePhoneNumberFormat } from "./utils.js";
import path from "path";
import fs from "fs";

config();

const __dirname = path.resolve();

const phaxio = new Phaxio(
  process.env.PHAXIO_API_KEY,
  process.env.PHAXIO_SECRET
);

export const createFax = async (faxData) => {
  const uploadPaths = faxData.files.map((file) => path.join(__dirname, file.path));
  const validatedFaxNumber = validatePhoneNumberFormat(faxData.faxNumber);

  deleteOldFaxUploads();

  if (validatedFaxNumber) {
    return new Promise((resolve, reject) => {
      phaxio.faxes
        .create({
          to: validatedFaxNumber,
          file: uploadPaths,
          batch: true,
          batch_delay: 15,
        })
        .then((fax) => {
          setTimeout(() => {
            fax.getInfo().then((info) => {
              console.log("A fax was just sent: ", info);
              resolve(info);
            });
          }, 5000);
        })
        .catch((err) => {
          console.error("A fax just failed to send: ", err);
          reject(err);
        });
    });
  } else {
    throw new Error("Invalid fax number.");
  }
};

const deleteOldFaxUploads = () => {
  const uploadsDir = path.join(__dirname, "uploads");
  const files = fs.readdirSync(uploadsDir);

  for (const file of files) {
    const date = file.split("-").pop();
    const now = new Date().getTime();
    const diff = now - date;
    const filePath = path.join(uploadsDir, file);

    if (diff > 300000) {
      fs.unlink(filePath, (err) => {
        if (err) throw err;
      });
    }
  }
};
