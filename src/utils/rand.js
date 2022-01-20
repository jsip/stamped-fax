// TODO: implement countrycode if fax is outside of +1 country code (like doube digit country codes)
export const formatFaxNumber = (value, countryCode) => {
  if (!value) return;

  const phoneNumber = value.replace(/[^\d]/g, "");
  const phoneNumberLength = phoneNumber.length;

  if (phoneNumberLength < 4) return phoneNumber;
  if (phoneNumberLength < 7)
    return `+${phoneNumber.slice(0, 1)} (${phoneNumber.slice(
      1,
      4
    )}) ${phoneNumber.slice(4)}`;
  return `+${phoneNumber.slice(0, 1)} (${phoneNumber.slice(
    1,
    4
  )}) ${phoneNumber.slice(4, 7)}-${phoneNumber.slice(7, 11)}`;
};

export const faxNumberToE164Format = (faxNumber) =>
  `+${faxNumber.replace(/[^\d]/g, "")}`;
