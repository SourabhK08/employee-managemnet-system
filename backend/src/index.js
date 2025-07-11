import express from "express";
import dotenv from "dotenv";
import connectDb from "./db/index.js";

dotenv.config();

const app = express();

const port = process.env.PORT;

connectDb()
  .then(() => {
    app.on("error", (err) => {
      console.log("Error while connecting from express", err);
    });

    app.listen(port, () => {
      console.log(`server connection at ${port}`);
    });
  })
  .catch((err) => {
    console.log("Error in connecting db", err);
  });
