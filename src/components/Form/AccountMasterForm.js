import React from "react";
import PropTypes from "prop-types";
import { Row, Col } from "antd";
import { Input, Select } from "components/FormControllers";
import Label from "components/Form/atoms/Label";
import SectionHeader from "components/Form/atoms/SectionHeader";
import Checkbox from "antd/lib/checkbox/Checkbox";

function AccountMasterForm({
  control,
  stores,
  handleShowPassword,
  showPassword,
  password,
  userId,
  handleUserId,
}) {
  return (
    <div className="form-wrapper">
      <Row className="form-section">
        <Col span={24}>
          <SectionHeader label={"アカウント"} />
        </Col>
        <Col span={24}>
          <div className="input-group">
            <Label label={"アカウント名"} />
            <div className="input-element">
              <Input
                control={control}
                inputName="name"
                inputProps={{
                  placeholder: "アカウント名を入力してください",
                  autoComplete: "off",
                }}
              />
            </div>
          </div>
        </Col>
        <Col span={24} style={{ marginTop: 25 }}>
          <div className="input-group">
            <Label label={"ユーザーID"} />
            <div className="input-element">
              <Input
                control={control}
                inputName="userName"
                inputProps={{
                  placeholder: "半角英数字20文字以内で入力して下さい",
                  maxLength: 20,
                  autoComplete: "off",
                }}
                callback={handleUserId}
              />
            </div>
            <div className="input-footer">※下記のIDでログインしてください</div>
            {userId}
          </div>
        </Col>
        <Col span={24} style={{ marginTop: 25 }}>
          <div className="input-group">
            <Label label={"パスワード"} />
            <div className="input-element">
              <Input
                control={control}
                inputName="password"
                inputProps={{
                  placeholder: "半角英数字8文字以上で入力してください",
                  type: showPassword ? "text" : "password",
                  value: { password },
                  autoComplete: "new-password",
                }}
              />
            </div>
            <div className="input-footer">
              <Checkbox
                checked={showPassword}
                onChange={() => handleShowPassword()}
              >
                {" "}
                パスワードを表示する
              </Checkbox>
            </div>
          </div>
        </Col>
        <Col span={24} style={{ marginTop: 25 }}>
          <div className="input-group">
            <Label label={"対象店舗"} required={true} />
            <div className="input-element" style={{ marginRight: 25 }}>
              <Select
                control={control}
                inputName={"storeId"}
                placeholder={"店舗を選択してください"}
                Options={stores.map((m) => ({
                  key: m.id,
                  label: m.name,
                  disabled: m.status !== 0 ? "disabled" : "",
                }))}
              />
            </div>
          </div>
        </Col>
      </Row>
    </div>
  );
}

AccountMasterForm.propTypes = {
  control: PropTypes.any,
  stores: PropTypes.array,
  showPassword: PropTypes.bool,
  handleShowPassword: PropTypes.func,
  password: PropTypes.string,
  userId: PropTypes.string,
  handleUserId: PropTypes.func,
};

export default AccountMasterForm;
