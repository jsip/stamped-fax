import { Router } from 'express';
import { auth } from "../middlewares/auth.js";

const router = Router();

router.post("/", auth, (req, res, next) => {
  console.log("Logged in user: ", req);
  next(res.statusCode);
});

export default router;