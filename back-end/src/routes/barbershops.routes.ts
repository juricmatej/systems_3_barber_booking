import e, { Request, Response, NextFunction, Router } from "express";
import { getBarbershop, updateBarbershop } from "../db/database.js";
import {  requireLogin } from "../middleware/require-login.js";
import { requireAdmin } from "../middleware/require-admin.js";

const router = Router();



const getBarbershopId = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {

    const { id } = req.params;

    const barbershops = await getBarbershop(Number(id));
    
    if (barbershops.length == 0 ) {
        res.status(400).json({
            success: false,
            message: "Barbershop id not founds"
        })
        return;
    }

    res.status(200).json(barbershops[0]);

} catch (error) {
    next(error)
}
}

const updateBarbershopId = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {

    const { id } = req.params;

    if (Number(id) != req.session.user!.barbershop_id) {
        res.status(400).json({
            success: false,
            message: "Not your barbershop buddy"
        })

        return;
    }


    const {name, description, adress, city, phone, email} = req.body as {
        name?: string;
        description?: string;
        adress?: string;
        city?: string;
        phone?: number;
        email?: string;

    };


    
    if (!name || !adress || !city) {
        res.status(400).json({
            success: false,
            message: "name, address and city are requiresd"
        })

        return;
    }

    const queryResult = await updateBarbershop(Number(id), name, description ?? "", adress, city, phone ?? null, email ?? "");
    

          if (queryResult.affectedRows == 1) {
        res.status(200).json({
            success: true,
            message: "Babrershop updated"
        })
        return;
      }

      res.status(500).json({
        success: false,
        message: "Babrshop nut updated"
      })

    


} catch (error) {
    next(error)
}

}




router.get("/:id", getBarbershopId);
router.put("/:id", requireLogin, requireAdmin, updateBarbershopId);

export default router;
