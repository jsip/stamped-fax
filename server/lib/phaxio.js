import dotenv, { config } from 'dotenv';
import Phaxio from 'phaxio-official';
import { validatePhoneNumberFormat } from './utils.js';
import path from 'path';

config();
const phaxio = new Phaxio(process.env.PROD_PHAXIO_API_KEY, process.env.PROD_PHAXIO_SECRET);
const __dirname = path.resolve();

export const createFax = (faxData) => {
  const validatedFaxNumber = validatePhoneNumberFormat(faxData.faxNumber);
  const uploadPaths = faxData.files.map(file => path.join(__dirname, file.path));

  if (validatedFaxNumber) {
    phaxio.faxes.create({
      to: validatedFaxNumber,
      file: uploadPaths,
    })
    .then((fax) => {
      return setTimeout(() => {
        fax.getInfo()
      }, 5000)
    })
    .then(status => console.log(status))
    .catch((err) => { throw err; });
  }
}