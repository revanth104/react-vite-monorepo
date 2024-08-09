# @cloudifybiz/changelog-formatter

## 1.2.2

### Patch Changes

#### [krishnavcloudify99](https://github.com/krishnavcloudify99) [`11198ec`](https://github.com/cloudifybiz/pm-apps/commit/11198ec5cd28581cbf7fc2af5b70add0974ea5a7)

- Not adding releases in discord message whose only dependencies have updated.

## 1.2.1

### Patch Changes

#### [krishnavcloudify99](https://github.com/krishnavcloudify99) [`3c9b8e3`](https://github.com/cloudifybiz/pm-apps/commit/3c9b8e3a2d54f036250c8b6c76fb5924ea1f900e)

- Removed embedding for discord author

## 1.2.0

### Minor Changes

#### [krishnavcloudify99](https://github.com/krishnavcloudify99) [`df3a5ce`](https://github.com/cloudifybiz/pm-apps/commit/df3a5ce32efb1451a9edd23986050dacc2ba5ac6)

- **Adds git owner**: changeset version commands creates a file containing info about GitHub author on each changeset.
- **Update changeset output**: Updates the changeset output file and add git owners from the git owner file in each changeset.
- **Format discord message**: Formats discord messages from changeset file and creates batches of messages to post to discord.
- **Sends to discord**: Creates messages from changeset output and sends them to discord.
- **Artifact support**: Functionality to fetch and delete GitHub artifact.

## 1.1.0

### Minor Changes

#### [krishnavcloudify99](https://github.com/krishnavcloudify99) [`b1e7ace`](https://github.com/cloudifybiz/pm-apps/commit/b1e7aceab57a18a3679db5d0dbbf42b7da11450f)

- **Create logs for discord**: Create properly formatted logs for each changed package to be posted to discord.

## 1.0.0

### Major Changes

#### [krishnavcloudify99](https://github.com/krishnavcloudify99) [`d5c1749`](https://github.com/cloudifybiz/pm-apps/commit/d5c1749bafe959969d392675998dda37001bda86)

Custom changelog formatter for [changesets](https://github.com/changesets/changesets)

- Adds github user and commit hash link to the changelog summary
