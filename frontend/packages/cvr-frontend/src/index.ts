import "./styles.scss";
import "bootstrap/dist/css/bootstrap.css";
import "react-checkbox-tree/lib/react-checkbox-tree.css";

import Configurator from "./components/Configurator";
import HbSideBar from "./components/HbSideBar";
import ErrorModal from "./components/ErrorModal";
import SuccessModal from "./components/SuccessModal";
import PricingCards from "./components/PricingCards";
import SearchWindowTable from "./components/SearchWindowTable";
import FinancialDataTable from "./components/FinancialDataTable";
import QueryDropdown from "./components/QueryDropdown";
import QuerySearchMultiSelectDropdown from "./components/QuerySearchMultiSelectDropdown";
import SaveModal from "./components/SaveModal";
import IndustryTypeModal from "./components/IndustryTypeModal";
import Pagination from "./components/Pagination";
import CompanyList from "./components/CompanyList";
import NoSearchResultsFound from "./components/NoSearchResultsFound";
import SetupGuide from "./components/SetupGuide";
import SetupGuideHeader from "./components/SetupGuideHeader";

import cvrMappingSlice, {
  fetchMappings,
  validateProperties,
  fetchAppFields,
  onChangeContactCreation,
  clearDefaultValues,
  storeActiveKey,
} from "./slice/cvrMappingSlice";

import preferenceSlice, {
  setShowErrorModal,
  setShowSuccessModal,
  onHideErrorModal,
  onHideSuccessModal,
  fetchSubscription,
  updateUserIds,
  hideSaveModal,
  showSaveModal,
  setPaginationSearchResults,
  setPaginationSearchInput,
  setBulkFeatureStats,
  setShowBulkFeatureModal,
  setShowProgressBar,
} from "./slice/preferenceSlice";

import searchWindowSlice, {
  fetchFinancialData,
  getCompanies,
  setCompaniesData,
  setSearchInput,
  setGlobalSearch,
  onSelectQueries,
  onSelectSize,
  getCvrProperties,
  getSearchQueryCompanies,
  setShowInfo,
  setShowIndustryTypeModal,
} from "./slice/searchWindowslice";

export {
  cvrMappingSlice,
  fetchMappings,
  Configurator,
  validateProperties,
  fetchAppFields,
  HbSideBar,
  setShowErrorModal,
  setShowSuccessModal,
  onHideErrorModal,
  onHideSuccessModal,
  preferenceSlice,
  ErrorModal,
  SuccessModal,
  fetchSubscription,
  updateUserIds,
  fetchFinancialData,
  getCompanies,
  setCompaniesData,
  setSearchInput,
  searchWindowSlice,
  PricingCards,
  SearchWindowTable,
  FinancialDataTable,
  setGlobalSearch,
  QueryDropdown,
  onSelectQueries,
  onSelectSize,
  QuerySearchMultiSelectDropdown,
  SaveModal,
  showSaveModal,
  hideSaveModal,
  getCvrProperties,
  getSearchQueryCompanies,
  setShowInfo,
  setShowIndustryTypeModal,
  IndustryTypeModal,
  onChangeContactCreation,
  Pagination,
  setPaginationSearchResults,
  setPaginationSearchInput,
  setBulkFeatureStats,
  setShowProgressBar,
  setShowBulkFeatureModal,
  CompanyList,
  clearDefaultValues,
  storeActiveKey,
  NoSearchResultsFound,
  SetupGuide,
  SetupGuideHeader,
};
