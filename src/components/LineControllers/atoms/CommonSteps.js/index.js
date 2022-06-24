import React from "react";
import { Row, Col, Tooltip } from "antd";
import PropTypes from "prop-types";

import QuestionMarkIcon from "components/Icons/QuestionMarkIcon";
import LineButton from "../LineButton";
import { Input } from "antd/es";
import { CopyOutlined } from "@ant-design/icons";
import { CopyToClipboard } from "react-copy-to-clipboard";
import { API_URL } from "settings/config";

function CommonSteps({
  headings,
  subHeadings = "",
  tootlTipTitle,
  buttonTitle,
  buttonLink,
  backdrop = false,
  onCopyText = null,
  isIphone,
}) {
  return (
    <div
      className="form-wrapper"
      style={{
        paddingRight: "0px",
        position: "relative",
        zIndex: backdrop ? "9999" : "0",
      }}
    >
      <Row className="form-section">
        <Col md={{ span: 20, offset: 2 }}>
          <div className="input-element" style={{ textAlign: "center" }}>
            <p
              className="line-configuration-span"
              style={{ color: backdrop ? "#EB516D" : "#111111" }}
            >
              {headings}
            </p>
            <p
              className="line-configuration-span"
              style={{ color: backdrop ? "#EB516D" : "#111111" }}
            >
              {subHeadings}
            </p>
            {onCopyText ? (
              <>
                {" "}
                <Input
                  style={{
                    maxWidth: isIphone ? "100%" : "50%",
                    height: "40px",
                    marginTop: "10px",
                  }}
                  disabled={true}
                  value={`${API_URL}line/webhook/callback`}
                  addonAfter={
                    <CopyToClipboard
                      text={`${API_URL}line/webhook/callback`}
                      onCopy={onCopyText}
                    >
                      <CopyOutlined />
                    </CopyToClipboard>
                  }
                />
                <br />
              </>
            ) : null}
            <Tooltip
              placement={isIphone ? "topLeft" : "top"}
              title={tootlTipTitle}
              style={{
                transform: "translate(-16px, 0px)",
              }}
              arrowPointAtCenter
            >
              <span className={"question-span"}>
                <QuestionMarkIcon
                  inputProps={{
                    style: {
                      transform: "translate(0px, 6px)",
                      cursor: "pointer",
                    },
                  }}
                />
              </span>
            </Tooltip>
            <LineButton
              title={buttonTitle}
              link={buttonLink}
              inputProps={{
                style: {
                  marginTop: isIphone ? "14px" : "32px",
                  marginLeft: "8px",
                },
              }}
            />
          </div>
        </Col>
      </Row>
    </div>
  );
}

CommonSteps.propTypes = {
  headings: PropTypes.string,
  subHeadings: PropTypes.string,
  tootlTipTitle: PropTypes.string,
  buttonLink: PropTypes.string,
  buttonTitle: PropTypes.string,
  backdrop: PropTypes.bool,
  onCopyText: PropTypes.any,
  isIphone: PropTypes.bool,
};
export default CommonSteps;
