const getCommonFaxRecipients = async () => {
  const faxRecipients = await fetch('http://localhost:5500/commonFaxRecipients').then(res => {
    return res.json();
  }).catch(err => console.error(err));
  return faxRecipients;
}

const setCommonFaxRecipients = async () => {
  await fetch('http://localhost:5500/commonFaxRecipients', {
    method: 'POST',
  }).then(res => {
    if (res.status === 200) {
      return res;
    } else throw new Error('Server said fuck you haha!');
  }).catch(err => console.error(err));
}

export {
  getCommonFaxRecipients,
  setCommonFaxRecipients,
}