/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect } from "react";
import { Spinner, Navbar, Container } from "react-bootstrap";

import { useDispatch, useSelector } from "react-redux";
import { useSearchParams } from "react-router-dom";
import { CmsEditAndSave } from "./CmsEditAndSave.js";
import { CmsRichText } from "./CmsRichText.js";
import { fetchCmsData, onChangeIsUserAllowed } from "../slice/cmsSlice.js";

import { ICmsData } from "../types/cmsTypes";

interface IProps {
  setShowSuccessModal: any;
  setShowErrorModal: any;
}

const Notifications = (props: IProps) => {
  const { setShowSuccessModal, setShowErrorModal } = props;

  const dispatch = useDispatch();
  const [searchParams] = useSearchParams();

  const appSlug = searchParams.get("appSlug") as string;

  const cmsState = useSelector((state: { cms: ICmsData }) => state.cms);

  const {
    cmsData: { loading: cmsLoading },
  } = cmsState;

  const { notifications } = cmsState?.cmsData?.data?.cmsContent || {};

  const { allowedUsers } = cmsState;
  useEffect(() => {
    dispatch(fetchCmsData() as any);
  }, []);

  useEffect(() => {
    const userId = searchParams.get("userId");
    if (allowedUsers.length > 0) {
      dispatch(onChangeIsUserAllowed({ userId }));
    }
  }, [allowedUsers]);

  const renderSuccessAndFailedNotifications = (
    message: any,
    key: string,
    notificationKey: string
  ) => {
    const notificationKeys = Object.keys(message);
    const notificationMessages = notificationKeys.map((notification, index) => {
      const description = message[notification].description;
      const messagePath = `cmsContent.notifications.${key}.${notificationKey}.${notification}.message`;

      return (
        <div key={index}>
          {description && (
            <h4 className="cms-notification-sub-heading mt-4 mb-0">
              {description}
            </h4>
          )}
          <CmsRichText path={messagePath} cssName="" />
        </div>
      );
    });

    return notificationMessages;
  };

  const renderNotifications = (
    notificationContent: any,
    key: string,
    notificationKey: string
  ) => {
    const content = notificationContent[notificationKey];
    if (content) {
      return renderSuccessAndFailedNotifications(content, key, notificationKey);
    }
    return null;
  };

  const renderBlocks = () => {
    if (notifications && Object.keys(notifications).length > 0) {
      const notificationBlocks = Object.keys(notifications).map(
        (key, index) => (
          <div
            className="pms-dialog-box p-4 mb-4"
            key={index}
            style={{ border: "3px solid #e4e6e9" }}
          >
            {notifications[key].heading && (
              <h4 className="cms-notification-heading">
                {notifications[key].heading}
              </h4>
            )}
            {renderNotifications(notifications[key], key, "successContent")}
            {renderNotifications(notifications[key], key, "failContent")}
          </div>
        )
      );

      return notificationBlocks;
    }
    return null;
  };

  return (
    <div>
      <Navbar className="navbar-bg" fixed="top">
        <Container className="py-3 d-flex justify-content-center">
          <div className="text-center">
            <strong>Edit notifications in cms</strong>
          </div>
        </Container>
      </Navbar>
      {cmsLoading ? (
        <div className="d-flex flex-row justify-content-center align-items-center">
          <div className="d-flex flex-column justify-content-center align-items-center">
            <div className="d-flex flex-row justify-content-center align-items-center">
              <Spinner animation="border" variant="success" role="status">
                <span className="visually-hidden">Loading...</span>
              </Spinner>
            </div>
          </div>
        </div>
      ) : (
        <>
          <div
            className="d-flex flex-row justify-content-center"
            style={{ paddingTop: "120px" }}
          >
            <CmsEditAndSave
              appSlug={appSlug}
              setShowErrorModal={setShowErrorModal}
              setShowSuccessModal={setShowSuccessModal}
            />
          </div>
          <div className="d-flex flex-column align-items-center mt-4 pb-5">
            {renderBlocks()}
          </div>
        </>
      )}
    </div>
  );
};

export default Notifications;
