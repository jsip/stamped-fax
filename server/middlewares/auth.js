import { config } from "dotenv";
import jwt from "jsonwebtoken";

config();

export const auth = (req, res, next) => {
  console.log("auth middleware");
  const bearerHeader = req.headers["authorization"];

  if (bearerHeader) {
    const bearer = bearerHeader.split(" ");
    const bearerToken = bearer[1];
    const bearerUsername = bearerToken.split(":")[0];
    const bearerPassword = bearerToken.split(":")[1];

    if (
      bearerUsername === process.env.USERNAME &&
      bearerPassword === process.env.PASSWORD
    ) {
      jwt.sign(
        { token: bearerToken },
        process.env.SESSION_SECRET,
        (err, token) => {
          if (err) {
            return next(err);
          } else {
            return res.status(200).json({ token });
          }
        }
      );
    } else {
      const error = new Error("Authentication failed.");
      error.httpStatusCode = 401;
      return next(error);
    }
  } else {
    res.sendStatus(403);
  }
};
