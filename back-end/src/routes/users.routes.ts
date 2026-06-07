import { Request, Response, NextFunction, Router } from "express";
import { getUserByEmail } from "../db/database.js";
import bcrypt from "bcrypt";

const router = Router();

const loginUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { email, password } = req.body as {
      email?: string;
      password?: string;
    };

    if (!email || !password) {
      res.status(400).json({
        success: false,
        message: "Username and password are required.",
      });

      return;
    }

    const queryResult = await getUserByEmail(email);

    if (queryResult.length === 0) {
      res.status(401).json({
        success: false,
        message: "User is not registered.",
      });

      return;
    }

    const user = queryResult[0];

    const passwordHash = await bcrypt.compare(password, user.password_hash)

    if (!passwordHash) {
      res.status(401).json({
        success: false,
        message: "Incorrect password.",
      });

      return;
    }

    if (!user.is_active) {
        res.status(403).json({
            success: false,
            message: "User account not active"

        });
        
        return;


    }

    res.status(200).json({
      success: true,
      message: "Login successful.",
      user: {
        id: user.id,
        first_name: user.first_name,
        last_name: user.last_name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    next(error);
  }
};

/*
const registerUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { username, email, password } = req.body as {
      username?: string;
      email?: string;
      password?: string;
    };

    if (!username || !email || !password) {
      res.status(400).json({
        success: false,
        message: "Username, email and password are required.",
      });

      return;
    }

    const queryResult = await createUser(username, email, password);

    if (queryResult.affectedRows === 1) {
      res.status(201).json({
        success: true,
        message: "User registered.",
      });

      return;
    }

    res.status(500).json({
      success: false,
      message: "User was not registered.",
    });
  } catch (error) {
    next(error);
  }
};
*/

router.post("/login", loginUser);
//router.post("/register", registerUser);

export default router;