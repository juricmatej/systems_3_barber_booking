import { Request, Response, NextFunction, Router } from "express";
import { requireLogin } from "../middleware/require-login.js";
import { requireAdmin } from "../middleware/require-admin.js";
import { createEmployee, getEmployess1 } from "../db/database.js";
import { getServices, addService, updateService } from "../db/database.js";


const router = Router ();


const getServices1 = async (
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
        });
        return;
    }

    const service = await getServices(Number(barbershop_id));
    res.status(200).json(service);

} catch (error) {
    next(error)
}

}

const addService1 = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { barbershop_id, name, description, duration_min, price } = req.body as {
        barbershop_id?: number,
        name?: string,
        description?: string,
        duration_min?: number,
        price?: number,
    };

    if (!barbershop_id || !name || !duration_min || !price) {
        res.status(400).json({
            success: false,
            message: "Barbershop id, name, duration and price are required",
        });
        return;
    }

    const queryResult = await addService(barbershop_id, name, description ?? "", duration_min, price );
    if (queryResult.affectedRows == 1){
        res.status(200).json({
            success: true,
            message: "Service added !",
            service_id: queryResult.insertId,
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

const updateService1 = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;
    const { name, description, duration_min, price, is_active } = req.body as {
        name?: string,
        description?: string,
        duration_min?: number,
        price?: number,
        is_active?: number,
    };

    if (is_active == undefined || !name || !duration_min || !price) {
        res.status(400).json({
            success: false,
            message: "Activtiy status, name, duration and price are required",
        });
        return;
    }

    const queryResult = await updateService(Number(id), name, description ?? "", duration_min, price, is_active  );
    if (queryResult.affectedRows == 1){
        res.status(200).json({
            success: true,
            message: "Service updaed !",
            service_id: queryResult.insertId,
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



router.get("/", getServices1);
router.post("/", requireLogin, requireAdmin, addService1);
router.put("/:id", requireLogin, requireAdmin, updateService1);

export default router;