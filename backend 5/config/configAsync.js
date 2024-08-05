import mysql from "mysql2/promise";

// connecting Database
export const connection = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "password",
  database: "NTF",
});
