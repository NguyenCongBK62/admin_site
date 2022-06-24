import React, { useState, useEffect, useRef } from "react";
import PropTypes from "prop-types";

import dayjs from "dayjs";

import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router-dom";

import { getDayOfWeek } from "utils/common";

import { toggleBackdrop } from "actions/common";
import {
  fetchReservationDetails,
  setReservationDetails,
  updateReservationTrack,
  deleteReservation,
  setIsDeleted,
} from "actions/reservationActions";

import { ReservationDetailsModal } from "components/Modal";
import { DayGantt, WeekGantt } from "components/Gantt";
import GanttHeader from "components/Gantt/GanttHeader";
import Calendar from "components/Calendar";
import DatePickerComponent from "components/Datepicker/datepicker-custom";
import jaJP from "antd/lib/locale/ja_JP";
import { ConfigProvider } from "antd/es";

import PlusIcon from "components/Icons/PlusIcon";
import CalenderIcon from "components/Icons/CalendarIcon";
import FileTextIcon from "components/Icons/FileTextIcon";
import { sendSMSReservationMessage } from "actions/createReservation";
export default function Gantt({
  view,
  response,
  day,
  setDay,
  previous,
  forward,
  reloadData,
}) {
  let chart = null;
  let label = "";
  const dispatch = useDispatch();
  const history = useHistory();
  const backdrop = useSelector((state) => state.layoutReducer.backdrop);
  const reservationDetails = useSelector(
    (state) => state.homeReducer.reservation
  );
  const isDelete = useSelector((state) => state.homeReducer.isDelete);

  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [block, setBlock] = useState({});
  const wrapperRef = useRef();
  const wrapperCellRef = useRef();
  const handleReloadData = () => {
    reloadData();
  };

  const handleClickOutside = (event) => {
    if (
      wrapperRef.current &&
      !wrapperRef.current.contains(event.target) &&
      typeof event.target.className === "string"
        ? !event.target.className.includes("gantt-create-button")
        : false
    ) {
      dispatch(toggleBackdrop(false));
    }
  };

  const handleClickOutsideCell = (event) => {
    if (
      wrapperRef.current &&
      !wrapperRef.current.contains(event.target) &&
      typeof event.target.className === "string"
        ? !event.target.className.includes("gantt-click-options")
        : false
    ) {
      setBlock({});
    }
  };

  useEffect(() => {
    setShowDetailsModal(false);
    dispatch(setReservationDetails({}));
  }, []);

  useEffect(() => {
    if (isDelete) {
      dispatch(setIsDeleted(false));
      handleReloadData();
    }
  }, [isDelete]);

  useEffect(() => {
    // Bind the event listener
    document.addEventListener("mousedown", handleClickOutsideCell);
    return () => {
      // Unbind the event listener on clean up
      document.removeEventListener("mousedown", handleClickOutsideCell);
    };
  }, [wrapperCellRef]);

  useEffect(() => {
    // Bind the event listener
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      // Unbind the event listener on clean up
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [wrapperRef]);

  useEffect(() => {
    if (reservationDetails?.reservation?.id) {
      setShowDetailsModal(true);
    }
  }, [reservationDetails]);

  const handleCellClick = (start, table, i) => {
    const dateStart = dayjs(start).tz("Asia/Tokyo").startOf("d");
    const offset = (dayjs(start).tz("Asia/Tokyo") - dateStart) / 1000 / 60;
    const top =
      view === "week"
        ? i
          ? i * 50 + 5 + i * 10
          : 5
        : i
        ? i * 50 + 35 + i * 10
        : 40;
    setBlock({
      y: top,
      x: (100 / 60) * offset,
      table: table,
      start,
    });
  };

  const createNewReservation = () => {
    history.push({
      pathname: "/reservation/create",
      state: {
        data: { ...block, start: block.start.toISOString() },
        url: history.location,
      },
    });
  };

  const handleBadgeClick = (reservation) => {
    dispatch(fetchReservationDetails(reservation.id));
  };

  const cancelModalAction = () => {
    setShowDetailsModal(false);
    dispatch(setReservationDetails({}));
  };

  const handleReservationSelect = (reservation) => {
    dispatch(fetchReservationDetails(reservation.id));
  };

  const updateReservationTracker = (id, status) => {
    dispatch(updateReservationTrack(id, status));
    setTimeout(() => {
      handleReloadData();
    }, 3000);
  };

  const handleDelete = (id, isSendSMS) => {
    if (isSendSMS) {
      dispatch(
        sendSMSReservationMessage({
          reservationId: id,
          reservationType: 3,
          editedInfo: null,
        })
      );
    } else {
      dispatch(deleteReservation(id));
    }
    setShowDetailsModal(false);
  };

  const toggleBackdropAction = () => {
    if (backdrop) {
      dispatch(toggleBackdrop(false));
    } else {
      dispatch(toggleBackdrop(true));
    }
  };

  if (view === "day") {
    chart = (
      <DayGantt
        handleBadgeClick={handleBadgeClick}
        handleCellClick={handleCellClick}
        response={response.data ? response.data : []}
        day={day}
        showColumnBreakpoint
        selectedBlock={block}
        wrapperCellRef={wrapperCellRef}
        createNewReservation={createNewReservation}
      />
    );
    label = (
      <ConfigProvider locale={jaJP}>
        <DatePickerComponent
          value={day}
          onChange={(date) => setDay(date)}
          inputReadOnly
          suffixIcon={null}
          className="gantt-datepicker"
          dropdownClassName="gantt-datepicker-dropdown"
          allowClear={false}
          format={(value) =>
            `${value.format("YYYY-MM-DD")} (${getDayOfWeek(day.day())})`
          }
        />
      </ConfigProvider>
    );
  }
  if (view === "week") {
    chart = (
      <WeekGantt
        handleBadgeClick={handleBadgeClick}
        handleCellClick={handleCellClick}
        response={response.data ? response.data : []}
        day={day}
        selectedBlock={block}
        wrapperCellRef={wrapperCellRef}
        createNewReservation={createNewReservation}
      />
    );
    const months = [];
    response?.data?.forEach(({ day }) => {
      if (!months.includes(dayjs(day).month())) {
        months.push(dayjs(day).month());
      }
    });
    label = (
      <ConfigProvider locale={jaJP}>
        <DatePickerComponent
          value={day}
          onChange={(date) => setDay(date)}
          inputReadOnly
          suffixIcon={null}
          className="gantt-datepicker"
          dropdownClassName="gantt-datepicker-dropdown"
          allowClear={false}
          format={(value) => {
            if (months.length > 1) {
              return `${dayjs(value).year()}年${months[0] + 1}月~${dayjs(
                value
              ).year()}年${months[1] + 1}月`;
            } else if (months.length === 0) {
              return `${dayjs(value).year()}年`;
            } else {
              return `${dayjs(value).year()}年${months[0] + 1}月`;
            }
          }}
        />
      </ConfigProvider>
    );
  }

  if (view === "month") {
    chart = (
      <Calendar
        reservations={response?.data ? response.data : []}
        handleReservationSelect={handleReservationSelect}
        day={day}
      />
    );
    label = (
      <ConfigProvider locale={jaJP}>
        <DatePickerComponent
          value={day}
          onChange={(date) => setDay(date)}
          picker="month"
          inputReadOnly
          suffixIcon={null}
          className="gantt-datepicker"
          dropdownClassName="gantt-datepicker-dropdown"
          allowClear={false}
          format={(value) =>
            `${dayjs(value).year()}年${dayjs(value).month() + 1}月`
          }
        />
      </ConfigProvider>
    );
  }

  return (
    <div className="gantt-container">
      <GanttHeader previous={previous} forward={forward} label={label} />
      <div className="gantt">{chart}</div>

      <div
        className={`gantt-options-container ${
          backdrop ? "gantt-options-container-open" : ""
        }`}
        style={{ visibility: backdrop ? "visible" : "hidden" }}
        ref={wrapperRef}
      >
        <div
          className="gantt-options-item"
          onClick={() => {
            dispatch(toggleBackdrop(false));

            history.push("/customer/create");
          }}
        >
          <div className="gantt-options-text">お客様情報を新規追加</div>
          <button className="round-button gantt-options-button">
            <FileTextIcon />
          </button>
        </div>
        <div
          className="gantt-options-item"
          onClick={() => {
            dispatch(toggleBackdrop(false));
            history.push({
              pathname: "/reservation/create",
              state: {
                url: history.location,
              },
            });
          }}
        >
          <div className="gantt-options-text">ご予約を新規追加</div>
          <button className="round-button gantt-options-button">
            <CalenderIcon />
          </button>
        </div>
      </div>
      {view !== "month" ? (
        <div
          className={`round-button gantt-create-button ${
            backdrop ? "rotate-button" : ""
          }`}
          onClick={toggleBackdropAction}
        >
          <PlusIcon />
        </div>
      ) : null}
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

Gantt.propTypes = {
  response: PropTypes.any,
  view: PropTypes.string,
  day: PropTypes.any,
  setDay: PropTypes.func,
  forward: PropTypes.func,
  previous: PropTypes.func,
  reloadData: PropTypes.func,
};
