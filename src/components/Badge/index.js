import React, { useEffect, useRef, useState } from "react";
import PropTypes from "prop-types";
import StripeIcon from "components/Icons/StripeIcon";
import OpenIcon from "components/Icons/OpenIcon";
import "components/Badge/style/index.less";

export default function Badge({
  title,
  sTitle,
  width,
  hasOpenIcon = false,
  top = 0,
  height = 34,
  offset,
  type,
  handleBadgeClick,
  data,
  cutTag,
}) {
  const [tagWidth, setTagWidth] = useState(-12);

  const style = {
    top: `${top + 13}px`,
    width: `${width}px`,
    left: `${offset}px`,
  };

  let stripe = null;
  let color = "#888888";
  if (hasOpenIcon) {
    style.cursor = "pointer";
  }
  switch (type) {
    case "visiting":
      style.background = "#121958";
      color = "#ffffff";
      break;
    case "waiting-for-visit":
      style.background = "#F4F5FD";
      style.border = "1px solid #121958";
      style.color = "#121958";
      color = "#121958";
      break;
    case "temporary-reservation":
      style.background = "#F4F5FD";
      style.border = "1px solid #121958";
      style.color = "#121958";
      color = "#121958";
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
      color = "#121958";
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
      color = "#888888";
      style.border = "1px solid #9b9b9b";
      break;
    case "no-show":
      style.background = "#dbdbdb";
      style.color = "#888888";
      color = "#888888";
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

  const tag = useRef();

  useEffect(() => {
    if (tag.current?.offsetWidth) {
      setTagWidth(-1 * (tag.current.offsetWidth / 2));
    }
    if (width < 50) {
      setTagWidth(-30);
    }
  }, []);
  return (
    <div
      className="badge"
      style={style}
      onClick={() => {
        if (data) {
          handleBadgeClick(data.table, data.reservation);
        }
      }}
    >
      {stripe}
      <div className="title-container">
        {hasOpenIcon && width > 50 ? <OpenIcon stroke={color} /> : null}
        {width >= 50 ? <span className="title">{title}</span> : null}

        {/* <span className="secondary-title">{sTitle}</span> */}
      </div>
      {!cutTag ? (
        <div
          className="tag"
          ref={tag}
          style={{
            right: tagWidth,
            display:
              data.reservation.hasChangeStatus === 1 ||
              data.reservation.hasChangeStatus === 2
                ? ""
                : "none",
          }}
        >
          {data.reservation.hasChangeStatus === 1
            ? "追加"
            : data.reservation.hasChangeStatus === 2
            ? "変更あり"
            : null}
        </div>
      ) : null}
    </div>
  );
}

Badge.propTypes = {
  title: PropTypes.string,
  sTitle: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  width: PropTypes.number,
  hasOpenIcon: PropTypes.bool,
  cutTag: PropTypes.bool,
  top: PropTypes.number,
  height: PropTypes.number,
  offset: PropTypes.number,
  type: PropTypes.string,
  handleBadgeClick: PropTypes.func,
  data: PropTypes.any,
};
