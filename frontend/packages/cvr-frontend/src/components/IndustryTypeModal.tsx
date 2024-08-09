import React, { useState, useMemo } from "react";
import { Modal } from "react-bootstrap";
import CheckboxTree, { Node } from "react-checkbox-tree";
import { ISearchWindowSlice } from "../types/searchWindowTypes";

import {
  setExpanded,
  setChecked,
  setSavedSelectedItems,
  setShowIndustryTypeModal,
} from "../slice/searchWindowslice";

import {
  MdCheckBox,
  MdCheckBoxOutlineBlank,
  MdAddBox,
  MdIndeterminateCheckBox,
} from "react-icons/md";
import { FiPlus, FiMinus } from "react-icons/fi";

import { useSelector, useDispatch } from "react-redux";

import _ from "lodash";

interface IProps {
  nodes: Node[];
}

const IndustryTypeModal = (props: IProps) => {
  const { nodes }: { nodes: Node[] } = props;

  const { expanded, selectedItems, showIndustryTypeModal } = useSelector(
    (state: { searchWindow: ISearchWindowSlice }) => state.searchWindow
  );

  const [keyword, setKeyword] = useState("");

  const dispatch = useDispatch();

  const icons = {
    check: <MdCheckBox className="rct-icon rct-icon-check" />,
    uncheck: <MdCheckBoxOutlineBlank className="rct-icon rct-icon-uncheck" />,
    halfCheck: (
      <MdIndeterminateCheckBox className="rct-icon rct-icon-half-check" />
    ),
    expandClose: <FiPlus className="rct-icon rct-icon-expand-close" />,
    expandOpen: <FiMinus className="rct-icon rct-icon-expand-open" />,
    expandAll: <MdAddBox className="rct-icon rct-icon-expand-all" />,
    collapseAll: (
      <MdIndeterminateCheckBox className="rct-icon rct-icon-collapse-all" />
    ),
    parentClose: "",
    parentOpen: "",
    leaf: "",
  };

  const getAllValuesFromNodes = (
    nodes: Node[],
    firstLevel: boolean
  ): string[] => {
    if (firstLevel) {
      const values = [];
      for (const node of nodes) {
        values.push(node.value);
        if (node.children) {
          values.push(...getAllValuesFromNodes(node.children, false));
        }
      }
      return values;
    } else {
      const values = [];
      for (const node of nodes) {
        values.push(node.value);
        if (node.children) {
          values.push(...getAllValuesFromNodes(node.children, false));
        }
      }
      return values;
    }
  };

  const onSearchInputChange = (
    event: React.ChangeEvent<HTMLInputElement>,
    searchedNodes: Node[]
  ) => {
    if (keyword.trim() && !event.target.value.trim()) {
      dispatch(setExpanded({ expanded: [] }));
      setKeyword(event.target.value);
    } else {
      dispatch(
        setExpanded({ expanded: getAllValuesFromNodes(searchedNodes, true) })
      );
      setKeyword(event.target.value);
    }
  };

  const getHighlightText = (text: string, keyword: string) => {
    const startIndex = text.indexOf(keyword);
    return startIndex !== -1 ? (
      <span>
        {text.substring(0, startIndex)}
        <span style={{ color: "#2cb664" }}>
          {text.substring(startIndex, startIndex + keyword.length)}
        </span>
        {text.substring(startIndex + keyword.length)}
      </span>
    ) : (
      <span>{text}</span>
    );
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const keywordFilter = (nodes: any, keyword: string) => {
    const newNodes = [];
    for (const node of nodes) {
      if (node.children) {
        const nextNodes = keywordFilter(node.children, keyword);
        if (nextNodes.length > 0) {
          node.children = nextNodes;
        } else if (node.label.toLowerCase().includes(keyword.toLowerCase())) {
          node.children = nextNodes.length > 0 ? nextNodes : [];
        }
        if (
          nextNodes.length > 0 ||
          node.label.toLowerCase().includes(keyword.toLowerCase())
        ) {
          node.label = getHighlightText(node.label, keyword);
          newNodes.push(node);
        }
      } else {
        if (node.label.toLowerCase().includes(keyword.toLowerCase())) {
          node.label = getHighlightText(node.label, keyword);
          newNodes.push(node);
        }
      }
    }
    return newNodes;
  };

  const searchedNodes: Node[] = useMemo(() => {
    return keyword.trim() ? keywordFilter(_.cloneDeep(nodes), keyword) : nodes;
  }, [keyword, nodes]);

  return (
    <Modal
      show={showIndustryTypeModal}
      dialogClassName="modal-90w"
      aria-labelledby="custom-modal-styling-title"
      centered
      className="industry-type-modal"
      onHide={() => {
        dispatch(setShowIndustryTypeModal());
        dispatch(setExpanded({ expanded: [] }));
      }}
    >
      <Modal.Header className="d-flex justify-content-between">
        <div className="d-flex flex-row align-items-center">
          <h4>Selected Industries</h4>
          <span className="ms-2">
            {selectedItems.length} industries selected
          </span>
        </div>
        <div className="d-flex align-items-center">
          <label className="industry-type-search-label">Filter list</label>
          <input
            placeholder="enter industry name/code"
            value={keyword}
            onChange={(event) => onSearchInputChange(event, searchedNodes)}
            className="industry-type-search-input my-2 ms-3"
          />
        </div>
      </Modal.Header>
      <Modal.Body>
        <CheckboxTree
          nodes={searchedNodes}
          checked={selectedItems}
          expanded={expanded}
          onCheck={(checked) => dispatch(setChecked({ checked }))}
          onExpand={(expanded) => dispatch(setExpanded({ expanded }))}
          icons={icons}
        />
      </Modal.Body>
      <Modal.Footer className="d-flex justify-content-between">
        <button
          className="industry-type-save-btn"
          onClick={() => {
            dispatch(setShowIndustryTypeModal());
            dispatch(setChecked({ checked: [] }));
            dispatch(setExpanded({ expanded: [] }));
            setKeyword("");
          }}
        >
          Cancel
        </button>
        <button
          onClick={() => {
            dispatch(setShowIndustryTypeModal());
            dispatch(setExpanded({ expanded: [] }));
            dispatch(setSavedSelectedItems());
            setKeyword("");
          }}
          className="industry-type-save-btn"
        >
          Save
        </button>
      </Modal.Footer>
    </Modal>
  );
};

export default IndustryTypeModal;
