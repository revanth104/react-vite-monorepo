import { Release, Changeset, Changesets } from "../types/changeset.types.js";
import axios from "axios";
const WEBHOOK = process.env.DISCORD_RELEASE_WEBHOOK;
/**
 * This function creates a formatted message and sends it to Discord
 * @param author - The author object stored in the json file
 * @param summary - Changeset summary as stored in the json file
 * @param releases - The releases array as stored in the json file
 * @returns
 */

const discordMsgLength = 2000;

/**
 * Functions which sends a text message to discord
 * @param message - Message that needs to be sent to discord must be <= discordMsgLength
 */
const callDiscordWebhook = async (message: string) => {
  if (!WEBHOOK)
    throw new Error(
      "Discord release webhook not set, please set the webhook in DISCORD_RELEASE_WEBHOOK environment variable"
    );

  const body = {
    content: message,
  };

  await axios.post(WEBHOOK, body);
};

/**
 * Creates a message which contains all the major , minor and patch changes for a particular package release
 * @param release - The release object from changelog data
 * @param changesets - The changesets for each id mentioned in the release
 * @returns changelog in stringified markdowns
 */
const createMessage = (release: Release, changesets: Changeset[]): string => {
  // Return if no changesets associated to them (This releases had only their dependency updated)
  if (changesets.length === 0) return "";
  const header = `## ${release.name}@${release.newVersion}`;

  let majorText, minorText, patchText;
  majorText = minorText = patchText = "";

  for (const changeset of changesets) {
    const bump = changeset.releases.filter((el) => el.name === release.name)[0]
      .type;

    const summary = `\n[${changeset.author?.authorName}](<${changeset.author?.authorUrl}>)\n${changeset.summary}`;

    // Adds all the major summaries
    if (bump === "major") {
      majorText += majorText ? `${summary}` : `\n### Major Changes${summary}`;
    }
    // Adds all the minor summaries together
    if (bump === "minor") {
      minorText += minorText ? `\n${summary}` : `\n### Minor Changes${summary}`;
    }
    // Add all the patch summaries together
    if (bump === "patch") {
      patchText += patchText ? `\n${summary}` : `\n### Patch Changes${summary}`;
    }
  }

  // Adds all the major , minor and patch summary for a particular package release
  return header + majorText + minorText + patchText;
};

export default async (changesets: Changesets) => {
  const messages: string[] = ["\n"];
  for (const release of changesets.releases) {
    // Get the changesets for the release
    const releaseChangests = changesets.changesets.filter((el) =>
      release.changesets.includes(el.id)
    );
    let message = createMessage(release, releaseChangests);

    // Trim the message if it is too long, changelogs shouldn't be these long
    if (message.length > discordMsgLength)
      message = message.substring(0, discordMsgLength - 3) + "...";

    messages.push(message);
  }

  // Creates batches of messages which will be sent to discord
  const batches: string[] = ["# PM Releases"];
  for (const message of messages) {
    const lastBatchIndex = batches.length - 1;
    // Add the message into existing messages stored in the latest batch
    const joinedMessage = batches[lastBatchIndex] + "\n" + message;
    if (joinedMessage.length > discordMsgLength) {
      /**
       * If after adding the messages the latest batch size exceeds
       * put the message into a new batch
       */
      batches.push(message);
    } else {
      batches[lastBatchIndex] = joinedMessage;
    }
  }

  // Sends the batches to discord
  for (let i = 0; i < batches.length; i++) {
    const message = batches[i];
    console.log(`Pushing batch ${i}, batch size -> ${message.length}`);
    await callDiscordWebhook(message);
  }

  return "Success";
};
