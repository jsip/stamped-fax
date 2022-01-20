import React from "react";
import "../Login.scss";
import { useState } from "react";

export const Login = ({ setToken }) => {
  const [username, setUserName] = useState();
  const [password, setPassword] = useState();

  const loginUser = async (credentials) => {
    const token = `${credentials.username}:${credentials.password}`;
    return fetch("http://localhost:5500/login", {
      headers: {
        "Content-type": "application/json",
        Authorization: `Basic ${token}`,
      },
    })
      .then((data) => {
        return data.json();
      })
      .catch((err) => console.error(err));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = await loginUser({
      username,
      password,
    });
    setToken(token);
  };

  return (
    <div className="Login-wrapper">
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
        <div>
          <button type="submit" className="Submit-button">
            Submit
          </button>
        </div>
      </form>
    </div>
  );
};
