import dotenv, { config } from 'dotenv';
import Phaxio from 'phaxio-official';
import { validatePhoneNumberFormat } from './utils.js';
import path from 'path';

config();

const phaxio = new Phaxio(process.env.TEST_PHAXIO_API_KEY, process.env.TEST_PHAXIO_SECRET);
const __dirname = path.resolve();

export const createFax = async (faxData) => {
  const validatedFaxNumber = validatePhoneNumberFormat(faxData.faxNumber);
  const uploadPaths = faxData.files.map(file => path.join(__dirname, file.path));

  if (validatedFaxNumber) {
    const faxPromise = new Promise((resolve, reject) => {
      phaxio.faxes.create({
        to: validatedFaxNumber,
        file: uploadPaths,
      })
      .then(fax => {
        setTimeout(() => {
          fax.getInfo().then(info => {
            resolve(info);
          })
        }, 5000)
      })
      .catch((err) => reject(err));
    });
    return faxPromise;
  }
}