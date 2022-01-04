const sendPhaxioFax = async (formData) => {
  await fetch('http://localhost:5500/fax', {
    method: 'POST',
    contentType: 'multipart/form-data',
    body: formData,
  }).then(res => {
    if (res.status === 200) {
      return res;
    } else throw new Error('Server said fuck you haha!');
  }).catch(err => console.error(err));
}

const verifyDataIntegrity = async (data) => {
  if (!data.has('faxNumber') || !data.has('faxFiles')) {
    throw new Error('Please send the necessary information.');
  }
  return data;
}

export {
  verifyDataIntegrity,
  sendPhaxioFax,
}