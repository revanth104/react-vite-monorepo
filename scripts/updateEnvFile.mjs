import * as fs from "fs/promises";

// Get the project root and stage from the command line arguments
const FILE_PATH = process.argv[2];
const ENV_VARS = process.argv[3];

let fileData;

// Function to update or add a key-value pair in the .env file
const updateEnv = async (key, value) => {
  // Create a regular expression to match the key
  const regex = new RegExp(`^${key}=.*`, "m");
  // Check if the key exists in the file

  if (regex.test(fileData)) {
    // If the key exists, replace the line
    fileData = fileData.replace(regex, `${key}=${value}`);
  } else {
    // If the key doesn't exist, add it to the end of the file
    fileData += `\n${key}=${value}`;
  }
};

const main = async () => {
  const netlifyEnvVars = JSON.parse(ENV_VARS);
  try {
    await fs.readFile(FILE_PATH, "utf8");
    fileData = await fs.readFile(FILE_PATH, "utf8");
  } catch (error) {
    if (error.code === "ENOENT") console.log(`${FILE_PATH} not found`);
    else throw error;
  }

  Object.entries(netlifyEnvVars).forEach((el) => {
    updateEnv(el[0], el[1]);
  });

  fs.writeFile(FILE_PATH, fileData);
  console.log("Updated new environment variables\n", fileData);
};

main();
