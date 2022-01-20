import Fax from "../lib/Fax";
import { verifyDataIntegrity, sendPhaxioFax } from "./phaxio";
import { faxNumberToE164Format } from "./rand";

const getFaxNumber = () => document.getElementById("faxNumber") ? faxNumberToE164Format(document.getElementById("faxNumber").value) : null;

const buildFax = async (faxFiles) => {
  const faxNumber = getFaxNumber();
  const fax = new Fax(faxNumber, faxFiles);
  const formData = fax.build();

  try {
    const verifiedFormData = await verifyDataIntegrity(formData);
    sendFax(verifiedFormData).then((res) => res).catch((err) => err);
  } catch (err_1) {
    throw new Error(`Error verifying data integrity: ${err_1}`);
  }
};

const sendFax = async (formData) => {
  try {
    const res = await sendPhaxioFax(formData);
    return res;
  } catch (err) {
    throw new Error(`Error sending request: ${err}`);
  }
};

export { buildFax };