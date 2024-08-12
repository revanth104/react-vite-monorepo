type SetupGuideKeys = {
  [key: string]: { id: string; title: string }[];
};

export const setupGuideTitles = [
  {
    id: "installationProcess",
    title: "Installation Process",
  },
  {
    id: "postInstallation",
    title: "Post-Installation",
  },
];

export const setupGuideKeys: SetupGuideKeys = {
  installationProcess: [
    {
      id: "installTheApp",
      title: "How to Install the App",
    },
    {
      id: "mappingWindow",
      title: "Mapping Window",
    },
    {
      id: "chooseSubscriptionPlan",
      title: "Choose Your Subscription Plan",
    },
    {
      id: "confirmation",
      title: "Confirmation page",
    },
  ],
  postInstallation: [
    {
      id: "settingsAfterInstallation",
      title: "How to Change the App Settings After Installation",
    },
    {
      id: "bulkUpdate",
      title: "Bulk update",
    },
    {
      id: "crmCard",
      title: "Crm Card",
    },
    {
      id: "globalSearch",
      title: "Global search",
    },
    {
      id: "querySearch",
      title: "Query Search",
    },
  ],
};
