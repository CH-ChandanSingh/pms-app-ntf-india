import { connection } from "../config/config.js";
import { getMasterTableFieldData } from "../utils/utils.js";

export const rmMovement = async (formDataSet) => {
  try {
    for (let formData of formDataSet) {
      const { rm_name, supplier_name, f_year, q1, q2, q3, q4 } = formData;
      const updatedRMNameId = await getMasterTableFieldData(
        "rm",
        "name",
        rm_name,
        "id"
      );
      await connection.connect(function (err) {
        if (err) throw err;
        connection.query(
          "SELECT * FROM rm_movements where rm_id=? and f_year=?",
          [updatedRMNameId, f_year],
          function (err, result, fields) {
            if (err) throw err;
            let updateId = result && result[0] ? result[0].id : null;
            if (updateId) {
              // Updating the data in part table
              connection.query(
                `Update rm_movements set rm_id=?, supplier_name=?, f_year=?, q1=?, q2=?, q3=?, q4=? where id=?`,
                [
                  updatedRMNameId,
                  supplier_name,
                  f_year,
                  q1,
                  q2,
                  q3,
                  q4,
                  updateId,
                ],
                async (err, result, fields) => {
                  if (err) throw err;
                }
              );
            } else {
              // Inserting the  data in part table
              connection.query(
                `INSERT INTO rm_movements (id, rm_id, supplier_name, f_year, q1, q2, q3, q4)
       VALUES (?,?, ?, ?, ?, ?, ?, ?)`,
                [
                  updateId,
                  updatedRMNameId,
                  supplier_name,
                  f_year,
                  q1,
                  q2,
                  q3,
                  q4,
                ],
                async (err, result, fields) => {
                  if (err) throw err;
                }
              );
            }
          }
        );
      });
    }
    return "Rm movement update Successfully";
  } catch (err) {
    return err;
  }
};
