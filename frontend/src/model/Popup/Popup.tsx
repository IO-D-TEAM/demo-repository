import React, { FC, useState } from "react";
import "./Popup.css";
import CloseIcon from "@mui/icons-material/Close";

interface PopupProps {}

const Popup = (props: any) => {
  return props.trigger ? (
    <div className="popup">
      <div className="popup-inner">
        <button onClick={() => props.setTrigger(false)} className="close-btn">
          <CloseIcon></CloseIcon>
        </button>
        {props.children}
      </div>
    </div>
  ) : (
    <div></div>
  );
};

export default Popup;
