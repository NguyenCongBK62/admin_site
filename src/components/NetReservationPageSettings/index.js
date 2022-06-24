import React from "react";
import { Col, Row } from "antd";
import PropTypes from "prop-types";
import { CopyOutlined } from "@ant-design/icons";
import CopyToClipboard from "react-copy-to-clipboard";

import SelectPicker from "components/SelectPicker";
import {
  displayCrowdedPercentOptions,
  reservedBeforeDayEndOptions,
  reservedBeforeDayOptions,
  reservedBeforeHourStartOptions,
  publicStatusButtons,
} from "containers/StoreMasterCreateUpdate/data";
import {
  Input,
  NumberInput,
  TextArea,
  RadioButton,
} from "components/FormControllers";
import SectionHeader from "components/Form/atoms/SectionHeader";
import Label from "components/Form/atoms/Label";
import MonitorIcon from "components/Icons/MonitorIcon";

export default function NetReservationPageSettings({
  control,
  watch,
  isEdit,
  onCopyText,
}) {
  return (
    <Row className="form-section" style={{ marginTop: 30 }}>
      <Col span={24}>
        <SectionHeader label={"ネット予約ページ設定"} />
      </Col>
      <Col span={24}>
        <div className="input-group">
          <Label label={"受付期間設定"} required={false} />
          <div className="input-elements-inline" style={{ flexWrap: "wrap" }}>
            <div className="input-element">
              <SelectPicker
                control={control}
                inputName={"netReservation.reservedBeforeDay"}
                defaultValue={0}
                inputProps={{
                  placeholder: "当日",
                  style: { width: 80 },
                }}
                Options={reservedBeforeDayOptions.map((r, index) => ({
                  key: index,
                  label: r,
                }))}
              />
            </div>
            <div className="input-element" style={{ marginLeft: 30 }}>
              {!watch("netReservation.reservedBeforeDay") ||
              watch("netReservation.reservedBeforeDay") === "当日" ? (
                <>
                  <span> </span>
                  <SelectPicker
                    control={control}
                    inputName={"netReservation.reservedBeforeHourStart"}
                    defaultValue={0}
                    inputProps={{
                      placeholder: "指定なし",
                      style: { width: 100 },
                    }}
                    Options={reservedBeforeHourStartOptions.map((r, index) => ({
                      key: index,
                      label: r,
                    }))}
                  />
                </>
              ) : (
                <div
                  className="input-element"
                  style={{ display: "inline-block", marginTop: "4px" }}
                ></div>
              )}
              <span style={{ marginRight: "8px" }}> から </span>
            </div>
            <div className="input-element">
              {" "}
              <SelectPicker
                control={control}
                inputName={"netReservation.reservedBeforeDayEnd"}
                defaultValue={0}
                inputProps={{
                  placeholder: "指定なし",
                  style: { width: 100 },
                }}
                Options={reservedBeforeDayEndOptions.map((r, index) => ({
                  key: index,
                  label: r,
                }))}
              />
              <span> まで予約を受付ける {"   "}</span>
            </div>
          </div>
        </div>
      </Col>{" "}
      <Col span={24} style={{ marginTop: 12 }}>
        <div className="input-group">
          <Label label={"空き状況の表示設定"} required={false} />
          <div className="input-elements-inline" style={{ flexWrap: "wrap" }}>
            <div className="input-element">
              <span style={{ marginLeft: "0px" }}>空きが </span>
              <SelectPicker
                control={control}
                inputName={"netReservation.displayCrowdedPercent"}
                defaultValue={3}
                inputProps={{
                  placeholder: "3割",
                  style: { width: 80 },
                }}
                Options={displayCrowdedPercentOptions.map((d, index) => ({
                  key: index + 1,
                  label: d,
                }))}
              />
              <span> を切った枠を「△」表示する</span>
            </div>
          </div>
        </div>
      </Col>{" "}
      <Col span={24} style={{ marginTop: 12 }}>
        <div className="input-group">
          <Label label={"注意書き"} required={false} />
          <div className="input-element">
            <TextArea
              control={control}
              inputName={"netReservation.netReservationNote"}
              inputProps={{
                rows: 6,
                placeholder: "",
                maxLength: 500,
                style: {
                  background: "#fafafa",
                },
              }}
            />
          </div>
        </div>
      </Col>{" "}
      <Col span={24} style={{ marginTop: 12 }}>
        <div className="input-group">
          <Label label={"予約通知先"} required={false} />
          <div className="input-elements-inline" style={{ flexWrap: "wrap" }}>
            <span
              style={{ marginLeft: "0px", width: "110px", paddingTop: "10px" }}
            >
              携帯番号{" "}
            </span>
            <div className="input-element staff-phone-number">
              <NumberInput
                control={control}
                inputName="netReservation.staffPhonenumber"
                defaultValue={""}
                inputNumberProps={{
                  placeholder: "09012345678",
                }}
                className="ant-input-custom"
                type="tel"
                stringMode={true}
              />
            </div>
          </div>
          <div className="input-elements-inline" style={{ flexWrap: "wrap" }}>
            <span
              style={{ marginLeft: "0px", width: "110px", paddingTop: "10px" }}
            >
              メールアドレス{" "}
            </span>
            <div className="input-element staff-email">
              <Input
                control={control}
                inputName="netReservation.staffEmail"
                inputProps={{
                  placeholder: "mail@example.com",
                }}
                className="ant-input-custom"
              />
            </div>
          </div>
        </div>
      </Col>
      <Col span={24} style={{ marginTop: 12 }}>
        <div className="input-group">
          <div style={{ display: "flex" }}>
            <Col span={12}>
              <Label label={"ネット予約フォームURL"} required={false} />
            </Col>
            {isEdit ? (
              <Col span={12} style={{ textAlign: "end" }}>
                {" "}
                <a
                  href={watch("formReservationStores")}
                  target="_blank"
                  rel="noreferrer"
                >
                  <span
                    className="store-master-form__customLabel-text"
                    style={{ fontSize: "9px", fontWeight: 600 }}
                  >
                    <MonitorIcon width="11px" height="11px" />{" "}
                    予約フォームを見る
                  </span>
                </a>
              </Col>
            ) : null}
          </div>
          <div className="input-element">
            <Input
              control={control}
              inputName="formReservationStores"
              inputProps={{
                placeholder: "店舗情報登録後に表示されます。",
                style: {
                  maxWidth: "100%",
                  height: "40px !important",
                },
                maxLength: 255,
                disabled: true,
                addonAfter: isEdit ? (
                  <CopyToClipboard
                    text={watch("formReservationStores")}
                    onCopy={onCopyText}
                  >
                    <CopyOutlined />
                  </CopyToClipboard>
                ) : null,
              }}
            />
          </div>
        </div>
      </Col>
      <Col span={24} style={{ marginTop: 12 }}>
        <div className="input-group">
          <Label label={"公開ステータス"} required={false} />
          <div className="input-element" style={{ marginRight: 25 }}>
            <RadioButton
              control={control}
              defaultValue={"true"}
              inputName={"displayNetReservation"}
              buttons={publicStatusButtons}
              classes={"radio-button-container-flex-start"}
            />
          </div>
        </div>
      </Col>
    </Row>
  );
}

NetReservationPageSettings.propTypes = {
  control: PropTypes.any,
  watch: PropTypes.any,
  getValues: PropTypes.any,
  setTotalNumber: PropTypes.func,
  clearNumber: PropTypes.func,
  backspaceNumber: PropTypes.func,
  staffPhonenumberVisibleChange: PropTypes.func,
  staffPhonenumberVisible: PropTypes.any,
  staffPhonenumber: PropTypes.any,
  handleStaffPhonenumber: PropTypes.func,
  isEdit: PropTypes.bool,
  onCopyText: PropTypes.func,
};
