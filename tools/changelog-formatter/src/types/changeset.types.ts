export type Changeset = {
  releases: {
    name: string;
    type: string;
  }[];
  summary: string;
  id: string;
  author?: {
    authorName: string;
    authorUrl: string;
  };
};

export type Release = {
  name: string;
  type: string;
  oldVersion: string;
  changesets: string[];
  newVersion: string;
};

export type Changesets = {
  changesets: Changeset[];
  releases: Release[];
};
