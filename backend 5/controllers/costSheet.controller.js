import { costSheet } from "../services/costSheet.service.js";

export const getCostSheet = async (req, res, next) => {
  try {
    const formDataSet = req.body;
    const result = await costSheet(formDataSet);
    return res.status(200).json({
      message: "Cost Sheet getting successfully",
      data: result,
    });
  } catch (error) {
    console.log("error", error);
    return res.status(500).json({
      message: "Internal server error",
    });
  }
};
