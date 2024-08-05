import express from "express";
import { getMasterTableFieldData } from "./utils/utils.js";
import mysql from "mysql2";
import cors from "cors";
const app = express();

const connection = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "password",
  database: "NTF",
});

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Under construction");
});

// PMS Report
app.get("/pms", async (req, res) => {
  try {
    let dataSet = [];
    let financial_year = 2023;
    await connection.connect(function (err) {
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
                      indexing_msil_directed: dataCost?.indexing_msil_directed,
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
          res.status(200).json({
            data: dataSet,
            message: "PMS generated successfully",
          });
        }
      );
    });
  } catch (err) {
    res.status(500).json({
      message: err,
    });
  }
});

app.get("/costSheetList", async (req, res) => {
  try {
    let dataSet = [];
    await connection.connect(function (err) {
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
          res.status(200).json({
            data: dataSet,
            message: "Cost Sheet List",
          });
        }
      );
    });
  } catch (err) {
    res.status(500).json({
      message: err,
    });
  }
});

app.get("/rmMovementList", async (req, res) => {
  try {
    let dataSet = [];
    await connection.connect(function (err) {
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
          res.status(200).json({
            data: dataSet,
            message: "RM Movement List",
          });
        }
      );
    });
  } catch (err) {
    res.status(500).json({
      message: err,
    });
  }
});

app.get("/actualPriceList", async (req, res) => {
  try {
    let dataSet = [];
    await connection.connect(function (err) {
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
          res.status(200).json({
            data: dataSet,
            message: "Actual Price List",
          });
        }
      );
    });
  } catch (err) {
    res.status(500).json({
      message: err,
    });
  }
});

// Rm movement
app.post("/rmMovement", async (req, res) => {
  try {
    const formDataSet = req.body;
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
    res.status(200).json({
      message: "Rm movement update Successfully",
    });
  } catch (err) {
    res.status(500).json({
      message: err,
    });
  }
});

// Cost sheet execution
app.post("/costSheet", async (req, res) => {
  try {
    const formDataSet = req.body;
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
                      rm_name.trim(),
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
                            `INSERT INTO cost_sheet (id, part_id, cost_type, rm_name, supplier_name, rm_weight_kg_pc, rm_rate_rs_kg, rm_rate_rs_pc, indexing_msil_directed)
       VALUES (?,?, ?, ?, ?, ?, ?, ?, ?)`,
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
    res.status(200).json({
      message: "cost sheet update Successfully",
    });
  } catch (err) {
    res.status(500).json({
      message: err,
    });
  }
});

// Actual Price execution
app.post("/actualPrice", async (req, res) => {
  try {
    const formDataSet = req.body;
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
    res.status(200).json({
      message: "Actual price update Successfully",
    });
  } catch (err) {
    res.status(500).json({
      message: err,
    });
  }
});

app.listen(5000, () => {
  console.log("Server listening in http://localhost:5000");
});
