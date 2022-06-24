import React, { useState, useEffect } from "react";
import { useMediaQuery } from "react-responsive";
import Navbar from "components/Navbar";
import PropTypes from "prop-types";
import { Spin, Layout as AntLayout, message } from "antd";
import dayjs from "dayjs";
import Sidebar from "components/Sidebar";
import Backdrop from "components/Backdrop";
import { useDispatch, useSelector } from "react-redux";
import { useHistory, useLocation } from "react-router";
import { setLogin, getAccountProfile } from "actions/login";

import "./style/index.less";
import auth from "utils/auth";
import {
  toggleCollapse,
  fetchAllStores,
  setSelectedStore,
  fetchNotifyMessage,
  setError,
  setSuccessMessage,
  fetchNetReservationUnconfirmedByStoreId,
  fetchStoreUUID,
  setIphone,
  deleteNotificationById,
  updateNotification,
  updateNotificationOld,
  setNotifications,
} from "actions/common";

import {
  updateReservationTrack,
  setReservationDetails,
  fetchReservationDetails,
  deleteReservation,
} from "actions/reservationActions";

import { ReservationDetailsModal } from "components/Modal";
import bg from "assets/bg.svg";
import { RightArrow } from "components/Icons/Arrows";
import { PhoneOutlined } from "@ant-design/icons";

import { getDayOfWeek, checkVersion } from "utils/common";

let intervalFunction = null;
let notifyFunction = null;

