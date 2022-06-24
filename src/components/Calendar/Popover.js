import React, { useState } from "react";
import PropTypes from "prop-types";
import { Popover } from "antd";
import dayjs from "dayjs";
import { useSelector } from "react-redux";

export default function PopoverComponent({
  res,
  date,
  handleReservationSelect,
}) {
  const [state, setState] = useState({
    clicked: false,
    hovered: false,
  });
  const isIphone = useSelector((state) => state.layoutReducer.isIphone);

  const handleClickChange = (visible) => {
    setState({
      clicked: visible,
    });
  };
  const clickContent = (
    <ul className="calendar-body-cell-popover-list">
      {res.map((r) => (
        <li
          key={r.id}
          className="calendar-body-cell-popover-list-item"
          onClick={() => {
            handleReservationSelect(r);
            setState({
              clicked: false,
            });
          }}
        >
          {dayjs(r.startTime).format("HH:mm")}~{r.spellingLastName}{" "}
          {r.spellingFirstName}
          <span>{r.numberOfCustomers}名</span>
        </li>
      ))}
    </ul>
  );
  return (
    <Popover
      content={clickContent}
      title={<div>{date}</div>}
      trigger="click"
      visible={state.clicked}
      onVisibleChange={handleClickChange}
    >
      <div className="calendar-body-cell-reservation-header">
        {res.length} 件 {isIphone ? <br /> : ""}(
        {res.reduce((a, c) => c.numberOfCustomers + a, 0)}名 )
      </div>
    </Popover>
  );
}

PopoverComponent.propTypes = {
  res: PropTypes.any,
  date: PropTypes.any,
  handleReservationSelect: PropTypes.func,
};
