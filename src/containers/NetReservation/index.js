import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router";

import queryString from "query-string";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
import _ from "lodash";

import { setError, setIphone } from "actions/common";
import {
  fetchStoreDetailsByUUID,
  fetchTableAvailableTime,
  createNetReservation,
  setNetCreated,
  setTableAvailableTIme,
  setHolidays,
  setStoreDetails,
} from "actions/netReservation";

import bg from "assets/bg.svg";
import "containers/NetReservation/style/index.less";
import { fetchMenu } from "actions/createReservation";

import { Typography, Divider, Spin, message } from "antd";
import NetReservationForm from "components/Form/NetReservationForm";
import { useMediaQuery } from "react-responsive";

import { NetReservationConfirmModal } from "components/Modal";
import { checkVersion } from "utils/common";

dayjs.extend(utc);
dayjs.extend(timezone);

const times = [
  "00:00",
  "00:15",
  "00:30",
  "00:45",
  "01:00",
  "01:15",
  "01:30",
  "01:45",
  "02:00",
  "02:15",
  "02:30",
  "02:45",
  "03:00",
  "03:15",
  "03:30",
  "03:45",
  "04:00",
  "04:15",
  "04:30",
  "04:45",
  "05:00",
  "05:15",
  "05:30",
  "05:45",
  "06:00",
  "06:15",
  "06:30",
  "06:45",
  "07:00",
  "07:15",
  "07:30",
  "07:45",
  "08:00",
  "08:15",
  "08:30",
  "08:45",
  "09:00",
  "09:15",
  "09:30",
  "09:45",
  "10:00",
  "10:15",
  "10:30",
  "10:45",
  "11:00",
  "11:15",
  "11:30",
  "11:45",
  "12:00",
  "12:15",
  "12:30",
  "12:45",
  "13:00",
  "13:15",
  "13:30",
  "13:45",
  "14:00",
  "14:15",
  "14:30",
  "14:45",
  "15:00",
  "15:15",
  "15:30",
  "15:45",
  "16:00",
  "16:15",
  "16:30",
  "16:45",
  "17:00",
  "17:15",
  "17:30",
  "17:45",
  "18:00",
  "18:15",
  "18:30",
  "18:45",
  "19:00",
  "19:15",
  "19:30",
  "19:45",
  "20:00",
  "20:15",
  "20:30",
  "20:45",
  "21:00",
  "21:15",
  "21:30",
  "21:45",
  "22:00",
  "22:15",
  "22:30",
  "22:45",
  "23:00",
  "23:15",
  "23:30",
  "23:45",
];

function filterTime(times, businessHours) {
  const temp = [...times];
  if (businessHours?.length) {
    const result = [];

    _.forEach(businessHours, (b) => {
      _.forEach(temp, (t) => {
        if (t.toString() > b.closeHours.toString()) {
          return;
        }
        if (t.toString() >= b.openHours.toString()) {
          result.push(t);
        }
      });
    });
    return result;
  } else {
    return times;
  }
}

