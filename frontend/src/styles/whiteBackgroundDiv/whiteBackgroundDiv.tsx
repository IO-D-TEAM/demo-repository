import React, { ReactNode } from "react";
import "./whiteBackgroundDiv.css";

interface WhiteBackgroundDiv {
  children: ReactNode;
}

const WhiteBackgroundDiv: React.FC<WhiteBackgroundDiv> = ({ children }) => (
  <div className="divStyle">{children}</div>
);

export default WhiteBackgroundDiv;
