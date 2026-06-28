import mysql, { ResultSetHeader, RowDataPacket } from "mysql2/promise";
import bcrypt from "bcrypt";
import { appendFile, stat } from "node:fs";

const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_DATABASE,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

export interface User extends RowDataPacket {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  phone: number;
  password_hash: string;
  role: string;
  is_active: number;
  created_at: string;  
}

export interface Employee extends RowDataPacket {
  id: number;
  user_id: number;
  barbershop_id: number;
  display_name: string;
  created_at: string;
}

export interface Service extends RowDataPacket {
  id: number;
  barbershop_id: number;
  name: string;
  description: string;
  duration_min: number;
  price: number;
  is_active: number;

}

export interface Appointment extends RowDataPacket {
  id: number;
  barbershop_id: number;
  employee_id: number;
  service_id: number;
  customer_name: string;
  customer_email: string;
  customer_phone: number;
  start_datetime: string;
  end_datetime: string;
  status: string;
  created_at: string;  
  updated_at: string;  


}

export interface Schedule extends RowDataPacket {
  id: number;
  employee_id: number;
  day_of_week: number;
  start_time: string;
  end_time: string;
  break_start: string;
  break_end: string;
  is_active: number;
}

export interface TimeOff extends RowDataPacket {
  id: number;
  employee_id: number;
  start_datetime: string;
  end_datetime: string;
  reason: string;
}


 /*
  export const allNews = async (): Promise<NewsItem[]> => {
  const [rows] = await pool.query<NewsItem[]>("SELECT * FROM news");
  return rows;
};

export const oneNewsItem = async (id: string): Promise<NewsItem[]> => {
  const [rows] = await pool.query<NewsItem[]>(
    "SELECT * FROM news WHERE id = ?",
    [id]
  );

  return rows;
};

export const createNewsItem = async (
  title: string,
  slug: string,
  text: string
): Promise<ResultSetHeader> => {
  const [result] = await pool.query<ResultSetHeader>(
    "INSERT INTO news (title, slug, text) VALUES (?, ?, ?)",
    [title, slug, text]
  );

  return result;
};

*/

export const getUserByEmail = async (email: string): Promise<User[]> => {
  const [rows] = await pool.query<User[]>(
    "SELECT * FROM user WHERE email = ?",
    [email]
  );

  return rows;
};



export const createUser = async (
  first_name: string,
  last_name: string,
  phone: number | null,
  email: string,
  password: string


): Promise<ResultSetHeader> => {

  const password_hash= await bcrypt.hash(password, 10);


  const [result] = await pool.query<ResultSetHeader>(
    "INSERT INTO user (first_name, last_name, email, phone, password_hash) VALUES (?, ?, ?, ?, ?)",
    [first_name, last_name, email, phone, password_hash]
  );

  return result;
};


export const createEmployee = async (
  user_id: number,
  barbershop_id: number,
  display_name: string,
  bio: string,

): Promise<ResultSetHeader> => {
    const [result] = await pool.query<ResultSetHeader>(
      "INSERT INTO employee (user_id, barbershop_id, display_name, bio) VALUES (?, ?, ?, ?)",
      [user_id, barbershop_id, display_name, bio]
    );
    return result;
};

export const getEmployess1 = async (
    barbershop_id: number,
): Promise<Employee[]> => {
    const [rows] = await pool.query<Employee[]>(
        `SELECT empl.id, empl.display_name, empl.bio, usr.first_name, usr.last_name
        FROM employee empl
        JOIN user usr ON empl.user_id = usr.id
        WHERE usr.is_active = 1 AND empl.barbershop_id = ?  ` ,
        [barbershop_id]
    );
    return rows;


  };



export const getServices = async (
  barbershop_id: number,

): Promise<Service[]> => {
  const [rows] = await pool.query<Service[]>(
    "SELECT * FROM service WHERE is_active = 1 AND barbershop_id = ?",
    [barbershop_id]
  );
  return rows;
}


export const addService = async (
  barbershop_id: number,
  name: string,
  description: string,
  duration_min: number,
  price: number,
): Promise<ResultSetHeader> => {
  const [result] = await pool.query<ResultSetHeader>(
    "INSERT INTO service (barbershop_id, name, description, duration_min, price) VALUES (?,?,?,?,?)",
    [barbershop_id, name, description, duration_min, price]
  );  
  return result;
};


