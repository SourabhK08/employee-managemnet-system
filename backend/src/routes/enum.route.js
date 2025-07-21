import { Router } from "express";
import {enums} from "../constants/enum.js";

const enumRouter = Router();

enumRouter.get('/', (req, res) => {
  res.status(200).json({
    success: true,
    message: "Data fetched successfully.",
    data: enums
  });
});

export default enumRouter