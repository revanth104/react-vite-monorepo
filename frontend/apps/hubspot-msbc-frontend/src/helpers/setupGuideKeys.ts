type SetupGuideKeys = {
  [key: string]: { id: string; title: string }[];
};

export const setupGuideTitles: { id: string; title: string }[] = [
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
      id: "connectingAccount",
      title: "Connecting Microsoft Business Central account",
    },
    {
      id: "companyAndEnvironment",
      title: "Select Company & Environment",
    },
    {
      id: "chooseSubscriptionPlan",
      title: "Choose Your Subscription Plan",
    },
    {
      id: "installFlowInvoiceSyncRules",
      title: "Create Invoice/Order Sync Rules",
    },
    {
      id: "customerSearchRules",
      title: "Customer Search Rules",
    },
    {
      id: "installFlowProductSyncRules",
      title: "Product Sync Rules",
    },
  ],
  postInstallation: [
    {
      id: "settingsAfterInstallation",
      title: "How to Change the App Settings After Installation",
    },
    {
      id: "customerSyncRules",
      title: "Customer Sync Rules",
    },
    {
      id: "customerDefaultMappings",
      title: "Customer Default Mappings",
    },
    {
      id: "companyFieldMappings",
      title: "Company Field Mappings",
    },
    {
      id: "contactFieldMappings",
      title: "Contact Field Mappings",
    },
    {
      id: "productSyncRules",
      title: "Product Sync Rules",
    },
    {
      id: "productFieldMappings",
      title: "Product Field Mappings",
    },
    {
      id: "invoiceSyncRules",
      title: "Invoice/Order Sync Rules",
    },
    {
      id: "invoiceFieldMappings",
      title: "Invoice/Order Field Mappings",
    },
  ],
};