export const updateService = async (
  id: number,
  name: string,
  description: string,
  duration_min: number,
  price: number,
  is_active: number,
): Promise<ResultSetHeader> => {
    const [result] = await pool.query<ResultSetHeader>(
      "UPDATE service SET name = ?, description = ?, duration_min = ?, price = ?, is_active = ? WHERE id = ?",
      [id, name, description, duration_min, price, is_active]
    )
    return result;
};


export const getAppointmentsAll = async (
  barbershop_id: number,

): Promise<Appointment[]> => {
  const [rows] = await pool.query<Appointment[]>(
    `SELECT app.*, ser.name AS serviceName, empl.display_name AS employeeName
    FROM appointment app
    JOIN service ser ON app.service_id = ser.id
    JOIN employee empl ON app.employee_id = empl.id  
    WHERE app.barbershop_id = ?
    ORDER BY app.start_datetime DESC`,
    [barbershop_id]

  );
  return rows;
}


export const getAppointmentEmployee = async (
  employee_id: number

): Promise<Appointment[]> => {
  const [rows] = await pool.query<Appointment[]>(
    `SELECT app.*, ser.name AS service_name
     FROM appointment app
     JOIN service ser ON app.service_id = ser.id
     WHERE app.employee_id = ?
     ORDER BY app.start_datetime DESC`,
    [employee_id]
  );
  return rows;
};


export const createAppointment = async (
  barbershop_id: number,
  service_id: number,
  employee_id: number,
  customer_name: string,
  customer_email: string,
  customer_phone: string,
  start_datetime: string,
  end_datetime: string,
  note: string,
): Promise<ResultSetHeader> => {
  const [result] = await pool.query<ResultSetHeader>(
    "INSERT INTO appointment (barbershop_id, service_id, employee_id, customer_name, customer_email, customer_phone, start_datetime, end_datetime, note, status) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 'pending')",
    [barbershop_id, service_id, employee_id, customer_name, customer_email, customer_phone, start_datetime, end_datetime, note]
  );
  return result;
};


export const AppointmentUpdateStatus = async (
  id: number,
  status: string,


): Promise<ResultSetHeader> => {
  const [result] = await pool.query<ResultSetHeader>(
    "UPDATE appointment SET status = ? WHERE id = ?",
    [status, id]
  );
  return result;
}

export const Overlap = async (
  employee_id: number,
  start_datetime: string,
  end_datetime: string,

): Promise<Appointment[]> => {
  const [rows] = await pool.query<Appointment[]>(
    `SELECT * FROM appointment
     WHERE employee_id = ?
     AND status != 'cancelled'
     AND start_datetime < ?
     AND end_datetime > ?`,
     [employee_id, start_datetime, end_datetime]
  );
  return rows;
}


export const getEmployeeSchedule = async (
  employee_id: number,

): Promise<Schedule[]> => {
  const [rows] = await pool.query<Schedule[]>(
    "SELECT * FROM schedule WHERE employee_id = ? ORDER BY day_of_week",
    [employee_id]
  );
  return rows;
};

export const ScheduleDay = async (
  employee_id: number,
  day_of_week: number,
  start_time: string,
  end_time: string,
  break_start: string,
  break_end: string,
  is_active: number,
  
): Promise<ResultSetHeader> => {
  const [result] = await pool.query<ResultSetHeader>(
    `INSERT INTO schedule (employee_id, day_of_week, start_time, end_time, break_start, break_end, is_active) VALUES (?, ?, ?, ?, ?, ?, ?)
     ON DUPLICATE KEY UPDATE
     start_time = VALUES(start_time),
     end_time = VALUES(end_time),
     break_start = VALUES(break_start),
     break_end = VALUES(break_end),
     is_active = VALUES(is_active)`,
    [employee_id, day_of_week, start_time, end_time, break_start, break_end, is_active]
  );
  return result;
};


export const EmployeeTimeOff = async (
  employee_id: number,

): Promise<TimeOff[]> => {
  const [rows] = await pool.query<TimeOff[]>(
    "SELECT * FROM timeoff WHERE employee_id = ? ORDER BY start_datetime",
    [employee_id]
  );
  return rows;
};


export const createTimeOff = async (
  employee_id: number,
  start_datetime: string,
  end_datetime: string,
  reason: string,
): Promise<ResultSetHeader> => {
  const [result] = await pool.query<ResultSetHeader>(
    "INSERT INTO timeoff (employee_id, start_datetime, end_datetime, reason) VALUES (?, ?, ?, ?)",
    [employee_id, start_datetime, end_datetime, reason]
  );
  return result;
};

