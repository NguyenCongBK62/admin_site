import { put, call, takeLatest, delay } from "redux-saga/effects";
import {
  FETCH_CUSTOMER_BY_PHONE,
  FETCH_TABLE_LIST,
  FETCH_MENU_LIST,
  FETCH_RESERVATION_METHOD,
  FETCH_RECEPTIONIST,
  CREATE_RESERVATION,
  UPDATE_RESERVATION,
  SEND_SMS_RESERVATION_MESSAGE,
  CREATE_MESSAGE,
  CONFIRM_NET_RESERVATION,
  CREATE_RPA_RESERVATION,
} from "constant";
import {
  setCustomerSuggestion,
  setMenu,
  setTable,
  setReceptionists,
  setReservationMethod,
  setReservation,
  sendSMSReservationMessage as sendSMSReservationMessageAction,
  confirmNetReservation as confirmNetReservationAction,
  createRpaReservation as createRpaReservationAction,
} from "actions/createReservation";

import { createMessage as createMessageAction } from "actions/message";

import { setError, setLoading } from "actions/common";

import request from "utils/request";
import auth from "utils/auth";
import {
  formatDateWithDay,
  formatTime,
  getTodayByTimeZone,
} from "utils/common";
import { deleteReservation } from "actions/reservationActions";

const hasSms = auth.getKey("loginUser.hasSms");
const storeId = auth.getKey("loginUser.storeId");

function* fetchCustomerByPhone({ payload }) {
  yield delay(500);
  const { phonenumber, storeId } = payload;
  const url = "/customers/searchByPhonenumber";
  const options = {
    method: "GET",
    params: {
      phonenumber,
      storeId,
    },
  };

  try {
    const response = yield call(request, url, options);
    yield put(setCustomerSuggestion(response.data));
  } catch (ex) {
    yield put(setError(ex));
  }
}

function* fetchTables({ payload }) {
  const {
    storeId,
    startTime,
    endTime,
    reservationId = 0,
    self = false,
  } = payload;
  const tablesUrl = `/tables/getAllByStore/${storeId}`;
  let reservationUrl = "";
  if (self) {
    reservationUrl = `/reservations/getReservedTableExcludeSelf`;
  } else {
    reservationUrl = `/reservations/getReservedTable`;
  }

  const options = {
    method: "GET",
  };

  const optionsReservation = {
    method: "GET",
    params: {
      storeId,
      startTime,
      endTime,
    },
  };

  if (self && reservationId) {
    optionsReservation.params.reservationId = reservationId;
    optionsReservation.params.self = true;
  }

  try {
    const { data: tableData } = yield call(request, tablesUrl, options);
    const { data: reservationData } = yield call(
      request,
      reservationUrl,
      optionsReservation
    );

    const modifiedTableData = tableData.map((table) => {
      const exists = reservationData.filter(
        (reservedTables) => reservedTables.id === table.id
      );
      return {
        ...table,
        disabled: !!exists.length,
      };
    });

    yield put(setTable(modifiedTableData));
  } catch (ex) {
    yield put(setError(ex));
  }
}

function* fetchMenu({ payload }) {
  const { storeId, unauthenticated = false } = payload;
  const url = `/menu/getAllByStore/${storeId}`;
  const options = {
    method: "GET",
  };

  try {
    const response = yield call(request, url, options, unauthenticated);
    yield put(setMenu(response.data));
  } catch (ex) {
    yield put(setError(ex));
  }
}

function* fetchReceptionists({ payload }) {
  const { storeId } = payload;
  const url = `/receptionists/getAllByStoreId/${storeId}`;
  const options = {
    method: "GET",
  };

  try {
    const response = yield call(request, url, options);
    yield put(setReceptionists(response.data));
  } catch (ex) {
    yield put(setError(ex));
  }
}

function* fetchReservationMethod({ payload }) {
  const { storeId } = payload;
  const url = `/reserveMethod/getAllByStoreId/${storeId}`;
  const options = {
    method: "GET",
  };

  try {
    const response = yield call(request, url, options);
    yield put(setReservationMethod(response.data));
  } catch (ex) {
    yield put(setError(ex.toString()));
  }
}

