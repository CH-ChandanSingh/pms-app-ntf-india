import { rmMovement } from "../services/rmMovement.service.js";

export const getRmMovement = async (req, res, next) => {
  try {
    const formDataSet = req.body;
    const result = await rmMovement(formDataSet);
    return res.status(200).json({
      message: "RM Movement getting successfully",
      data: result,
    });
  } catch (error) {
    console.log("error", error);
    return res.status(500).json({
      message: "Internal server error",
    });
  }
};
