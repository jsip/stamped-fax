import dotenv, { config } from 'dotenv';

config();

export const auth = (req, res, next) => {
  console.log('Inside auth middleware');
  console.log(req.body);

  const bearerHeader = req.headers['authorization'];

  if (bearerHeader) {
    const bearer = bearerHeader.split(' ');
    const bearerToken = bearer[1];
    const bearerUsername = bearerToken.split(':')[0];
    const bearerPassword = bearerToken.split(':')[1];

    if (bearerUsername === process.env.USERNAME && bearerPassword === process.env.PASSWORD) {
      req.token = bearerToken;
      next();
    } else {
      const error = new Error('Authentication failed.');
      error.httpStatusCode = 401;
      return next(error);
    }
  } else {
    res.sendStatus(403);
  }
}