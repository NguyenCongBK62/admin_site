import React from "react";
import PropTypes from "prop-types";
import { Row, Col } from "antd";
import {
  DatePicker,
  TimePicker,
  NumberInput,
  Input,
  TextArea,
  List,
  RadioButton,
  Select,
  PhoneInput,
  CustomField,
} from "components/FormControllers";
import Label from "components/Form/atoms/Label";
import SectionHeader from "components/Form/atoms/SectionHeader";
import { requiredMessage } from "utils/validationMessage";
import smokeIcon from "assets/smoke.svg";
import smokingHeated from "assets/smoking-heated.svg";
import nonSmokeIcon from "assets/non-smoke.svg";

import dayjs from "dayjs";

const statusButtons = [
  {
    value: "0",
    label: "予約確定",
  },
  {
    value: "1",
    label: "仮予約",
  },
  {
    value: "2",
    label: "キャンセル待ち",
  },
];

function CustomFields({ control, errors, customItems }) {
  if (customItems) {
    return (
      <>
        {customItems.map((c) => {
          if (c.displayOnReservation) {
            return (
              <Col span={24} style={{ marginTop: 25 }} key={c.id}>
                <CustomField
                  control={control}
                  customField={c}
                  errors={errors}
                />
              </Col>
            );
          }
          return null;
        })}
      </>
    );
  }
}

