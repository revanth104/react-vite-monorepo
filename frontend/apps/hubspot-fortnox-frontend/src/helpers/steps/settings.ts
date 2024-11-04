import { IGuideSteps } from "./install";

const contactSyncRulesSteps: IGuideSteps[] = [
  {
    element: ".customer-sync-rules-tab",
    popover: {
      title: "Step 1",
      description: "Define company sync rules",
      side: "right",
      align: "center",
    },
  },
  {
    element: ".company-search-parameters",
    popover: {
      title: "Mapping company with customer",
      description: "Define company search parameters",
      side: "top",
      align: "center",
    },
  },
  {
    element: ".contact-search-parameters",
    popover: {
      title: "Locate the customer with contact",
      description: "Define the contact search parameter",
      side: "top",
      align: "center",
    },
  },
  {
    element: ".handling-customer-number",
    popover: {
      title: "Generate the customer number",
      description:
        "Select the method for generating a customer number if not found in the search",
      side: "top",
      align: "center",
    },
  },
  {
    element: ".customer-number-selection-action",
    popover: {
      title: "Store the customer number",
      description:
        "Select a property to store a customer number in HubSpot. You can also select not to store anywhere",
      side: "top",
      align: "center",
    },
  },
  {
    element: ".customer-number-selection-trigger",
    popover: {
      title: "Take the customer number",
      description: "Choose the customer number property for e-conomic.",
      side: "top",
      align: "center",
    },
  },
];

const contactDefaultMappingsSteps: IGuideSteps[] = [
  {
    element: ".customer-default-mappings-tab",
    popover: {
      title: "Default mappings",
      description: "Set the default mappings",
      side: "top",
      align: "center",
    },
  },
  {
    element: ".fortnox-payment-terms",
    popover: {
      title: "Payment Terms",
      description: "Choose the payment terms",
      side: "right",
      align: "center",
    },
  },
  {
    element: ".fortnox-currenies",
    popover: {
      title: "Currencies",
      description: "Choose a currency",
      side: "right",
      align: "center",
    },
  },
  {
    element: ".fortnox-price-list",
    popover: {
      title: "Price List",
      description: "Choose the Price list",
      side: "right",
      align: "center",
    },
  },
  {
    element: ".fortnox-deliver-ways",
    popover: {
      title: "Delivery Ways",
      description: "Choose delivery ways",
      side: "right",
      align: "center",
    },
  },
  {
    element: ".fortnox-delivery-terms",
    popover: {
      title: "Delivery Terms",
      description: "Choose the delivery terms",
      side: "right",
      align: "center",
    },
  },
  {
    element: ".fortnox-vat-type",
    popover: {
      title: "VAT Type",
      description: "Choose the VAT type",
      side: "right",
      align: "center",
    },
  },
  {
    element: ".fortnox-languages",
    popover: {
      title: "Languages",
      description: "Choose a language",
      side: "right",
      align: "center",
    },
  },
];

const productSyncRulesSteps: IGuideSteps[] = [
  {
    element: ".product-sync-rules-tab",
    popover: {
      title: "Step 2",
      description: "Define product sync rules",
      side: "right",
      align: "center",
    },
  },
  {
    element: ".product-search-parameters",
    popover: {
      title: "Locate products",
      description: "Locate products through matching unique fields",
      side: "right",
      align: "center",
    },
  },
  {
    element: ".custom-product-mapping",
    popover: {
      title: "Link products directly",
      description: "Or link them directly",
      side: "right",
      align: "center",
    },
  },
  {
    element: ".do-not-generate-invoice",
    popover: {
      title: "Do not generate an invoice",
      description: "Choose this when you don’t want to generate invoices",
      side: "right",
      align: "center",
    },
  },
  {
    element: ".use-default-product",
    popover: {
      title: "Use the default product",
      description: "Take the product number from a default product",
      side: "right",
      align: "center",
    },
  },
  {
    element: ".find-create-product",
    popover: {
      title: "Create a new product",
      description: "Create new products if not found in search",
      side: "right",
      align: "center",
    },
  },
  {
    element: ".sync-deal-without-products",
    popover: {
      title: "Deals without products",
      description:
        "Choose this option when you want to sync deals without products in it",
      side: "top",
      align: "center",
    },
  },
];

const invoiceSyncRulesSteps: IGuideSteps[] = [
  {
    element: ".invoice-sync-rules-tab",
    popover: {
      title: "Step 1",
      description: "Control how you would like to generate invoices",
      side: "right",
      align: "center",
    },
  },
  {
    element: ".generic-pipeline",
    popover: {
      title: "Adding a pipeline",
      description: "Choose your Pipeline",
      side: "right",
      align: "center",
    },
  },
  {
    element: ".generic-deal-stage",
    popover: {
      title: "Define deal stage",
      description: "Select a deal stage",
      side: "right",
      align: "center",
    },
  },
  {
    element: ".generic-generate",
    popover: {
      title: "Define invoice/order",
      description: "Whether it’s an invoice or an order",
      side: "right",
      align: "center",
    },
  },
  {
    element: ".save-changes-button",
    popover: {
      title: "Adding pipeline",
      description: "Click here to add a Pipeline.",
      side: "right",
      align: "center",
    },
  },
  {
    element: ".clear-data-btn",
    popover: {
      title: "Clearing data",
      description:
        "Use this option to clear any current selections and start afresh",
      side: "right",
      align: "center",
    },
  },
  {
    element: ".attach-pdf-section",
    popover: {
      title: "Attach PDF",
      description: "Attach PDF to invoices/orders",
      side: "top",
      align: "center",
    },
  },
];

export {
  contactSyncRulesSteps,
  contactDefaultMappingsSteps,
  productSyncRulesSteps,
  invoiceSyncRulesSteps,
};
