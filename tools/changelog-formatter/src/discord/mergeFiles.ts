import * as fs from "fs/promises";
import { artifactDir, artifactPath } from "../config.js";
import { Changesets } from "../types/changeset.types.js";

// Storing as .env cause it is easier to append
const gitOwnerFilePath = artifactDir + "/gitOwners.env";
import * as dotenv from "dotenv";
// Add the git owners data to the env variables
dotenv.config({ path: gitOwnerFilePath });

/**
 * Adds data from git Owners to the respective changesets in Output.json
 */
const main = async () => {
  let changesetData!: Changesets;

  // Extract data from changeset output file
  console.log("Looking for git owner and changeset files");
  try {
    const data = await fs.readFile(artifactPath, "utf8");
    changesetData = JSON.parse(data);
  } catch (error) {
    if (error instanceof Error && "code" in error && error.code === "ENOENT") {
      const message = `Output file not found please run changeset status --output=${artifactPath}`;
      console.log("\x1b[31m%s\x1b[0m", message);
      throw error;
    }
  }

  // Add the author data from env variables to changeset output file
  changesetData.changesets = changesetData.changesets.map((el) => {
    const { id } = el;
    const author = process.env[id];
    if (author) return { ...el, author: JSON.parse(author) };
    return el;
  });

  // Convert back to JSON string
  const jsonString = JSON.stringify(changesetData, null, 2);

  // Write to the changeset output file
  await fs.writeFile(artifactPath, jsonString);
  console.log(`Added changelog to ${artifactPath}`);
};

main();
