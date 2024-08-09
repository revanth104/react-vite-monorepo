import React, { useEffect } from "react";
import "./App.scss";

import { useDispatch } from "react-redux";
import { fetchCmsData } from "@cloudify/cms";
import { NoSearchResultsFound } from "@cloudify/cvr-frontend";

function App() {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchCmsData());
  }, []);
  return (
    <>
      <NoSearchResultsFound />
    </>
  );
}

export default App;
