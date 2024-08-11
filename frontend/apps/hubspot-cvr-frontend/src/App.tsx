import React from "react";
import "./App.scss";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";

import NavBarPage from "./pages/NavBarPage";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/setup" element={<NavBarPage />} />
      </Routes>
    </Router>
  );
}

export default App;
