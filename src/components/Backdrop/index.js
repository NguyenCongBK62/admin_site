import React from "react";
import PropTypes from "prop-types";

import "./style/index.less";

export default function Backdrop({ show, clickedBackdrop }) {
  return show ? (
    <div
      className="backdrop"
      data-testid="backdrop"
      onClick={clickedBackdrop}
    ></div>
  ) : null;
}

Backdrop.propTypes = {
  show: PropTypes.bool,
  clickedBackdrop: PropTypes.func,
};
