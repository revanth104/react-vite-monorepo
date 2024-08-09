import React, {
  forwardRef,
  useEffect,
  useRef,
  useImperativeHandle,
} from "react";
import Quill from "quill";

interface EditorProps {
  defaultValue?: string;
  onChange?: (value: string) => void;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  modules: any;
  theme: string;
}

const Editor = forwardRef<Quill, EditorProps>(
  ({ defaultValue, onChange, modules, theme }, ref) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const quillRef = useRef<Quill | null>(null);
    const defaultValueRef = useRef(defaultValue);
    const onTextChangeRef = useRef(onChange);

    useImperativeHandle(ref, () => quillRef.current as Quill);

    useEffect(() => {
      const container = containerRef.current;
      if (container) {
        const editorContainer = container.appendChild(
          container.ownerDocument.createElement("div")
        );
        const quill = new Quill(editorContainer, {
          modules,
          theme,
        });

        quillRef.current = quill;

        if (defaultValueRef.current) {
          quill.root.innerHTML = defaultValueRef.current;
        }

        quill.on(Quill.events.TEXT_CHANGE, () => {
          onTextChangeRef.current?.(quill.root.innerHTML);
        });
      }

      return () => {
        quillRef.current = null;
        if (container) {
          container.innerHTML = "";
        }
      };
    }, [modules, theme]);

    return <div ref={containerRef}></div>;
  }
);
Editor.displayName = "Editor";
export default Editor;
