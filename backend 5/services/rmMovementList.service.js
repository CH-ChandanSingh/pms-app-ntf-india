import { connection } from "../config/config.js";
import { getMasterTableFieldData } from "../utils/utils.js";

export const rmMovementList = async () => {
  try {
    let dataSet = [];
    await new Promise((resolve, reject) => {
      connection.connect(function (err) {
        if (err) throw err;
        connection.query(
          "SELECT * FROM rm_movements where 1",
          async function (err, result, fields) {
            if (err) throw err;
            for (let data of result) {
              // Getting the model name
              const updateRmName = await getMasterTableFieldData(
                "rm",
                "id",
                data?.rm_id,
                "name"
              );

              // Pushing the combined dataset into dataSet
              dataSet.push({
                rm_name: updateRmName,
                supplier_name: data?.supplier_name,
                f_year: data?.f_year,
                q1: data?.q1,
                q2: data?.q2,
                q3: data?.q3,
                q4: data?.q4,
              });
            }
            resolve();
          }
        );
      });
    });
    return dataSet;
  } catch (err) {
    res.status(500).json({
      message: err,
    });
  }
};
