import { Request, Response, NextFunction, Router } from "express";
import { requireLogin } from "../middleware/require-login.js";
import { requireAdmin } from "../middleware/require-admin.js";
import { createEmployee, getEmployess1 } from "../db/database.js";
// databes.ts 

const router = Router();


const addEmployee = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { user_id, barbershop_id, display_name, bio } = req.body as {
        user_id?: number;
        barbershop_id?: number;
        display_name?: string;
        bio?: string;

    };

    if (!user_id || !barbershop_id || !display_name) {
        res.status(400).json({
            success: false,
            message: "Users id, name and barbershops id are needed",
        });
        return;
    }

    const queryResult = await createEmployee(user_id, barbershop_id, display_name, bio ?? "");
    if (queryResult.affectedRows == 1){
        res.status(200).json({
            success: true,
            message: "Employee added.",
            employee_id: queryResult.insertId,
        });
        return;
    }

    res.status(500).json({
        success: false,
        message: "Could not be added. Why ? ¯\_(ツ)_/¯ "
        
    })
    
} catch (error) {
    next(error);
}

}



const getEmployees = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {

    const { barbershop_id } = req.query as { barbershop_id?: string };
    if (!barbershop_id) {
        res.status(400).json({
            success: false,
            message: "Need Barbershop ID"
        })
    }

    const employes = await getEmployess1(Number(barbershop_id));
    res.status(200).json(employes);

} catch (error) {
    next(error)
}

}

router.post("/", requireLogin, requireAdmin, addEmployee);
router.get("/", getEmployees);

export default router;


