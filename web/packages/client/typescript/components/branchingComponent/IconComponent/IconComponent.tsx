import * as React from "react";
// import "./IconComponent.css";
import { IconRenderer } from "@inductiveautomation/perspective-client";

interface IconProps {
  path: string;
  color: string;
}

const IconComponent = ({ path, color }: IconProps) => {
  return (
    <div className="icon">
      <IconRenderer color={color} path={path} />
    </div>
  );
};
// const IconComponent = ({ path, color }: IconProps) => {
//   // const svgFile = path.split('/')[0];
//   const svgId = path.split("/")[1];
//   const iconSheet =
//     require("../../branchingComponent/icons/material.svg").default;

//   return (
//     <div
//       className="icon"
//       style={{
//         maskImage: `url(${iconSheet}#${svgId})`,
//         backgroundColor: color,
//       }}
//     ></div>
//   );
// };

export default IconComponent;
