import React from "react";
import Cms from "./Cms.js";

interface IProps {
  path: string;
  cssName?: string;
}

export const CmsRichText = (props: IProps) => {
  const { path, cssName } = props;
  return <Cms path={path} cssName={cssName} />;
};
