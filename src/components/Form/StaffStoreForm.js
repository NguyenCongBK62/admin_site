import React from "react";
import PropTypes from "prop-types";
import { Row, Col } from "antd";
import { Input, List, RadioButton } from "components/FormControllers";
import Label from "components/Form/atoms/Label";
import SectionHeader from "components/Form/atoms/SectionHeader";

const displaySettingsButton = [
  {
    value: "true",
    label: "表示",
  },
  {
    value: "false",
    label: "非表示",
  },
];

function StaffStoreForm({
  control,
  stores,
  role,
  selectedStore,
  loadedStoreId,
  loadedStoreName,
}) {
  return (
    <div className="form-wrapper">
      <Row className="form-section">
        <Col span={24}>
          <SectionHeader label={"担当者"} />
        </Col>
        <Col span={24}>
          <div className="input-group">
            <Label label={"担当者名"} />
            <div className="input-element">
              <Input
                control={control}
                inputName="name"
                inputProps={{
                  placeholder: "担当者名を入力してください",
                  autoComplete: "off",
                }}
              />
            </div>
          </div>
        </Col>
        <Col span={24} style={{ marginTop: 25 }}>
          <div className="input-group">
            <Label label={"対象店舗"} required={false} />
            <div className="input-element" style={{ marginRight: 25 }}>
              {role === "admin" && loadedStoreId ? (
                <p>{loadedStoreName}</p>
              ) : role === "admin" && !loadedStoreId ? (
                <List
                  control={control}
                  inputName={"stores"}
                  options={stores.map((s) => ({
                    ...s,
                    disabled: s.status !== 0,
                  }))}
                />
              ) : (
                <p>{loadedStoreId ? loadedStoreName : selectedStore.name}</p>
              )}
            </div>
          </div>
        </Col>
        <Col span={24} style={{ marginTop: 25 }}>
          <div className="input-group">
            <Label label={"表示設定"} required={false} />
            <div className="input-element" style={{ marginRight: 25 }}>
              <RadioButton
                control={control}
                defaultValue={"true"}
                inputName={"isDisplayed"}
                buttons={displaySettingsButton}
                classes={"radio-button-container-flex-start"}
              />
            </div>
          </div>
        </Col>
      </Row>
    </div>
  );
}

StaffStoreForm.propTypes = {
  control: PropTypes.any,
  stores: PropTypes.array,
  role: PropTypes.string,
  selectedStore: PropTypes.any,
  loadedStoreId: PropTypes.any,
  loadedStoreName: PropTypes.any,
};

export default StaffStoreForm;
