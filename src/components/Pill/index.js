import React from "react";
import PropTypes from "prop-types";
import "components/Pill/style/index.less";
import StripeIcon from "components/Icons/StripeIcon";

export default function Pill({ label, type }) {
  const style = {};
  let stripe = null;
  const height = 19;
  const width = 94;

  switch (type) {
    case "visiting":
      style.background = "#121958";
      break;
    case "waiting-for-visit":
      style.background = "#F4F5FD";
      style.border = "1px solid #121958";
      style.color = "#121958";
      break;
    case "temporary-reservation":
      style.background = "#F4F5FD";
      style.border = "1px solid #121958";
      style.color = "#121958";
      stripe = (
        <StripeIcon
          bounds={{ height, width }}
          stroke={"#C9CBDC"}
          inputProps={{ className: "svg-background" }}
        />
      );
      break;
    case "waiting-list":
      style.background = "#ffffff";
      style.border = "1px solid #121958";
      style.color = "#121958";
      stripe = (
        <StripeIcon
          bounds={{ height, width }}
          stroke={"#E7E8F1"}
          inputProps={{ className: "svg-background" }}
        />
      );
      break;
    case "closed":
      style.background = "#E0E0E3";
      style.color = "#888888";
      style.border = "1px solid #9b9b9b";
      break;
    case "no-show":
      style.background = "#dbdbdb";
      style.color = "#888888";
      style.border = "1px solid #9b9b9b";
      stripe = (
        <StripeIcon
          bounds={{ height, width }}
          stroke={"#C3C4C7"}
          inputProps={{ className: "svg-background" }}
        />
      );
      break;
    default:
      break;
  }
  return (
    <div className={`pill`} style={style}>
      {stripe}
      <span>{label}</span>
    </div>
  );
}

Pill.propTypes = {
  label: PropTypes.string,
  type: PropTypes.string,
};
