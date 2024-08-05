import { connection } from "../config/config.js";
import { getMasterTableFieldData } from "../utils/utils.js";

export const costSheet = async (formDataSet) => {
  try {
    for (let formData of formDataSet) {
      const {
        part_number,
        part_name,
        po_type_id,
        model_id,
        rm_base,
        sop,
        vendor_code,
        pcd_1,
        pcd_1_date,
        pcd_2,
        pcd_2_date,
        pcd_3,
        pcd_3_date,
        pcd_4,
        pcd_4_date,
        cost,
      } = formData;
      const updatedPoTypeId = await getMasterTableFieldData(
        "po_type",
        "name",
        po_type_id,
        "id"
      );
      const updatedModelId = await getMasterTableFieldData(
        "model",
        "name",
        model_id,
        "id"
      );
      await connection.connect(function (err) {
        if (err) throw err;
        connection.query(
          "SELECT * FROM part_detail where part_number=?",
          part_number,
          function (err, result, fields) {
            if (err) throw err;

            let updateId = result && result[0] ? result[0].id : null;
            if (updateId) {
              // Updating the data in part table
              connection.query(
                `Update part_detail set part_number=?, part_name=?, po_type_id=?, model_id=?, rm_base=?, sop=?, vendor_code=?, pcd_1=?, pcd_1_date=?, pcd_2=?, pcd_2_date=?, pcd_3=?, pcd_3_date=?, pcd_4=?,pcd_4_date=? where id=?`,
                [
                  part_number,
                  part_name,
                  updatedPoTypeId,
                  updatedModelId,
                  rm_base,
                  sop,
                  vendor_code,
                  String(pcd_1),
                  pcd_1_date,
                  String(pcd_2),
                  pcd_2_date,
                  String(pcd_3),
                  pcd_3_date,
                  String(pcd_4),
                  pcd_4_date,
                  updateId,
                ],
                async (err, result, fields) => {
                  if (err) throw err;

                  // update the cost price
                  for (let costData of cost) {
                    const {
                      cost_type,
                      rm_name,
                      supplier_name,
                      rm_weight_kg_pc,
                      rm_rate_rs_kg,
                      rm_rate_rs_pc,
                      indexing_msil_directed,
                    } = costData;

                    const updatedCostType = await getMasterTableFieldData(
                      "cost_type",
                      "name",
                      cost_type,
                      "id"
                    );
                    const updatedRmName = await getMasterTableFieldData(
                      "rm",
                      "name",
                      rm_name,
                      "id"
                    );

                    connection.query(
                      "SELECT rm.name AS name,cost_sheet.id AS id FROM cost_sheet JOIN rm ON cost_sheet.rm_name = rm.id and cost_sheet.part_id=? and rm.name=?",
                      [updateId, rm_name],
                      function (err, resultSub, fields) {
                        if (err) throw err;
                        let updateSubId =
                          resultSub && resultSub[0] ? resultSub[0].id : null;
                        if (updateSubId) {
                          connection.query(
                            `Update cost_sheet set part_id=?,cost_type=?, rm_name=?, supplier_name=?, rm_weight_kg_pc=?, rm_rate_rs_kg=?, rm_rate_rs_pc=?, indexing_msil_directed=? where id=?`,
                            [
                              updateId,
                              updatedCostType,
                              updatedRmName,
                              supplier_name ? supplier_name : "",
                              rm_weight_kg_pc ? rm_weight_kg_pc : 0,
                              rm_rate_rs_kg ? rm_rate_rs_kg : 0,
                              rm_rate_rs_pc ? rm_rate_rs_pc : 0,
                              indexing_msil_directed
                                ? indexing_msil_directed
                                : "",
                              updateSubId,
                            ],
                            (err, result, fields) => {
                              if (err) throw err;
                            }
                          );
                        } else {
                          connection.query(
                            `INSERT INTO cost_sheet (id, part_id, cost_type, rm_name, supplier_name, rm_weight_kg_pc, rm_rate_rs_kg, rm_rate_rs_pc, indexing_msil_directed) VALUES (?,?, ?, ?, ?, ?, ?, ?, ?)`,
                            [
                              updateSubId,
                              updateId,
                              updatedCostType,
                              updatedRmName,
                              supplier_name ? supplier_name : "",
                              rm_weight_kg_pc ? rm_weight_kg_pc : 0,
                              rm_rate_rs_kg ? rm_rate_rs_kg : 0,
                              rm_rate_rs_pc ? rm_rate_rs_pc : 0,
                              indexing_msil_directed
                                ? indexing_msil_directed
                                : "NA",
                            ],
                            (err, result, fields) => {
                              if (err) throw err;
                            }
                          );
                        }
                      }
                    );
                  }
                  // end of cost section
                }
              );
            } else {
              // Inserting the  data in part table
              connection.query(
                `INSERT INTO part_detail (id, part_number, part_name, po_type_id, model_id, rm_base, sop, vendor_code, pcd_1, pcd_1_date, pcd_2, pcd_2_date, pcd_3, pcd_3_date, pcd_4, pcd_4_date)
       VALUES (?,?, ?, ?, ?, ?, ?, ?,?, ?, ?, ?, ?, ?,?,?)`,
                [
                  updateId,
                  part_number,
                  part_name,
                  updatedPoTypeId,
                  updatedModelId,
                  rm_base,
                  sop,
                  vendor_code,
                  String(pcd_1),
                  pcd_1_date,
                  String(pcd_2),
                  pcd_2_date,
                  String(pcd_3),
                  pcd_3_date,
                  String(pcd_4),
                  pcd_4_date,
                ],
                async (err, result, fields) => {
                  if (err) throw err;
                  let updatedPartId = result.insertId;
                  // update the cost price
                  for (let costData of cost) {
                    const {
                      cost_type,
                      rm_name,
                      supplier_name,
                      rm_weight_kg_pc,
                      rm_rate_rs_kg,
                      rm_rate_rs_pc,
                      indexing_msil_directed,
                    } = costData;
                    const updatedCostType = await getMasterTableFieldData(
                      "cost_type",
                      "name",
                      cost_type,
                      "id"
                    );
                    const updatedRmName = await getMasterTableFieldData(
                      "rm",
                      "name",
                      rm_name,
                      "id"
                    );
                    connection.query(
                      "SELECT rm.name AS name,cost_sheet.id AS id FROM cost_sheet JOIN rm ON cost_sheet.rm_name = rm.id and cost_sheet.part_id=? and rm.name=?",
                      [updateId, rm_name],
                      function (err, resultSub, fields) {
                        if (err) throw err;
                        let updateSubId =
                          resultSub && resultSub[0] ? resultSub[0].id : null;

                        if (updateSubId) {
                          connection.query(
                            `Update cost_sheet set part_id=?,cost_type=?, rm_name=?, supplier_name=?, rm_weight_kg_pc=?, rm_rate_rs_kg=?, rm_rate_rs_pc=?, indexing_msil_directed=? where id=?`,
                            [
                              updatedPartId,
                              updatedCostType,
                              updatedRmName,
                              supplier_name ? supplier_name : "",
                              rm_weight_kg_pc ? rm_weight_kg_pc : 0,
                              rm_rate_rs_kg ? rm_rate_rs_kg : 0,
                              rm_rate_rs_pc ? rm_rate_rs_pc : 0,
                              indexing_msil_directed
                                ? indexing_msil_directed
                                : "",
                              updateSubId,
                            ],
                            (err, result, fields) => {
                              if (err) throw err;
                            }
                          );
                        } else {
                          connection.query(
                            `INSERT INTO cost_sheet (id, part_id,cost_type, rm_name, supplier_name, rm_weight_kg_pc, rm_rate_rs_kg, rm_rate_rs_pc, indexing_msil_directed)
       VALUES (?,?, ?, ?, ?, ?, ?,?,?)`,
                            [
                              updateSubId,
                              updatedPartId,
                              updatedCostType,
                              updatedRmName,
                              supplier_name ? supplier_name : "",
                              rm_weight_kg_pc ? rm_weight_kg_pc : 0,
                              rm_rate_rs_kg ? rm_rate_rs_kg : 0,
                              rm_rate_rs_pc ? rm_rate_rs_pc : 0,
                              indexing_msil_directed
                                ? indexing_msil_directed
                                : "",
                            ],
                            (err, result, fields) => {
                              if (err) throw err;
                            }
                          );
                        }
                      }
                    );
                  }
                  // end of cost section
                }
              );
            }
          }
        );
      });
    }
    return "cost sheet update Successfully";
  } catch (err) {
    return err;
  }
};
