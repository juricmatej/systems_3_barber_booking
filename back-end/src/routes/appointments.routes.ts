import { Request, Response, NextFunction, Router } from "express";
import { requireLogin } from "../middleware/require-login.js";
import { requireAdmin } from "../middleware/require-admin.js";
import { getAppointmentEmployee, getAppointmentsAll, createAppointment, AppointmentUpdateStatus, Overlap, getAppointmentById, getEmployeeByUserId, getServiceById, getFreeSlots, } from "../db/database.js";
import { serialize } from "node:v8";


const router = Router();


const getAppointments = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {

    const  barbershop_id  = req.session.user!.barbershop_id;
    if (!barbershop_id) {
        res.status(400).json({
            success: false,
            message: "Need Barbershop ID"
        });
        return;
    }

    const appointments = await getAppointmentsAll(barbershop_id);
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

    const employees = await getEmployeeByUserId(req.session.user!.id);
    const isOwner = employees.length > 0 && employees[0].id == Number(employee_id);

    if (!isOwner && req.session.user!.role != "admin") {
        res.status(400).json({
            success: false,
            message: "You can only see your appointments"
        });
        return;
    }

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
        return;
    }

    const appointments = await getAppointmentById(Number(id));

    if (appointments.length == 0) {
        res.status(400).json({
            success: false,
            message: "Appointment not found"
        });
        return;

    }

    const appointment = appointments[0];

    const employees = await getEmployeeByUserId(req.session.user!.id);

    const isOwner = employees.length > 0 && employees[0].id == appointment.employee_id;


    const isBarberAdmin = req.session.user!.role == "admin" && appointment.barbershop_id == req.session.user!.barbershop_id;

    if (!isOwner && !isBarberAdmin) {
        res.status(403).json({
            success: false,
            message: "You cant change thiss"
        });
        return;
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


const getFreeAppointments = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {

    const { employee_id, service_id, date } = req.query as {
         employee_id?: string;
         service_id?: string;
         date?: string;
    }
    
    if (!employee_id || !service_id || !date ){
        res.status(400).json({
            success: false,
            message: "Need employee id, service id nad date"
            

        })
        return;
    }

    const services = await getServiceById(Number(service_id));

    if (services.length == 0) {
        res.status(400).json({
            success: false,
            message: "Service not found"
        });
        return;

    }

    const slots = await getFreeSlots(Number(employee_id), date, services[0].duration_min);
    

    res.status(200).json(slots);


} catch (error) {
    next(error)
}

}





router.post("/", addAppointment);
router.get("/", requireLogin, requireAdmin, getAppointments);
router.get("/employee/:employee_id", requireLogin, getEmployeesAppointments);
router.put("/:id/status", requireLogin, updateStatus);
router.get("/free", getFreeAppointments);

export default router;