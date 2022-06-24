import React from "react";
import { Divider, Menu } from "antd";
import { CloseCircleOutlined } from "@ant-design/icons";
import Heading from "components/Heading";
import PropTypes from "prop-types";

export default function NoticeDropdown({
  notifications,
  goToReservationNow,
  updateMsgNotifyWatched,
  deleteNotification,
  getOldNotification,
}) {
  const handleOnScroll = (e) => {
    if (
      e.target.scrollHeight - e.target.scrollTop <
      e.target.clientHeight + 80
    ) {
      getOldNotification();
    }
  };
  return (
    <Menu onScroll={handleOnScroll} className="notice-dropdown-menu">
      <Heading>お知らせ</Heading>
      {Object.keys(notifications).length > 0 ? (
        notifications.lstMessageNotify.map((notification, index) => (
          <Menu.Item
            style={notification.watched === false ? { fontWeight: "bold" } : ""}
            key={notification.id}
            className="notice-item"
          >
            <p
              dangerouslySetInnerHTML={{ __html: notification.content }}
              onClick={
                notification.reservationId !== null &&
                notification.reservationDeleted === false
                  ? () =>
                      goToReservationNow(
                        notification.id,
                        notification.reservationId
                      )
                  : () => updateMsgNotifyWatched(notification.id)
              }
            />
            <span onClick={() => deleteNotification(notification.id)}>
              <CloseCircleOutlined />
            </span>
            {notifications.lstMessageNotify.length - 1 !== index ? (
              <Divider />
            ) : null}
          </Menu.Item>
        ))
      ) : (
        <Menu.Item key={0}>
          <p>新着メッセージがありません。</p>
        </Menu.Item>
      )}
    </Menu>
  );
}

NoticeDropdown.propTypes = {
  notifications: PropTypes.object,
  updateMsgNotifyWatched: PropTypes.func,
  goToReservationNow: PropTypes.func,
  deleteNotification: PropTypes.func,
  getOldNotification: PropTypes.func,
};
