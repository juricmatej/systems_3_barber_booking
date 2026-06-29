import { Request, Response, NextFunction, Router } from "express";
import { requireLogin } from "../middleware/require-login.js";
import { requireAdmin } from "../middleware/require-admin.js";
import { getAppointmentEmployee, getAppointmentsAll, createAppointment, AppointmentUpdateStatus, Overlap} from "../db/database.js";


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

const addAppointment = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    
    const {
      barbershop_id,
      service_id,
      employee_id,
      customer_name,
      customer_email,
      customer_phone,
      start_datetime,
      end_datetime,
      note,
    } = req.body as {
      barbershop_id?: number;
      service_id?: number;
      employee_id?: number;
      customer_name?: string;
      customer_email?: string;
      customer_phone?: string;
      start_datetime?: string;
      end_datetime?: string;
      note?: string;


    };

    if (!barbershop_id || !service_id || !employee_id || !customer_name || !customer_email || !start_datetime || !end_datetime) {
        res.status(400).json({ 
        success: false,
        message: "Not enough information provided to add the appointment " 
        });
        return;
    }



    const overlpa = await Overlap(employee_id,  start_datetime, end_datetime);
    if (overlpa.length > 0) {
        res.status(404).json({
        success: false,
        message: "A appointment at this time is already set"
        });
        return;
    }

    const queryResult = await createAppointment(
        barbershop_id,
        service_id,
        employee_id,
        customer_name,
        customer_email,
        customer_phone ?? "",
        start_datetime,
        end_datetime,
        note ?? ""
    );

    if (queryResult.affectedRows == 1) {
        res.status(201).json({
        success: true,
        message: "Appointment added",
        appointment_id: queryResult.insertId,     
        });
        return;
    }

     res.status(500).json({
        success: false,
        message: "Could not be added. Why ? ¯\_(ツ)_/¯ "
        
    })

} catch (error) {
    next(error)
}

}


const updateStatus = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {

    const { id } = req.params;
    const { status } = req.body as { status?: string }; 

    //SAMO TESNIIII
    const statusi = ["pending", "confirmed", "cancelled", "completed"];
    
    if (!status || !statusi.includes(status)){
        res.status(400).json({
            success: false,
            message: "Status is not correct brotha"

        })
    }

    const queryResult = await AppointmentUpdateStatus(Number(id),  status ?? "");
    if (queryResult.affectedRows == 1) {
        res.status(201).json({
        success: true,
        message: "Status Updated",
        appointment_id: queryResult.insertId,     
        });
        return;
    }

    res.status(404).json({
        success: false,
        message: "Could not be added. Why ? ¯\_(ツ)_/¯ "
        
    })

} catch (error) {
    next(error)
}

}



router.post("/", addAppointment);
router.get("/", requireLogin, requireAdmin, getAppointments);
router.get("/employee/:employee_id", requireLogin, getEmployeesAppointments);
router.put("/:id/status", requireLogin, updateStatus);

export default router;