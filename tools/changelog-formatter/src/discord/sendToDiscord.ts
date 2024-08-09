#!/usr/bin/env node
import downloadArtifact from "../github/downloadArtifact";
import deleteArtifact from "../github/deleteArtifact";
import { Changesets } from "../types/changeset.types.js";
import sendMessage from "./sendMessage";
import { readFile } from "fs/promises";
import { artifactPath } from "../config";

const main = async () => {
  const artifact = await downloadArtifact();
  const data = await readFile(artifactPath, "utf8");
  const fileData: Changesets = JSON.parse(data);
  await sendMessage(fileData);
  const msg = await deleteArtifact(artifact.id);
  console.log(msg);
};

main();
