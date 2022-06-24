import React from "react";
import { Button } from "antd";
import PropTypes from "prop-types";
import ExternalLinkIcon from "components/Icons/ExternalLinkIcon";

import "./style/index.less";

export default function LineButton({ title, link, inputProps }) {
  return (
    <Button className="line-button" {...inputProps}>
      <a href={link} target="_blank" rel="noopener noreferrer">
        <ExternalLinkIcon
          width="16"
          height="16"
          stroke="white"
          inputProps={{
            style: {
              transform: "translate(0px, 2px)",
            },
          }}
        />
        {"  "}
        <span>{title}</span>
      </a>
    </Button>
  );
}

LineButton.propTypes = {
  title: PropTypes.string,
  link: PropTypes.string,
  inputProps: PropTypes.any,
};
