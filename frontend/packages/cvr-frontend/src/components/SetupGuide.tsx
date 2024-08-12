import React, { useState, useRef } from "react";
import { Container, Col, Accordion } from "react-bootstrap";
import { RxCaretRight, RxCaretDown } from "react-icons/rx";

interface IProps {
  CmsRichText: React.ComponentType<{ path: string; cssName?: string }>;
  contentCssName: string;
  setupGuideKeys: {
    [key: string]: { id: string; title: string }[];
  };
  setupGuideTitles: {
    title: string;
    id: string;
  }[];
}

const SetupGuide = (props: IProps) => {
  const { CmsRichText, contentCssName, setupGuideKeys, setupGuideTitles } =
    props;

  const [activeItem, setActiveItem] = useState<string | undefined | null>("");
  const accordionRef = useRef(null);

  const storeActiveItem = (eventKey: string | undefined) => {
    setActiveItem(eventKey);
    if (eventKey && accordionRef.current) {
      (accordionRef.current as HTMLElement).scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  };

  return (
    <Container className="p-5 d-flex flex-column align-items-center">
      <Col md={11}>
        <div className="setup-guide-content-container pt-5">
          <CmsRichText
            path="cmsContent.setupGuide.text"
            cssName={contentCssName}
          />

          {setupGuideTitles && setupGuideTitles.length > 0 && (
            <>
              {setupGuideTitles.map((headers, index) => {
                const { title, id: headerId } = headers;
                return (
                  <div className="mt-5" key={index}>
                    <h2>{title}</h2>
                    <Accordion
                      activeKey={activeItem}
                      onSelect={(eventKey) =>
                        storeActiveItem(eventKey as string)
                      }
                    >
                      {setupGuideKeys[headerId].map((item) => {
                        const { id: subHeaderId, title: subHeaderTitle } = item;
                        return (
                          <Accordion.Item
                            eventKey={subHeaderId}
                            key={subHeaderId}
                            ref={
                              activeItem === subHeaderId ? accordionRef : null
                            }
                          >
                            <Accordion.Header>
                              <span className="accordion-title">
                                {subHeaderTitle}
                              </span>
                              {activeItem === subHeaderId ? (
                                <RxCaretDown className="ms-1" size={20} />
                              ) : (
                                <RxCaretRight className="ms-1" size={20} />
                              )}
                            </Accordion.Header>
                            <Accordion.Body>
                              <CmsRichText
                                path={`cmsContent.setupGuide.${headerId}.${subHeaderId}`}
                                cssName={contentCssName}
                              />
                            </Accordion.Body>
                          </Accordion.Item>
                        );
                      })}
                    </Accordion>
                  </div>
                );
              })}
            </>
          )}
        </div>
      </Col>
    </Container>
  );
};

export default SetupGuide;
