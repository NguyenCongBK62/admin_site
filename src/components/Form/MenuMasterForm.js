import React from "react";
import PropTypes from "prop-types";
import { Row, Col } from "antd";
import {
  Input,
  List,
  NumberInput,
  RadioButton,
} from "components/FormControllers";
import Label from "components/Form/atoms/Label";
import SectionHeader from "components/Form/atoms/SectionHeader";
import Checkbox from "components/FormControllers/atoms/Checkbox";

const displayStatusButton = [
  {
    value: "true",
    label: "表示",
  },
  {
    value: "false",
    label: "非表示",
  },
];

const taxOptions = [
  {
    id: true,
    name: "税別",
  },
];

function MenuMasterForm({
  control,
  stores,
  role,
  selectedStore,
  isEdit,
  taxOption,
  onChangeTaxOption,
}) {
  return (
    <div className="form-wrapper">
      <Row className="form-section">
        <Col span={24}>
          <SectionHeader label={"メニュー内容"} />
        </Col>
        <Col span={24}>
          <div className="input-group">
            <Label label={"メニュー名 "} />
            <div className="input-element">
              <Input
                control={control}
                inputName="name"
                inputProps={{
                  placeholder: "メニュー名を入力してください",
                  autoComplete: "off",
                  style: { maxWidth: "100%" },
                }}
              />
            </div>
          </div>
        </Col>
        <Col span={24} style={{ marginTop: 25 }}>
          <div className="input-group">
            <Label label={"ネット予約ページ用のメニュー名 "} required={false} />
            <div className="input-element">
              <Input
                control={control}
                inputName="netReservationName"
                inputProps={{
                  placeholder:
                    "ネット予約ページ用のメニュー名を入力してください。",
                  autoComplete: "off",
                  style: { maxWidth: "100%" },
                }}
              />
            </div>
          </div>
        </Col>
        <Col span={24} style={{ marginTop: 25 }}>
          <div className="input-group">
            <Label label={"金額"} required={false} />
            <div className="input-element">
              <NumberInput
                control={control}
                inputName="price"
                defaultValue={""}
                inputNumberProps={{
                  min: 0,
                  max: 9999999,
                  placeholder: "2,980",
                  type: "number",
                }}
                label={"円"}
                type="text"
              />
            </div>
          </div>
        </Col>
        <Col span={24} style={{ marginTop: 25 }}>
          <div className="input-group">
            <div className="input-element">
              <Checkbox
                control={control}
                inputName="tax"
                defaultValue={taxOption}
                options={taxOptions}
                inputProps={{
                  style: { width: "100%" },
                }}
                label={"円"}
                callback={onChangeTaxOption}
              />
            </div>
          </div>
        </Col>
        <Col span={24} style={{ marginTop: 25 }}>
          <div className="input-group">
            <Label label={"対象店舗"} required={false} />
            <div className="input-element" style={{ marginRight: 25 }}>
              {role === "admin" && isEdit ? (
                <p>{selectedStore?.name}</p>
              ) : role === "admin" && !isEdit ? (
                <List
                  control={control}
                  inputName={"stores"}
                  options={stores.map((s) => ({
                    ...s,
                    disabled: s.status !== 0,
                  }))}
                />
              ) : (
                <p>{selectedStore?.name}</p>
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
                inputName={"displayStatus"}
                buttons={displayStatusButton}
                classes={"radio-button-container-flex-start"}
              />
            </div>
          </div>
        </Col>
      </Row>
      <Row className="form-section" style={{ marginTop: "30px" }}>
        <Col span={24}>
          <SectionHeader label={"グルメサイト連携情報"} />
        </Col>
        <Col span={24}>
          <div style={{ color: "#121958" }}>
            <span>
              ※グルメサイト管理画面で設定しているコース名称を入力してください。
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
    </div>
  );
}

MenuMasterForm.propTypes = {
  control: PropTypes.any,
  stores: PropTypes.array,
  role: PropTypes.string,
  selectedStore: PropTypes.any,
  isEdit: PropTypes.bool,
  taxOption: PropTypes.array,
  onChangeTaxOption: PropTypes.func,
};

export default MenuMasterForm;
