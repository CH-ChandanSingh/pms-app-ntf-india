import { rmMovementList } from "../services/rmMovementList.service.js";

export const getRmMovementList = async (req, res, next) => {
  try {
    let financial_year = 2023;
    const result = await rmMovementList(financial_year);
    return res.status(200).json({
      message: "RM Movement list getting successfully",
      data: result,
    });
  } catch (error) {
    console.log("error", error);
    return res.status(500).json({
      message: "Internal server error",
    });
  }
};