export default function NetReservation() {
  const [showModal, setShowModal] = useState(false);
  const [dataSubmitted, setDataSubmitted] = useState({});
  const [openHours, setOpenHours] = useState([]);

  const { control, formState, setValue, getValues, handleSubmit } = useForm();
  const { errors } = formState;
  const history = useHistory();
  const dispatch = useDispatch();
  const { Title, Text } = Typography;
  const isLoading = useSelector((state) => state.layoutReducer.loading);
  const error = useSelector((state) => state.layoutReducer.error);
  const store = useSelector((state) => state.netReservationReducer.store);
  const menus = useSelector((state) => state.createReservationReducer.menus);
  const created = useSelector((state) => state.netReservationReducer.created);
  const holidays = useSelector((state) => state.netReservationReducer.holidays);

  const availableTables = useSelector(
    (state) => state.netReservationReducer.availableTables
  );
  const query = queryString.parse(window.location.search);

  if (!query.id) {
    history.push("/not-found");
  }

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

  const isIphone = isIpadLandscape || isIpadPortrait;

  useEffect(() => {
    window.scrollTo(0, 0);
    dispatch(setIphone(isIphone));
  });

  useEffect(() => {
    document.title = "ネット予約フォーム";
    dispatch(setTableAvailableTIme([]));
    dispatch(setHolidays([]));
    dispatch(setStoreDetails([]));
    checkVersion();
  }, []);

  useEffect(() => {
    dispatch(fetchStoreDetailsByUUID({ id: query.id }));
  }, [query.id]);

  useEffect(() => {
    if (store?.id) {
      dispatch(fetchMenu({ storeId: store?.id, unauthenticated: true }));
      const result = filterTime(times, store.businessHours);
      setOpenHours(result);
    }
    if (store === -1) {
      history.push("/not-found");
    }
  }, [store]);

  useEffect(() => {
    const selectedDate = getValues("date");
    _.forEach(holidays, (h) => {
      if (
        parseInt(h.day) === selectedDate.day() &&
        parseInt(h.month) === selectedDate.month()
      ) {
        setValue("date", selectedDate.add(1, "M"));
      }
    });
  }, [holidays]);

  useEffect(() => {
    if (error) {
      message.error({
        content: error,
        style: {
          color: "#EB516D",
        },
      });
      dispatch(setError(""));
    }
  }, [error]);

  useEffect(() => {
    if (created) {
      dispatch(setNetCreated(false));
      history.push({
        pathname: "/rsv/confirm",
        state: { store },
      });
    }
  }, [created]);

  const setEndTime = () => {
    const startTime = getValues("startTime");
    const tempTime = dayjs(
      `${dayjs().format("YYYY-MM-DD")} ${startTime}`,
      "YYYY-MM-DD HH:mm"
    );
    if (tempTime.isValid()) {
      setValue("endTime", tempTime.add(2, "h").format("HH:mm"));
      getAvailableTable(dayjs());
    }
  };

  const getAvailableTable = () => {
    let date = getValues("date");
    const start = getValues("startTime");
    const end = getValues("endTime");
    let dayBefore = store.netReservation.reservedBeforeDay;
    let dayBeforeEnd = store.netReservation.reservedBeforeDayEnd;

    if (!dayBefore) {
      dayBefore = 0;
    }

    if (!dayBeforeEnd) {
      dayBeforeEnd = 0;
    }

    date =
      dayjs(date) < dayjs().add(dayBefore, "d")
        ? dayjs().add(dayBefore, "d")
        : dayjs(date).startOf("M");

    const startDate = dayjs(
      `${date?.format("YYYY-MM-DD")} ${start}`,
      "YYYY-MM-DD HH:mm"
    );

    const endDate = dayjs(
      `${date?.format("YYYY-MM-DD")} ${end}`,
      "YYYY-MM-DD HH:mm"
    );
    const startTime = dayjs
      .tz(startDate.format("YYYY-MM-DD HH:mm"), "Asia/Tokyo")
      .toDate()
      .toString();

    const endTime = dayjs
      .tz(endDate.format("YYYY-MM-DD HH:mm"), "Asia/Tokyo")
      .toDate()
      .toString();

    dispatch(
      fetchTableAvailableTime({
        storeId: store.id,
        startTime,
        endTime,
      })
    );
  };

  const handleModalCancel = () => {
    setShowModal(false);
  };

  const handleOnOk = () => {
    const storeId = store?.id;
    if (isNaN(storeId)) {
      message.error({
        content: "店舗情報を登録してください。",
        style: {
          color: "#EB516D",
        },
      });
      return;
    }

    const {
      date,
      startTime,
      endTime,
      adultNumber: dataAdultNumber,
      childNumber: dataChildNumber,
      lastName,
      firstName,
      phoneNumber,
      menus,
      note,
      privacyAgreement,
      allowGroupMessage,
      email,
    } = dataSubmitted;

    let adultNumber = dataAdultNumber;
    let childNumber = dataChildNumber;

    const startDate = dayjs(
      `${date?.format("YYYY-MM-DD")} ${startTime}`,
      "YYYY-MM-DD HH:mm"
    );
    let endDate = dayjs(
      `${date?.format("YYYY-MM-DD")} ${endTime}`,
      "YYYY-MM-DD HH:mm"
    );

    if (startDate >= endDate) {
      endDate = endDate?.add(1, "d");
    }

    if (isNaN(adultNumber) || adultNumber < 0) {
      adultNumber = 0;
    }
    if (isNaN(childNumber) || childNumber < 0) {
      childNumber = 0;
    }

    const numberCustomer = adultNumber + childNumber;

    if (numberCustomer <= 0) {
      message.error({
        content: "人数を入力してください。",
        style: {
          color: "#EB516D",
        },
      });
      return;
    }
    if (!lastName) {
      message.error({
        content: "お名前を入力してください。",
        style: {
          color: "#EB516D",
        },
      });
      return;
    }

    if (phoneNumber === "") {
      message.error({
        content: "携帯番号を入力してください。",
        style: {
          color: "#EB516D",
        },
      });
      return;
    }

    let dayBefore = store.netReservation.reservedBeforeDay;
    let hourBefore = store.netReservation.reservedBeforeHourStart;
    dayBefore = dayBefore != null && dayBefore !== undefined ? dayBefore : 0;
    hourBefore =
      hourBefore != null && hourBefore !== undefined ? hourBefore : 0;
    let now;

    if (dayBefore > 0) {
      now = dayjs
        .tz(new Date(), "Asia/Tokyo")
        .add(dayBefore, "d")
        .set({ hour: 0, minute: 0, second: 0, millisecond: 0 });
    } else {
      now = dayjs(new Date()).add(dayBefore, "d").add(hourBefore, "h");
    }

    if (startDate <= now) {
      message.error({
        content: "受付時間外のため、予約できません。",
        style: {
          color: "#EB516D",
        },
      });
      return;
    }

    if (privacyAgreement === false) {
      message.error({
        content:
          "「個人情報の取り扱いについて」をご確認の上、ご同意をお願い致します。",
        style: {
          color: "#EB516D",
        },
      });
      return;
    }

    const data = {
      endTime: endDate,
      menus: menus.map((m) => ({ id: m.id })),
      note: note.trim(),
      numberOfAdults: adultNumber,
      numberOfKids: childNumber,
      phonenumber: phoneNumber,
      spellingLastname: lastName.trim(),
      spellingFirstname: firstName.trim(),
      startTime: startDate,
      storeUUID: query.id,
      privacyAgreement: privacyAgreement,
      allowGroupMessage: allowGroupMessage,
      email: email,
    };

    dispatch(createNetReservation(data));
    setShowModal(false);
  };

  const handleOnSubmit = (data) => {
    setShowModal(true);
    setDataSubmitted(data);
    // handleOnOk(data);
  };

  return (
    <Spin tip="" size="large" spinning={isLoading}>
      <div
        style={{
          backgroundImage: `url(${bg})`,
          padding: "0",
        }}
        className={"container"}
      >
        <div className="net-form">
          <Title style={{ padding: "0 25px" }}>
            {store.name} ネット予約フォーム
          </Title>
          <Divider />
          {store.displayNetReservation ? (
            <>
              <div
                dangerouslySetInnerHTML={{
                  __html: store?.netReservation?.netReservationNote?.replace(
                    /\n/g,
                    "<br />"
                  ),
                }}
                style={{ fontSize: 16, padding: "0 25px" }}
              />
              <form onSubmit={handleSubmit(handleOnSubmit)}>
                <NetReservationForm
                  control={control}
                  openHours={openHours}
                  menus={menus.filter((m) => {
                    if (m.price > 0 && m.netReservationName) {
                      return true;
                    }
                    return false;
                  })}
                  errors={errors}
                  availableTables={availableTables}
                  setEndTime={setEndTime}
                  getAvailableTable={getAvailableTable}
                  store={store}
                  publicHolidays={holidays}
                />
              </form>{" "}
            </>
          ) : isLoading ? null : (
            <Text style={{ fontSize: 18, padding: "0 25px" }}>
              現在、ネットでの予約受付を停止しています。
            </Text>
          )}
        </div>
        <NetReservationConfirmModal
          isModalVisible={showModal}
          data={dataSubmitted}
          handleCancel={handleModalCancel}
          handleOk={handleOnOk}
        />
      </div>
    </Spin>
  );
}
