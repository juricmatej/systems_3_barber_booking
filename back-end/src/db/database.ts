import mysql, { ResultSetHeader, RowDataPacket } from "mysql2/promise";

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
  user_name: string;
  user_email: string;
  user_password: string;
}

export interface Service extends RowDataPacket {
  id: number;
  title: string;
  slug: string;
  text: string;
}

export interface Appointment extends RowDataPacket {
  id: number;
  title: string;
  slug: string;
  text: string;
}

export interface Schedule extends RowDataPacket {
  id: number;
  title: string;
  slug: string;
  text: string;
}

export interface TimeOff extends RowDataPacket {
  id: number;
  title: string;
  slug: string;
  text: string;
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
  username: string,
  email: string,
  password: string
): Promise<ResultSetHeader> => {
  const [result] = await pool.query<ResultSetHeader>(
    "INSERT INTO user_login (user_name, user_email, user_password) VALUES (?, ?, ?)",
    [username, email, password]
  );

  return result;
};
