import React from "react";
import PropTypes from "prop-types";
import { Row, Col } from "antd";

import Label from "components/Form/atoms/Label";
import SectionHeader from "components/Form/atoms/SectionHeader";
import { Input, NumberInput, PhoneInput } from "components/FormControllers";

export default function StoreInformation({
  control,
  handlePostalCodeSelection,
  fetchPostalCodeSuggestions,
  postalCodeSuggestions,
}) {
  const menuItems = [1, 2, 3, 4, 5, 6, 7, 8, 9, "-", 0];
  return (
    <Row className="form-section">
      <Col span={24}>
        <SectionHeader label={"店舗情報"} />
      </Col>
      <Col span={24}>
        <div className="input-group">
          <Label label={"店舗名"} />
          <div className="input-element">
            <Input
              control={control}
              inputName="name"
              defaultValue={""}
              inputProps={{
                placeholder: "店舗名を入力してください",
                autoComplete: "off",
                style: { maxWidth: "100%" },
              }}
            />
          </div>
        </div>
      </Col>
      <Col span={24} style={{ marginTop: 12 }}>
        <div className="input-group">
          <Label
            label={"メッセージの表示名（相手先に表示されます）"}
            required={false}
          />
          <div className="input-element">
            <Input
              control={control}
              defaultValue={""}
              inputName="displayName"
              inputProps={{
                placeholder: "表示名を入力します",
                maxLength: 20,
              }}
            />
          </div>
        </div>
      </Col>
      <Col span={24} style={{ marginTop: 12 }}>
        <div className="input-group">
          <Label label={"郵便番号"} required={false} />
          <div className="input-element">
            <PhoneInput
              control={control}
              inputName="postalCode"
              handleAutoCompleteSelection={(selected) => {
                handlePostalCodeSelection(selected);
                // handleClearCustomerSuggestion();
              }}
              parentCallback={fetchPostalCodeSuggestions}
              suggestions={
                postalCodeSuggestions
                  ? postalCodeSuggestions.map((code) => ({
                      key: code.id,
                      value: `${code.zipCode.trim()}-${
                        code.prefecture.trim() +
                        "" +
                        code.city.trim() +
                        "" +
                        code.town.trim()
                      }`,
                    }))
                  : []
              }
              placeholder=""
            />
          </div>
        </div>
      </Col>
      <Col span={24} style={{ marginTop: 12 }}>
        <div className="input-group">
          <Label label={"所在地"} required={false} />
          <div className="input-element">
            <Input
              control={control}
              inputName="address"
              inputProps={{
                style: { maxWidth: "100%" },
                maxLength: 500,
              }}
            />
          </div>
        </div>
      </Col>
      <Col span={24} style={{ marginTop: 12 }}>
        <div className="input-group">
          <Label label={"電話番号"} required={false} />
          <div className="input-element" style={{ marginRight: 25 }}>
            {/* <PhoneInput
              control={control}
              placeholder="011-1234-4567"
              defaultValue=""
              inputName="phonenumber"
              suggestions={[]}
              menuItems={menuItems}
              handleAutoCompleteSelection={() => {}}
            /> */}
            <NumberInput
              control={control}
              inputName="phonenumber"
              defaultValue={""}
              inputNumberProps={{
                placeholder: "09012345678",
                maxLength: 13,
              }}
              className="ant-input-custom"
              menuItems={menuItems}
              type="tel"
              stringMode={true}
            />
          </div>
        </div>
      </Col>
    </Row>
  );
}

StoreInformation.propTypes = {
  control: PropTypes.any,
  handlePostalCodeSelection: PropTypes.func,
  fetchPostalCodeSuggestions: PropTypes.func,
  postalCodeSuggestions: PropTypes.array,
};
