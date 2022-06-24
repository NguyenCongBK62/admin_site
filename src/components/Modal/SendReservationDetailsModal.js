import React from "react";
import PropTypes from "prop-types";
import ReactModal from "./ReactModal";
import { Row, Button } from "antd";
import { formatTime, getDayOfWeek } from "utils/common";
import dayjs from "dayjs";
import timezone from "dayjs/plugin/timezone";
import utc from "dayjs/plugin/utc";
import _ from "lodash";

dayjs.extend(utc);
dayjs.extend(timezone);
export default function SendReservationDetailsModal({
  isModalVisible,
  handleCancel,
  modalTitle,
  onSubmit,
  data,
  hasChange,
  changes,
}) {
  let tables = "";
  _.forEach(data?.tables, (m) => (tables += `${m.name}, `));

  let menus = "";
  _.forEach(data?.menus, (m) => (menus += `${m.name}, `));

  const modalBody = (
    <>
      {" "}
      <p style={{ textAlign: "center" }}>
        {hasChange
          ? "変更した内容をメッセージで送りますか?"
          : "以下の内容でメッセージを送ります。"}
      </p>
      <div className="reservation-modal-details">
        {!hasChange ? (
          <>
            <Row>
              <div className="label-container">日にち：</div>
              <div className="data-container">
                {dayjs(data?.date).tz("Asia/Tokyo").format("YYYY-MM-DD")} (
                {getDayOfWeek(dayjs(data.date).tz("Asia/Tokyo").day())})
              </div>
            </Row>
            <Row>
              <div className="label-container">時間 : </div>
              <div className="data-container">
                {data?.startTime} 〜 {data?.endTime}
              </div>
            </Row>
            <Row>
              <div className="label-container">人数 ：</div>
              <div className="data-container">
                大人　{data?.adultNumber}人　　子ども　　{data?.childNumber}人
              </div>
            </Row>
            <Row>
              <div className="label-container">お名前 ：</div>
              <div className="data-container">
                {data?.lastName} {data?.firstName}様
              </div>
            </Row>
            <Row>
              <div className="label-container">携帯番号 ：</div>
              <div className="data-container">{data?.phoneNumber}</div>
            </Row>
            <Row>
              <div className="label-container">テーブル：</div>
              <div className="data-container">{tables.slice(0, -2)}</div>
            </Row>
            <Row>
              <div className="label-container">メニュー：</div>
              <div className="data-container">{menus.slice(0, -2)}</div>
            </Row>
            <Row>
              <div className="label-container">予約メモ：</div>
              <div className="data-container">
                <span style={{ maxWidth: "472px", overflowWrap: "break-word" }}>
                  {data?.note}
                </span>
              </div>
            </Row>
            <Row>
              <div className="label-container">予約担当 ：</div>
              <div className="data-container">{data?.receptionists}</div>
            </Row>
            <Row>
              <div className="label-container">予約経路 ：</div>
              <div className="data-container">{data.reservationMethods}</div>
            </Row>
          </>
        ) : (
          <>
            {changes.reservation?.startTime ? (
              <Row>
                <div className="label-container">日にち：</div>
                <div className="data-container">
                  {dayjs(changes.reservation?.startTime)
                    .tz("Asia/Tokyo")
                    .format("YYYY-MM-DD")}{" "}
                  (
                  {getDayOfWeek(
                    dayjs(changes.reservation?.startTime).tz("Asia/Tokyo").day()
                  )}
                  )
                </div>
              </Row>
            ) : (
              ""
            )}
            {changes.reservation?.endTime || changes.reservation?.startTime ? (
              <Row>
                <div className="label-container">時間 : </div>
                <div className="data-container">
                  {changes.reservation?.startTime
                    ? formatTime(changes.reservation.startTime)
                    : data?.startTime}{" "}
                  〜{" "}
                  {changes.reservation?.endTime
                    ? formatTime(changes.reservation.endTime)
                    : data?.endTime}
                </div>
              </Row>
            ) : (
              ""
            )}
            {changes.reservation?.numberOfAdults ||
            changes.reservation?.numberOfKids ? (
              <Row>
                <div className="label-container">人数 ：</div>
                <div className="data-container">
                  {changes.reservation?.numberOfAdults &&
                  changes.reservation?.numberOfKids
                    ? "大人 " +
                      changes.reservation?.numberOfAdults +
                      "人　　子ども　　" +
                      changes.reservation?.numberOfKids +
                      "人"
                    : changes.reservation?.numberOfAdults
                    ? "大人　" + changes.reservation?.numberOfAdults + "人"
                    : "子ども　" + changes.reservation?.numberOfKids + "人"}
                </div>
              </Row>
            ) : (
              ""
            )}
            {changes.customer?.spelling ? (
              <Row>
                <div className="label-container">お名前 ：</div>
                <div className="data-container">
                  {changes.customer?.spelling}様
                </div>
              </Row>
            ) : (
              ""
            )}
          </>
        )}
      </div>
    </>
  );
  const modalFooter = (
    // <div style={{ display: "flex", justifyContent: "space-evenly" }}>
    <>
      <Button key="cancel" onClick={handleCancel}>
        戻る
      </Button>
      <div>
        <Button
          key="doNotSend"
          onClick={() => {
            handleCancel();
            onSubmit(false);
          }}
        >
          送信しない
        </Button>
        <Button
          key="send"
          onClick={() => {
            handleCancel();
            onSubmit(true);
          }}
          type="primary"
          style={{ marginRight: "0px" }}
        >
          送信する
        </Button>
      </div>
    </>
    // </div>
  );
  const customStyles = {
    content: {
      width: "520px",
    },
  };
  return (
    <ReactModal
      isModalVisible={isModalVisible}
      handleCancel={handleCancel}
      modalTitle={modalTitle}
      modalBody={modalBody}
      modalFooter={modalFooter}
      customStyles={customStyles}
    />
  );
}

SendReservationDetailsModal.propTypes = {
  isModalVisible: PropTypes.bool,
  handleCancel: PropTypes.func,
  modalTitle: PropTypes.string,
  onSubmit: PropTypes.func,
  data: PropTypes.any,
  hasChange: PropTypes.bool,
  changes: PropTypes.object,
};
