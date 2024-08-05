import { pmsList } from "../services/pms.service.js";

export const getPms = async (req, res, next) => {
  try {
    let financial_year = 2023;
    const result = await pmsList(financial_year);
    return res.status(200).json({
      message: "pms list getting successfully",
      data: result,
    });
  } catch (error) {
    console.log("error", error);
    return res.status(500).json({
      message: "Internal server error",
    });
  }
};
