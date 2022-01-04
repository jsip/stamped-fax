class Fax {
  constructor(faxNumber, files) {
    this.faxNumber = faxNumber;
    this.files = files;
  }

  build() {
    const formData = new FormData();
    for (const file of this.files) {
      formData.append('faxFiles', file);
    }
    formData.append('faxNumber', this.faxNumber);
    return formData
  }
}

export default Fax;