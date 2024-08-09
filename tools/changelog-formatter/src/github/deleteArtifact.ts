import axios from "axios";
import { repoOwner, repo } from "../config.js";

export default async (artifactId: string) => {
  if (!process.env.GITHUB_TOKEN) {
    throw new Error("Please add GITHUB_TOKEN environment variable");
  }

  // Fetching artifact information from github
  console.log("Deleting the artifact");
  await axios.delete(
    `https://api.github.com/repos/${repoOwner}/${repo}/actions/artifacts/${artifactId}`,
    {
      headers: {
        Authorization: `Bearer ${process.env.GITHUB_TOKEN}`,
        Accept: "application/vnd.github+json",
        "X-GitHub-Api-Version": "2022-11-28",
      },
    }
  );

  return `Deleted artifact ${artifactId}`;
};
