import { actualPrice } from "../services/actualPrice.service.js";

export const getActualPrice = async (req, res, next) => {
  try {
    const formDataSet = req.body;
    const result = await actualPrice(formDataSet);
    return res.status(200).json({
      message: "Actual Price list getting successfully",
      data: result,
    });
  } catch (error) {
    console.log("error", error);
    return res.status(500).json({
      message: "Internal server error",
    });
  }
};
