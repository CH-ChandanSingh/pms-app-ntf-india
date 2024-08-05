import { costSheetList } from "../services/costSheetList.service.js";

export const getCostSheetList = async (req, res, next) => {
  try {
    let financial_year = 2023;
    const result = await costSheetList(financial_year);
    return res.status(200).json({
      message: "Cost Sheet list getting successfully",
      data: result,
    });
  } catch (error) {
    console.log("error", error);
    return res.status(500).json({
      message: "Internal server error",
    });
  }
};
