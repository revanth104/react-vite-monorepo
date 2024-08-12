import React, { useEffect } from "react";
import { useSearchParams } from "react-router-dom";

function Redirect() {
  const [searchParams] = useSearchParams();

  useEffect(() => {
    const paymentStatus = searchParams.get("paymentStatus");
    if (paymentStatus) {
      console.log(paymentStatus);
      window.opener.postMessage({ paymentStatus }, "*");
      window.close();
    }
  }, []);

  return <div></div>;
}

export default Redirect;
