import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import Layout from "containers/Layout";
import Pill from "components/Pill";
import Gantt from "containers/Home/Gantt";
import DashboardIcon from "components/Icons/DashboardIcon";
import "./style/index.less";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
import {
  fetchReservationDataDay,
  fetchReservationDataWeek,
  fetchReservationDataMonth,
  setView,
} from "actions/reservationActions";
import auth from "utils/auth";
import queryString from "query-string";
import _ from "lodash";

dayjs.extend(utc);
dayjs.extend(timezone);

const views = [
  { key: "month", text: "月" },
  { key: "week", text: "週" },
  { key: "day", text: "日" },
];

let INTERVAL_STATUS = false;

export default function Home() {
  const [day, setDay] = useState(dayjs().tz("Asia/Tokyo"));
  // const [view, setView] = useState("day");
  const [response, setResponse] = useState({});
  const [caseLength, setCaseLength] = useState(0);
  const [adult, setAdult] = useState(0);
  const [child, setChild] = useState(0);
  const selectedStore = useSelector(
    (state) => state.layoutReducer.selectedStore
  );
  const dayResponse = useSelector((state) => state.homeReducer.dayResponse);
  const weekResponse = useSelector((state) => state.homeReducer.weekResponse);
  const monthResponse = useSelector((state) => state.homeReducer.monthResponse);
  const view = useSelector((state) => state.homeReducer.currentGanttView);

  const dispatch = useDispatch();
  const history = useHistory();

  const handleViewChange = (newView) => {
    if (newView !== view) {
      setResponse({});
      setDay(dayjs());
      dispatch(setView(newView));

      history.replace(`/?view=${newView}`);
    } else {
      reloadData();
    }
  };

  const reformedReloadData = () => {
    const storeId = auth.getKey("loginUser.storeId");
    if (view === "day") {
      dispatch(
        fetchReservationDataDay(storeId, day.format("YYYY-MM-DD"), true)
      );
    }
    if (view === "week") {
      dispatch(
        fetchReservationDataWeek(storeId, day.format("YYYY-MM-DD"), true)
      );
    }
    if (view === "month") {
      dispatch(
        fetchReservationDataMonth(storeId, day.format("YYYY-MM-DD"), true)
      );
    }
  };

  useEffect(() => {
    const params = queryString.parse(history.location.search);
    if (params.view && params.view !== view) {
      dispatch(setView(params.view));
    }
    if (params?.day) {
      setDay(dayjs(params?.day));
    }
  }, [history.location]);

  useEffect(() => {
    if (selectedStore.id && selectedStore.companyCode) {
      reloadData(false);
    }
    if (!INTERVAL_STATUS) {
      INTERVAL_STATUS = setInterval(reformedReloadData, 90000);
    } else {
      clearInterval(INTERVAL_STATUS);
      INTERVAL_STATUS = setInterval(reformedReloadData, 90000);
    }

    return () => {
      clearInterval(reformedReloadData);
    };
  }, [day, selectedStore, view]);

  useEffect(() => {
    if (view === "day") {
      setResponse(dayResponse);
      let adult = 0;
      let child = 0;
      let reservations = [];

      _.forEach(dayResponse.data, ({ reservation }) => {
        _.forEach(reservation, (r) => {
          reservations.push(r.reservation);
        });
      });
      reservations = _.unionBy(reservations, "id");

      _.forEach(reservations, (reservation) => {
        adult += reservation.numberOfAdults;
        child += reservation.numberOfKids;
      });
      setCaseLength(reservations.length);
      setAdult(adult);
      setChild(child);
    }
    if (view === "week") {
      setResponse(weekResponse);
      let adult = 0;
      let child = 0;

      let reservations = [];

      _.forEach(weekResponse.data, ({ reservation: dayReservation }) => {
        _.forEach(dayReservation, ({ reservation: reservationList }) => {
          _.forEach(reservationList, ({ reservation }) => {
            reservations.push(reservation);
          });
        });
      });

      reservations = _.unionBy(reservations, "id");

      _.forEach(reservations, (reservation) => {
        adult += reservation.numberOfAdults;
        child += reservation.numberOfKids;
      });

      // weekResponse.data.forEach(({ reservation: dayReservation }) => {
      //   dayReservation.forEach(({ reservation: reservationList }) => {
      //     length += reservationList.length;
      //     reservationList.forEach(({ reservation }) => {
      //       adult += reservation.numberOfAdults;
      //       child += reservation.numberOfKids;
      //     });
      //   });
      // });
      setCaseLength(reservations.length);
      setAdult(adult);
      setChild(child);
    }
    if (view === "month") {
      setResponse(monthResponse);

      let adult = 0;
      let child = 0;
      monthResponse.data?.forEach((r) => {
        adult += r.numberOfAdults;
        child += r.numberOfKids;
      });
      setCaseLength(monthResponse.data.length);
      setAdult(adult);
      setChild(child);
    }
  }, [dayResponse, weekResponse, monthResponse]);

  const previous = () => {
    if (view === "day") {
      setDay(dayjs(day).tz("Asia/Tokyo").subtract(1, "d"));
    }
    if (view === "week") {
      setDay(dayjs(day).tz("Asia/Tokyo").subtract(1, "w"));
    }
    if (view === "month") {
      setDay(dayjs(day).tz("Asia/Tokyo").subtract(1, "M"));
    }
  };

  const forward = () => {
    if (view === "day") {
      setDay(dayjs(day).tz("Asia/Tokyo").add(1, "d"));
    }
    if (view === "week") {
      setDay(dayjs(day).tz("Asia/Tokyo").add(1, "w"));
    }
    if (view === "month") {
      setDay(dayjs(day).tz("Asia/Tokyo").add(1, "M"));
    }
  };

  const handleNow = () => {
    setDay(dayjs());
  };

  const reloadData = (live = false) => {
    const storeId = auth.getKey("loginUser.storeId");
    if (storeId > 0 && selectedStore.companyCode) {
      if (view === "day") {
        dispatch(
          fetchReservationDataDay(storeId, day.format("YYYY-MM-DD"), live)
        );
        setResponse({});
      }
      if (view === "week") {
        dispatch(
          fetchReservationDataWeek(storeId, day.format("YYYY-MM-DD"), live)
        );
        setResponse({});
      }
      if (view === "month") {
        dispatch(
          fetchReservationDataMonth(storeId, day.format("YYYY-MM-DD"), live)
        );
        setResponse({});
      }
    }
  };

  return (
    <Layout>
      <div className={"home-container"} data-testid={"home-page"}>
        <div className="top-banner">
          <div className="banner-status">
            <span>本日のご予約</span>
            <span className="case-number"> {caseLength} </span>
            <span>件</span>
          </div>
          <div className="person-count">
            {adult + child}人（大人：{adult}人 子ども：{child}人）
          </div>
        </div>
        <div className="dashboard-title-container">
          <DashboardIcon height={28} width={28} />
          <span>ダッシュボード</span>
        </div>
        <div className="dashboard-action-buttons">
          {dayjs().format("YYYY-MM-DD") !== day.format("YYYY-MM-DD") ? (
            <div className="today-button" onClick={() => handleNow()}>
              <span>
                {view === "day" ? "今日" : view === "week" ? "今週" : "今月"}
              </span>
            </div>
          ) : null}

          <div className="condensed-buttons">
            {views.map((x) => (
              <span
                key={x.key}
                className={view === x.key ? "selected" : ""}
                onClick={() => handleViewChange(x.key)}
              >
                {x.text}
              </span>
            ))}
          </div>
        </div>
        <div className="reservation-chart">
          <Gantt
            response={response}
            view={view}
            day={day}
            setDay={setDay}
            previous={previous}
            forward={forward}
            reloadData={reloadData}
          />
        </div>
        <div className="pill-container">
          <Pill label="来店中" type="visiting" />
          <Pill label="来店待ち" type="waiting-for-visit" />
          <Pill label="仮予約" type="temporary-reservation" />
          <Pill label="キャンセル待ち" type="waiting-list" />
          <Pill label="退店" type="closed" />
          <Pill label="NO SHOW" type="no-show" />
        </div>
      </div>
    </Layout>
  );
}