export default function Layout({ children }) {
  const dispatch = useDispatch();
  const { Content } = AntLayout;
  const collapsed = useSelector((state) => state.layoutReducer.collapsed);
  const backdrop = useSelector((state) => state.layoutReducer.backdrop);
  const stores = useSelector((state) => state.layoutReducer.stores);
  const error = useSelector((state) => state.layoutReducer.error);
  const storeIdMaster = auth.getKey("loginUser.StoreIdMaster");
  const successMessage = useSelector(
    (state) => state.layoutReducer.successMessage
  );
  const loading = useSelector((state) => state.layoutReducer.loading);
  const selectedStore = useSelector(
    (state) => state.layoutReducer.selectedStore
  );
  const notifications = useSelector(
    (state) => state.layoutReducer.notifications
  );

  let isIphone = useSelector((state) => state.layoutReducer.isIphone);
  const reservationDetails = useSelector(
    (state) => state.homeReducer.reservation
  );

  const netReservationUncofirmed = useSelector(
    (state) => state.layoutReducer.netReservationUncofirmed
  );

  const showSecondHeader = useSelector(
    (state) => state.layoutReducer.showSecondHeader
  );

  const selectStore = (storeId) => {
    if (
      location.pathname.includes("master") &&
      storeId !== parseInt(storeIdMaster) &&
      role !== "admin"
    ) {
      dispatch(setError("店舗切り替え権限がありません。"));
      setShowBackdrop(false);
      setVisible(false);
      return;
    }
    const tempStores = stores.filter((s) => {
      return s.id === storeId;
    });
    if (tempStores.length > 0) {
      dispatch(setSelectedStore(tempStores[0]));
    }
    setShowBackdrop(false);
    setVisible(false);
  };

  const [loggedOut, setLoggedOut] = useState(false);
  const [showBackdrop, setShowBackdrop] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);

  const [visible, setVisible] = useState(false);
  const [netReservationSize, setNetReservationSize] = useState(0);
  const [reservationDataSource, setReservationDataSource] = useState([]);

  const role = auth.getKey("loginUser.role");
  const selectedStoreId = auth.getKey("loginUser.storeId");
  const hasReservation = auth.getKey("loginUser.hasReservation");
  const hasSms = auth.getKey("loginUser.hasSms");
  const history = useHistory();
  const location = useLocation();
  const storeUUID = useSelector((state) => state.layoutReducer.storeUUID);

  let publicUrl = "";
  if (storeUUID) {
    publicUrl = window.location.origin + "/rsv/?id=" + storeUUID;
  }

  const customStyles = {
    cursor: "pointer",
  };
  const reservationColumns = [
    {
      title: "名前",
      width: "30%",
      render: function renderGivenNames(_, row) {
        return (
          <div>
            <p
              style={{
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
              }}
            >
              {row.customer.spelling !== undefined &&
              row.customer.spelling !== null
                ? row.customer.spelling
                : ""}
              <br />
              <PhoneOutlined style={{ fontSize: 14 }} />{" "}
              {row.customer.phonenumber !== undefined
                ? row.customer.phonenumber
                : ""}
            </p>
          </div>
        );
      },
    },
    {
      title: "人数",
      width: "15%",
      render: function renderNumberOfPeople(_, row) {
        return (
          <div>
            <p>{row.reservation.numberOfCustomers} 名</p>
          </div>
        );
      },
    },
    {
      title: "日にち",
      width: "25%",
      render: function renderDate(_, row) {
        return (
          <div>
            {row.reservation.startTime !== undefined ? (
              <p>
                {dayjs(row.reservation.startTime)
                  .tz("Asia/Tokyo")
                  .format("YYYY-MM-DD")}{" "}
                ({" "}
                {getDayOfWeek(
                  dayjs(row.reservation.startTime).tz("Asia/Tokyo").day()
                )}{" "}
                )
              </p>
            ) : (
              ""
            )}
          </div>
        );
      },
    },
    {
      title: "時間",
      width: "23%",
      render: function renderTime(_, row) {
        return (
          <div>
            <p>
              {row.reservation.startTime !== undefined
                ? dayjs(row.reservation.startTime)
                    .tz("Asia/Tokyo")
                    .format("HH:mm")
                : ""}
              〜
              {row.reservation.endTime !== undefined
                ? dayjs(row.reservation.endTime)
                    .tz("Asia/Tokyo")
                    .format("HH:mm")
                : ""}
            </p>
          </div>
        );
      },
    },
    {
      title: "",
      dataIndex: "",
      width: "8%",
      render: function renderRightArrowIcon(_, row) {
        return Object.keys(row).length >= 1 ? (
          <div
            onClick={() =>
              history.push({
                pathname: `/reservation/edit/${row.reservation.id}`,
              })
            }
            style={customStyles}
          >
            <RightArrow />
          </div>
        ) : null;
      },
    },
  ];

  // const isIphonePortrait = useMediaQuery({
  //   screen: true,
  //   minDeviceWidth: 375,
  //   maxDeviceWidth: 812,
  //   orientation: "portrait",
  //   "-webkit-min-device-pixel-ratio": 3,
  // });
  // const isIphoneLandscape = useMediaQuery({
  //   screen: true,
  //   minDeviceWidth: 375,
  //   maxDeviceWidth: 812,
  //   orientation: "landscape",
  //   "-webkit-min-device-pixel-ratio": 3,
  // });

  const isIpadPortrait = useMediaQuery({
    screen: true,
    minDeviceWidth: 320,
    maxDeviceWidth: 1023,
    orientation: "portrait",
  });
  const isIpadLandscape = useMediaQuery({
    screen: true,
    minDeviceWidth: 320,
    maxDeviceWidth: 1024,
    orientation: "landscape",
  });

  isIphone = isIpadLandscape || isIpadPortrait;

  const backdropHandler = () => {
    setShowBackdrop(!showBackdrop);
    setVisible(!visible);
  };

  // Here The layout fetches all the store and Profile info for the first time.
  useEffect(() => {
    dispatch(setReservationDetails({}));
    dispatch(fetchAllStores());
    dispatch(getAccountProfile());
    dispatch(setIphone(isIphone));
  }, []);

  // This is used to display the common error and success message.
  useEffect(() => {
    if (error !== "") {
      if (
        history.location.pathname.includes("settings/store-master") ||
        history.location.pathname.includes("settings/account-master")
      ) {
        if (error !== "店舗情報を登録してください。") {
          message.error({
            content: error,
            style: {
              color: "#ff4d4f",
            },
          });
        }
        dispatch(setError(""));
      } else {
        message.error({
          content: error,
          style: {
            color: "#ff4d4f",
          },
        });
        dispatch(setError(""));
      }
    }

    if (successMessage !== "") {
      message.success({
        content: successMessage,
        style: {
          color: "#52c41a",
        },
      });
      dispatch(setSuccessMessage(""));
    }
  }, [error, successMessage]);

  useEffect(() => history.listen(checkVersion), []);
  // This is executed whenever the store is updated.
  useEffect(() => {
    if (!intervalFunction) {
      intervalFunction = setInterval(reloadData, 5000);
      notifyFunction = setInterval(getNewNotifications, 5000);
    } else {
      clearInterval(intervalFunction);
      intervalFunction = setInterval(reloadData, 5000);
      clearInterval(notifyFunction);
      notifyFunction = setInterval(getNewNotifications, 5000);
    }

    if (selectedStore.id > 0) {
      dispatch(fetchNotifyMessage(selectedStore.id, 0));
      dispatch(fetchNetReservationUnconfirmedByStoreId(selectedStore.id));
      dispatch(fetchStoreUUID(selectedStore.id));
    }

    return () => {
      clearInterval(intervalFunction);
      clearInterval(notifyFunction);
    };
  }, [selectedStore]);

  useEffect(() => {
    setNetReservationSize(netReservationUncofirmed.length);
    setReservationDataSource(netReservationUncofirmed);
  }, [netReservationUncofirmed]);

  const setBackdrop = () => {
    setShowBackdrop(false);
    setVisible(!visible);
    if (!visible) {
      setShowBackdrop(true);
    }
  };

  const reloadData = () => {
    dispatch(fetchNetReservationUnconfirmedByStoreId(selectedStore.id));
  };

  const getNewNotifications = () => {
    dispatch(fetchNotifyMessage(selectedStore.id, -1, true, false));
  };

  const updateMsgNotifyWatched = (notificationId) => {
    dispatch(updateNotification({ id: notificationId }));
    setShowBackdrop(!showBackdrop);
    setVisible(false);
  };

  const goToReservationNow = (notificationId, reservationId) => {
    // Show reservation details Modal
    setShowBackdrop(!showBackdrop);
    setVisible(false);
    dispatch(fetchReservationDetails(reservationId));
    dispatch(updateNotification({ id: notificationId }));
    setShowDetailsModal(true);
  };

  // Implement Top Search functionality
  // on interval check for new notifications
  // Implement scroll notification "notify/getOldNotifyMessagePaging"
  const searchAllNetReservation = (currValue) => {
    const filteredData = netReservationUncofirmed.filter((entry) => {
      return (
        entry.customer?.spelling?.includes(currValue) ||
        entry.customer?.phonenumber?.includes(currValue) ||
        entry.reservation?.numberOfCustomers?.toString().includes(currValue) ||
        dayjs(entry.reservation.startTime)
          .tz("Asia/Tokyo")
          .format("YYYY-MM-DD")
          .toString()
          .includes(currValue) ||
        dayjs(entry.reservation.endTime)
          .tz("Asia/Tokyo")
          .format("YYYY-MM-DD")
          .toString()
          .includes(currValue)
      );
    });
    setReservationDataSource(filteredData);
  };

  const toNetReservationPage = () => {
    setShowBackdrop(!showBackdrop);
    setVisible(false);
    window.open(publicUrl);
  };

  const goAccountList = () => {
    setShowBackdrop(!showBackdrop);
    setVisible(false);
    history.push("/settings/account-master");
  };

  const logout = () => {
    auth.logout();
    setLoggedOut(true);
  };

  if (loggedOut) {
    dispatch(setLogin(null, false, ""));
    window.location.href = "/login";
  }

  const cancelModalAction = () => {
    setShowDetailsModal(false);
    dispatch(setReservationDetails({}));
  };

  const deleteNotification = (id) => {
    dispatch(deleteNotificationById({ id }));
    dispatch(
      setNotifications({
        ...notifications,
        lstMessageNotify: notifications.lstMessageNotify.filter(
          (n) => n.id !== id
        ),
      })
    );
    setShowBackdrop(false);
  };

  const updateReservationTracker = (id, status) => {
    dispatch(updateReservationTrack(id, status));
  };

  const handleDelete = (id) => {
    dispatch(deleteReservation(id));
    setShowDetailsModal(false);
  };

  const getOldNotification = () => {
    dispatch(fetchNotifyMessage(selectedStore.id, -1, false, true));
  };

  const updateOldNotification = () => {
    dispatch(updateNotificationOld({ id: selectedStore.id }));
  };

  return (
    <div
      style={{
        backgroundImage: `url(${bg})`,
        overflow: backdrop || showBackdrop ? "hidden" : "auto",
        height: showBackdrop ? "100.1vh" : "auto",
      }}
      className={"main"}
    >
      <Navbar
        showBackdrop={setBackdrop}
        notifications={notifications}
        updateMsgNotifyWatched={updateMsgNotifyWatched}
        goToReservationNow={goToReservationNow}
        stores={stores}
        selectedStore={selectedStore}
        changeStore={selectStore}
        reservationColumns={reservationColumns}
        reservationData={reservationDataSource}
        role={role}
        selectedStoreId={selectedStoreId}
        logout={logout}
        hasReservation={hasReservation}
        toNetReservationPage={toNetReservationPage}
        goAccountList={goAccountList}
        netReservationSize={netReservationSize}
        searchAllNetReservation={searchAllNetReservation}
        isIphone={isIphone}
        deleteNotification={deleteNotification}
        getOldNotification={getOldNotification}
        updateOldNotification={updateOldNotification}
        toggleCollapsed={() => dispatch(toggleCollapse())}
      />
      <Backdrop show={showBackdrop} clickedBackdrop={backdropHandler} />
      <Sidebar
        collapsed={isIphone ? !collapsed : collapsed}
        toggleCollapsed={() => dispatch(toggleCollapse())}
        hasReservation={hasReservation}
        role={role}
        hasSms={hasSms}
        location={location}
        isIphone={isIphone}
      />
      <Content
        className={collapsed ? "section section-collapsed" : "section"}
        style={
          isIphone && showSecondHeader
            ? { marginTop: "130px" }
            : isIphone && !showSecondHeader
            ? { marginTop: "70px" }
            : {}
        }
      >
        <Spin
          tip=""
          size="large"
          spinning={loading}
          className={"full-screen-spin"}
        >
          {children}
        </Spin>
      </Content>
      <div
        className="full-backdrop"
        style={{ display: backdrop ? "block" : "none" }}
      />
      {reservationDetails?.reservation?.id ? (
        <ReservationDetailsModal
          isModalVisible={showDetailsModal}
          handleCancel={cancelModalAction}
          reservation={reservationDetails}
          onChange={updateReservationTracker}
          handleDelete={handleDelete}
        />
      ) : null}
    </div>
  );
}

Layout.propTypes = {
  children: PropTypes.any,
};
