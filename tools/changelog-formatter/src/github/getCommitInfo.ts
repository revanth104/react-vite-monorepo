import axios from "axios";
import { repoOwner, repo } from "../config.js";

export default async function (
  commitSha: string
): Promise<{ authorName: string; authorUrl: string; commitUrl: string }> {
  if (!process.env.GITHUB_TOKEN) {
    throw new Error("Please add GITHUB_TOKEN environment variable");
  }

  const response = await axios.get(
    `https://api.github.com/repos/${repoOwner}/${repo}/commits/${commitSha}`,
    {
      headers: {
        Authorization: `Bearer ${process.env.GITHUB_TOKEN}`,
        Accept: "application/vnd.github+json",
        "X-GitHub-Api-Version": "2022-11-28",
      },
    }
  );

  const authorName = response.data.commit.author.name;
  const authorUrl = response.data.author.html_url;
  const commitUrl = response.data.html_url;

  return {
    authorName,
    authorUrl,
    commitUrl,
  };
}
