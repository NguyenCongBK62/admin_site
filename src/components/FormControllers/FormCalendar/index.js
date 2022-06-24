/* eslint-disable */
import React from "react";
import PropTypes from "prop-types";
import "components/FormControllers/FormCalendar/style/index.less";
import _ from "lodash";
import GanttHeader from "components/Gantt/GanttHeader";
import DatePickerComponent from "components/Datepicker/datepicker-custom";
import jaJP from "antd/lib/locale/ja_JP";
import { ConfigProvider } from "antd/es";
import dayjs from "dayjs";
import isToday from "dayjs/plugin/isToday";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
import { Controller } from "react-hook-form";
import updateLocale from "dayjs/plugin/updateLocale";
import NetReservation from "containers/NetReservation";

dayjs.extend(updateLocale);

dayjs.extend(isToday);
dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.updateLocale("en", {
  weekStart: 1,
});
const weekday = ["月", "火", "水", "木", "金", "土", "日"];

export default function FormCalendar({
  control,
  inputName,
  showOverlay,
  availableTables,
  store,
  defaultValue,
  publicHolidays,
  callback = () => {},
}) {
  const { weeklyHolidays, hasHolidays } = store;
  const isWeeklyHoliday = (day) => {
    return _.find(weeklyHolidays, (h) => dayjs(day).day() === h.id);
  };

  const isPublicHoliday = (day) => {
    if (!hasHolidays) return false;
    return _.find(publicHolidays, (pH) => {
      const isSameDay = dayjs(day).date() === parseInt(pH.day);
      const isSameMonth = dayjs(day).month() === parseInt(pH.month) - 1; // dayjs month is zero indexed
      if (isSameDay && isSameMonth) {
        return true;
      }
      return false;
    });
  };

  const getFirstAvailableDay = (defaultDay, dayBefore) => {
    const firstAvailableDay = _.find(availableTables, (a) => {
      const currentDay = dayjs(a.day);
      if (
        !isWeeklyHoliday(currentDay) &&
        !isPublicHoliday(currentDay) &&
        currentDay >= dayjs().add(dayBefore, "d").startOf("d")
      ) {
        return currentDay;
      }
    });
    if (!firstAvailableDay) {
      return defaultDay;
    }

    return dayjs(firstAvailableDay.day);
  };

  return (
    <Controller
      control={control}
      name={inputName}
      defaultValue={dayjs()}
      render={({ onChange, value, name }) => {
        let dayBefore = store.netReservation.reservedBeforeDay;
        let dayBeforeEnd = store.netReservation.reservedBeforeDayEnd;

        if (!dayBefore) {
          dayBefore = 0;
        }

        if (!dayBeforeEnd) {
          dayBeforeEnd = 0;
        }

        console.log("value ", value, availableTables);
        const selectedDay =
          value > dayjs().add(dayBefore, "d")
            ? value
            : getFirstAvailableDay(dayjs().add(dayBefore, "d"), dayBefore);
        const currentMonth = dayjs(selectedDay);
        const monthStart = dayjs(currentMonth).startOf("M");

        const monthEnd = dayjs(monthStart).endOf("M");
        const startDate = dayjs(monthStart).startOf("w");
        const endDate = dayjs(monthEnd).endOf("w");

        const rows = [];
        let days = [];

        const { netReservation } = store;

        let day = startDate;
        let formattedDate = "";

        const displayCrowdedPercent = netReservation?.displayCrowdedPercent
          ? netReservation?.displayCrowdedPercent
          : null;
        while (day <= endDate) {
          let icon = null;
          for (let i = 0; i < 7; i++) {
            formattedDate = day.format("D");
            if (dayjs(day).get("M") === dayjs(currentMonth).get("M")) {
              const date = dayjs(day); // current date of the loop
              const res = _.find(availableTables, (a) => {
                return (
                  dayjs(a.day).tz("Asia/Tokyo").format("YYYY-MM-DD") ===
                  date.format("YYYY-MM-DD")
                );
              });

              icon = null;
              if (
                !(day < dayjs().add(dayBefore, "d").startOf("d")) &&
                (dayBeforeEnd
                  ? date <=
                    dayjs()
                      .add(dayBefore + dayBeforeEnd, "d")
                      .startOf("d")
                  : true) &&
                !isPublicHoliday(date) &&
                !isWeeklyHoliday(date)
              ) {
                if (res) {
                  if (
                    res?.availableTable / res?.totalTable >
                    displayCrowdedPercent / 10
                  ) {
                    icon = "●";
                  }
                  if (
                    res.availableTable !== 0 &&
                    res.availableTable / res.totalTable <=
                      displayCrowdedPercent / 10
                  ) {
                    icon = "▲";
                  }
                  if (res.availableTable === 0) {
                    icon = "X";
                  }
                }
              }

              let holiday = "";
              // for normal weeklyHolidays
              if (isWeeklyHoliday(day) || isPublicHoliday(day)) {
                holiday = "休業日";
              }

              const dayChangeHandle = (date) => {
                if (
                  date >= dayjs().add(dayBefore, "d").startOf("d") &&
                  (dayBeforeEnd
                    ? date <=
                      dayjs()
                        .add(dayBefore + dayBeforeEnd, "d")
                        .startOf("d")
                    : true) &&
                  res?.availableTable !== 0 &&
                  !isPublicHoliday(date) &&
                  !isWeeklyHoliday(date)
                ) {
                  onChange(date);
                }
              };
              days.push(
                <div
                  className={`form-calendar-body-cell ${
                    dayjs(day).day() === 6
                      ? "form-calendar-body-cell-blue"
                      : dayjs(day).day() === 0
                      ? "form-calendar-body-cell-red"
                      : ""
                  } ${
                    day < dayjs().add(dayBefore, "d").startOf("d") ||
                    isWeeklyHoliday(day) ||
                    isPublicHoliday(day)
                      ? "form-calendar-body-cell-passed"
                      : ""
                  } ${
                    store?.netReservation?.reservedBeforeDayEnd
                      ? day >
                          dayjs()
                            .add(dayBefore + dayBeforeEnd, "d")
                            .startOf("d") || res?.availableTable === 0
                        ? "form-calendar-body-cell-passed"
                        : ""
                      : ""
                  }
                  ${icon === "X" ? "form-calendar-body-cell-passed" : ""}
                  `}
                  key={dayjs(day).format()}
                  onClick={() => {
                    dayChangeHandle(date);
                  }}
                >
                  <span
                    className={`form-calendar-body-cell-day ${
                      dayjs(selectedDay).isValid() &&
                      !isPublicHoliday(selectedDay) &&
                      !isWeeklyHoliday(selectedDay) &&
                      dayjs(selectedDay).format("YYYY-MM-DD") ===
                        date.format("YYYY-MM-DD")
                        ? "form-calendar-body-cell-day-selected"
                        : ""
                    }`}
                  >
                    {formattedDate}
                  </span>
                  <span className={"form-calendar-body-cell-icon"}>
                    {icon}
                    {holiday}
                  </span>
                </div>
              );
            } else {
              days.push(
                <div
                  key={dayjs(day).format()}
                  className={`form-calendar-body-cell`}
                >
                  {null}
                </div>
              );
            }

            day = dayjs(day).add(1, "d");
          }
          rows.push(
            <div className="form-calendar-body-row" key={day}>
              {days}
            </div>
          );
          days = [];
        }

        return (
          <div className="form-calendar">
            {showOverlay ? (
              <div className="form-calendar-overlay">
                <button type="button">
                  ご来店時間を選択すると、来店日が選択いただけます。
                </button>
              </div>
            ) : null}
            <GanttHeader
              label={
                <ConfigProvider locale={jaJP}>
                  <DatePickerComponent
                    value={currentMonth}
                    onChange={(date) => {
                      onChange(dayjs(date).startOf("M"));
                      callback();
                    }}
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
              }
              forward={() => {
                onChange(dayjs(currentMonth).add(1, "M").startOf("M"));
                callback();
              }}
              previous={() => {
                onChange(dayjs(currentMonth).subtract(1, "M").startOf("M"));
                callback();
              }}
              style={{ margin: 0, width: "100%" }}
            />
            <div className="form-calender-navigation"></div>
            <div className="form-calendar-header">
              {weekday.map((week, index) => (
                <div key={`calendar-${index}`}>{week}</div>
              ))}
            </div>
            <div className="form-calendar-body">{rows}</div>
          </div>
        );
      }}
    />
  );
}

FormCalendar.propTypes = {
  day: PropTypes.any,
  control: PropTypes.any,
  inputName: PropTypes.string,
  showOverlay: PropTypes.bool,
  callback: PropTypes.func,
  defaultValue: PropTypes.any,
  store: PropTypes.any,
  publicHolidays: PropTypes.array,
  availableTables: PropTypes.any,
};
