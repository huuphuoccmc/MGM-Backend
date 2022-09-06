import jsonfile from "jsonfile";
const dbFilePath = __dirname + "/database.json";

/**
 * Fetch the json from the file.
 *
 * @returns
 */
function load(): Promise<Record<string, any>> {
  return jsonfile.readFile(dbFilePath);
}

/**
 * Update the file.
 *
 * @param db
 * @returns
 */
function save(db: Record<string, any>): Promise<void> {
  return jsonfile.writeFile(dbFilePath, db);
}

export default {
    load,
    save,
} as const;