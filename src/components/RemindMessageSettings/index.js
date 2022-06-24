import React from "react";
import { Col, Row } from "antd";
import PropTypes from "prop-types";

import SelectPicker from "components/SelectPicker";
import { hourOptions } from "containers/StoreMasterCreateUpdate/data";
import SectionHeader from "components/Form/atoms/SectionHeader";
import Label from "components/Form/atoms/Label";
import { NumberInput } from "components/FormControllers";

export default function RemindMessageSettings({ control }) {
  return (
    <Row className="form-section" style={{ marginTop: 30 }}>
      <Col span={24}>
        <SectionHeader label={"リマインドメッセージ設定"} />
      </Col>
      <Col span={24}>
        <div className="input-group">
          <Label label={"配信タイミング"} required={false} />
          <div className="input-elements-inline" style={{ flexWrap: "wrap" }}>
            <div className="input-element">
              <span style={{ marginLeft: "0px" }}>予約 </span>
              <NumberInput
                control={control}
                inputName="remindBeforeDate"
                defaultValue={""}
                inputNumberProps={{
                  min: 0,
                  max: 999,
                  placeholder: "1",
                  type: "number",
                }}
                label={"日前の"}
              />
            </div>
            <div className="input-element" style={{ marginLeft: 20 }}>
              <SelectPicker
                control={control}
                inputName={"remindHour"}
                defaultValue={""}
                inputProps={{
                  placeholder: "--",
                  style: { width: 80 },
                }}
                Options={hourOptions.map((h, index) =>
                  h === "--"
                    ? { key: "", label: h }
                    : { key: index - 1, label: h }
                )}
              />
              <span> 時に配信</span>
            </div>
          </div>
        </div>
      </Col>{" "}
    </Row>
  );
}

RemindMessageSettings.propTypes = {
  control: PropTypes.any,
};
