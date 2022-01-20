import { Token } from "./token";

const sendPhaxioFax = async (formData) => {
  return await fetch("http://localhost:5500/api/fax", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${Token().token}`,
    },
    body: formData,
  })
};

const verifyDataIntegrity = async (data) => {
  if (!data.has("faxNumber") || !data.has("faxFiles")) {
    throw new Error("Please send the necessary information.");
  }
  return data;
};

export { verifyDataIntegrity, sendPhaxioFax };
