import { SyncOutlined } from "@ant-design/icons";
import { Col, Row } from "antd";
import AWS from "aws-sdk";
import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import "./style/index.less";

AWS.config.update({
  accessKeyId: process.env.REACT_APP_ACCESS_ID,
  secretAccessKey: process.env.REACT_APP_ACCESS_KEY,
  region: process.env.REACT_APP_REGION,
});
const s3 = new AWS.S3();

const BucketList = ({ companyCode }) => {
  const [mailContent, setMailContent] = useState();
  const [isReload, setIsReload] = useState(false);
  const [haveMail, setHaveMail] = useState(true);
  const params = {
    Bucket: "email.production.umat-operation.com",
    Prefix: `reservations/${companyCode}/tabelog_auth`,
  };
  const onReload = () => {
    setMailContent("");
    setIsReload(true);
    s3.listObjectsV2(params, (err, data) => {
      if (err) {
        setHaveMail(false);
        setIsReload(false);
      } else {
        let lastMailContent = data.Contents[0];
        for (var i = 0; i < data.Contents.length; i++) {
          if (
            Date.parse(lastMailContent.LastModified) <
            Date.parse(data.Contents[i].LastModified)
          ) {
            lastMailContent = data.Contents[i];
          }
        }
        const param2 = {
          Bucket: "email.production.umat-operation.com",
          Key: lastMailContent?.Key,
        };
        s3.getObject(param2, (err, data) => {
          if (err || data.Body.length === 0) {
            setHaveMail(false);
          } else {
            if (data.Body.toString("utf-8")) {
              let dataTxt = data.Body.toString("utf-8").replace(
                /(https?:\/\/[^\s]+)/g,
                function (url) {
                  return (
                    '<a href="' + url + '" target="_blank">' + url + "</a>"
                  );
                }
              );
              dataTxt = dataTxt.split("Content-Transfer-Encoding: 8bit")[1];
              setMailContent(dataTxt.replace(/^\s+|\s+$/g, ""));
              setHaveMail(true);
            }
          }
        });
        setIsReload(false);
      }
    });
  };
  useEffect(() => {
    onReload();
  }, []);

  return (
    <div className="form-wrapper" style={{ paddingRight: "0px" }}>
      <Row className="form-section">
        <Col md={{ span: 20, offset: 2 }}>
          <div className="registration-email-title">
            <span>
              ?????????????????????URL???????????????????????????????????????????????????????????????
            </span>
          </div>
          <div className="title-confirm-mail">
            <span>
              1.
              ????????????????????????????????????URL????????????????????????????????????????????????????????????????????????????????????URL????????????????????????????????????
            </span>
          </div>
          <Row justify="center">
            <div className="mail-form">
              <div className="mail-content-title">
                <button
                  className="reload-mail-button"
                  onClick={() => onReload()}
                >
                  {isReload ? <SyncOutlined spin /> : <SyncOutlined />}
                  ??????????????????????????? &nbsp; &nbsp;
                </button>

                <span className="mail-title-span">
                  ???????????????????????????????????????????????????????????????????????????????????????
                </span>
              </div>
              {haveMail ? (
                <div
                  className="mail-content"
                  dangerouslySetInnerHTML={{ __html: mailContent }}
                />
              ) : (
                <div className="mail-content-fail">
                  <p>
                    <span style={{ display: "inline-block" }}>
                      ?????????????????????????????????????????????????????????????????????????????????
                    </span>
                    <span style={{ display: "inline-block" }}>
                      ?????????????????????????????????????????????????????????????????????????????????????????????
                    </span>
                  </p>
                </div>
              )}
            </div>
          </Row>
        </Col>
      </Row>
    </div>
  );
};

BucketList.propTypes = {
  companyCode: PropTypes.string,
};
export default BucketList;
