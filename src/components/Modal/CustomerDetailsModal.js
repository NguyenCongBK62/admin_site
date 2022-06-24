import React from "react";
import PropTypes from "prop-types";
import dayjs from "dayjs";
import timezone from "dayjs/plugin/timezone";
import utc from "dayjs/plugin/utc";

import { Modal, Row, Col, Image, Table, Popover } from "antd";
import { MoreOutlined, ExclamationCircleOutlined } from "@ant-design/icons";
import { RightArrow } from "components/Icons/Arrows";
import Pill from "components/Pill";
import { useHistory } from "react-router-dom";

import {
  getDayOfWeek,
  getStatusTypeFromReservation,
  translateReservationStatus,
} from "utils/common";

import _ from "lodash";

dayjs.extend(utc);
dayjs.extend(timezone);

function CustomerDetailsModal({
  isModalVisible,
  handleCancel,
  handleDelete,
  customerData,
  handleReservationClick,
}) {
  const { customerDetails, customerHistory } = customerData;
  const { confirm } = Modal;
  const history = useHistory();

  const handleDeleteAction = (id) => {
    confirm({
      icon: <ExclamationCircleOutlined />,
      content: `削除したデータはもとに戻せません。 お客様情報を削除してもよろしいですか？ ※予約履歴も削除されます。
      `,
      okText: "はい",
      okType: "danger",
      cancelText: "いいえ",
      centered: true,
      onOk() {
        handleDelete(id);
      },
      onCancel() {},
    });
  };

  let totalVisit = 0;
  let lastVisitDate = null;

  totalVisit = customerDetails?.visitBefore;
  _.forEach(customerHistory, (h) => {
    if (
      h.reservationStatus === 0 &&
      (h.reservationTrackingStatus === 2 || h.reservationTrackingStatus === 1)
    ) {
      totalVisit += 1;
      if (lastVisitDate === null) {
        lastVisitDate = dayjs(h.startTime);
      } else if (lastVisitDate < dayjs(h.startTime)) {
        lastVisitDate = dayjs(h.startTime);
      }
    }
  });

  if (lastVisitDate) {
    lastVisitDate = `${dayjs(lastVisitDate)
      .tz("Asia/Tokyo")
      .format("YYYY-MM-DD")}${" "}
    (
    ${getDayOfWeek(dayjs(lastVisitDate).tz("Asia/Tokyo").day())}
      )`;
  }

  const columns = [
    {
      title: "",
      key: "reservationStatus",
      render: (k, row) => {
        if (!row.deleted) {
          return (
            <Pill
              type={getStatusTypeFromReservation(row)}
              label={translateReservationStatus(row.reservationStatus)}
            />
          );
        }
        return "";
      },
    },
    {
      title: "",
      key: "startTime",
      render: (k, row) => {
        return dayjs(row.startTime).format("YYYY/MM/DD");
      },
    },
    {
      title: "",
      key: "endTime",
      render: (k, row) => {
        return (
          dayjs(row.startTime).tz("Asia/Tokyo").format("HH:mm") +
          "〜" +
          dayjs(row.endTime).tz("Asia/Tokyo").format("HH:mm")
        );
      },
    },
    {
      title: "",
      key: "numberOfCustomers",
      render: (k, row) => {
        return row.numberOfCustomers + " 人";
      },
    },
    {
      title: "",
      key: "id",
      // eslint-disable-next-line react/display-name
      render: (k, row) => {
        return (
          <div onClick={() => handleReservationClick(row.id)}>
            <RightArrow />
          </div>
        );
      },
    },
  ];

  const content = (
    <div className={"customer-menu-dropdown"}>
      <p
        onClick={() => {
          history.push(`/customer/edit/${customerDetails.id}`);
        }}
      >
        お客様情報を編集する
      </p>
      {/* <p>メッセージを送る</p> */}
      <p onClick={() => handleDeleteAction(customerDetails.id)}>
        お客様情報を削除する
      </p>
    </div>
  );
  return (
    <Modal
      visible={isModalVisible}
      onCancel={handleCancel}
      onOk={handleCancel}
      footer={false}
      afterClose={handleCancel}
      title={
        <div>
          <Popover placement="bottomLeft" content={content} trigger="click">
            <span className={"customer-menu-icon"}>
              <MoreOutlined />
            </span>
          </Popover>
          お客様情報
        </div>
      }
      className="reservation-modal"
    >
      <Row>
        <Col span={18}>
          <Row>
            <span className="modal-label">名前:</span>
            <span className="modal-data">
              {customerDetails.lastname} {customerDetails.firstname}
            </span>
          </Row>
          <Row>
            <span className="modal-label">名前（カナ）：</span>
            <span className="modal-data">
              {customerDetails.spellingLastname}{" "}
              {customerDetails.spellingFirstname}
            </span>
          </Row>
          <Row>
            <span className="modal-label">携帯番号：</span>
            <span className="modal-data">{customerDetails.phonenumber}</span>
          </Row>
          <Row>
            <span className="modal-label">来店回数：</span>
            <span className="modal-data">{totalVisit}回</span>
          </Row>
          <Row>
            <span className="modal-label">前回来店日：</span>
            <span className="modal-data">{lastVisitDate}</span>
          </Row>
          <Row>
            <span className="modal-label">ステータス：</span>
            <span className="modal-data">{customerDetails.statusName}</span>
          </Row>
        </Col>
        <Col span={6}>
          <Image
            width={"100%"}
            height={150}
            src={customerDetails.avatar ? customerDetails.avatar : ""}
            fallback="data:image/png;base64,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"
          />
        </Col>
      </Row>
      <Row
        style={{
          marginTop: 25,
          maxHeight: 400,
          overflow: "auto",
          display: customerHistory.length ? "block" : "none",
          border: "1px solid #d9d9d9",
        }}
      >
        <Col>
          <Table
            dataSource={customerHistory.length ? customerHistory : []}
            className={"reservation-table"}
            columns={columns}
            pagination={false}
          />
        </Col>
      </Row>
    </Modal>
  );
}

CustomerDetailsModal.propTypes = {
  isModalVisible: PropTypes.bool,
  handleCancel: PropTypes.func,
  customerData: PropTypes.any,
  wrapper: PropTypes.any,
  handleDelete: PropTypes.func,
  handleReservationClick: PropTypes.func,
};

export default CustomerDetailsModal;
