import React from "react";
import PropTypes from "prop-types";
import { Row, Col } from "antd";
import {
  Input,
  Select,
  RadioButton,
  TextArea,
  NumberInput,
} from "components/FormControllers";
import Label from "components/Form/atoms/Label";
import SectionHeader from "components/Form/atoms/SectionHeader";

const requiredButtons = [
  {
    value: true,
    label: "必須",
  },
  {
    value: false,
    label: "任意",
  },
];

const displayOnReservationButtons = [
  {
    value: true,
    label: "する",
  },
  {
    value: false,
    label: "しない",
  },
];

const displayOnCustomerButtons = [
  {
    value: true,
    label: "する",
  },
  {
    value: false,
    label: "しない",
  },
];

function CustomItemForm({ control, typeOption, typeId }) {
  const newTypeId = typeId;
  return (
    <div className="form-wrapper">
      <Row className="form-section">
        <Col span={24}>
          <SectionHeader label={"カスタム項目"} />
        </Col>
        <Col span={24}>
          <div className="input-group">
            <Label label={"項目名"} />
            <div className="input-element">
              <Input
                control={control}
                inputName="name"
                inputProps={{
                  placeholder: "項目名を入力してください",
                  autoComplete: "off",
                }}
              />
            </div>
          </div>
        </Col>

        <Col
          span={24}
          style={{
            marginTop: 25,
            display: newTypeId === "2" ? "block" : "none",
          }}
        >
          <div className="input-group">
            <Label label={"単位"} />
            <div className="input-element">
              <Input
                control={control}
                inputName="unit"
                inputProps={{
                  placeholder: "単位",
                  autoComplete: "off",
                }}
              />
            </div>
          </div>
        </Col>

        <Col span={24} style={{ marginTop: 25 }}>
          <div className="input-group">
            <Label label={"タイプ"} required={true} />
            <div className="input-element" style={{ marginRight: 25 }}>
              <Select
                control={control}
                inputName={"typeId"}
                placeholder={"タイプを選択してください"}
                Options={typeOption.map((m) => ({
                  key: m.id,
                  label: m.name,
                  //   disabled: m.status !== 0 ? "disabled" : "",
                }))}
              />
            </div>
          </div>
        </Col>
        <Col
          span={24}
          style={{
            marginTop: 25,
            display: newTypeId === "3" ? "block" : "none",
          }}
        >
          <div className="input-group">
            <Label
              label={"※選択できる値を1行毎に記入してください"}
              required={false}
            />
            <div className="input-element" style={{ marginRight: 25 }}>
              <TextArea
                control={control}
                inputName={"selectOptions"}
                inputProps={{
                  rows: 8,
                  placeholder: " ",
                  maxLength: 500,
                }}
                showCharacterCount={true}
              />
            </div>
          </div>
        </Col>
        <Col
          span={24}
          style={{
            marginTop: 25,
            display: newTypeId === "4" ? "block" : "none",
          }}
        >
          <div className="input-group">
            <Label
              label={"※選択できる値を1行毎に記入してください"}
              required={false}
            />
            <div className="input-element" style={{ marginRight: 25 }}>
              <TextArea
                control={control}
                inputName={"selectMultipleOptions"}
                inputProps={{
                  rows: 8,
                  placeholder: " ",
                  maxLength: 500,
                }}
                showCharacterCount={true}
              />
            </div>
          </div>
        </Col>

        <Col
          span={24}
          style={{
            marginTop: 25,
            display: newTypeId === "6" ? "block" : "none",
          }}
        >
          <div className="input-group">
            <div className="input-element">
              <Label label={"行数"} required={false} />
              <NumberInput
                control={control}
                inputName={"optTextarea"}
                defaultValue={3}
                inputNumberProps={{
                  min: 0,
                  max: 30,
                  placeholder: "行数",
                  type: "number",
                }}
              />
            </div>
          </div>
        </Col>

        <Col span={24} style={{ marginTop: 25 }}>
          <div className="input-group">
            <Label label={"必須項目にする"} required={false} />
            <div className="input-element" style={{ marginRight: 25 }}>
              <RadioButton
                classes={"radio-button-container-flex-start"}
                control={control}
                defaultValue={true}
                inputName={"required"}
                buttons={requiredButtons}
              />
            </div>
          </div>
        </Col>
        <Col span={24} style={{ marginTop: 25 }}>
          <div className="input-group">
            <Label label={"予約画面に表示する"} required={false} />
            <div className="input-element" style={{ marginRight: 25 }}>
              <RadioButton
                classes={"radio-button-container-flex-start"}
                control={control}
                defaultValue={true}
                inputName={"displayOnReservation"}
                buttons={displayOnReservationButtons}
              />
            </div>
          </div>
        </Col>
        <Col span={24} style={{ marginTop: 25 }}>
          <div className="input-group">
            <Label label={"お客様情報画面に表示する"} required={false} />
            <div className="input-element" style={{ marginRight: 25 }}>
              <RadioButton
                classes={"radio-button-container-flex-start"}
                control={control}
                defaultValue={true}
                inputName={"displayOnCustomer"}
                buttons={displayOnCustomerButtons}
              />
            </div>
          </div>
        </Col>
      </Row>
    </div>
  );
}

CustomItemForm.propTypes = {
  control: PropTypes.any,
  typeOption: PropTypes.array,
  typeId: PropTypes.string,
};

export default CustomItemForm;
