import React from "react";
import "./App.scss";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";

import NavBarPage from "./pages/NavBarPage";
import MappingWindow from "./pages/MappingWindow";
import Subscription from "./pages/Subscription";
import BulkUpdate from "./pages/BulkUpdate";
import SearchWindow from "./pages/SearchWindow";
import Redirect from "./pages/Redirect";
import QuerySearchWindow from "./pages/QuerySearchWindow";
import SetupGuidePage from "./pages/SetupGuidePage";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/setup" element={<NavBarPage />} />
        <Route path="/mappings" element={<MappingWindow />} />
        <Route path="/subscription" element={<Subscription />} />
        <Route path="/bulkupdate" element={<BulkUpdate />} />
        <Route path="/searchwindow" element={<SearchWindow />} />
        <Route path="/global-search" element={<SearchWindow />} />
        <Route path="query-search" element={<QuerySearchWindow />} />
        <Route path="/redirect" element={<Redirect />} />
        <Route path="/setupguide" element={<SetupGuidePage />} />
      </Routes>
    </Router>
  );
}

export default App;
