import "./styles.scss";

import { CmsEditAndSave } from "./components/CmsEditAndSave";
import { CmsRichText } from "./components/CmsRichText";
import Notifications from "./components/Notifications";
import cmsSlice, {
  fetchCmsData,
  onChangeIsUserAllowed,
} from "./slice/cmsSlice";

export {
  cmsSlice,
  fetchCmsData,
  onChangeIsUserAllowed,
  CmsEditAndSave,
  CmsRichText,
  Notifications,
};
