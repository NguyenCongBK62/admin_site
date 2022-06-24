import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import PropTypes from "prop-types";
import dayjs from "dayjs";
import timezone from "dayjs/plugin/timezone";
import utc from "dayjs/plugin/utc";

import { Modal, Radio, Tag, Row, Col, Divider, Button, Spin } from "antd";
import {
  CalendarOutlined,
  ClockCircleOutlined,
  TeamOutlined,
  IdcardOutlined,
  PhoneOutlined,
  DeleteOutlined,
  ExclamationCircleOutlined,
  ArrowLeftOutlined,
  CloseOutlined,
} from "@ant-design/icons";
import { getDayOfWeek, translateReservationStatus } from "utils/common";

dayjs.extend(utc);
dayjs.extend(timezone);

const options = [
  { label: "来店待ち", value: 0 },
  { label: "来店中", value: 1 },
  { label: "退店", value: 2 },
  { label: "No Show", value: 3 },
];

function ReservationDetailsModal({
  isModalVisible,
  handleCancel,
  onChange,
  forCustomer,
  handleDelete,
  reservation: reservationData,
}) {
  const history = useHistory();
  const { reservation, linkPage, customer, tables } = reservationData;
  const [isLoading, setIsLoading] = useState(false);
  const { confirm } = Modal;
  const tags = [];

  const handleDeleteAction = (id) => {
    setIsLoading(false);

    confirm({
      icon: <ExclamationCircleOutlined />,
      content:
        "キャンセルした予約はもとに戻せません。予約をキャンセルしてもよろしいですか？",
      okText: "はい",
      okType: "danger",
      cancelText: "いいえ",
      centered: true,
      onOk() {
        if (reservation.isLineReservation) {
          confirm({
            icon: <ExclamationCircleOutlined />,
            content: "ご予約キャンセルのメッセージを送りますか？",
            okText: "送信する",
            okType: "danger",
            cancelText: "送信しない",
            centered: true,
            onOk() {
              setIsLoading(false);
              handleDelete(id, true);
            },
            onCancel() {
              setIsLoading(false);
              handleDelete(id, false);
            },
          });
        } else {
          setIsLoading(false);
          handleDelete(id, false);
        }
      },
      onCancel() {
        setIsLoading(false);
      },
    });
  };

  if (linkPage !== null && linkPage !== undefined) {
    tags.push(<Tag key={reservation.id}>{linkPage.name}</Tag>);
  }

  if (
    reservation.isNetReservation !== null &&
    reservation.isNetReservation !== undefined &&
    reservation.isNetReservation === true &&
    (reservation.reserveMethod === null ||
      reservation.reserveMethod.deleted === true)
  ) {
    tags.push(<Tag key={reservation.id}>ネット予約</Tag>);
  }

  if (
    (reservation.isNetReservation === null ||
      reservation.isNetReservation === undefined ||
      (reservation.isNetReservation !== true &&
        reservation.isNetReservation !== "true")) &&
    (linkPage == null || linkPage === undefined) &&
    (reservation.reserveMethod === null ||
      reservation.reserveMethod.deleted === true)
  ) {
    tags.push(
      <Tag key={reservation.id}>
        {reservation.isLineReservation ? "LINE予約" : "直接予約"}{" "}
      </Tag>
    );
  }

  if (
    reservation.reserveMethod !== null &&
    reservation.reserveMethod.deleted === false &&
    linkPage === null &&
    linkPage === undefined
  ) {
    tags.push(<Tag key={reservation.id}>{reservation.reserveMethod.name}</Tag>);
  }
  let footer = [];

  if (!forCustomer) {
    footer = [
      <Button
        key="delete"
        type="text"
        style={{ float: "left", paddingLeft: "0px" }}
        onClick={() => handleDeleteAction(reservation.id)}
      >
        <DeleteOutlined style={{ fontSize: 16 }} />
        予約をキャンセル
      </Button>,
      <Button key="cancel" onClick={handleCancel}>
        閉じる
      </Button>,
      <Button
        key="link"
        onClick={() => {
          const url = history.location;
          let state = {};
          if (url.pathname === "/") {
            state = url;
          }
          history.push({
            pathname: `/reservation/edit/${reservation.id}`,
            state: { url: state },
          });
        }}
        type="primary"
      >
        変更する
      </Button>,
    ];
  }
  return (
    <Spin tip="" size="large" spinning={isLoading}>
      <Modal
        visible={isModalVisible}
        onCancel={handleCancel}
        afterClose={handleCancel}
        footer={footer}
        destroyOnClose={true}
        title={"ご予約内容"}
        className="reservation-modal"
        closeIcon={forCustomer ? <ArrowLeftOutlined /> : <CloseOutlined />}
      >
        <div className="reservation-modal-button-group">
          <Radio.Group
            options={options}
            onChange={(e) => onChange(reservation.id, e.target.value)}
            defaultValue={reservation.reservationTrackingStatus}
            optionType="button"
            buttonStyle="solid"
            size="middle"
            disabled={forCustomer}
          />
        </div>
        <div className="reservation-modal-tags-group">
          {tags}{" "}
          <Tag>
            {customer.numberOfVisit === null ||
            customer.numberOfVisit === undefined ||
            customer.numberOfVisit === 0
              ? "ご新規"
              : "来店回数：" + customer.numberOfVisit + "回"}
          </Tag>
        </div>
        <div className="reservation-modal-details">
          <Row>
            <Col span={12}>
              <div className="icon-container">
                <CalendarOutlined style={{ fontSize: 16 }} />
              </div>
              <div className="data-container">
                {dayjs(reservation.startTime)
                  .tz("Asia/Tokyo")
                  .format("YYYY/MM/DD")}{" "}
                (
                {getDayOfWeek(
                  dayjs(reservation.startTime).tz("Asia/Tokyo").day()
                )}
                )
              </div>
            </Col>
            <Col span={12}>
              <div className="icon-container">
                <ClockCircleOutlined style={{ fontSize: 16 }} />
              </div>
              <div className="data-container">
                {dayjs(reservation.startTime).tz("Asia/Tokyo").format("HH:mm")}
                〜{dayjs(reservation.endTime).tz("Asia/Tokyo").format("HH:mm")}
              </div>
            </Col>
          </Row>
          <Row>
            <div className="icon-container">
              <TeamOutlined style={{ fontSize: 16 }} />
            </div>
            <div className="data-container">
              <span>{reservation.numberOfCustomers}</span>
              名（大人：
              <span>{reservation.numberOfAdults}</span>
              名、子ども：
              <span>{reservation.numberOfKids}</span>名）
            </div>
          </Row>
          <Row>
            <div className="icon-container">
              <IdcardOutlined style={{ fontSize: 16 }} />
            </div>
            <div className="data-container">
              {customer.spelling === "null null" ? "" : customer.spelling}様
            </div>
          </Row>
          <Row>
            <div className="icon-container">
              <PhoneOutlined style={{ fontSize: 16 }} />
            </div>
            <div className="data-container">{customer.phonenumber}</div>
          </Row>

          <Divider />

          <Row>
            <div className="label-container">メニュー：</div>
            <div className="data-container">
              {reservation.menus.map((menu, i) => (
                <span key={`menu-${i}`}>
                  {menu.name}
                  {menu.isDeleted ? " (旧メニュー)" : ""}
                </span>
              ))}
            </div>
          </Row>
          <Row>
            <div className="label-container">テーブル：</div>
            <div
              className="data-container"
              style={{ flexDirection: "column", alignItems: "flex-start" }}
            >
              {tables.map((table, i) => (
                <span key={`table-${i}`}>
                  {table.name}
                  {table.isDeleted === true ? "(削除済み)" : ""}
                </span>
              ))}
            </div>
          </Row>
          <Row>
            <div className="label-container">ステータス：</div>
            <div className="data-container">
              {reservation.deleted
                ? "キャンセル"
                : translateReservationStatus(reservation.reservationStatus)}
            </div>
          </Row>
          <Row>
            <div className="label-container">予約メモ：</div>{" "}
            <div className="data-container">{reservation.note}</div>
          </Row>
          <Row>
            <div className="label-container">予約受付：</div>
            <div className="data-container">
              {reservation.receptionist ? reservation.receptionist.name : ""}
              {reservation.receptionist &&
              reservation.receptionist.deleted === true
                ? "(削除済み)"
                : ""}
            </div>
          </Row>
          <Row>
            <div className="label-container">予約経路:</div>
            <div className="data-container">
              {reservation.reserveMethod !== null
                ? reservation.reserveMethod.name
                : ""}
            </div>
          </Row>
        </div>
      </Modal>
    </Spin>
  );
}

ReservationDetailsModal.propTypes = {
  isModalVisible: PropTypes.bool,
  forCustomer: PropTypes.bool,
  handleCancel: PropTypes.func,
  onChange: PropTypes.func,
  reservation: PropTypes.any,
  handleDelete: PropTypes.func,
};

export default ReservationDetailsModal;
