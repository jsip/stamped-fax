import Fax from "../lib/Fax";
import { verifyDataIntegrity, sendPhaxioFax } from "./phaxio";
import { faxNumberToE164Format } from "./rand";

const getFaxNumber = () => document.getElementById("faxNumber") ? faxNumberToE164Format(document.getElementById("faxNumber").value) : null;

const buildFax = (faxFiles) => {
  const faxNumber = getFaxNumber();
  const fax = new Fax(faxNumber, faxFiles);
  const formData = fax.build();

  verifyDataIntegrity(formData)
    .then((verifiedFormData) => {
      sendFax(verifiedFormData)
    })
    .catch((err) => {
      throw new Error(`Error verifying data integrity: ${err}`);
    });
};

const sendFax = (formData) => {
  sendPhaxioFax(formData)
    .then((res) => {
      console.log(res);
    })
    .catch((err) => {
      console.log(err);
      throw new Error(`Error sending request: ${err}`);
    });
};

export { buildFax };