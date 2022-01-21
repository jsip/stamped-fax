import React from "react";
import "../App.scss";

export const Popup = (props) => {
  return (
    <div className="Popup-wrapper">
      <div className="Popup-box">
        <div>{props.content}</div>
        <div className="Popup-close-icon" onClick={props.handleClose}>
          {props.reloadOnClose ? (
            <a href="/">
              <b>{props.closeMessage}</b>
            </a>
          ) : (
            <b>{props.closeMessage}</b>
          )}
        </div>
      </div>
    </div>
  );
};
