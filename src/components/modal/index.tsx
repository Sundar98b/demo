import styled from "styled-components";
import React, { useEffect } from "react";
import { CloseCircleFilled } from "@ant-design/icons";

import UserChip from "../user-chip";

interface Modal {
  visibility?: boolean;
  onClose?: () => void;
  user_name: string;
  user_pic: string;
}

const Inner = styled.div`
  background: #fff;
  position: fixed;
  width: 80vw;
  z-index: 1001;
  height: 75vh;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  border-top: 3px solid #00ac6a;
  border-bottom-left-radius: 5px;
  border-bottom-right-radius: 5px;
  border-top-right-radius: 5px;
  .modal-body {
    height: 75vh;
    overflow-y: hidden;
    padding-bottom: 42px;
    .obj-wrapper {
      height: inherit;
    }
  }
`;
const User = styled.div`
  display: inline-block;
  min-width: 200px;
  background: #00ac6a;
  position: absolute;
  top: -38px;
  /* line-height: 28px; */
  padding-top: 7px;
  padding-left: 5px;
  border-top-left-radius: 5px;
  border-top-right-radius: 5px;
  text-align: center;
`;
const Close = styled.div`
  display: inline-block;
  position: absolute;
  right: 0;
  top: -28px;
  right: 11px;
  cursor: pointer;
`;
const Modal: React.FC<Modal> = props => {
  useEffect(() => {
    return () => {
      document.querySelector(".ant-modal-mask")?.remove();
    };
  }, []);

  useEffect(() => {
    if (props.visibility) {
      if (!document.querySelector(".ant-modal-mask")) {
        var innerDiv = document.createElement("div");
        innerDiv.className = "ant-modal-mask";
        document.querySelector("body")?.appendChild(innerDiv);
      }
    } else {
      document.querySelector(".ant-modal-mask")?.remove();
    }
  }, [props.visibility]);

  return (
    <div>
      {props.visibility && (
        <>
          <Inner>
            <User>
              <UserChip name={props.user_name} img={props.user_pic} />
            </User>
            <Close onClick={props.onClose}>
              <CloseCircleFilled style={{ fontSize: 20, color: "#eee" }} />
            </Close>
            <div className="modal-body">{props.children}</div>
          </Inner>
        </>
      )}
    </div>
  );
};

Modal.defaultProps = {
  visibility: false,
};

export default Modal;
