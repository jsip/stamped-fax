import { config } from "dotenv";
import jwt from "jsonwebtoken";

config();

export const permitted = (req, res, next) => {
  const bearerHeader = req.headers["authorization"];

  if (bearerHeader) {
    const bearer = bearerHeader.split(" ");
    const bearerToken = bearer[1];

    jwt.verify(bearerToken, process.env.SESSION_SECRET, (err, decodedToken) => {
      if (err) {
        console.log(err);
        const error = new Error("Permitted failed.");
        error.httpStatusCode = 401;
        return next(error);
      }
      const { token } = decodedToken;
      token.split(":")[0] === process.env.USERNAME &&
      token.split(":")[1] === process.env.PASSWORD
        ? next()
        : next(new Error("Permitted failed."));
    });
  } else {
    res.sendStatus(403);
  }
};
