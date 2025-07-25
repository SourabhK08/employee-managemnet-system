import cookieParser from "cookie-parser";
import express from "express";
import cors from "cors";

import { employeeRouter } from "./src/routes/index.js";
import { departmentRoutes } from "./src/routes/index.js";
import { roleRoutes } from "./src/routes/index.js";
import { errorHandler } from "./src/middlewares/errorHandler.js";
import enumRouter from "./src/routes/enum.route.js";
import { permissionRoutes } from "./src/routes/permission.route.js";

const app = express();

// app.use(
//   cors({
//     origin: process.env.CORS_ORIGIN,
//     credentials: true,
//   })
// );

app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
  })
);

app.use(
  express.json({
    limit: "16kb",
  })
);

app.use(
  express.urlencoded({
    extended: true,
    limit: "16kb",
  })
);

app.use(express.static("public"));

app.use(cookieParser());

app.get("/api", (req, res) => {
  res.send("Hello we are connected");
});

app.use((req, res, next) => {
  console.log("Request incoming:");
  console.log("Method:", req.method);
  console.log("Path:", req.path);
  console.log("Origin:", req.get("Origin"));
  next();
});

// ROUTES

app.use("/api/enums",enumRouter)

app.use('/api/permissions',permissionRoutes)

app.use("/api/employee", employeeRouter);
app.use("/api/department", departmentRoutes);
app.use("/api/role", roleRoutes);

app.use(errorHandler);

export default app;
