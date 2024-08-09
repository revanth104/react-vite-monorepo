/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useMemo, useRef } from "react";
import axios from "axios";
import Editor from "./Editor.js";
import Quill from "quill";
import { useSelector, useDispatch } from "react-redux";
import { onChangeCmsData } from "../slice/cmsSlice.js";
import { ICmsData } from "../types/cmsTypes";

interface IProps {
  path: string;
  cssName?: string;
}

const Cms = (props: IProps) => {
  const { path, cssName } = props;
  const quillRef = useRef<Quill | null>(null);
  const dispatch = useDispatch();
  const {
    cmsData: {
      data: { cmsContent },
    },
    isEdit,
  } = useSelector((state: { cms: ICmsData }) => state.cms);

  const imageUpload = async (formData: any) => {
    try {
      const url = `${import.meta.env.VITE_STRAPI_BASE_URL}/api/upload`;
      const token = import.meta.env.VITE_CMS_TOKEN;
      const headers = { Authorization: `Bearer ${token}` };
      const { data } = await axios.post(url, formData, { headers });
      return data;
    } catch (error: any) {
      let errorMessage;
      if (error.response && error.response.data.message)
        errorMessage = error.response.data.message;
      else errorMessage = error.message;
      return errorMessage;
    }
  };

  const imageHandler = () => {
    const editor = quillRef.current;
    const input = document.createElement("input");
    input.setAttribute("type", "file");
    input.setAttribute("accept", "image/*");
    input.click();

    input.onchange = async () => {
      const file = input.files && input.files[0];
      if (file) {
        if (/^image\//.test(file.type)) {
          const formData = new FormData();
          formData.append("files", file);
          const res = await imageUpload(formData);
          const url = `${import.meta.env.VITE_STRAPI_BASE_URL}${res[0]?.url}`;
          console.log(url);
          const selection = editor?.getSelection();
          if (selection) {
            editor?.insertEmbed(selection.index, "image", url);
          }
        } else {
          console.log("Image upload failed");
        }
      }
    };
  };

  const modules = useMemo(
    () => ({
      toolbar: {
        container: [
          [{ header: [1, 2, 3, 4, 5, 6, false] }],
          [{ font: [] }],
          [{ size: [] }],
          ["bold", "italic", "underline", "strike", "blockquote"],
          [
            { list: "ordered" },
            { list: "bullet" },
            { indent: "-1" },
            { indent: "+1" },
          ],
          ["link", "image", "video"],
          [{ align: [] }],
        ],
        handlers: {
          image: imageHandler,
        },
      },
    }),
    []
  );

  const showRichText = (path: string) => {
    let pathName = path;
    pathName = cmsContent && eval(path);
    return (
      <div className="my-4">
        <Editor
          theme="snow"
          ref={quillRef}
          defaultValue={pathName}
          onChange={(editedValue) =>
            dispatch(onChangeCmsData({ path, editedValue }))
          }
          modules={modules}
        />
      </div>
    );
  };

  const showText = (path: string, cssName: string | undefined) => {
    let pathName = path;
    pathName = cmsContent && eval(path);
    return (
      <div
        dangerouslySetInnerHTML={{ __html: pathName }}
        className={`${cssName ? cssName : ""} cms-content`}
      />
    );
  };

  return <>{isEdit ? showRichText(path) : showText(path, cssName)}</>;
};

export default Cms;
