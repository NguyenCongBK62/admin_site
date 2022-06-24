import { Col, Row } from "antd";
import Label from "components/Form/atoms/Label";
import SectionHeader from "components/Form/atoms/SectionHeader";
import { Input } from "components/FormControllers";
import PropTypes from "prop-types";
import React from "react";

export default function GourmetSiteStoreMaterForm({ control }) {
  return (
    <Row className="form-section" style={{ marginTop: "30px" }}>
      <Col span={24}>
        <SectionHeader label={"グルメサイト連携情報"} />
      </Col>
      <Col span={24}>
        <div style={{ color: "#121958" }}>
          <span>
            ※グルメサイト管理画面で設定している店舗名称を入力してください。
            （入力された名称は、部分一致で連携を行います）
          </span>
        </div>
        <div className="input-group">
          <Label label={"食べログ"} required={false} />
          <div className="input-element">
            <Input
              control={control}
              inputName="nameTaberogu"
              defaultValue=""
              inputProps={{
                autoComplete: "off",
                style: { maxWidth: "100%" },
              }}
            />
          </div>
        </div>
      </Col>
      <Col span={24}>
        <div className="input-group">
          <Label label={"ぐるなび"} required={false} />
          <div className="input-element">
            <Input
              control={control}
              inputName="nameGurunavi"
              defaultValue=""
              inputProps={{
                autoComplete: "off",
                style: { maxWidth: "100%" },
              }}
            />
          </div>
        </div>
      </Col>
      <Col span={24}>
        <div className="input-group">
          <Label label={"ホットペッパー"} required={false} />
          <div className="input-element">
            <Input
              control={control}
              inputName="nameHotopepper"
              defaultValue=""
              inputProps={{
                autoComplete: "off",
                style: { maxWidth: "100%" },
              }}
            />
          </div>
        </div>
      </Col>
    </Row>
  );
}

GourmetSiteStoreMaterForm.propTypes = {
  control: PropTypes.any,
};
