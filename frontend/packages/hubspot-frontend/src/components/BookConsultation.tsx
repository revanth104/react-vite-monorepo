import React from "react";
import { Button } from "react-bootstrap";

interface IBookConsultationProps {
  CmsRichText: React.ComponentType<{ path: string; cssName?: string }>;
}

const BookConsultation = (props: IBookConsultationProps) => {
  const { CmsRichText } = props;
  return (
    <>
      <CmsRichText
        path="cmsContent.authenticationPage.rightSideContent"
        cssName="hubspot"
      />
      <Button
        href="https://meetings.hubspot.com/cloudify/app-assistance"
        className="w-100 book-consultation-btn"
        target="_blank"
        rel="noreferrer"
      >
        Get Guided Installation
      </Button>
    </>
  );
};

export default BookConsultation;
