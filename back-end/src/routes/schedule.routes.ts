import { Request, Response, NextFunction, Router } from "express";
import { getEmployeeSchedule, ScheduleDay, EmployeeTimeOff, createTimeOff } from "../db/database.js";
import {  requireLogin } from "../middleware/require-login.js";
import { requireAdmin } from "../middleware/require-admin.js";

const router = Router();



const getSchedule = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {

    const { employee_id } = req.params;

    const queryResult = await getEmployeeSchedule(Number(employee_id));
    res.status(200).json(queryResult);

} catch (error) {
    next(error)
}

}



const setScheduleDay = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
        
    const { employee_id } = req.params;

    const { day_of_week, start_time, end_time, start_break, end_break, is_active } = req.body as {
      day_of_week?: number;
      start_time?: string;
      end_time?: string;
      start_break?: string;
      end_break?: string;
      is_active?: number;

    };

    if(day_of_week == undefined || day_of_week < 0  || day_of_week > 7) {
        res.status(400).json({
            success: false,
            message: "Day is not defined correlty my man"
        })
        return;
    }

    const queryResult = await ScheduleDay(Number(employee_id), day_of_week, start_time ?? "", end_time ?? "", start_break ?? "", end_break ?? "", is_active ?? 1);
    res.status(200).json({
        success: true,
        message: "Schedule updated",
    })

} catch (error) {
    next(error)
}

}

const TimeOff = async (
    req: Request, 
    res: Response, 
    next: NextFunction
) => {
  try {


    const { employee_id } = req.params;

    const timeoff = await EmployeeTimeOff(Number(employee_id));
    res.status(200).json(timeoff);
  


} catch (error) {
    next(error);
  }
};



const setTimeOff = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {

    const { employee_id } = req.params;

    const { start_datetime, end_datetime, reason } = req.body as {
      start_datetime?: string;
      end_datetime?: string;
      reason?: string;
    };

    if(!start_datetime || !end_datetime){
        res.status(400).json({
            success: false,
            message: "Start/End date and time are neededd"
        });
        return;
    }

     const queryResult = await createTimeOff(Number(employee_id), start_datetime, end_datetime, reason ?? "");
    if (queryResult.affectedRows == 1) {
        res.status(200).json({
            success: true,
            message: "Time off aded"
        })
    }
} catch (error) {
    next(error)
}

}



router.get("/:employee_id", requireLogin, getSchedule);
router.put("/:employee_id", requireLogin, setScheduleDay);
router.get("/:employee_id/timeoff", requireLogin, TimeOff);
router.post("/:employee_id/timeoff", requireLogin, setTimeOff);

export default router;