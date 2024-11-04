import inquirer from "inquirer";
import shell from "shelljs";
import chalk from "chalk";
import { exec } from "child_process";

// This is used to check if the verdaccio server is running
const isVerdaccioRunning = () => {
  const response = shell.exec("curl -Is http://localhost:4873");
  return response.stdout.includes("200 OK");
};

// Start Verdaccio in a separate terminal window
const startVerdaccio = () => {
  console.log(chalk.green("-----Running Verdaccio server-----"));

  const command = "start cmd.exe";
  const args = [
    "/c",
    "pnpm",
    "verdaccio",
    "-c",
    "./local/verdaccio-config.yaml",
  ];

  exec(`${command} ${args.join(" ")}`, (error, stdout, stderr) => {
    if (error) {
      console.error(
        chalk.red(`Error starting Verdaccio: ${stderr || error.message}`)
      );
    }
  });
};

// Stops the Verdaccio server by killing the port 4873.
const stopVerdaccio = () => {
  console.log(chalk.red("-----Stopping Verdaccio server-----"));
  shell.exec("npx kill-port 4873");
  console.log(chalk.green("-----Verdaccio server stopped successfully-----"));
};

// Deploys package to Verdaccio and deletes existing package folder if it exists.
const deployToVerdaccio = () => {
  const verdaccioStoragePath = "./local/storage";
  const packageFolderPath = `${verdaccioStoragePath}/@cloudifybiz`;
  if (shell.test("-e", packageFolderPath)) {
    console.log(chalk.red("-----Deleting existing package folder-----"));
    shell.rm("-rf", packageFolderPath);
  } else {
    console.log(chalk.yellow("-----Package folder does not exist-----"));
  }
  console.log(chalk.cyan("-----Publishing package to Verdaccio-----"));
  shell.exec(
    "pnpm nx affected -t publish-to-verdaccio --exclude=*,!serverless/apps/** --verbose"
  );
  console.log(
    chalk.green("-----Published package to Verdaccio successfully-----")
  );
};

// Asynchronous function to start Verdaccio server and prompt user for actions.
const main = async () => {
  if (isVerdaccioRunning()) {
    console.log(
      chalk.green("-------Verdaccio server is already running------")
    );
  } else {
    startVerdaccio();
  }

  const shouldContinue = true;

  while (shouldContinue) {
    const QUESTIONS = [
      {
        type: "list",
        name: "action",
        message: "Choose an action",
        choices: [
          "Publish package to Verdaccio",
          "Stop Verdaccio server",
          "Other options",
        ],
      },
    ];

    const answers = await inquirer.prompt(QUESTIONS);

    console.log(`User chose: ${answers.action}`);
    if (answers.action === "Publish package to Verdaccio") {
      deployToVerdaccio();
    } else if (answers.action === "Stop Verdaccio server") {
      stopVerdaccio();
      break;
    } else {
      console.log(chalk.red("------Other options not implemented yet------"));
    }
  }
};

main();
