import * as fs from "fs/promises";
import { NewChangesetWithCommit } from "@changesets/types";
import { artifactDir } from "../config.js";

// Saving as .env as it is easier to append
const filePath = artifactDir + "/gitOwners.env";

/**
 * Creates a json map of changeset and their respective author name and their github url
 * @param author - The author object which contains the name and the url
 * @param summary - Changeset the changeset object
 */

export default async (
  author: {
    authorName: string;
    authorUrl: string;
  },
  changeset: NewChangesetWithCommit
) => {
  // Check if File is present
  console.log("Looking for output file at ", filePath);
  try {
    await fs.readFile(filePath, "utf8");
  } catch (error) {
    if (error instanceof Error && "code" in error && error.code === "ENOENT") {
      console.log(`${filePath} not found, creating file...`);
    } else {
      throw error;
    }
  }

  // Write to the file
  const data = JSON.stringify(author);
  await fs.appendFile(filePath, `\n${changeset.id}="${data}"`);

  console.log(`Added changelog to ${filePath}`);
};
