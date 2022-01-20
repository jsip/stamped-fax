const getCommonFaxRecipients = async () => {
  const faxRecipients = await fetch(
    "http://localhost:5500/api/commonFaxRecipients"
  )
    .then((res) => {
      return res.json();
    })
    .catch((err) => console.error(err));
  return faxRecipients;
};

const addCommonFaxRecipient = async (faxRecipient) => {
  await fetch("http://localhost:5500/api/commonFaxRecipients", {
    method: "PUT",
    body: JSON.stringify(faxRecipient),
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer stamped:simonhelice`,
    },
  })
    .then((res) => {
      if (res.status === 200) {
        return res;
      } else throw new Error("Server said fuck you haha!");
    })
    .catch((err) => console.error(err));
};

export { getCommonFaxRecipients, addCommonFaxRecipient };
