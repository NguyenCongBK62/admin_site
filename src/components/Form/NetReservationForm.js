import React from "react";
import PropTypes from "prop-types";
import { Row, Col, Typography } from "antd";
import {
  Select,
  NumberInput,
  List,
  Input,
  PhoneInput,
  TextArea,
  CheckboxSingle,
  FormCalendar,
} from "components/FormControllers";
import Label from "components/Form/atoms/Label";
import SectionHeader from "components/Form/atoms/SectionHeader";

function NetReservationForm({
  control,
  openHours,
  menus,
  errors,
  setEndTime,
  getAvailableTable,
  availableTables,
  store,
  publicHolidays,
}) {
  const { Text, Title } = Typography;
  return (
    <div
      className="form-wrapper res-form-wrapper"
      style={{ marginTop: 60, padding: "0 25px" }}
    >
      <Row className="form-section">
        <Col span={24}>
          <SectionHeader label={"空席検索"} />
        </Col>
        <Col span={24}>
          <div className="input-group">
            <Label label={"ご来店時間をお選びください。"} required={false} />
            <div className="input-elements-inline">
              <div className="input-element input-element-visit-time">
                <Select
                  control={control}
                  inputName={"startTime"}
                  placeholder={"-"}
                  Options={openHours.map((t) =>
                    t !== "--" ? { key: t, label: t } : { key: null, label: t }
                  )}
                  callback={setEndTime}
                />
                から
              </div>

              <div
                className="input-element input-element-visit-time"
                style={{ marginLeft: 15 }}
              >
                <Select
                  control={control}
                  inputName={"endTime"}
                  placeholder={"-"}
                  Options={openHours.map((t) => ({ key: t, label: t }))}
                  callback={getAvailableTable}
                />
                まで
              </div>
            </div>
          </div>
        </Col>
        <Col span={24} style={{ marginTop: 25 }}>
          <div className="input-group">
            <Label label={"ご来店人数を入力してください。"} required={false} />
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
                />
              </div>
              <div className="input-element" style={{ marginLeft: 20 }}>
                <Label label={"子ども"} required={false} />
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
                />
              </div>
            </div>
          </div>
        </Col>
        <Col span={24}>
          <div className="input-group">
            <Label
              label={"ご来店日の日付をお選びください。"}
              required={false}
            />
            <div className="input-element" style={{ marginRight: 25 }}>
              <FormCalendar
                control={control}
                inputName={"date"}
                showOverlay={!availableTables.length}
                availableTables={availableTables}
                store={store}
                publicHolidays={publicHolidays}
                callback={getAvailableTable}
              />
              <div className="calender-label">
                ● 空席あり ▲ 残りわずか <b>x</b> 空席なし
              </div>
            </div>
          </div>
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
      </Row>
      <Row className="form-section" style={{ marginTop: 40 }}>
        <Col span={24}>
          <SectionHeader label={"予約者情報"} />
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
                  inputProps={{ placeholder: "セイ" }}
                />
              </div>
              <div className="input-element">
                <Input
                  control={control}
                  inputName="firstName"
                  inputProps={{ placeholder: "メイ" }}
                />
              </div>
            </div>
            <div className="input-footer">※苗字のみでも可</div>
          </div>
        </Col>
        <Col span={24} style={{ marginTop: 25 }}>
          <div className="input-group">
            <Label label={"お電話番号"} />
            <div className="input-element input-element-phone">
              <PhoneInput
                control={control}
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
            <Label label={"メールアドレス"} required={false} />
            <div className="input-element">
              <Input
                control={control}
                inputName="email"
                validation={{
                  pattern: {
                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                    message: "メールアドレスが不正です",
                  },
                }}
                errors={errors.email}
                inputProps={{ placeholder: "mail@example.com" }}
                className="ant-input-custom"
              />
            </div>
            <div className="input-footer">※予約確認メールが送信されます</div>
          </div>
        </Col>
        <Col span={24} style={{ marginTop: 25 }}>
          <div className="input-group">
            <Label label={"ご要望欄"} required={false} />
            <div className="input-element" style={{ marginRight: 25 }}>
              <TextArea
                control={control}
                inputName={"note"}
                inputProps={{ rows: 6, placeholder: "補足を記入してください" }}
              />
            </div>
          </div>
        </Col>
        <Col span={24} style={{ marginTop: 25 }}>
          <div className="input-group">
            <Label label={"キャンペーン等のご案内"} required={false} />
            <div className="input-element" style={{ marginRight: 25 }}>
              <CheckboxSingle
                control={control}
                inputName="allowGroupMessage"
                label={"予約した店舗、系列店からキャンペーン等の情報を受け取る"}
              />
            </div>
          </div>
        </Col>
      </Row>
      <Row className="form-section" style={{ marginTop: 40 }}>
        <Title
          level={5}
          style={{ width: "100%", textAlign: "center", paddingBottom: 20 }}
        >
          個人情報の取り扱いについて
        </Title>
        <Text>
          本予約システムは、株式会社Wiz（以下「当社」といいます）が提供しております。
          <br />
          本予約システムでご入力された情報その他お客様が本予約システムを利用することで取得される情報は、本店（予約対象の店舗）及び当社が取得し、当社は当社の定める下記「個人情報について」の規定に従い、お客様の個人情報を取り扱います。
          <br />
          ご予約の内容のご確認、下記「個人情報について」にご同意の上、「確定」ボタンを押して、予約を確定させてください。
        </Text>
        <Text
          style={{ width: "100%", textAlign: "center", paddingTop: "30px" }}
        >
          個人情報の取り扱い詳細については
          <a
            className="net-link"
            href="https://012grp.co.jp/policy"
            target="_blank"
            rel="noreferrer"
          >
            プライバシーポリシー
          </a>
          をご覧ください
        </Text>
        <Text
          style={{
            width: "100%",
            textAlign: "center",
            paddingBottom: 10,
            paddingTop: 10,
          }}
        >
          <CheckboxSingle
            control={control}
            inputName="privacyAgreement"
            label={"「個人情報について」同意する"}
          />
        </Text>

        <Col span={24}>
          <Row justify="center" style={{ marginTop: 20 }}>
            <button
              type="submit"
              className="button button-primary button-primary-2"
            >
              確認
            </button>
          </Row>
        </Col>
      </Row>
    </div>
  );
}

NetReservationForm.propTypes = {
  control: PropTypes.any,
  openHours: PropTypes.array,
  menus: PropTypes.array,
  setEndTime: PropTypes.func,
  getAvailableTable: PropTypes.func,
  availableTables: PropTypes.any,
  errors: PropTypes.any,
  store: PropTypes.any,
  publicHolidays: PropTypes.array,
};

export default NetReservationForm;
