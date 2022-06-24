import React from "react";
import { Badge, Col, Dropdown, Input, Layout, Row, Button } from "antd";
import "./style/index.less";
import MonitorIcon from "components/Icons/MonitorIcon";
import { NavLink, useHistory } from "react-router-dom";
import { useForm } from "react-hook-form";

import FileTextIcon from "components/Icons/FileTextIcon";
import BellIcon from "components/Icons/BellIcon";
import HomeIcon from "components/Icons/HomeIcon";
import ProfileIcon from "components/Icons/ProfileIcon";
import SearchIcon from "components/Icons/SearchIcon";
import PropTypes from "prop-types";
import { ReservationSearchDropdown } from "./ReservationSearchDropdown";
import NoticeDropdown from "./NoticeDropdown";
import StoreDropdown from "./StoreDropdown";
import UserDropdown from "./UserDropdown";
import MenuIcon from "components/Icons/MenuIcon";
import Logo from "../../assets/umat_logo.svg";
import HelpCircleIcon from "components/Icons/HelpCircleIcon";
import { useDispatch, useSelector } from "react-redux";
import { setShowSecondHeader } from "actions/common";

const { Header } = Layout;

export default function Navbar({
  showBackdrop,
  notifications,
  goToReservationNow,
  updateMsgNotifyWatched,
  stores,
  selectedStore,
  changeStore,
  reservationColumns,
  reservationData,
  role,
  selectedStoreId,
  logout,
  hasReservation,
  toNetReservationPage,
  goAccountList,
  netReservationSize,
  searchAllNetReservation,
  isIphone,
  toggleCollapsed,
  deleteNotification,
  getOldNotification,
  updateOldNotification,
}) {
  const IconWidth = "22";
  const IconHeight = "22";
  const customStyles = { position: "relative", bottom: "7px" };
  const history = useHistory();
  const { control, setValue } = useForm();
  const showSecondHeader = useSelector(
    (state) => state.layoutReducer.showSecondHeader
  );
  const dispatch = useDispatch();

  return (
    <>
      <Header
        className="header"
        style={isIphone ? { height: "70px", padding: "0px 15px" } : {}}
      >
        <Row style={{ justifyContent: "space-between" }}>
          <Col xs={4} sm={4} md={6} lg={8} xl={6}>
            <div
              className="logo"
              onClick={() => (window.location.href = "/")}
              style={isIphone ? { marginTop: "12px", fontSize: "30px" } : {}}
            >
              <img
                src={Logo}
                height={isIphone ? "40px" : "54px"}
                width={isIphone ? "134px" : "180px"}
                alt="Umat Logo"
              />
            </div>
          </Col>
          {!isIphone ? (
            <>
              <Col xs={16} sm={16} md={12} lg={8} xl={12} className="search">
                <Input
                  placeholder="予約を検索（名前/名前カナ/携帯番号）"
                  suffix={<SearchIcon />}
                  className="search-bar"
                  disabled={history.location.pathname.includes(
                    "/reservation/edit"
                  )}
                  onKeyDown={(v) =>
                    v.key === "Enter"
                      ? history.push(
                          `/reservation/list?searchText=${v.target.value}`
                        )
                      : ""
                  }
                />
              </Col>
              <Col xs={4} sm={4} md={6} lg={8} xl={6}>
                <ul className="menu">
                  <Dropdown
                    overlay={ReservationSearchDropdown({
                      reservationColumns,
                      reservationData,
                      netReservationSize,
                      searchAllNetReservation,
                      control,
                    })}
                    placement="bottomRight"
                    arrow
                    trigger={["click"]}
                    onVisibleChange={(visible) => {
                      showBackdrop(visible);
                      setValue("date", null);
                      searchAllNetReservation("");
                    }}
                    overlayClassName={"menu-items-dropdown store-dropdown"}
                  >
                    <li className="menu-items">
                      <Badge
                        count={netReservationSize}
                        offset={[5, -10]}
                        size={"small"}
                      >
                        <MonitorIcon
                          width={IconWidth}
                          height={IconHeight}
                          customStyles={customStyles}
                        />
                      </Badge>
                    </li>
                  </Dropdown>

                  <li className="menu-items">
                    <NavLink to="/customer/list">
                      <FileTextIcon
                        width={IconWidth}
                        height={IconHeight}
                        customStyles={customStyles}
                      />
                    </NavLink>
                  </li>
                  <Dropdown
                    overlay={NoticeDropdown({
                      notifications,
                      goToReservationNow,
                      updateMsgNotifyWatched,
                      deleteNotification,
                      getOldNotification,
                      updateOldNotification,
                    })}
                    placement="bottomRight"
                    arrow
                    trigger={["click"]}
                    onVisibleChange={(visible) => {
                      showBackdrop(visible);
                      if (visible) {
                        updateOldNotification();
                      }
                    }}
                    overlayClassName={"menu-items-dropdown"}
                  >
                    <li className="menu-items">
                      <Badge
                        count={notifications.totalNewMsg}
                        offset={[5, -10]}
                        size={"small"}
                      >
                        <BellIcon
                          width={IconWidth}
                          height={IconHeight}
                          customStyles={customStyles}
                        />
                      </Badge>
                    </li>
                  </Dropdown>
                  <Dropdown
                    overlay={StoreDropdown({
                      stores,
                      selectedStore,
                      changeStore,
                    })}
                    placement="bottomRight"
                    arrow
                    trigger={["click"]}
                    // onClick={showBackdrop}
                    onVisibleChange={showBackdrop}
                    overlayClassName={"menu-items-dropdown"}
                  >
                    <li className="menu-items">
                      <HomeIcon
                        width={IconWidth}
                        height={IconHeight}
                        customStyles={customStyles}
                      />
                    </li>
                  </Dropdown>
                  <Dropdown
                    overlay={UserDropdown({
                      logout,
                      stores,
                      selectedStoreId,
                      role,
                      showBackdrop,
                      hasReservation,
                      toNetReservationPage,
                      goAccountList,
                    })}
                    placement="bottomRight"
                    arrow
                    trigger={["click"]}
                    // onClick={showBackdrop}
                    onVisibleChange={showBackdrop}
                    overlayClassName={"menu-items-dropdown"}
                  >
                    <li className="profile-icon">
                      <ProfileIcon />
                    </li>
                  </Dropdown>
                </ul>
              </Col>
            </>
          ) : (
            <Col xs={4} sm={4} md={6} lg={8} xl={6}>
              <ul className="menu" style={{ marginTop: "0px" }}>
                <li className="menu-items">
                  <Button
                    type="primary"
                    className={showSecondHeader ? "nav-help-icon" : "menu-icon"}
                    style={{
                      marginTop: "10px",
                    }}
                    onClick={() =>
                      dispatch(setShowSecondHeader(!showSecondHeader))
                    }
                  >
                    <Badge
                      dot
                      style={{ height: "10px", width: "10px" }}
                      count={netReservationSize + notifications.totalNewMsg}
                      offset={[-5, 0]}
                    >
                      <HelpCircleIcon
                        width={IconWidth}
                        height={IconHeight}
                        customStyles={customStyles}
                      />
                    </Badge>
                  </Button>
                </li>
                <li className="menu-items">
                  <Button
                    type="primary"
                    className="menu-icon"
                    onClick={() => toggleCollapsed(!isIphone)}
                    style={{ marginTop: "10px" }}
                  >
                    <MenuIcon height={"30"} width={"30"} />
                  </Button>
                </li>
              </ul>
            </Col>
          )}
        </Row>
      </Header>
      {isIphone && showSecondHeader ? (
        <Header
          className="header second-header"
          style={
            isIphone
              ? {
                  height: "60px",
                  padding: "0px 15px",
                  top: "70px",
                  position: "fixed",
                  borderTop: "0px",
                }
              : {}
          }
        >
          <Row style={{ justifyContent: "space-between" }}>
            <>
              <Col span={24}>
                <ul className="menu">
                  <Dropdown
                    overlay={ReservationSearchDropdown({
                      reservationColumns,
                      reservationData,
                      netReservationSize,
                      searchAllNetReservation,
                      control,
                    })}
                    // placement="bottomCenter"
                    arrow
                    trigger={["click"]}
                    onVisibleChange={(visible) => {
                      showBackdrop(visible);
                      setValue("date", null);
                      searchAllNetReservation("");
                    }}
                    overlayClassName={
                      "menu-items-dropdown reservation-dropdown"
                    }
                  >
                    <li className="menu-items">
                      <Badge
                        count={netReservationSize}
                        offset={[0, -5]}
                        size={"small"}
                        dot
                        style={{ height: "10px", width: "10px" }}
                      >
                        <MonitorIcon
                          width={IconWidth}
                          height={IconHeight}
                          customStyles={customStyles}
                        />
                      </Badge>
                    </li>
                  </Dropdown>

                  <li className="menu-items">
                    <NavLink to="/customer/list">
                      <FileTextIcon
                        width={IconWidth}
                        height={IconHeight}
                        customStyles={customStyles}
                      />
                    </NavLink>
                  </li>
                  <Dropdown
                    overlay={NoticeDropdown({
                      notifications,
                      goToReservationNow,
                      updateMsgNotifyWatched,
                      deleteNotification,
                      getOldNotification,
                      updateOldNotification,
                    })}
                    // placement="bottomCenter"
                    arrow
                    trigger={["click"]}
                    // onVisibleChange={showBackdrop}
                    onVisibleChange={(visible) => {
                      showBackdrop(visible);
                      if (visible) {
                        updateOldNotification();
                      }
                    }}
                    overlayClassName={"menu-items-dropdown notice-dropdown"}
                  >
                    <li className="menu-items">
                      <Badge
                        count={notifications.totalNewMsg}
                        offset={[0, -5]}
                        size={"small"}
                        dot
                        style={{ height: "10px", width: "10px" }}
                      >
                        <BellIcon
                          width={IconWidth}
                          height={IconHeight}
                          customStyles={customStyles}
                        />
                      </Badge>
                    </li>
                  </Dropdown>

                  <Dropdown
                    overlay={StoreDropdown({
                      stores,
                      selectedStore,
                      changeStore,
                    })}
                    // placement="bottomCenter"
                    arrow
                    trigger={["click"]}
                    // onClick={showBackdrop}
                    onVisibleChange={showBackdrop}
                    overlayClassName={"menu-items-dropdown store-dropdown"}
                  >
                    <li className="menu-items">
                      <HomeIcon
                        width={IconWidth}
                        height={IconHeight}
                        customStyles={customStyles}
                      />
                    </li>
                  </Dropdown>
                  <Dropdown
                    overlay={UserDropdown({
                      logout,
                      stores,
                      selectedStoreId,
                      role,
                      showBackdrop,
                      hasReservation,
                      toNetReservationPage,
                      goAccountList,
                    })}
                    // placement="bottomRight"
                    arrow
                    trigger={["click"]}
                    // onClick={showBackdrop}
                    onVisibleChange={showBackdrop}
                    overlayClassName={"menu-items-dropdown user-dropdown-arrow"}
                  >
                    <li className="profile-icon">
                      <ProfileIcon />
                    </li>
                  </Dropdown>
                </ul>
              </Col>
            </>
          </Row>
        </Header>
      ) : (
        ""
      )}
    </>
  );
}

Navbar.propTypes = {
  showBackdrop: PropTypes.func,
  notifications: PropTypes.object,
  updateMsgNotifyWatched: PropTypes.func,
  goToReservationNow: PropTypes.func,
  stores: PropTypes.array,
  selectedStore: PropTypes.object,
  changeStore: PropTypes.func,
  reservationColumns: PropTypes.array,
  reservationData: PropTypes.array,
  role: PropTypes.string,
  selectedStoreId: PropTypes.any,
  logout: PropTypes.func,
  hasReservation: PropTypes.any,
  toNetReservationPage: PropTypes.func,
  goAccountList: PropTypes.func,
  netReservationSize: PropTypes.any,
  searchAllNetReservation: PropTypes.func,
  isIphone: PropTypes.bool,
  toggleCollapsed: PropTypes.func,
  deleteNotification: PropTypes.func,
  getOldNotification: PropTypes.func,
  updateOldNotification: PropTypes.func,
};
