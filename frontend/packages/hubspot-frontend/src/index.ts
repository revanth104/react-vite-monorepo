import "./styles.scss";
import "bootstrap/dist/css/bootstrap.css";

import HbButton from "./components/HbButton";
import HbNavbar from "./components/HbNavbar";
import HbIntroPage from "./components/HbIntroPage";
import Connection from "./components/Connection";
import ConnectedAccount from "./components/ConnectedAccount";
import AddPipelines from "./components/AddPipelines";
import HorizontalProgressBar from "./components/HorizontalProgressbar";
import HbSideBar from "./components/HbSideBar";
import TextWithTooltip from "./components/TextWithTooltip";
import Loading from "./components/Loading";
import SuccessModal from "./components/SuccessModal";
import ErrorModal from "./components/ErrorModal";
import InstallFlowSyncRules from "./components/InstallFlowSyncRules";
import FinancialIframe from "./components/FinancialIframe";
import BookConsultation from "./components/BookConsultation";
import ReInstallAlert from "./components/ReInstallAlert";

import hubspotSlice, {
  fetchHubSpotFields,
  updateHubspotUserIds,
  onChangeCurrentWindow,
  onChangeProgress,
} from "./slice/hubspotSlice";

export {
  HbButton,
  HbNavbar,
  HbIntroPage,
  Connection,
  ConnectedAccount,
  AddPipelines,
  HorizontalProgressBar,
  HbSideBar,
  TextWithTooltip,
  Loading,
  SuccessModal,
  ErrorModal,
  InstallFlowSyncRules,
  FinancialIframe,
  BookConsultation,
  ReInstallAlert,
  // Slices
  hubspotSlice,
  // Functions
  fetchHubSpotFields,
  updateHubspotUserIds,
  onChangeCurrentWindow,
  onChangeProgress,
};
