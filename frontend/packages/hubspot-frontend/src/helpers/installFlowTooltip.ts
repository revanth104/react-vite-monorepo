import { IGeneralFieldsSavingStructure } from "@cloudify/generic/src/types/contactTypes";
import {
  IMappingItem,
  IAccordionMappingItem,
} from "@cloudify/generic/src/types/mappingTypes";

type TInstallFlowTooltipProps = {
  page: string;
  preferenceForProducts: string;
  productPreference: IGeneralFieldsSavingStructure | undefined;
  actionAppName: string;
  productGroupPreference: IGeneralFieldsSavingStructure | undefined;
  preferenceForSearchParameters: string;
  checkProductMappingsCount: ({
    productMappings,
  }: {
    productMappings: IMappingItem[] | IAccordionMappingItem;
  }) => number;
  productMappings: IMappingItem[] | IAccordionMappingItem;
  dealsSyncCheckbox: boolean;
  dealSyncProductPreference: IGeneralFieldsSavingStructure | undefined;
};

const installFlowTooltip = (props: TInstallFlowTooltipProps) => {
  const {
    page,
    preferenceForProducts,
    productPreference,
    actionAppName,
    productGroupPreference,
    preferenceForSearchParameters,
    checkProductMappingsCount,
    productMappings,
    dealsSyncCheckbox,
    dealSyncProductPreference,
  } = props;
  let tooltip = "";
  if (page === "productSyncRules") {
    if (preferenceForProducts === "select product" && !productPreference) {
      tooltip =
        "Please select the default product for using it as default product";
    } else if (
      preferenceForSearchParameters === "set custom mappings" &&
      checkProductMappingsCount({ productMappings }) === 0
    ) {
      tooltip = "Please select at least one product mapping";
    } else if (
      actionAppName === "e-conomic" &&
      preferenceForProducts === "find create product" &&
      !productGroupPreference
    ) {
      tooltip = "Please select the product group";
    } else if (dealsSyncCheckbox && !dealSyncProductPreference) {
      tooltip = "Please select the product.";
    }
  }

  return tooltip;
};

export default installFlowTooltip;
