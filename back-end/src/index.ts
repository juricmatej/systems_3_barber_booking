import "dotenv/config";
import express, { Request, Response, NextFunction } from "express";
import usersRouter from "./routes/users.routes.js"
import session from "express-session";
import employeesRouter from "./routes/employess.routes.js";
import servicesRouter from "./routes/services.routes.js";
import appointmentsRouter from "./routes/appointments.routes.js";
import scheduleRouter from "./routes/schedule.routes.js";

const app = express();
const port = Number(process.env.PORT) || 5000;

app.use(
  session({
    secret: process.env.SESSION_SECRET || "temporary-development-secret",
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      sameSite: "lax",
      secure: false,
      maxAge: 1000 * 60 * 60,
    },
  })
);


// Middleware for JSON request bodies
app.use(express.json());

// Middleware for HTML form submissions
app.use(express.urlencoded({ extended: false }));

app.get("/", (_req: Request, res: Response) => {
  res.send("This is Brivnica API");
});

app.use("/users", usersRouter);
app.use("/services", servicesRouter);
app.use("/employess", employeesRouter);
app.use("/appointments", appointmentsRouter);
app.use("/schedule", scheduleRouter);
// Central error handler
app.use((error: unknown, _req: Request, res: Response, _next: NextFunction) => {
  console.error(error);

  res.status(500).json({
    success: false,
    message: "Internal server error",
  });
});

app.listen(port, () => {
  console.log(`Server is running on port: ${port}`);
});
