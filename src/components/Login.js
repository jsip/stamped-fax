import React from "react";
import "../Login.scss";
import { useState } from "react";
import PropellerHat from "../propeller-hat.svg";

export const Login = ({ setToken }) => {
  const [username, setUserName] = useState();
  const [password, setPassword] = useState();

  const loginUser = async (credentials) => {
    const token = `${credentials.username}:${credentials.password}`;
    return fetch("http://localhost:8080/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Basic ${token}`,
        "Access-Control-Request-Method": ["GET", "OPTIONS", "POST", "PUT"],
        "Access-Control-Request-Headers": ["Content-Type", "Authorization", "Accept", "Origin"],
      },
    }).then((data) => {
      return data.json();
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = await loginUser({
      username,
      password,
    });
    if (token) {
      setToken(token.token);
      window.location.reload();
    }
  };

  return (
    <div className="Login-wrapper">
      <div className="Login-logo-wrapper">
        <img
          className="Login-logo"
          src={PropellerHat}
          alt="Propeller Hat"
        ></img>
      </div>
      <h1>Log In</h1>
      <form onSubmit={handleSubmit}>
        <label>
          <p>Username</p>
          <input
            className="Login-input"
            type="text"
            onChange={(e) => setUserName(e.target.value)}
          />
        </label>
        <label>
          <p>Password</p>
          <input
            className="Login-input"
            type="password"
            onChange={(e) => setPassword(e.target.value)}
          />
        </label>
        <button type="submit" className="Submit-button">
          Submit
        </button>
      </form>
    </div>
  );
};
