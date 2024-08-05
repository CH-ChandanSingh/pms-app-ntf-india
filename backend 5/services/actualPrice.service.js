import { connection } from "../config/config.js";
import { getMasterTableFieldData } from "../utils/utils.js";

export const actualPrice = async (formDataSet) => {
  try {
    for (let formData of formDataSet) {
      const {
        part_name,
        f_year,
        po_type,
        actual_price_q1,
        actual_price_q2,
        actual_price_q3,
        actual_price_q4,
      } = formData;

      const updatedPartId = await getMasterTableFieldData(
        "part_detail",
        "part_number",
        part_name,
        "id"
      );
      const updatePoTypeId = await getMasterTableFieldData(
        "po_type",
        "name",
        po_type,
        "id"
      );

      await connection.connect(function (err) {
        if (err) throw err;

        connection.query(
          "SELECT * FROM actual_price where part_id = ? and po_type_id=? and f_year=?",
          [updatedPartId, updatePoTypeId, f_year],
          function (err, result, fields) {
            if (err) throw err;
            let updateId = result && result[0] ? result[0].id : null;
            if (updateId) {
              // Updating the data in part table
              connection.query(
                `Update actual_price set part_id=?, po_type_id=?, f_year=?, actual_price_q1=?, actual_price_q2=?,actual_price_q3=?, actual_price_q4=? where id=?`,
                [
                  updatedPartId,
                  updatePoTypeId,
                  f_year,
                  actual_price_q1,
                  actual_price_q2,
                  actual_price_q3,
                  actual_price_q4,
                  updateId,
                ],
                async (err, result, fields) => {
                  if (err) throw err;
                }
              );
            } else {
              // Inserting the  data in part table
              connection.query(
                `INSERT INTO actual_price (id,  part_id, po_type_id, f_year, actual_price_q1, actual_price_q2, actual_price_q3, actual_price_q4)
       VALUES (?,?, ?, ?, ?, ?, ?, ?)`,
                [
                  updateId,
                  updatedPartId,
                  updatePoTypeId,
                  f_year,
                  actual_price_q1,
                  actual_price_q2,
                  actual_price_q3,
                  actual_price_q4,
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
    return "Actual price update Successfully";
  } catch (err) {
    return err;
  }
};
