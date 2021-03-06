import { Token } from "./token";

const getCommonFaxRecipients = async () => {
  const faxRecipients = await fetch(
    "/api/commonFaxRecipients",
    {
      headers: {
        Authorization: `Bearer ${Token().token}`,
      },
    }
  )
    .then((res) => {
      return res.json();
    })
    .catch((err) => console.error(err));
  return faxRecipients;
};

const addCommonFaxRecipient = async (faxRecipient) => {
  await fetch("/api/commonFaxRecipients", {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${Token().token}`,
    },
    body: JSON.stringify(faxRecipient),
  })
    .then((res) => {
      if (res.status === 200) {
        return res;
      } else throw new Error("Error adding common fax recipient.");
    })
    .catch((err) => console.error(err));
};

const removeCommonFaxRecipient = async (uuid) => {
  await fetch(`/api/commonFaxRecipients/${uuid}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${Token().token}`,
    },
  })
    .then((res) => {
      if (res.status === 200) {
        return res;
      } else throw new Error("Error removing common fax recipient.");
    })
    .catch((err) => console.error(err));
}

export { getCommonFaxRecipients, addCommonFaxRecipient, removeCommonFaxRecipient };
