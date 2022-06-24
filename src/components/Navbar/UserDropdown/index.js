import React from "react";
import { Col, Divider, Menu, Row } from "antd";
import PropTypes from "prop-types";
import Heading from "components/Heading";
import MonitorIcon from "components/Icons/MonitorIcon";
import SettingsIcon from "components/Icons/SettingsIcon";
import LogoutIcon from "components/Icons/LogoutIcon";
import auth from "utils/auth";

export default function UserDropdown({
  logout,
  stores = [],
  selectedStoreId = -1,
  role,
  showBackdrop,
  hasReservation,
  toNetReservationPage,
  goAccountList,
}) {
  return (
    <Menu className="user-dropdown">
      <Menu.Item onClick={showBackdrop}>
        <Heading>
          アカウント名：
          {auth.getKey("loginUser.name") !== "null"
            ? auth.getKey("loginUser.name")
            : ""}{" "}
          {role === "admin" ? "管理者" : ""}
        </Heading>
      </Menu.Item>
      <Menu.Item onClick={showBackdrop}>
        <Divider />
        <p style={{ cursor: "text" }}>
          ユーザーID: {auth.getKey("loginUser.userName")}
        </p>
        <Divider />
      </Menu.Item>
      {role !== "admin" && stores.length > 0
        ? stores.map((store) => {
            if (store.id === parseInt(selectedStoreId) && role !== "admin") {
              return (
                <Menu.Item
                  key={store.id}
                  value={store.id}
                  onClick={showBackdrop}
                >
                  <p style={{ cursor: "text" }}>対象店舗：{store.name}</p>
                  <Divider />
                </Menu.Item>
              );
            }
            return null;
          })
        : null}
      {hasReservation === "true" || hasReservation === true ? (
        <Menu.Item onClick={toNetReservationPage}>
          <Row>
            <Col style={{ margin: "16px 5px 0 0" }}>
              <MonitorIcon />
            </Col>{" "}
            <Col>
              {" "}
              <p>ネット予約ページを見る</p>
            </Col>
          </Row>
        </Menu.Item>
      ) : null}
      {role === "admin" ? (
        <Menu.Item onClick={goAccountList}>
          <Row>
            <Col style={{ margin: "16px 5px 0 0" }}>
              <SettingsIcon />
            </Col>{" "}
            <Col>
              {" "}
              <p>アカウントマスタ</p>
            </Col>
          </Row>
        </Menu.Item>
      ) : null}
      <Menu.Item onClick={logout}>
        <Row>
          <Col style={{ margin: "16px 5px 0 0" }}>
            <LogoutIcon />{" "}
          </Col>{" "}
          <Col>
            {" "}
            <p>ログアウト</p>
          </Col>
        </Row>
      </Menu.Item>
    </Menu>
  );
}

UserDropdown.propTypes = {
  logout: PropTypes.func,
  selectedStoreId: PropTypes.any,
  role: PropTypes.string,
  stores: PropTypes.array,
  showBackdrop: PropTypes.func,
  hasReservation: PropTypes.any,
  toNetReservationPage: PropTypes.func,
  goAccountList: PropTypes.func,
};
