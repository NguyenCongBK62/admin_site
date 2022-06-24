import React from "react";
import PropTypes from "prop-types";
import { Col, Input, Menu, Row, Table } from "antd";
import Heading from "components/Heading";
import SearchIcon from "components/Icons/SearchIcon";
import "./style/index.less";
import DatePicker from "components/Datepicker";
import dayjs from "dayjs";

const inputStyle = {
  width: "174px",
  height: "40px",
  float: "right",
};

export function ReservationSearchDropdown({
  reservationColumns,
  reservationData,
  netReservationSize,
  searchAllNetReservation,
  control,
}) {
  return (
    <Menu className="reservation-search">
      <Menu.Item disabled={true}>
        <Row>
          <Col span={16}>
            <Heading>ネット予約</Heading>
          </Col>
          <Col span={8}>
            {" "}
            <p className="count-reservation">
              現在
              <span>{netReservationSize}</span>件
            </p>
          </Col>
        </Row>
      </Menu.Item>
      <Menu.Item disabled={true}>
        <Row
          style={{ marginTop: "19px" }}
          className={"responsive-search-reservation"}
        >
          <Col span={15}>
            {" "}
            <Input
              placeholder="予約を検索"
              suffix={<SearchIcon fill="#111111" />}
              className="search-bar-reservation"
              onChange={(val) => searchAllNetReservation(val.target.value)}
            />
          </Col>
          <Col span={9}>
            <DatePicker
              control={control}
              inputName={"date"}
              defaultValue={""}
              inputProps={{
                placeholder: "2019/07/25（木）",
                style: inputStyle,
              }}
              callback={(val) =>
                searchAllNetReservation(
                  val ? dayjs(val).format("YYYY-MM-DD") : ""
                )
              }
            />
          </Col>
        </Row>
      </Menu.Item>
      <Menu.Item disabled={true}>
        <Table
          columns={reservationColumns}
          scroll={{ y: 240 }}
          dataSource={reservationData}
          style={{ marginTop: "23px" }}
          pagination={false}
          size="small"
          locale={{
            emptyText: <span>{"ネット予約はありません"}</span>,
          }}
        />
      </Menu.Item>
    </Menu>
  );
}

ReservationSearchDropdown.propTypes = {
  reservationColumns: PropTypes.array,
  reservationData: PropTypes.array,
  netReservationSize: PropTypes.any,
  control: PropTypes.any,
  searchAllNetReservation: PropTypes.func,
};
