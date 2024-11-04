import React from "react";
import "./App.scss";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Settings from "./pages/Settings";
import SetupGuidePage from "./pages/SetupGuidePage";
import Redirect from "./pages/Redirect";
import RetriggerPage from "./pages/RetriggerPage";
import Subscription from "./pages/Subscription";
import Setup from "./pages/Setup";
import Connect from "./pages/Connect";
import EnvironmentSelection from "./pages/EnvironmentSelection";
import FinancialDataIframe from "./pages/FinancialDataIframe";
import { SuccessModal, ErrorModal } from "@cloudify/hubspot-frontend";
import {
  onHideErrorModal,
  onHideSuccessModal,
  setShowErrorModal,
  setShowSuccessModal,
  BillingForm,
  StripeProvider,
} from "@cloudify/generic";
import { CmsRichText, Notifications } from "@cloudify/cms";
function App() {
  return (
    <Router>
      <SuccessModal
        CmsRichText={CmsRichText}
        onHideSuccessModal={onHideSuccessModal}
      />
      <ErrorModal
        CmsRichText={CmsRichText}
        onHideErrorModal={onHideErrorModal}
      />
      <Routes>
        <Route path="/setup" element={<Setup />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="/setupguide" element={<SetupGuidePage />} />
        <Route path="/redirect" element={<Redirect />} />
        <Route path="/logs" element={<RetriggerPage />} />
        <Route path="/subscription" element={<Subscription />} />
        <Route path="/connect" element={<Connect />} />
        <Route path="/environment" element={<EnvironmentSelection />} />
        <Route path="/financial" element={<FinancialDataIframe />} />
        <Route
          path="/billing-form"
          element={
            <StripeProvider>
              <BillingForm />
            </StripeProvider>
          }
        />
        <Route
          path="/cms-notifications"
          element={
            <Notifications
              setShowErrorModal={setShowErrorModal}
              setShowSuccessModal={setShowSuccessModal}
            />
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
