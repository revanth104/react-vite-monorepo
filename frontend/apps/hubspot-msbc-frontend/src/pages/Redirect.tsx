import React, { useEffect } from "react";
import { useSearchParams } from "react-router-dom";

const Redirect = () => {
  const [searchParams] = useSearchParams();
  useEffect(() => {
    const paymentStatus = searchParams.get("paymentStatus");
    const plan = searchParams.get("plan");

    if (paymentStatus && plan) {
      window.opener.postMessage({ paymentStatus, plan }, "*");
      window.close();
    }
  }, []);
  return <div></div>;
};

export default Redirect;
