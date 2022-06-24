import React from "react";
import { Button } from "antd";
import PropTypes from "prop-types";

import "./style/index.less";

export default function LineButton({ title, inputProps }) {
  return (
    <Button className="email-button" {...inputProps}>
      <span>{title}</span>
    </Button>
  );
}

LineButton.propTypes = {
  title: PropTypes.string,
  link: PropTypes.string,
  inputProps: PropTypes.any,
};
