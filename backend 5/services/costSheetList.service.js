import { connection } from "../config/config.js";
import { getMasterTableFieldData } from "../utils/utils.js";

export const costSheetList = async () => {
  try {
    let dataSet = [];
    await new Promise((resolve, reject) => {
      connection.connect(function (err) {
        if (err) throw err;
        connection.query(
          "SELECT * FROM cost_sheet where 1",
          async function (err, result, fields) {
            if (err) throw err;
            for (let data of result) {
              // Getting the model name
              const updateRmName = await getMasterTableFieldData(
                "rm",
                "id",
                data?.rm_name,
                "name"
              );

              const updateCostType = await getMasterTableFieldData(
                "cost_type",
                "id",
                data?.cost_type,
                "name"
              );

              // Fetching part details

              let dataPartDetailSub = [];
              await new Promise((resolve, reject) => {
                connection.query(
                  "SELECT * FROM part_detail where id = ?",
                  [data?.part_id],
                  async function (err, resultSub, fields) {
                    if (err) reject(err);
                    for (let dataPartDetail of resultSub) {
                      // Pushing cost details into data RM movement
                      const updatePoType = await getMasterTableFieldData(
                        "po_type",
                        "id",
                        dataPartDetail?.po_type_id,
                        "name"
                      );

                      const updateModel = await getMasterTableFieldData(
                        "model",
                        "id",
                        dataPartDetail?.model_id,
                        "name"
                      );

                      dataPartDetailSub = {
                        part_number: dataPartDetail.part_number,
                        part_name: dataPartDetail.part_name,
                        po_type: updatePoType,
                        model: updateModel,
                        rm_base: dataPartDetail.rm_base,
                        sop: dataPartDetail.sop,
                        vendor_code: dataPartDetail.vendor_code,

                        pcd_1: dataPartDetail.pcd_1,
                        pcd_1_date: dataPartDetail.pcd_1_date,
                        pcd_2: dataPartDetail.pcd_2,
                        pcd_2_date: dataPartDetail.pcd_2_date,
                        pcd_3: dataPartDetail.pcd_3,
                        pcd_3_date: dataPartDetail.pcd_3_date,
                        pcd_4: dataPartDetail.pcd_4,
                        pcd_4_date: dataPartDetail.pcd_4_date,
                      };
                    }
                    resolve();
                  }
                );
              });

              // Pushing the combined dataset into dataSet
              dataSet.push({
                cost_type: updateCostType,
                rm_name: updateRmName,
                supplier_name: data?.supplier_name,
                rm_weight_kg_pc: data?.rm_weight_kg_pc,
                rm_rate_rs_kg: data?.rm_rate_rs_kg,
                rm_rate_rs_pc: data?.rm_rate_rs_pc,
                indexing_msil_directed: data?.indexing_msil_directed,
                part_details: dataPartDetailSub,
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
