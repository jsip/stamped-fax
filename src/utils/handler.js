import Fax from '../lib/Fax';
import { verifyDataIntegrity, sendPhaxioFax } from './phaxio';
import { faxNumberToE164Format } from './rand';

const getFaxNumber = () => {
  const faxNumber = document.getElementById('faxNumber') ? document.getElementById('faxNumber').value : null;
  const faxNumberE164 = faxNumberToE164Format(faxNumber);
  return faxNumberE164;
}

const buildFax = (faxFiles) => {
  const faxNumber = getFaxNumber();
  const fax = new Fax(faxNumber, faxFiles);
  const formData = fax.build();

  verifyDataIntegrity(formData).then((verifiedFormData) => {
    sendFax(verifiedFormData);
  }).catch((err) => {
    console.log('error verifying data integrity', err);
  });
}

const sendFax = (formData) => {
  sendPhaxioFax(formData).then((res) => {
    console.log('fax sent');
  }).catch((err) => {
    console.log('error sending fax', err);
  });
}

export {
  buildFax,
};