function* createReservation({ payload }) {
  const url = `/reservations/create?isSaved=true`;
  const { dataModel2, isSendSMS } = payload;
  const options = {
    method: "POST",
    data: dataModel2,
  };

  try {
    const response = yield call(request, url, options);
    yield put(setReservation(true));
    dataModel2.reservation.id = response.data?.id;
    yield put(createRpaReservationAction({ dataModel2 }));
    if (isSendSMS && hasSms) {
      yield put(
        sendSMSReservationMessageAction({
          reservationId: response.data?.id,
          reservationType: 1,
          editedInfo: null,
        })
      );
    }
  } catch (ex) {
    yield put(setLoading(false));
    yield put(setError(ex.toString()));
  }
}

function* createRpaReservation({ payload }) {
  const { dataModel2 } = payload;
  const url = "rpa/reservations/create";
  const options = {
    method: "POST",
    data: dataModel2,
  };
  try {
    yield call(request, url, options);
  } catch (ex) {
    console.log(ex);
  }
}

function* updateReservation({ payload }) {
  const url = `/reservations/edit?isSaved=true`;
  const { dataModel2, isSendSMS, isNetorLineReservation } = payload;
  const options = {
    method: "PUT",
    data: dataModel2,
  };

  try {
    yield call(request, url, options);
    yield put(setReservation(true));
    if (isSendSMS && !isNetorLineReservation) {
      yield put(
        sendSMSReservationMessageAction({
          reservationId: dataModel2.reservation?.id,
          reservationType: 2,
          editedInfo: null,
        })
      );
    }
    if (
      isNetorLineReservation &&
      dataModel2.reservation?.reservationStatus === "0"
    ) {
      yield put(
        confirmNetReservationAction({
          reservationId: dataModel2.reservation?.id,
        })
      );
    }
  } catch (ex) {
    yield put(setLoading(false));
    yield put(setError(ex.toString()));
  }
}

function* confirmNetReservation({ payload }) {
  const { reservationId } = payload;
  const url = "reservations/confirmNetReservation/" + reservationId;
  const options = {
    method: "GET",
  };
  try {
    yield call(request, url, options);
  } catch (ex) {
    yield put(setError(ex.toString()));
  }
}

