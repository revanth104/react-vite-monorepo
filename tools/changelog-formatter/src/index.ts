import {
  NewChangesetWithCommit,
  ChangelogFunctions,
  ModCompWithPackage,
} from "@changesets/types";

import getcommitInfo from "./github/getCommitInfo.js";
import createGitOwnerFile from "./discord/createGitOwnerFile.js";

const getReleaseLine = async (changeset: NewChangesetWithCommit) => {
  const commit = changeset.commit;

  if (!commit) return changeset.summary;
  const shortCommit = commit.slice(0, 7);

  const { authorName, authorUrl, commitUrl } = await getcommitInfo(commit);

  /* eslint no-useless-concat: "off" */
  const header =
    `#### [${authorName}](${authorUrl})` +
    " " +
    `[\`${shortCommit}\`](${commitUrl}) \n`;

  await createGitOwnerFile({ authorName, authorUrl }, changeset);

  return header + "   " + changeset.summary;
};

const getDependencyReleaseLine = async (
  changesets: NewChangesetWithCommit[],
  dependenciesUpdated: ModCompWithPackage[]
) => {
  if (dependenciesUpdated.length === 0) return "";

  const changesetLinks = changesets.map(
    (changeset) =>
      `- Updated dependencies${
        changeset.commit ? ` [${changeset.commit.slice(0, 7)}]` : ""
      }`
  );

  const updatedDependenciesList = dependenciesUpdated.map(
    (dependency) => `  - ${dependency.name}@${dependency.newVersion}`
  );

  return [...changesetLinks, ...updatedDependenciesList].join("\n");
};

const sendToDiscord = () => {
  return "Sending to Discord";
};

const defaultChangelogFunctions: ChangelogFunctions & {
  sendToDiscord: () => string;
} = {
  getReleaseLine,
  getDependencyReleaseLine,
  sendToDiscord,
};

export default defaultChangelogFunctions;
