import mysql from "mysql2";

// connecting Database
export const connection = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "password",
  database: "NTF",
});