function* sendSMSReservationMessage({ payload }) {
  let { reservationId, reservationType, editedInfo } = payload;
  const url = "reservations/getDetailById/" + reservationId;
  const options = {
    method: "GET",
  };
  try {
    const response = yield call(request, url, options);
    const reservationDetailModel = response.data;
    const contactPhone = reservationDetailModel?.contactPhone
      ? reservationDetailModel?.contactPhone
      : "";
    let smsTitle = "";
    let templateSMS = "";
    let menuNamesArr = [];
    let menuNames = "";
    if (reservationType === 1) {
      // CREATE RESERVATION
      smsTitle = "ご予約を承りました。";
    } else if (reservationType === 3) {
      // DELETE RESERVATION
      smsTitle = "ご予約のキャンセルを承りました。";
    }

    let numberOfPeople = "";
    numberOfPeople =
      reservationDetailModel.reservation.numberOfAdults !== null &&
      reservationDetailModel.reservation.numberOfAdults !== 0
        ? "大人" + reservationDetailModel.reservation.numberOfAdults + "名"
        : "";

    numberOfPeople +=
      reservationDetailModel.reservation.numberOfKids !== null &&
      reservationDetailModel.reservation.numberOfKids !== 0
        ? "/子ども" + reservationDetailModel.reservation.numberOfKids + "名"
        : "";

    templateSMS =
      smsTitle +
      "\r\n" +
      formatDateWithDay(reservationDetailModel.reservation.startTime) +
      " " +
      formatTime(reservationDetailModel.reservation.startTime) +
      "～" +
      formatTime(reservationDetailModel.reservation.endTime) +
      "\r\n" +
      "予約者名： " +
      reservationDetailModel.customer.spelling +
      " (" +
      numberOfPeople +
      ")\r\n";
    if (
      reservationDetailModel.reservation.menus !== undefined &&
      reservationDetailModel.reservation.menus
    ) {
      menuNamesArr = Array.from(
        reservationDetailModel.reservation.menus,
        (menu) => menu.name
      );
      menuNames = menuNamesArr.join(", ");
      templateSMS = templateSMS + "メニュー：" + menuNames + "\r\n";
    }
    templateSMS =
      templateSMS +
      reservationDetailModel.storeName +
      "\r\n" +
      "電話番号：" +
      contactPhone;

    if (reservationType === 2) {
      editedInfo = {
        startTime: reservationDetailModel?.reservation?.startTime,
        endTime: reservationDetailModel?.reservation?.endTime,
        cus_spelling: reservationDetailModel?.customer?.spelling,
        numberOfCustomers:
          reservationDetailModel?.reservation?.numberOfCustomers,
        numberOfAdults: reservationDetailModel?.reservation?.numberOfAdults,
        numberOfKids: reservationDetailModel?.reservation?.numberOfKids,
        menus: reservationDetailModel?.reservation?.menus,
      };
      let numberOfPeople = "";
      numberOfPeople =
        editedInfo.numberOfAdults !== null && editedInfo.numberOfAdults !== 0
          ? "大人" + editedInfo.numberOfAdults + "名"
          : "";

      numberOfPeople +=
        editedInfo.numberOfKids !== null && editedInfo.numberOfKids !== 0
          ? "/子ども" + editedInfo.numberOfKids + "名"
          : "";

      templateSMS =
        "ご予約の変更を承りました。" +
        "\r\n" +
        formatDateWithDay(editedInfo.startTime) +
        " " +
        formatTime(editedInfo.startTime) +
        "～" +
        formatTime(editedInfo.endTime) +
        "\r\n" +
        "予約者名： " +
        editedInfo.cus_spelling +
        " (" +
        numberOfPeople +
        ")\r\n";
      if (editedInfo.menus !== undefined && editedInfo.menus !== null) {
        menuNamesArr = Array.from(editedInfo.menus, (menu) => menu.name);
        menuNames = menuNamesArr.join(", ");

        templateSMS = templateSMS + "メニュー：" + menuNames + "\r\n";
      }
      templateSMS =
        templateSMS +
        reservationDetailModel.storeName +
        "\r\n" +
        "電話番号：" +
        contactPhone +
        "\n\r\n※予約申し込み内容の変更をご希望の場合は、予約されたお店へ直接お電話にてご連絡をお願いします。";
    }
    const data = {
      id: 0,
      storeId: storeId,
      customerId: reservationDetailModel.customer.id,
      content: templateSMS,
      fromCustomer: false,
      sentDate: getTodayByTimeZone(),
    };
    if (isNaN(storeId)) {
      yield put(setError("店舗情報を登録してください。"));
      return false;
    }
    if (
      reservationDetailModel.reservation.isLineReservation ||
      (reservationDetailModel.customer?.phonenumber &&
        reservationDetailModel.customer?.phonenumber !== "")
    )
      yield put(createMessageAction({ data }));

    if (reservationType === 3) {
      yield put(deleteReservation(reservationId));
    }
  } catch (ex) {
    yield put(setError(ex.toString()));
  }
}

function* createMessage({ payload }) {
  const { data } = payload;
  const url = "messages/create";
  const options = {
    method: "POST",
    data: data,
  };

  try {
    yield call(request, url, options);
  } catch (ex) {
    yield put(setError(ex.toString()));
  }
}

export function* createReservationWatcher() {
  yield takeLatest(FETCH_CUSTOMER_BY_PHONE, fetchCustomerByPhone);
  yield takeLatest(FETCH_TABLE_LIST, fetchTables);
  yield takeLatest(FETCH_MENU_LIST, fetchMenu);
  yield takeLatest(FETCH_RECEPTIONIST, fetchReceptionists);
  yield takeLatest(FETCH_RESERVATION_METHOD, fetchReservationMethod);
  yield takeLatest(CREATE_RESERVATION, createReservation);
  yield takeLatest(UPDATE_RESERVATION, updateReservation);
  yield takeLatest(SEND_SMS_RESERVATION_MESSAGE, sendSMSReservationMessage);
  yield takeLatest(CREATE_MESSAGE, createMessage);
  yield takeLatest(CONFIRM_NET_RESERVATION, confirmNetReservation);
  yield takeLatest(CREATE_RPA_RESERVATION, createRpaReservation);
}
