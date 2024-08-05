import { connection } from "../config/configAsync.js";

export const getMasterTableFieldData = async (
  tableName,
  searchFieldName,
  searchText,
  returnFieldName
) => {
  if (searchText) {
    let connect = await connection;
    const query = `SELECT ${returnFieldName} FROM ${tableName} WHERE ${searchFieldName} = '${searchText}'`;
    const rows = await connect.execute(query);
    return rows[0] !== undefined ? rows[0][0][returnFieldName] : "--";
  } else {
    return "--";
  }
};
