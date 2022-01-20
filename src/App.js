import "./App.scss";
import { buildFax } from "./utils/handler";
import { useState } from "react";
import StampedSVG from "./stamped.svg";
import { formatFaxNumber } from "./utils/rand";
import {
  addCommonFaxRecipient,
  getCommonFaxRecipients,
} from "./utils/commonFaxRecipients";
import { Popup } from "./components/Popup";
import { Login } from "./components/Login";
import { useToken } from "./utils/useToken";

const App = () => {
  const { token, setToken } = useToken();

  const [filesList, setFiles] = useState([]);
  const [faxButton, setFaxButton] = useState(filesList.length < 1);
  const [inputNumber, setInputNumber] = useState("");
  const [inputName, setInputName] = useState("");
  const [commonFaxRecipients, setCommonFaxRecipients] = useState();
  const [isOpenFax, setIsOpenFax] = useState(false);
  const [isOpenPreset, setIsOpenPreset] = useState(false);
  const [chosenFaxRecipient, setChosenFaxRecipient] = useState();

  const togglePopupFax = () => setIsOpenFax(!isOpenFax);
  const togglePopupPreset = () => setIsOpenPreset(!isOpenPreset);

  const buildCommonFaxRecipients = () => {
    getCommonFaxRecipients().then((res) => {
      setCommonFaxRecipients(res);
    });
  };

  const updateFaxRecipient = () => {
    addCommonFaxRecipient({
      name: inputName,
      number: inputNumber,
    })
      .then((res) => {
        buildCommonFaxRecipients();
        togglePopupPreset();
      })
      .catch((err) => console.error(err));
  };

  const handleNumberInput = (e) => {
    const formattedFaxNumber = formatFaxNumber(e.target.value);
    commonFaxRecipients.faxRecipients.some((recipient) =>
      recipient.number === formattedFaxNumber ? setChosenFaxRecipient(recipient) : null
    );
    setInputNumber(formattedFaxNumber);
  };

  const dropHandler = (e) => {
    e.preventDefault();
    e.stopPropagation();

    const files = e.target.files;
    if (files.length === 0) return;

    const filesArr = Array.prototype.slice.call(files);
    filesArr.length === 1
      ? setFiles((prevState) => [...prevState, filesArr[0]])
      : filesArr.forEach((file) =>
          setFiles((prevState) => [...prevState, file])
        );

    setFaxButton(filesArr.length > 0 ? false : true);
    return false;
  };

  if (!token) {
    return <Login setToken={setToken} />;
  } else {
    return (
      <div className="App" onLoad={buildCommonFaxRecipients}>
        <header className="App-header">
          <a
            href="https://app.stamped.ai"
            target="_blank"
            rel="noopener noreferrer"
          >
            <img
              className="App-header-logo"
              src={StampedSVG}
              alt="Stamped Logo"
            ></img>
          </a>
          <span className="App-collab-symbol">X</span>
          <a
            href="https://stampedcomptablesagreesinc.cchifirm.ca/2/login/#/fe/dashboard"
            target="_blank"
            rel="noopener noreferrer"
          >
            <p className="App-icon">👵🖨👴</p>
          </a>
        </header>
        <section>
          <form
            className="Info-form"
            onSubmit={(e) => { buildFax(filesList); e.preventDefault(); }}
          >
            <div className="Phone-fax-wrapper">
              <input
                className="Phone-input"
                type="tel"
                placeholder="+14187881536"
                id="faxNumber"
                required
                onChange={(e) => handleNumberInput(e)}
                value={inputNumber}
              ></input>
              <select
                className="Fax-recipients select-wrapper"
                onChange={(e) =>
                  setInputNumber(formatFaxNumber(e.target.value))
                }
                value={chosenFaxRecipient ? chosenFaxRecipient.number : ""}
              >
                <option disabled>
                  Choose a preset number
                </option>
                {commonFaxRecipients
                  ? commonFaxRecipients.faxRecipients.map((faxRecipient) => (
                      <option
                        key={faxRecipient.number}
                        value={faxRecipient.number}
                      >
                        {faxRecipient.name}
                      </option>
                    ))
                  : null}
              </select>
              {commonFaxRecipients && inputNumber.length === 17
                ? commonFaxRecipients.faxRecipients.filter(
                    (fax) => fax.number === inputNumber
                  ).length === 0
                  ? !isOpenPreset && (
                      <Popup
                        content={
                          <>
                            <div className="New-preset">
                              <b>{`${inputNumber} is a new number.`}</b>
                              <div>
                                <input
                                  className="Preset-name-input"
                                  type="text"
                                  placeholder="Enter a name"
                                  onChange={(e) => setInputName(e.target.value)}
                                />
                              </div>
                              <button
                                className="Preset-add-button"
                                onClick={updateFaxRecipient}
                              >
                                Add to presets
                              </button>
                            </div>
                          </>
                        }
                        closeMessage="Don't add to presets ❌"
                        handleClose={togglePopupPreset}
                      />
                    )
                  : null
                : null}
            </div>
            <input
              className="Drop-zone"
              type="file"
              onChange={dropHandler}
              name="faxFiles"
              multiple
              accept=".pdf"
            ></input>
            <div className="File-list">
              <ul>
                {filesList.length > 0
                  ? filesList.map((file) => (
                      <li
                        className="File-item"
                        key={file.name + "_t-" + file.lastModified}
                      >
                        <b>
                          {file.name}
                          &nbsp;&nbsp;&nbsp; ({(file.size / 1024).toFixed(
                            2
                          )}{" "}
                          KB)
                        </b>
                        <div
                          className="Fax-rm-button"
                          onClick={() =>
                            setFiles((prevState) =>
                              prevState.filter(
                                (f) =>
                                  (f.name && f.lastModified) !==
                                  (file.name && file.lastModified)
                              )
                            )
                          }
                        >
                          🗑
                        </div>
                      </li>
                    ))
                  : null}
              </ul>
            </div>
            <div>
              {isOpenFax && (
                <Popup
                  content={
                    <>
                      <b>Sending your fax..</b>
                      <ul>
                        {filesList
                          ? filesList.map((file) => (
                              <li
                                className="File-item"
                                key={file.name + "_t-" + file.lastModified}
                              >
                                <b>
                                  {file.name}
                                  &nbsp;&nbsp;&nbsp; (
                                  {(file.size / 1024).toFixed(2)} KB)
                                </b>
                                <div className="Fax-status-icon">🛫</div>
                              </li>
                            ))
                          : null}
                      </ul>
                    </>
                  }
                  closeMessage="Done ✅"
                  handleClose={togglePopupFax}
                />
              )}
            </div>
            <button
              className="Drop-zone-submit"
              onClick={togglePopupFax}
              type="submit"
              disabled={faxButton}
            >
              {filesList.length > 0
                ? `Fax ${filesList.length} file${
                    filesList.length > 1 ? "s" : ""
                  }`
                : `No files to fax.`}
            </button>
          </form>
        </section>
      </div>
    );
  }
};

export default App;
