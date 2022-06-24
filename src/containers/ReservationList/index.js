/* eslint-disable react/display-name */
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
import { useForm } from "react-hook-form";
import { Col, Row } from "antd";

import {
  fetchAllByDayWithPaging,
  fetchByNameOrSpellingOrPhone,
  setAllByDayWithPaging,
} from "actions/reservationListAction";
import {
  deleteReservation,
  fetchReservationDetails,
  updateReservationTrack,
  setReservationDetails,
  setIsDeleted,
} from "actions/reservationActions";

import { ReservationDetailsModal } from "components/Modal";
import Layout from "containers/Layout";
import Table from "components/Table";
import CalendarIcon from "components/Icons/CalendarIcon";
import RightArrow from "components/Icons/Arrows/RightArrow";
import Heading from "components/Heading";
import { DatePicker } from "components/FormControllers";
import { getDayOfWeek } from "utils/common";

import "./style/index.less";
import { useHistory, useLocation } from "react-router";
import FormHeader from "components/FormHeader";
import { sendSMSReservationMessage } from "actions/createReservation";

dayjs.extend(utc);
dayjs.extend(timezone);

const inputStyle = {
  width: "174px",
  height: "40px",
  float: "right",
};

function ReservationList() {
  const customStyles = {
    cursor: "pointer",
    paddingTop: "20px",
  };

  const dispatch = useDispatch();
  const history = useHistory();

  const query = new URLSearchParams(useLocation().search);
  const queryString = query.get("searchText");
  const [searchText, setSearchText] = useState(queryString);

  const { control, getValues, setValue } = useForm({ mode: "onChange" });
  const [totalItems, setTotalItems] = useState(0);
  const [dataSource, setDataSource] = useState([]);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [isSearch, setIsSearch] = useState(false);

  const selectedStore = useSelector(
    (state) => state.layoutReducer.selectedStore
  );

  const reservationData = useSelector(
    (state) => state.reservationListReducer.reservation_data
  );

  const reservationDetails = useSelector(
    (state) => state.homeReducer.reservation
  );

  const isDelete = useSelector((state) => state.homeReducer.isDelete);

  useEffect(() => {
    dispatch(setReservationDetails({}));
  }, []);

  useEffect(() => {
    if (queryString !== null) {
      const storeId = selectedStore.id;
      const page = 1;
      dispatch(fetchByNameOrSpellingOrPhone(storeId, queryString, page));
      setIsSearch(true);
      setSearchText(queryString);
    } else {
      setIsSearch(false);
      fetchData({ date: dayjs().tz("Asia/Tokyo").format("YYYY-MM-DD") });
    }
  }, [queryString]);

  useEffect(() => {
    if (isDelete) {
      fetchData({});
      dispatch(setIsDeleted(false));
    }
  }, [isDelete]);

  useEffect(() => {
    if (selectedStore.id && selectedStore.companyCode && searchText === null) {
      fetchData({ date: dayjs().tz("Asia/Tokyo").format("YYYY-MM-DD") });
    }
  }, [selectedStore]);

  useEffect(() => {
    if (reservationData) {
      setDataSource(reservationData.result);
      setTotalItems(reservationData.totalItems);
      dispatch(setAllByDayWithPaging(null));
    }
  }, [reservationData]);

  useEffect(() => {
    if (reservationDetails?.reservation?.id) {
      setShowDetailsModal(true);
    }
  }, [reservationDetails]);

  const onChange = (page) => {
    fetchData({ page });
  };

  const fetchData = ({ date, page = 1, storeId = selectedStore.id }) => {
    let reservationDate;
    setIsSearch(false);
    if (!date && queryString !== null) {
      dispatch(fetchByNameOrSpellingOrPhone(storeId, searchText, page));
      return;
    } else if (!date) {
      reservationDate = getValues("date")?.isValid()
        ? getValues("date").tz("Asia/Tokyo").format("YYYY-MM-DD")
        : dayjs().tz("Asia/Tokyo").format("YYYY-MM-DD");
      setValue("date", dayjs());
    } else {
      reservationDate = date;
    }

    dispatch(fetchAllByDayWithPaging(storeId, reservationDate, page));
    history.push(`/reservation/list`);
  };
  const cancelModalAction = () => {
    setShowDetailsModal(false);
    dispatch(setReservationDetails({}));
  };
  const handleReservationSelect = ({ reservation }) => {
    dispatch(fetchReservationDetails(reservation.id));
  };

  const updateReservationTracker = (id, status) => {
    dispatch(updateReservationTrack(id, status));
    fetchData({});
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

  const columns = [
    {
      title: "日時",
      dataIndex: "title",
      render: (text, row) => {
        return (
          <div style={{ paddingTop: "20px" }}>
            {row.reservation.startTime !== undefined ? (
              <p>
                {dayjs(row.reservation.startTime)
                  .tz("Asia/Tokyo")
                  .format("YYYY-MM-DD")}{" "}
                (
                {getDayOfWeek(
                  dayjs(row.reservation.startTime).tz("Asia/Tokyo").day()
                )}
                )
              </p>
            ) : (
              ""
            )}
            <p>
              {" "}
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
      title: "お客様",
      dataIndex: "customer",
      render: (_, row) => {
        return (
          <div style={{ paddingTop: "20px" }}>
            <p>
              {row.customer.spelling !== undefined &&
              row.customer.spelling !== null
                ? row.customer.spelling
                : ""}
            </p>
            <p>
              {" "}
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
      dataIndex: "numberOfCustomers",
      render: (_, row) => {
        return (
          <div style={{ paddingTop: "20px" }}>
            <p>{row.reservation.numberOfCustomers} 名</p>
            <p>
              大人: {row.reservation.numberOfAdults} 名, 子ども:{" "}
              {row.reservation.numberOfKids} 名
            </p>
          </div>
        );
      },
    },
    {
      title: "テーブル",
      dataIndex: "table",
      render: (_, row) => {
        return (
          <div style={{ paddingTop: "20px" }}>
            {row.tables.map((option, index) => (
              <p key={option.id}>
                {option.name} {option.isDeleted === true ? "(削除済み)" : ""}
                {row.tables !== undefined && index !== row.tables.length - 1
                  ? ","
                  : " "}
              </p>
            ))}
          </div>
        );
      },
    },
    {
      title: "予約受付",
      dataIndex: "reservationReception",
      render: (_, row) => {
        return (
          <div style={{ paddingTop: "20px" }}>
            <p>
              {row.reservation.receptionist !== undefined &&
              row.reservation.receptionist !== null
                ? row.reservation.receptionist.name
                : " "}
            </p>
          </div>
        );
      },
    },
    {
      title: "",
      dataIndex: "",
      width: "70px",
      render: function renderRightArrowIcon(_, row) {
        return Object.keys(row).length >= 1 ? (
          <div
            onClick={() => handleReservationSelect(row)}
            style={customStyles}
          >
            <RightArrow />
          </div>
        ) : null;
      },
    },
  ];
  const date =
    queryString === null && getValues("date")?.isValid()
      ? getValues("date")
      : dayjs();
  return (
    <Layout>
      <div className="list-container">
        <Row style={{ marginBottom: "6.17px" }}>
          <FormHeader
            title={"ご予約一覧"}
            icon={<CalendarIcon width="28" height="28" type="lg" />}
          />
        </Row>
        <Row
          style={{ marginBottom: 20 }}
          className={"sp-reservation-list-header"}
        >
          <Col span={18}>
            <Heading classes="sub-heading">
              {isSearch === true && dataSource.length === 0
                ? "条件に該当するご予約はありません"
                : ""}
              {isSearch === false || dataSource.length > 0
                ? isSearch === false && date.isToday()
                  ? `本日のご予約： ${totalItems}件`
                  : isSearch === false
                  ? date.format("YYYY/MM/DD") +
                    ` (${getDayOfWeek(date.day())}) のご予約： ${totalItems}件`
                  : isSearch === true && dataSource.length > 0
                  ? `${searchText} ${
                      searchText.match(/\d/) ? " の" : "様の"
                    }ご予約： ${totalItems}件`
                  : ""
                : ""}
            </Heading>
          </Col>
          <Col span={6}>
            <DatePicker
              control={control}
              inputName={"date"}
              defaultValue={queryString === null ? dayjs() : ""}
              allowClear={false}
              inputProps={{
                allowClear: false,
                placeholder: "2019/07/25（木）",
                style: inputStyle,
                initialDate: dayjs().format("YYYY-MM-DD"),
              }}
              callback={() =>
                fetchData({
                  date: getValues("date")
                    ?.tz("Asia/Tokyo")
                    .format("YYYY-MM-DD"),
                })
              }
            />
          </Col>
        </Row>
        <Row>
          <Col span={24}>
            <Table
              data={dataSource}
              columns={columns}
              emptyText="該当する予約はありません。"
              onChange={onChange}
              totalItems={totalItems}
            />
          </Col>
        </Row>
        {reservationDetails?.reservation ? (
          <ReservationDetailsModal
            isModalVisible={showDetailsModal}
            handleCancel={cancelModalAction}
            reservation={reservationDetails}
            onChange={updateReservationTracker}
            handleDelete={handleDelete}
          />
        ) : null}
      </div>
    </Layout>
  );
}

ReservationList.propTypes = {};

export default ReservationList;
