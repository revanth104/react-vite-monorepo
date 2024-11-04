import React, { useEffect } from "react";
import { useSelector } from "react-redux";

import { Loading } from "@cloudify/hubspot-frontend";
import { Confirmation } from "@cloudify/generic";
import { CmsRichText } from "@cloudify/cms";

import { ICmsData } from "@cloudify/cms/src/types/cmsTypes";

const ConformationPage = () => {
  const {
    cmsData: { loading: cmsLoading },
  } = useSelector((state: { cms: ICmsData }) => state.cms);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <>
      {cmsLoading ? (
        <Loading />
      ) : (
        <Confirmation
          CmsRichText={CmsRichText}
          contentCssName="hubspot"
          cssName="confirmation-page"
        />
      )}
    </>
  );
};

export default ConformationPage;
