import dotenv, { config } from 'dotenv';
import Phaxio from 'phaxio-official';

const phaxio = new Phaxio(process.env.PHAXIO_API_KEY, process.env.PHAXIO_SECRET);

export const createFax = (faxData) => {
  console.log(faxData);
  // phaxio.faxes.create({
  //   to: '+1234567890', // Replace this with a number that can receive faxes.
  //   content_url: 'https://google.com',
  //   file: `${__dirname}/sample1.pdf`,
  // })
  // .then((fax) => {
  //   // The `create` method returns a fax object with methods attached to it for doing things
  //   // like cancelling, resending, getting info, etc.

  //   // Wait 5 seconds to let the fax send, then get the status of the fax by getting its info from the API.
  //   return setTimeout(() => {
  //     fax.getInfo()
  //   }, 5000)
  // })
  // .then(status => console.log('Fax status response:\n', JSON.stringify(status, null, 2)))
  // .catch((err) => { throw err; });
}