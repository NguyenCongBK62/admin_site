import React from "react";
import { Affix, Card, Col, Row } from "antd";
import PropTypes from "prop-types";

import "./style/index.less";
import { translateStoreStatus } from "utils/common";
import { DeleteFilled } from "@ant-design/icons";

export default function StoreMasterViewData({
  watch,
  onCancel,
  isEdit,
  deleteStore,
}) {
  function formatBusinessHour(businessHours) {
    let formattedTime = "";
    businessHours.forEach((time, index) => {
      if (
        time.startTimeHour !== "" &&
        time.startTimeMinute !== "" &&
        time.startTimeHour !== undefined &&
        time.startTimeMinute !== undefined
      ) {
        formattedTime += time.startTimeHour + ":" + time.startTimeMinute;
      }
      if (
        time.endTimeHour !== "" &&
        time.endTimeMinute !== "" &&
        time.endTimeHour !== undefined &&
        time.endTimeMinute !== undefined
      ) {
        formattedTime += "~" + time.endTimeHour + ":" + time.endTimeMinute;
      }
      if (index < businessHours.length - 1) {
        formattedTime += " , ";
      }
    });
    return formattedTime;
  }

  function formatHolidays(weeklyHolidays) {
    let holidays = "";
    if (!weeklyHolidays) return holidays;
    weeklyHolidays.forEach((holiday, index) => {
      holidays += holiday.name;
      if (index < weeklyHolidays.length - 1) {
        holidays += " , ";
      }
    });
    return holidays;
  }

  return (
    <Affix>
      <div className="store-master-table">
        <Card
          title="店舗マスタ"
          headStyle={{
            fontSize: "16px",
            fontWeight: 700,
            textAlign: "center",
            lineHeight: "24px",
            color: "#fff",
            backgroundColor: "#121958",
          }}
          extra={
            isEdit ? (
              <DeleteFilled
                style={{ color: "white", cursor: "pointer" }}
                onClick={deleteStore}
                width="16"
                height="16"
              />
            ) : null
          }
        >
          <div className="store-master-table__card-component">
            <div className="store-master-table__card-component-header">
              <h4>店舗情報</h4>
            </div>

            <div className="store-master-table__card-component-content">
              <Row>
                <Col span={12}>
                  <h4 className="store-master-table__card-component-header">
                    店舗名
                  </h4>
                </Col>
                <Col span={12}>
                  <p>{watch("name")}</p>
                </Col>
              </Row>
              <Row>
                <Col span={12}>
                  <h4 className="store-master-table__card-component-header">
                    メッセージの表示名
                  </h4>
                </Col>
                <Col span={12}>
                  <p>{watch("displayName")}</p>
                </Col>
              </Row>
              <Row>
                <Col span={12}>
                  <h4 className="store-master-table__card-component-header">
                    郵便番号
                  </h4>
                </Col>
                <Col span={12}>
                  <p>{watch("postalCode")}</p>
                </Col>
              </Row>
              <Row>
                <Col span={12}>
                  <h4 className="store-master-table__card-component-header">
                    所在地
                  </h4>
                </Col>
                <Col span={12}>
                  <p>{watch("address")}</p>
                </Col>
              </Row>
              <Row>
                <Col span={12}>
                  <h4 className="store-master-table__card-component-header">
                    電話番号
                  </h4>
                </Col>
                <Col span={12}>
                  <p>{watch("phonenumber")}</p>
                </Col>
              </Row>
            </div>
          </div>

          <div className="store-master-table__card-component">
            <div className="store-master-table__card-component-header">
              <h4>営業情報</h4>
            </div>

            <div className="store-master-table__card-component-content">
              <Row>
                <Col span={12}>
                  <h4 className="store-master-table__card-component-header">
                    営業時間
                  </h4>
                </Col>
                <Col span={12}>
                  <p>
                    {watch("businessHours")
                      ? formatBusinessHour(watch("businessHours"))
                      : ""}
                  </p>
                </Col>
              </Row>
              <Row>
                <Col span={12}>
                  <h4 className="store-master-table__card-component-header">
                    定休日
                  </h4>
                </Col>
                <Col span={12}>
                  <p>{formatHolidays(watch("weeklyHolidays"))}</p>
                </Col>
              </Row>
              <Row>
                <Col span={12}>
                  <h4 className="store-master-table__card-component-header">
                    営業状況
                  </h4>
                </Col>
                <Col span={12}>
                  <p>{translateStoreStatus(watch("status"))}</p>
                </Col>
              </Row>
            </div>
          </div>

          <div className="store-master-table__card-component">
            <div className="store-master-table__card-component-header">
              <h4>リマインドメッセージ設定</h4>
            </div>

            <div className="store-master-table__card-component-content">
              <Row>
                <Col span={12}>
                  <h4 className="store-master-table__card-component-header">
                    配信タイミング
                  </h4>
                </Col>
                <Col span={12}>
                  <p>
                    {watch("remindBeforeDate")
                      ? `予約 ${watch("remindBeforeDate")}日前の`
                      : ""}
                    {watch("remindHour")
                      ? `${watch("remindHour")}時に配信`
                      : ""}
                  </p>
                </Col>
              </Row>
            </div>
          </div>

          <div className="store-master-table__card-component">
            <div className="store-master-table__card-component-header">
              <h4>ネット予約設定</h4>
            </div>

            <div className="store-master-table__card-component-content">
              <Row>
                <Col span={12}>
                  <h4 className="store-master-table__card-component-header">
                    受付期間設定
                  </h4>
                </Col>
                <Col span={12}>
                  <p>
                    {watch("netReservation.reservedBeforeDay") &&
                    watch("netReservation.reservedBeforeDay") !== 0
                      ? `${watch("netReservation.reservedBeforeDay")}当日から`
                      : ""}
                    {watch("netReservation.reservedBeforeHourStart") &&
                    watch("netReservation.reservedBeforeHourStart") !== 0
                      ? `当日${watch(
                          "netReservation.reservedBeforeHourStart"
                        )}時間後から`
                      : ""}
                    {watch("netReservation.reservedBeforeDayEnd") &&
                    watch("netReservation.reservedBeforeDayEnd") !== 0
                      ? `${watch(
                          "netReservation.reservedBeforeDayEnd"
                        )}日後まで予約を受付ける`
                      : ""}
                  </p>
                </Col>
              </Row>
              <Row>
                <Col span={12}>
                  <h4 className="store-master-table__card-component-header">
                    空き状況の表示設定
                  </h4>
                </Col>
                <Col span={12}>
                  <p>
                    `空きが${watch("netReservation.displayCrowdedPercent")}
                    割を切った枠を「△」表示する`
                  </p>
                </Col>
              </Row>
              <Row>
                <Col span={12}>
                  <h4 className="store-master-table__card-component-header">
                    注意書き
                  </h4>
                </Col>
                <Col span={12}>
                  <p className="elipsis-p">
                    {watch("netReservation.netReservationNote")}
                  </p>
                </Col>
              </Row>
              <Row>
                <Col span={12}>
                  <h4 className="store-master-table__card-component-header">
                    予約通知先
                  </h4>
                </Col>
                <Col span={12}>
                  <p>
                    {watch("netReservation.staffPhonenumber")
                      ? `${watch("netReservation.staffPhonenumber")}, `
                      : ""}
                    {watch("netReservation.staffEmail")}
                  </p>
                </Col>
              </Row>
              <Row>
                <Col span={12}>
                  <h4 className="store-master-table__card-component-header">
                    ネット予約フォームURL
                  </h4>
                </Col>
                <Col span={12}>
                  <p>
                    {watch("formReservationStores")
                      ? watch("formReservationStores")
                      : "店舗情報登録後に表示されます。"}
                  </p>
                </Col>
              </Row>
              <Row>
                <Col span={12}>
                  <h4 className="store-master-table__card-component-header">
                    公開ステータス
                  </h4>
                </Col>
                <Col span={12}>
                  <p>
                    {watch("displayNetReservation") &&
                    watch("displayNetReservation") === "true"
                      ? "公開中"
                      : "非公開"}
                  </p>
                </Col>
              </Row>
            </div>
          </div>
        </Card>

        <div
          className="store-master-table__button"
          style={{ width: "100%", marginTop: "16px" }}
        >
          <button
            type={"reset"}
            className="button button__default button__default-2"
            onClick={onCancel}
          >
            キャンセル
          </button>

          <button
            type={"submit"}
            className="button button__primary button__primary-2"
          >
            {isEdit ? "更新する" : "登録する"}
          </button>
        </div>
      </div>
    </Affix>
  );
}

StoreMasterViewData.propTypes = {
  watch: PropTypes.any,
  onCancel: PropTypes.func,
  isEdit: PropTypes.bool,
  deleteStore: PropTypes.func,
};
