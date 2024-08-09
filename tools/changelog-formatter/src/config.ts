/**
 * Contains default configuration for the module
 */
import path from "path";

// Name of the github account
export const repoOwner = "cloudifybiz";
// Name of github repository
export const repo = "pm-apps";

// ArtifactName of the artifact set in github action
export const artifactName =
  process.env.ARTIFACT_FILE_NAME ?? "changesetOutput.json";

// Artifact download directory relative to the lib(build) folder
export const artifactDir = path.resolve(__dirname, "../../../.changeset");
export const artifactPath = `${artifactDir}/${artifactName}`;
