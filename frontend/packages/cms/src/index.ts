import "./styles.scss";
import "quill/dist/quill.snow.css";

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
