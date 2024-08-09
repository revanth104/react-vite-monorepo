import axios from "axios";
import * as fs from "fs/promises";
import extract from "extract-zip";

import {
  repoOwner,
  repo,
  artifactPath,
  artifactDir,
  artifactName,
} from "../config";

export default async () => {
  if (!process.env.GITHUB_TOKEN) {
    throw new Error("Please add GITHUB_TOKEN environment variable");
  }

  // Fetching artifact information from github
  console.log("Fetching the artifact");
  const { data: artifact } = await axios.get(
    `https://api.github.com/repos/${repoOwner}/${repo}/actions/artifacts?name=${artifactName}`,
    {
      headers: {
        Authorization: `Bearer ${process.env.GITHUB_TOKEN}`,
        Accept: "application/vnd.github+json",
        "X-GitHub-Api-Version": "2022-11-28",
      },
    }
  );

  if (artifact.artifacts.length === 0) {
    console.log("\x1b[31m%s\x1b[0m", "No artifact found");
    throw new Error(`Artifact not found with the name ${artifactName}`, {
      cause: 404,
    });
  }

  // Downloading article file from github
  console.log("Downloading the artifact...");
  const downloadUrl: string = artifact.artifacts[0].archive_download_url;

  const { data: artifactZip } = await axios.get(downloadUrl, {
    responseType: "arraybuffer",
    responseEncoding: "binary",
    headers: {
      Authorization: `Bearer ${process.env.GITHUB_TOKEN}`,
      Accept: "application/vnd.github+json",
      "X-GitHub-Api-Version": "2022-11-28",
    },
  });

  // Storing artifact zip file
  console.log(`Storing the artifact in ${artifactPath}`);
  await fs.writeFile(`${artifactPath}`, artifactZip);

  // Extracting artifact zip file
  console.log(`Extracting the artifact in ${artifactDir}`);
  await extract(`${artifactPath}`, { dir: artifactDir });

  return artifact.artifacts[0];
};
