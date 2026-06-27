import { Request, Response, NextFunction, Router } from "express";
import { requireLogin } from "../middleware/require-login.js";
import { requireAdmin } from "../middleware/require-admin.js";
import { getAppointmentEmployee, getAppointmentsAll, createAppointment, AppointmentUpdateStatus} from "../db/database.js";


const router = Router();


const getAppointments = async (
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

    const appointments = await getAppointmentsAll(Number(barbershop_id));
    res.status(200).json(appointments);

} catch (error) {
    next(error)
}

}



const getEmployeesAppointments = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {

    const { employee_id } = req.params;

    const service = await getAppointmentEmployee(Number(employee_id));
    res.status(200).json(service);

} catch (error) {
    next(error)
}

}

router.get("/", requireLogin, requireAdmin, getAppointments);
router.get("/employee/:employee_id", requireLogin, getAppointmentEmployee);

export default router;