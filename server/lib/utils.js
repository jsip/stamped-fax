export const validatePhoneNumberFormat = (value) => {
  if (value.match(/^\+[1-9]\d{1,14}$/)) {
    return value;
  }
  throw new Error("Please enter a valid phone number.");
};
