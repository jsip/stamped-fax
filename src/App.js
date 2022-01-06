import './App.scss';
import { buildFax } from './utils/handler';
import { useState } from 'react';
import StampedSVG from './stamped.svg';
import { formatFaxNumber } from './utils/rand';

const App = () => {
  const [filesList, setFiles] = useState([]);
  const [faxButton, setFaxButton] = useState(filesList.length < 1);
  const [inputValue, setInputValue] = useState("");
  // const [faxStatus, setFaxStatus] = useState({...filesList, status: "unfaxed", emoji: "🛫"});

  const handleInput = (e) => {
    const formattedFaxNumber = formatFaxNumber(e.target.value);
    setInputValue(formattedFaxNumber);
  };

  const dropHandler = (e) => {
    e.preventDefault();
    e.stopPropagation();

    const files = e.target.files;
    if (files.length === 0) return;

    const filesArr = Array.prototype.slice.call(files);
    filesArr.length === 1 ? setFiles(prevState => [...prevState, filesArr[0]]) : filesArr.forEach(file => setFiles(prevState => [...prevState, file]));

    setFaxButton(filesArr.length > 0 ? false : true);
    // setFaxStatus({status: "faxed", emoji: "⏱"});

    return false;
  }

  return (
    <div className="App">
      <header className="App-header">
        <a href="https://app.stamped.ai" target="_blank" rel="noopener noreferrer">
          <img className="App-header-logo" src={StampedSVG} alt="Stamped Logo"></img>
        </a>
        <span className="App-collab-symbol">X</span>
        <a href="https://stampedcomptablesagreesinc.cchifirm.ca/2/login/#/fe/dashboard" target="_blank" rel="noopener noreferrer">
          <p className="App-icon">👵🖨👴</p>
        </a>
      </header>
      <section>
        <form onSubmit={(e) => {buildFax(filesList); e.preventDefault()}}>
          <input className="Phone-input" type="tel" placeholder="+14187881536" id="faxNumber" required onChange={(e) => handleInput(e)} value={inputValue}></input>
          <input className="Drop-zone" type="file" onChange={dropHandler} name='faxFiles' multiple accept=".doc,.docx,.pdf,.tif,.jpg,.odt,.txt,.html,.png"></input>
          <div className="File-list">
            <ul>
              {
                filesList.length > 0 ? filesList.map(file =>
                  <li className="File-item" key={file.name + '_t-' + file.lastModified}>
                    <b>
                      {file.name}
                      &nbsp;&nbsp;&nbsp;
                      ({(file.size / 1024).toFixed(2)} KB)
                    </b>
                    <div className="Fax-rm-button" onClick={() => setFiles(prevState => prevState.filter(f => (f.name && f.lastModified) !== (file.name && file.lastModified)))}>🗑</div>
                    {/* <div hidden={faxStatus.status === "unfaxed"} className="Fax-status">{faxStatus.emoji}</div> */}
                  </li>
                ) : null
              }
            </ul>
          </div>
          <button className="Drop-zone-submit" type="submit" disabled={faxButton}>{filesList.length > 0 ? `Fax ${filesList.length} file${filesList.length > 1 ? "s" : ""}` : `No files to fax.`}</button>
        </form>
      </section>
    </div>
  );
}

export default App;