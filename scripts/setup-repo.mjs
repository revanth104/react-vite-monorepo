import { exec } from "child_process";

//Commands
const commands = [
  "pnpm c set recursive-install=false --location=project",
  "git config core.hooksPath .husky",
  "husky",
];

commands.forEach((command) => {
  // Execute the command
  exec(command, (error, stdout, stderr) => {
    if (error) {
      console.error(`Error executing command: ${error.message}`);
      return;
    }

    if (stderr) {
      console.error(`stderr: ${stderr}`);
      return;
    }
    if (stdout) console.log(`${stdout}`);
  });
});

console.log("Finished setting up the repo");
