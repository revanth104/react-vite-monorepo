export interface IGuideSteps {
  element: string;
  popover: {
    title: string;
    description: string;
    side?: string;
    align?: string;
  };
}

const introSteps: IGuideSteps[] = [
  {
    element: ".intro-card-button",
    popover: {
      title: "Start",
      description: "Click on start to begin",
      side: "top",
      align: "center",
    },
  },
];

const connectSteps: IGuideSteps[] = [
  {
    element: ".fortnox-connect-button",
    popover: {
      title: "Connect to Fortnox",
      description: "Click here to connect Fortnox account",
      side: "top",
      align: "center",
    },
  },
];

const invoiceSyncRules: IGuideSteps[] = [
  {
    element: ".invoice-sync-rules",
    popover: {
      title: "Step 1",
      description: "Configure invoice and order creation",
      side: "top",
      align: "center",
    },
  },
  {
    element: ".hubspot-pipeline-dropdown .setup-dropdown",
    popover: {
      title: "Define pipeline",
      description: "Choose your Pipeline",
      side: "right",
      align: "center",
    },
  },
  {
    element: ".hubspot-dealstage-dropdown .setup-dropdown",
    popover: {
      title: "Define deal stage",
      description: "Select a deal stage",
      side: "right",
      align: "center",
    },
  },
  {
    element: ".hubspot-generate-dropdown .setup-dropdown",
    popover: {
      title: "Define invoice/order",
      description: "Whether it's an order/invoice",
      side: "right",
      align: "center",
    },
  },
  {
    element: ".save-changes-button",
    popover: {
      title: "Adding a pipeline",
      description: "Click here to add a Pipeline.",
      side: "top",
      align: "center",
    },
  },
  {
    element: ".clear-data-btn",
    popover: {
      title: "Clearing data",
      description:
        "Use this option to clear any current selections and start afresh",
      side: "top",
      align: "center",
    },
  },
];

const contactSyncSteps: IGuideSteps[] = [
  {
    element: ".customer-preferences",
    popover: {
      title: "Step 2",
      description: "Set customer search preferences",
      side: "top",
      align: "center",
    },
  },
  {
    element: ".hs-fortnox-company-search-parameters",
    popover: {
      title: "Mapping company with customer",
      description: "Locate customers through matching unique fields",
      side: "top",
      align: "center",
    },
  },
  {
    element: ".hs-fortnox-contact-checkbox",
    popover: {
      title: "Locating customers with contact",
      description:
        "Use this option to add a contact as a customer in Fortnox when company is not present in the deal",
      side: "top",
      align: "center",
    },
  },
  {
    element: ".hs-fortnox-contact-search-parameters",
    popover: {
      title: "Map contact as a customer in Fortnox.",
      description: "Map contact as a customer in Fortnox",
      side: "top",
      align: "center",
    },
  },
];

const productSyncNormalSteps: IGuideSteps[] = [
  {
    element: ".product-sync-rules",
    popover: {
      title: "Step 3",
      description: "Set product sync rules",
      side: "top",
      align: "center",
    },
  },
  {
    element: ".hs-fortnox-product-search-parameters",
    popover: {
      title: "Map product field",
      description: "Locate products through matching unique fields",
      side: "top",
      align: "center",
    },
  },
  {
    element: ".hs-fortnox-custom-product-mapping",
    popover: {
      title: "Direct linking",
      description: "Or link them directly.",
      side: "top",
      align: "center",
    },
  },
  {
    element: ".hs-fortnox-deal-without-products",
    popover: {
      title: "Deals without products",
      description:
        "Choose this option when you want to sync deals without products.",
      side: "top",
      align: "center",
    },
  },
];

const productSyncAdvancedSteps: IGuideSteps[] = [
  {
    element: ".hs-fortnox-do-not-generate-invoice",
    popover: {
      title: "Skip invoice creation",
      description: "Choose this when you don’t want to generate an invoice",
      side: "top",
      align: "center",
    },
  },
  {
    element: ".hs-fortnox-use-default-product",
    popover: {
      title: "Use default product",
      description: "Take the product number from a default product.",
      side: "top",
      align: "center",
    },
  },
  {
    element: ".hs-fortnox-find-create-product",
    popover: {
      title: "Create a new product",
      description: "Create new products if not found in search",
      side: "top",
      align: "center",
    },
  },
];

export {
  introSteps,
  connectSteps,
  invoiceSyncRules,
  contactSyncSteps,
  productSyncNormalSteps,
  productSyncAdvancedSteps,
};
