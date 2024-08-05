import { connection } from "../config/config.js";
import { getMasterTableFieldData } from "../utils/utils.js";

export const actualPriceList = async () => {
  try {
    let dataSet = [];
    await new Promise((resolve, reject) => {
      connection.connect(function (err) {
        if (err) throw err;
        connection.query(
          "SELECT * FROM actual_price where 1",
          async function (err, result, fields) {
            if (err) throw err;
            for (let data of result) {
              // Getting the model name
              const updatePartNumber = await getMasterTableFieldData(
                "part_detail",
                "id",
                data?.part_id,
                "part_number"
              );

              const updatePoType = await getMasterTableFieldData(
                "po_type",
                "id",
                data?.part_id,
                "name"
              );

              // Pushing the combined dataset into dataSet
              dataSet.push({
                part_number: updatePartNumber,
                f_year: data?.f_year,
                po_type: updatePoType,
                actual_price_q1: data?.actual_price_q1,
                actual_price_q2: data?.actual_price_q1,
                actual_price_q3: data?.actual_price_q3,
                actual_price_q4: data?.actual_price_q4,
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