function ReservationForm({
  control,
  errors,
  onDateChange,
  menus,
  tables,
  receptionists,
  reservationMethods,
  customerSuggestions,
  fetchCustomerSuggestions,
  handlePhoneSelection,
  handleClearCustomerSuggestion,
  customItems,
}) {
  return (
    <div className="form-wrapper">
      <Row className="form-section">
        <Col span={24}>
          <SectionHeader label={"日時と人数"} />
        </Col>
        <Col span={24}>
          <div className="input-group">
            <Label label={"日にち"} />
            <div className="input-element">
              <DatePicker
                control={control}
                inputName={"date"}
                error={errors.date}
                defaultValue={dayjs()}
                validation={{
                  required: requiredMessage.replace("{{}}", "Date"),
                }}
                inputProps={{
                  allowClear: false,
                  placeholder: "2019/07/25（木）",
                  initialDate: dayjs().format("YYYY-MM-DD"),
                }}
                callback={onDateChange}
              />
            </div>
          </div>
        </Col>
        <Col span={24} style={{ marginTop: 25 }}>
          <div className="input-group">
            <Label label={"予約時間"} />
            <div className="input-element">
              <TimePicker
                control={control}
                inputName={"startTime"}
                callback={() => onDateChange(true)}
                errors={errors.startTime}
                validation={{
                  required: requiredMessage.replace("{{}}", "start time"),
                }}
              />
              <span style={{ padding: "0 11.5px" }}>~</span>
              <TimePicker
                control={control}
                inputName={"endTime"}
                callback={onDateChange}
                errors={errors.endTime}
                validation={{
                  required: requiredMessage.replace("{{}}", "end time"),
                }}
              />
            </div>
          </div>
        </Col>
        <Col span={24} style={{ marginTop: 25 }}>
          <div className="input-group">
            <Label label={"人数"} />
            <div className="input-elements-inline">
              <div className="input-element" style={{ width: 100 }}>
                <Label label={"大人"} required={false} />
                <NumberInput
                  control={control}
                  inputName="adultNumber"
                  defaultValue={1}
                  validation={{
                    required: "人数を入力してください。",
                  }}
                  inputNumberProps={{
                    min: 1,
                    max: 999,
                    placeholder: "999",
                    type: "number",
                  }}
                  label={"名"}
                  errors={errors.adultNumber}
                />
              </div>
              <div className="input-element" style={{ marginLeft: 20 }}>
                <Label label={"子供"} required={false} />
                <NumberInput
                  control={control}
                  inputName="childNumber"
                  inputNumberProps={{
                    defaultValue: 1,
                    min: 0,
                    max: 999,
                    placeholder: "999",
                    type: "number",
                  }}
                  label={"名"}
                  errors={errors.childNumber}
                />
              </div>
            </div>
          </div>
        </Col>
      </Row>
      <Row className="form-section" style={{ marginTop: 30 }}>
        <Col span={24}>
          <SectionHeader label={"お客様情報"} />
        </Col>
        <Col span={24}>
          <div className="input-group">
            <Label label={"お名前（カタカナまたはひらがな)"} />
            <div
              className="input-elements-inline reservation-input-name"
              style={{ flexWrap: "wrap" }}
            >
              <div className="input-element" style={{ marginRight: 25 }}>
                <Input
                  control={control}
                  inputName="lastName"
                  errors={errors.lastName}
                  validation={{
                    required: "お名前を入力してください。",
                  }}
                  inputProps={{ placeholder: "セイ" }}
                />
              </div>
              <div className="input-element">
                <Input
                  control={control}
                  inputName="firstName"
                  errors={errors.firstName}
                  inputProps={{ placeholder: "メイ" }}
                />
              </div>
            </div>
            <div className="input-footer">※苗字のみでも可</div>
          </div>
        </Col>
        <Col span={24} style={{ marginTop: 25 }}>
          <div className="input-group">
            <Label label={"お電話番号"} required={false} />
            <div className="input-element">
              <PhoneInput
                control={control}
                inputName="phoneNumber"
                errors={errors.phoneNumber}
                handleAutoCompleteSelection={(selected) => {
                  handlePhoneSelection(selected);
                  handleClearCustomerSuggestion();
                }}
                parentCallback={fetchCustomerSuggestions}
                suggestions={
                  customerSuggestions
                    ? customerSuggestions.map((i) => ({
                        key: i.id,
                        value: `${i.phonenumber}/${i.spellingLastname} ${i.spellingFirstname}`,
                      }))
                    : []
                }
              />
            </div>
          </div>
        </Col>
        <CustomFields
          control={control}
          customItems={customItems}
          errors={errors}
        />
      </Row>

      <Row className="form-section" style={{ marginTop: 30 }}>
        <Col span={24}>
          <SectionHeader label={"ご予約内容"} />
        </Col>
        <Col span={24}>
          <div className="input-group">
            <Label label={"メニュー"} required={false} />
            <div className="input-element" style={{ marginRight: 25 }}>
              <List
                control={control}
                inputName={"menus"}
                options={menus}
                label={(item) => {
                  return (
                    <span>{item.price ? item.price + "円" : "0" + "円"}</span>
                  );
                }}
                hasAllSelect={false}
              />
            </div>
          </div>
        </Col>
        <Col span={24} style={{ marginTop: 25 }}>
          <div className="input-group">
            <Label label={"テーブル"} required={false} />
            <div className="input-element" style={{ marginRight: 25 }}>
              <List
                control={control}
                inputName={"tables"}
                options={tables}
                errors={errors.tables}
                label={(item) => {
                  if (item.numberOfSeats === -1 || item.id === -1) {
                    return null;
                  }
                  return (
                    <div style={{ display: "flex" }}>
                      <span
                        style={{
                          paddingRight: "5px",
                        }}
                      >
                        {item.numberOfSeats}名席
                      </span>
                      <span style={{ width: 25 }}>
                        {item.numberOfSeats > -1 ? (
                          item.smokeStatus === 2 ? (
                            <img src={smokingHeated} style={{ width: 17 }} />
                          ) : item.smokeStatus === 1 ? (
                            <img src={nonSmokeIcon} />
                          ) : item.smokeStatus === 0 ? (
                            <img src={smokeIcon} />
                          ) : null
                        ) : null}
                      </span>
                    </div>
                  );
                }}
                hasAllSelect={false}
              />
            </div>
          </div>
        </Col>
        <Col span={24} style={{ marginTop: 25 }}>
          <div className="input-group">
            <Label label={"予約ステータス"} required={false} />
            <div className="input-element" style={{ marginRight: 25 }}>
              <RadioButton
                control={control}
                defaultValue={"0"}
                inputName={"status"}
                buttons={statusButtons}
              />
            </div>
          </div>
        </Col>
        <Col span={24} style={{ marginTop: 25 }}>
          <div className="input-group">
            <Label label={"予約メモ"} required={false} />
            <div className="input-element" style={{ marginRight: 25 }}>
              <TextArea
                control={control}
                inputName={"note"}
                errors={errors.note}
                inputProps={{ rows: 6, placeholder: "補足を記入してください" }}
              />
            </div>
          </div>
        </Col>
        <Col span={24} style={{ marginTop: 25 }}>
          <div className="input-group">
            <Label label={"予約受付スタッフ"} required={false} />
            <div className="input-element" style={{ marginRight: 25 }}>
              <Select
                control={control}
                inputName={"receptionistsOptions"}
                placeholder={"選択してください"}
                Options={receptionists.map((m) => ({
                  key: m.id,
                  label: m.name,
                }))}
              />
            </div>
          </div>
        </Col>
        <Col span={24} style={{ marginTop: 25 }}>
          <div className="input-group">
            <Label label={"予約経路"} required={false} />
            <div className="input-element" style={{ marginRight: 25 }}>
              <Select
                control={control}
                inputName={"reservationOption"}
                placeholder={"選択してください"}
                Options={reservationMethods.map((m) => ({
                  key: m.id,
                  label: m.name,
                }))}
              />
            </div>
          </div>
        </Col>
      </Row>
    </div>
  );
}

ReservationForm.propTypes = {
  control: PropTypes.any,
  errors: PropTypes.any,
  onDateChange: PropTypes.func,
  menus: PropTypes.any,
  tables: PropTypes.any,
  receptionists: PropTypes.any,
  reservationMethods: PropTypes.any,
  customerSuggestions: PropTypes.any,
  customItems: PropTypes.any,
  fetchCustomerSuggestions: PropTypes.func.isRequired,
  handlePhoneSelection: PropTypes.func.isRequired,
  handleClearCustomerSuggestion: PropTypes.func.isRequired,
};

export default ReservationForm;
