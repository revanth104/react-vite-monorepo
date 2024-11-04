import React from "react";
import "./App.scss";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";

import Setup from "./pages/Setup";
import Settings from "./pages/Settings";
import SetupGuidePage from "./pages/SetupGuidePage";
import Subscription from "./pages/Subscription";
import Redirect from "./pages/Redirect";
import RetriggerPage from "./pages/RetriggerPage";
import Connect from "./pages/Connect";
import FinancialDataIframe from "./pages/FinancialDataIframe";
import { SuccessModal, ErrorModal } from "@cloudify/hubspot-frontend";
import { CmsRichText } from "@cloudify/cms";
import {
  onHideSuccessModal,
  onHideErrorModal,
  setShowErrorModal,
  setShowSuccessModal,
  BillingForm,
  StripeProvider,
} from "@cloudify/generic";
import { Notifications } from "@cloudify/cms";

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
        <Route path="/subscription" element={<Subscription />} />
        <Route path="/redirect" element={<Redirect />} />
        <Route path="/logs" element={<RetriggerPage />} />
        <Route path="/connect" element={<Connect />} />
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
