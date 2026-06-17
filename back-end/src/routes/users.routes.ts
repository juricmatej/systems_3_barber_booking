import { Request, Response, NextFunction, Router } from "express";
import { getUserByEmail, createUser } from "../db/database.js";
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

    req.session.user = {
      id: user.id,
      email: user.email,
      role: user.role,
    };

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


const registerUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { first_name, last_name, email, phone, password } = req.body as {
      first_name?: string;
      last_name?: string;
      email?: string;
      phone?: number;
      password?: string;
    };

    if (!first_name || !last_name || !email || !password) {
      res.status(400).json({
        success: false,
        message: "First name, last name, email and password are required.",
      });

      return;
    }

    const queryResult = await createUser(first_name, last_name, phone ?? null, email, password, );

    if (queryResult.affectedRows === 1) {
      res.status(201).json({
        success: true,
        message: "User registered.",
        user_id: queryResult.insertId,
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


const getCurrentUser = (
  req: Request,
  res: Response
) => {
  if (!req.session.user) {
    res.status(200).json({
      loggedIn: false,
      user: null,
    });

    return;
  }

  res.status(200).json({
    loggedIn: true,
    user: req.session.user,
  });
};

const logoutUser = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  req.session.destroy((error) => {
    if (error) {
      next(error);
      return;
    }

    res.clearCookie("connect.sid");

    res.status(200).json({
      success: true,
      message: "Logout successful.",
    });
  });
};

router.post("/login", loginUser);
router.post("/register", registerUser);
router.get("/me", getCurrentUser);
router.post("/logout", logoutUser);

export default router;