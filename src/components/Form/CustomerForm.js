import React from "react";
import PropTypes from "prop-types";
import { Row, Col } from "antd";

import {
  NumberInput,
  Input,
  TextArea,
  RadioButton,
  Select,
  PhoneInput,
  FileUpload,
  CustomField,
} from "components/FormControllers";
import Label from "components/Form/atoms/Label";
import SectionHeader from "components/Form/atoms/SectionHeader";
import dayjs from "dayjs";

function CustomerForm({
  control,
  errors,
  postalCodeData,
  onZipCodeChange,
  handleZipCodeSelection,
  status,
  customOrder,
}) {
  return (
    <div className="form-wrapper">
      <Row className="form-section">
        <Col span={24}>
          <SectionHeader label={"基本情報"} />
        </Col>
        <Col span={24}>
          <div className="input-group">
            <Label label={"名前"} required={false} />
            <div
              className="input-elements-inline reservation-input-name"
              style={{ flexWrap: "wrap" }}
            >
              <div className="input-element" style={{ marginRight: 25 }}>
                <Input
                  control={control}
                  inputName="lastName"
                  inputProps={{ placeholder: "姓" }}
                  errors={errors.lastName}
                />
              </div>
              <div className="input-element">
                <Input
                  control={control}
                  inputName="firstName"
                  inputProps={{ placeholder: "名" }}
                  errors={errors.firstName}
                />
              </div>
            </div>
          </div>
        </Col>
        <Col span={24} style={{ marginTop: 25 }}>
          <div className="input-group">
            <Label label={"名前（カナ）"} />
            <div
              className="input-elements-inline reservation-input-name"
              style={{ flexWrap: "wrap" }}
            >
              <div className="input-element" style={{ marginRight: 25 }}>
                <Input
                  control={control}
                  inputProps={{ placeholder: "セイ" }}
                  inputName="lastNameKana"
                  validation={{
                    required: "名前（カタカナ）を入力してください",
                  }}
                  errors={errors.lastNameKana}
                />
              </div>
              <div className="input-element">
                <Input
                  control={control}
                  inputProps={{ placeholder: "メイ" }}
                  inputName="firstNameKana"
                  errors={errors.firstNameKana}
                />
              </div>
            </div>
          </div>
        </Col>
        <Col span={24} style={{ marginTop: 25 }}>
          <div className="input-group">
            <Label label={"お電話番号"} />
            <div className="input-element">
              <PhoneInput
                control={control}
                validation={{ required: "携帯番号を入力してください。" }}
                inputName="phoneNumber"
                errors={errors.phoneNumber}
                suggestions={[]}
                handleAutoCompleteSelection={() => {}}
              />
            </div>
          </div>
        </Col>
        <Col span={24} style={{ marginTop: 25 }}>
          <div className="input-group">
            <Label label={"DM配信"} required={false} />
            <div className="input-element">
              <RadioButton
                control={control}
                inputName="dm"
                defaultValue={true}
                buttons={[
                  {
                    value: true,
                    label: "可能",
                  },
                  {
                    value: false,
                    label: "不可",
                  },
                ]}
                errors={errors.dm}
              />
            </div>
          </div>
        </Col>
      </Row>
      <Row className="form-section" style={{ marginTop: 30 }}>
        <Col span={24}>
          <SectionHeader label={"連絡先情報"} />
        </Col>
        <Col span={24} style={{ marginTop: 25 }}>
          <div className="input-group">
            <Label label={"メール"} required={false} />
            <div className="input-element">
              <Input
                control={control}
                inputProps={{ placeholder: "mail@example.com" }}
                inputName="email"
                validation={{
                  pattern: {
                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                    message: "メールアドレスが不正です",
                  },
                }}
                errors={errors.email}
              />
            </div>
          </div>
        </Col>
        <Col span={24} style={{ marginTop: 25 }}>
          <div className="input-group">
            <Label label={"郵便番号"} required={false} />
            <div className="input-element">
              <PhoneInput
                control={control}
                inputName="postalCode"
                parentCallback={onZipCodeChange}
                characterSplit="-"
                placeholder=""
                suggestions={
                  postalCodeData
                    ? postalCodeData.map((code) => ({
                        key: code.id,
                        value: `${code.zipCode.trim()}-${
                          code.prefecture.trim() +
                          code.city.trim() +
                          code.town.trim()
                        }`,
                      }))
                    : []
                }
                dropdownMatchSelectWidth={300}
                handleAutoCompleteSelection={handleZipCodeSelection}
                errors={errors.postalCode}
              />
            </div>
          </div>
        </Col>
        <Col span={24} style={{ marginTop: 25 }}>
          <div className="input-group">
            <Label label={"住所 1"} required={false} />
            <div className="input-element">
              <Input
                control={control}
                inputName="address1"
                errors={errors.address1}
              />
            </div>
          </div>
        </Col>
        <Col span={24} style={{ marginTop: 25 }}>
          <div className="input-group">
            <Label label={"住所 2"} required={false} />
            <div className="input-element">
              <Input
                control={control}
                inputName="address2"
                errors={errors.address2}
              />
            </div>
          </div>
        </Col>
      </Row>
      <Row className="form-section" style={{ marginTop: 30 }}>
        <Col span={24}>
          <SectionHeader label={"パーソナル情報"} />
        </Col>
        <Col span={24} style={{ marginTop: 25 }}>
          <div className="input-group">
            <Label label={"性別"} required={false} />
            <div className="input-element">
              <RadioButton
                control={control}
                inputName="sex"
                defaultValue="1"
                buttons={[
                  {
                    value: "1",
                    label: "男性",
                  },
                  {
                    value: "0",
                    label: "女性",
                  },
                  {
                    value: "2",
                    label: "その他",
                  },
                ]}
                errors={errors.sex}
              />
            </div>
          </div>
        </Col>
        <Col span={24} style={{ marginTop: 25 }}>
          <div className="input-group">
            <Label label={"生年月日"} required={false} />
            <div className="input-element">
              <NumberInput
                control={control}
                inputName={"year"}
                defaultValue={null}
                inputNumberProps={{
                  placeholder: "1998",
                  min: 1900,
                  max: dayjs().year(),
                  // style: { width: 75 },
                }}
                label={"年"}
              />

              <NumberInput
                control={control}
                inputName={"month"}
                defaultValue={null}
                inputNumberProps={{
                  placeholder: "01",
                  min: 1,
                  max: 12,
                  style: { marginLeft: 5 },
                }}
                label={"月"}
              />

              <NumberInput
                control={control}
                inputName={"day"}
                defaultValue={null}
                inputNumberProps={{
                  placeholder: "31",
                  min: 1,
                  max: 31,
                  style: { marginLeft: 5 },
                }}
                label={"日"}
              />
            </div>
            <div className="input-footer" style={{ color: "red" }}>
              {errors && errors?.year?.message}
            </div>
          </div>
        </Col>
        <Col span={24} style={{ marginTop: 25 }}>
          <div className="input-group">
            <Label label={"写真"} required={false} />
            <div className="input-element">
              <FileUpload
                control={control}
                inputName="avatar"
                errors={errors.avatar}
              />
            </div>
          </div>
        </Col>
      </Row>
      <Row className="form-section" style={{ marginTop: 30 }}>
        <Col span={24}>
          <SectionHeader label={"ご来店情報"} />
        </Col>
        <Col span={24}>
          <div className="input-group">
            <Label label={"UMaT利用前の来店回数"} required={false} />
            <div className="input-element">
              <NumberInput
                control={control}
                inputName={"visit"}
                defaultValue={null}
                inputNumberProps={{
                  placeholder: "12",
                }}
                errors={errors.visit}
                label={"回"}
              />
            </div>
          </div>
        </Col>
        <Col span={24} style={{ marginTop: 25 }}>
          <div className="input-group">
            <Label label={"ステータス"} required={false} />
            <div className="input-element">
              <Select
                control={control}
                inputName={"status"}
                placeholder={"選択してください"}
                Options={status.map((m) => ({
                  key: m.id,
                  label: m.statusName,
                }))}
              />
            </div>
          </div>
        </Col>
        <Col span={24} style={{ marginTop: 25 }}>
          <div className="input-group">
            <Label label={"お客様メモ"} required={false} />
            <div className="input-element">
              <TextArea control={control} inputName={"note"} />
            </div>
          </div>
        </Col>
      </Row>
      <Row className="form-section" style={{ marginTop: 30 }}>
        <Col span={24}>
          <SectionHeader label={"カスタム項目"} />
        </Col>
        {customOrder?.map((c) => {
          if (c.displayOnCustomer) {
            return (
              <Col span={24} key={c.id} style={{ marginTop: 25 }}>
                <CustomField
                  customField={c}
                  control={control}
                  errors={errors}
                />
              </Col>
            );
          }
          return null;
        })}
      </Row>
    </div>
  );
}

CustomerForm.propTypes = {
  control: PropTypes.any,
  errors: PropTypes.any,
  customOrder: PropTypes.any,
  postalCodeData: PropTypes.any,
  status: PropTypes.any,
  onZipCodeChange: PropTypes.func,
  handleZipCodeSelection: PropTypes.func,
};

export default CustomerForm;
