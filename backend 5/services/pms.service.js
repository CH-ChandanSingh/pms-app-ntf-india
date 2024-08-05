import { connection } from "../config/config.js";
import { getMasterTableFieldData } from "../utils/utils.js";

export const pmsList = async (financial_year) => {
  try {
    let dataSet = [];
    await new Promise((resolve, reject) => {
      connection.connect(function (err) {
        if (err) throw err;
        connection.query(
          "SELECT * FROM part_detail where 1",
          async function (err, result, fields) {
            if (err) throw err;
            for (let data of result) {
              // Getting the model name
              const updateModel = await getMasterTableFieldData(
                "model",
                "id",
                data?.model_id,
                "name"
              );
              // Fetching cost details
              let dataCostSheetSub = [];

              await new Promise((resolve, reject) => {
                connection.query(
                  "SELECT * FROM cost_sheet where part_id=?",
                  [data?.id],
                  async function (err, resultSub, fields) {
                    if (err) reject(err);
                    for (let dataCost of resultSub) {
                      // Getting the cost Type
                      const updateCostType = await getMasterTableFieldData(
                        "cost_type",
                        "id",
                        dataCost?.cost_type,
                        "name"
                      );
                      // Getting the cost Type
                      const updateRMName = await getMasterTableFieldData(
                        "rm",
                        "id",
                        dataCost?.rm_name,
                        "name"
                      );

                      let dataRmMovementSub = [];
                      // Fetching cost details
                      await new Promise((resolve, reject) => {
                        connection.query(
                          "SELECT * FROM rm_movements where rm_id = ? and f_year=?",
                          [dataCost?.rm_name, financial_year],
                          async function (err, resultSub, fields) {
                            if (err) reject(err);
                            for (let dataRmMovement of resultSub) {
                              const updatedRMNameId =
                                await getMasterTableFieldData(
                                  "rm",
                                  "id",
                                  dataRmMovement.rm_id,
                                  "name"
                                );
                              // Pushing cost details into data RM movement
                              dataRmMovementSub.push({
                                rm_name: updatedRMNameId,
                                f_year: dataRmMovement.f_year,
                                q1: dataRmMovement.q1,
                                q2: dataRmMovement.q2,
                                q3: dataRmMovement.q3,
                                q4: dataRmMovement.q4,
                                q2_rate_movement: (
                                  (dataRmMovement.q2 - dataRmMovement.q1) *
                                  dataCost?.rm_weight_kg_pc
                                ).toFixed(2),
                                q3_rate_movement: (
                                  (dataRmMovement.q3 - dataRmMovement.q2) *
                                  dataCost?.rm_weight_kg_pc
                                ).toFixed(2),
                                q4_rate_movement: (
                                  (dataRmMovement.q4 - dataRmMovement.q3) *
                                  dataCost?.rm_weight_kg_pc
                                ).toFixed(2),
                              });
                            }
                            resolve();
                          }
                        );
                      });
                      // Pushing cost details into dataCostSheetSub
                      dataCostSheetSub.push({
                        name: updateRMName,
                        cost_type: updateCostType,
                        rm_name: updateRMName,
                        supplier_name: dataCost?.supplier_name,
                        rm_weight_kg_pc: dataCost?.rm_weight_kg_pc,
                        rm_rate_rs_kg: dataCost?.rm_rate_rs_kg,
                        rm_rate_rs_pc: dataCost?.rm_rate_rs_pc,
                        indexing_msil_directed:
                          dataCost?.indexing_msil_directed,
                        rm_movement: dataRmMovementSub, // Include RM movement detail
                      });
                    }
                    resolve();
                  }
                );
              });

              let dataActualPriceSub = [];
              // Fetching actual price
              await new Promise((resolve, reject) => {
                connection.query(
                  "SELECT * FROM actual_price where part_id = ? and po_type_id=? and f_year=?",
                  [data?.id, data?.po_type_id, financial_year],
                  async function (err, resultSub, fields) {
                    if (err) reject(err);
                    for (let dataActualPrice of resultSub) {
                      const updatedPartId = await getMasterTableFieldData(
                        "part_detail",
                        "id",
                        dataActualPrice.part_id,
                        "part_number"
                      );

                      // Pushing cost details into data RM movement
                      dataActualPriceSub.push({
                        f_year: dataActualPrice.f_year,
                        po_type_id: dataActualPrice.po_type_id,
                        actual_price_q1: dataActualPrice.actual_price_q1,
                        actual_price_q2: dataActualPrice.actual_price_q2,
                        actual_price_q3: dataActualPrice.actual_price_q3,
                        actual_price_q4: dataActualPrice.actual_price_q4,
                      });
                    }
                    resolve();
                  }
                );
              });

              // Pushing the combined dataset into dataSet
              dataSet.push({
                part_number: data?.part_number,
                part_name: data?.part_name,
                supplier_name: data?.supplier_name,
                model: updateModel,
                rm_base: data?.rm_base,
                sop: data?.sop,
                vendor_code: data?.vendor_code,
                pcd_1: data?.pcd_1,
                pcd_1_date: data?.pcd_1_date,
                pcd_2: data?.pcd_2,
                pcd_2_date: data?.pcd_2_date,
                pcd_3: data?.pcd_3,
                pcd_3_date: data?.pcd_3_date,
                pcd_4: data?.pcd_4,
                pcd_4_date: data?.pcd_4_date,
                cost_details: dataCostSheetSub, // Include cost details here
                actual_price: dataActualPriceSub, // Include cost details here
              });
            }
            resolve();
          }
        );
      });
    });
    return dataSet;
  } catch (error) {
    console.log("error", error);
    throw error;
  }
};
