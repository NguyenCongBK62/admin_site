import React from "react";
import PropTypes from "prop-types";
import "components/Calendar/style/index.less";
import dayjs from "dayjs";
import isToday from "dayjs/plugin/isToday";
import updateLocale from "dayjs/plugin/updateLocale";
import Popover from "components/Calendar/Popover";

dayjs.extend(isToday);
dayjs.extend(updateLocale);

dayjs.updateLocale("en", {
  weekStart: 1,
});
const weekday = ["月", "火", "水", "木", "金", "土", "日"];

function formatResponseData(reservations) {
  const result = {};
  reservations.forEach((res) => {
    if (!result[dayjs(res.startTime).format("YYYY-MM-DD")]) {
      result[dayjs(res.startTime).format("YYYY-MM-DD")] = [res];
    } else {
      result[dayjs(res.startTime).format("YYYY-MM-DD")].push(res);
    }
  });
  return result;
}

export default function Calendar({
  day: currentDay,
  reservations,
  handleReservationSelect,
}) {
  const currentMonth = dayjs(currentDay);
  const monthStart = dayjs(currentMonth).startOf("M");

  const monthEnd = dayjs(monthStart).endOf("M");
  const startDate = dayjs(monthStart).startOf("w");
  const endDate = dayjs(monthEnd).endOf("w");

  const rows = [];

  let days = [];
  let day = startDate;
  let formattedDate = "";

  const formattedReservation = formatResponseData(reservations);
  while (day <= endDate) {
    for (let i = 0; i < 7; i++) {
      formattedDate = day.format("D");
      if (dayjs(day).get("M") === dayjs(currentMonth).get("M")) {
        days.push(
          <div
            className={`calendar-body-cell ${
              dayjs(day).day() === 6
                ? "calendar-body-cell-blue"
                : dayjs(day).day() === 0
                ? "calendar-body-cell-red"
                : ""
            }
            
            `}
            key={dayjs(day).format()}
            onClick={() => {}}
          >
            <span
              className={`calendar-body-cell-day ${
                dayjs(day).tz("Asia/Tokyo").format("YYYY-MM-DD") ===
                dayjs().tz("Asia/Tokyo").format("YYYY-MM-DD")
                  ? "calendar-body-cell-day-selected"
                  : ""
              }`}
            >
              {formattedDate}
            </span>
            {formattedReservation[dayjs(day).format("YYYY-MM-DD")] ? (
              <div className="calendar-body-cell-reservation">
                <Popover
                  key={dayjs(day).toISOString()}
                  res={formattedReservation[dayjs(day).format("YYYY-MM-DD")]}
                  date={formattedDate}
                  handleReservationSelect={handleReservationSelect}
                />
              </div>
            ) : null}
          </div>
        );
      } else {
        days.push(
          <div key={dayjs(day).format()} className={`calendar-body-cell`}>
            {null}
          </div>
        );
      }

      day = dayjs(day).add(1, "d");
    }
    rows.push(
      <div className="calendar-body-row" key={day}>
        {days}
      </div>
    );
    days = [];
  }

  return (
    <div className="calendar">
      <div className="calendar-header">
        {weekday.map((week, index) => (
          <div key={`calendar-${index}`}>{week}</div>
        ))}
      </div>
      <div className="calendar-body">{rows}</div>
    </div>
  );
}

Calendar.propTypes = {
  day: PropTypes.any,
  reservations: PropTypes.any,
  handleReservationSelect: PropTypes.func,
};
