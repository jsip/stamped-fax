const sendPhaxioFax = async (formData) => {
  const fax = await fetch("http://localhost:5500/api/fax", {
    method: "POST",
    headers: {
      "authorization": 'Bearer stamped:simonhelice',
    },
    body: formData,
  })
    .then((res) => {
      if (res.status === 200) return res.json();
    })
    .catch((err) => {
      throw new Error(`Error sending request: ${err}`);
    });
  return fax;
};

const verifyDataIntegrity = async (data) => {
  if (!data.has("faxNumber") || !data.has("faxFiles")) {
    throw new Error("Please send the necessary information.");
  }
  return data;
};

export { verifyDataIntegrity, sendPhaxioFax };
