import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useHistory, useParams } from "react-router-dom";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
import { useForm } from "react-hook-form";
import { Row, Col, Modal } from "antd";
import { ExclamationCircleOutlined } from "@ant-design/icons";

import _ from "lodash";

import auth from "utils/auth";
import { injectError } from "utils/injectError";

import {
  fetchCustomer,
  fetchMenu,
  fetchReceptionists,
  fetchReservationMethod,
  fetchTable,
  createReservation,
  setReservation,
  setCustomerSuggestion,
  updateReservation,
  sendSMSReservationMessage,
} from "actions/createReservation";

import { fetchCustomItems } from "actions/customItemsAction";
import { setError, setLoading } from "actions/common";
import {
  fetchReservationDetails,
  setReservationDetails,
  deleteReservation,
  setIsDeleted,
} from "actions/reservationActions";
import FormHeader from "components/FormHeader";
import CalendarIcon from "components/Icons/CalendarIcon";
import Layout from "containers/Layout";
import { ReservationForm } from "components/Form";
import DataSidePreview from "components/DataSidePreview";
import { useErrors } from "hooks";
import { SendReservationDetailsModal } from "components/Modal";
import { getDayOfWeek } from "utils/common";
import queryString from "query-string";

dayjs.extend(utc);
dayjs.extend(timezone);

export default function ReservationCreateUpdate() {
  const history = useHistory();
  const methods = useForm({
    mode: "onSubmit",
  });

  const {
    handleSubmit,
    control,
    errors: formErrors,
    setValue,
    getValues,
  } = methods;
  const dispatch = useDispatch();
  const { id } = useParams();
  const { manualErrors } = useErrors();
  const { confirm } = Modal;
  const [showModal, setShowModal] = useState(false);
  const [dataModel, setDataModel] = useState({});
  const [hasChange, setHasChange] = useState(false);
  const [changes, setChanges] = useState({});
  const [isNetorLineReservation, setIsNetorLineReservation] = useState(false);

  const selectedStore = useSelector(
    (state) => state.layoutReducer.selectedStore
  );

  const tables = useSelector((state) => state.createReservationReducer.tables);

  const menus = useSelector((state) => state.createReservationReducer.menus);
  const isDelete = useSelector((state) => state.homeReducer.isDelete);
  const receptionists = useSelector(
    (state) => state.createReservationReducer.receptionists
  );

  const reservationMethods = useSelector(
    (state) => state.createReservationReducer.reservationMethods
  );

  const customerSuggestions = useSelector(
    (state) => state.createReservationReducer.customerSuggestions
  );

  const created = useSelector(
    (state) => state.createReservationReducer.created
  );

  const reservationDetails = useSelector(
    (state) => state.homeReducer.reservation
  );

  const customItems = useSelector(
    (state) => state.customItemsReducer.custom_items
  );

  // execute start of render
  useEffect(() => {
    dispatch(setIsDeleted(false));

    if (history.location.state?.data) {
      const { data } = history.location.state;
      const start = dayjs(data.start).tz("Asia/Tokyo");

      setValue("tables", [data.table]);
      setValue("date", start);
      setValue("startTime", start.format("HH:mm"));
      setValue("endTime", start.add(2, "h").format("HH:mm"));

      history.replace({
        pathname: history.location.pathname,
        state: { url: history.location.state?.url },
      });
    } else {
      const start = dayjs().tz("Asia/Tokyo").add(1, "h").startOf("h");

      setValue("date", start);
      setValue("startTime", start.format("HH:mm"));
      setValue("endTime", start.add(2, "h").format("HH:mm"));
    }
  }, []);

  // execute if edit mode
  useEffect(() => {
    if (id) {
      dispatch(fetchReservationDetails(id));
    } else {
      dispatch(setReservationDetails({}));
    }
  }, [id]);

  useEffect(() => {
    if (isDelete) {
      history.goBack();
      dispatch(setIsDeleted(false));
    }
  }, [isDelete]);

  // execute set values edit mode

  useEffect(() => {
    if (reservationDetails?.reservation?.id) {
      const {
        reservation,
        customer,
        tables,
        customFields: editCustomFields,
      } = reservationDetails;
      setValue("date", dayjs(reservation.startTime).tz("Asia/Tokyo"));
      setValue(
        "startTime",
        dayjs(reservation.startTime).tz("Asia/Tokyo").format("HH:mm")
      );
      setValue(
        "endTime",
        dayjs(reservation.endTime).tz("Asia/Tokyo").format("HH:mm")
      );
      setValue("adultNumber", reservation.numberOfAdults);
      setValue("childNumber", reservation.numberOfKids);
      setValue("lastName", customer.spelling.split(" ")[0]);
      setValue(
        "firstName",
        customer.spelling.split(" ").length > 1
          ? customer.spelling.split(" ")[1]
          : ""
      );
      setValue("phoneNumber", customer.phonenumber);

      setValue("tables", tables);
      setValue("menus", reservation.menus);
      setValue("status", reservation.reservationStatus.toString());
      setValue("note", reservation.note);
      setValue("receptionistsOptions", reservation.receptionist?.id);
      setValue("reservationOption", reservation.reserveMethod?.id);

      if (customItems?.data) {
        _.forEach(editCustomFields, (customItem) => {
          const item = _.find(
            customItems.data,
            (i) => i.id === customItem.customFieldId
          );

          if (item) {
            if (
              customItem.customFieldType?.id === 1 ||
              customItem.customFieldType?.id === 6
            ) {
              setValue(`custom-${item.name}`, customItem.textContent);
            }
            if (customItem.customFieldType?.id === 2) {
              setValue(`custom-${item.name}`, customItem.numberContent);
            }
            if (customItem.customFieldType?.id === 3) {
              setValue(`custom-${item.name}`, customItem.options[0]?.id);
            }
            if (customItem.customFieldType?.id === 4) {
              setValue(`custom-${item.name}`, customItem.options);
            }
            if (customItem.customFieldType?.id === 5) {
              setValue(`custom-${item.name}`, dayjs(customItem.datePicker));
            }
          }
        });
      }
    }
  }, [reservationDetails, customItems]);

  // useEffect(() => {
  // if (history.location.state?.data && tables.length) {
  //   const { data } = history.location.state;
  //   const foundTable = _.find(tables, (t) => t.id === data.table.id);
  //   if (!foundTable?.disabled) {
  //     setValue("tables", [data.table]);
  //     history.replace();
  //   }
  //   } else {
  //     const currentTables = getValues("tables");
  //     setValue(
  //       "tables",
  //       _.filter(currentTables, (ct) => {
  //         const t = _.find(tables, (ft) => ft.id === ct.id);
  //         if (t) {
  //           return !t.disabled;
  //         }
  //         return true;
  //       })
  //     );
  //   }
  // }, [tables]);

  useEffect(() => {
    const storeId = auth.getKey("loginUser.storeId");
    const date = getValues("date");
    const startTime = getValues("startTime");
    const endTime = getValues("endTime");

    if (storeId > 0 && selectedStore.name) {
      if (!id) {
        dispatch(
          fetchTable({
            storeId,
            startTime: dayjs
              .tz(`${date?.format("YYYY-MM-DD")} ${startTime}`, "Asia/Tokyo")
              .toDate()
              .toString(),
            endTime: dayjs
              .tz(`${date?.format("YYYY-MM-DD")} ${endTime}`, "Asia/Tokyo")
              .toDate()
              .toString(),
          })
        );
      } else {
        dispatch(
          fetchTable({
            storeId,
            startTime: dayjs
              .tz(`${date?.format("YYYY-MM-DD")} ${startTime}`, "Asia/Tokyo")
              .toDate()
              .toString(),
            endTime: dayjs
              .tz(`${date?.format("YYYY-MM-DD")} ${endTime}`, "Asia/Tokyo")
              .toDate()
              .toString(),
            reservationId: id,
            self: true,
          })
        );
      }

      dispatch(fetchMenu({ storeId }));
      dispatch(fetchReceptionists({ storeId }));
      dispatch(fetchReservationMethod({ storeId }));
      dispatch(fetchCustomItems(storeId));
    }
  }, [selectedStore]);

  useEffect(() => {
    if (created) {
      let pathname = "/";
      if (history.location.state?.url?.pathname) {
        const date = getValues("date");

        const query = queryString.parse(history.location.state?.url?.search);
        const newQuery = queryString.stringify({
          ...query,
          day: dayjs(date).toISOString(),
        });
        pathname = history.location.state?.url?.pathname;
        if (newQuery) {
          pathname += "?" + newQuery;
        }
      }

      history.push(pathname);
      dispatch(setReservation(false));
      dispatch(setLoading(false));
    }
  }, [created]);
  const closeModal = () => {
    setShowModal(false);
  };

  const showSendSMSModal = (data) => {
    let isChange = false;
    const tempChange = {
      customer: {},
      reservation: {},
      tables: [],
      linkPage: null,
    };
    if (reservationDetails?.reservation?.isLineReservation) {
      data.receptionists =
        _.find(receptionists, (i) => data.receptionistsOptions === i.id)
          ?.name || "";
      data.reservationMethods =
        _.find(reservationMethods, (i) => data.reservationOption === i.id)
          ?.name || "";

      setDataModel(data);

      if (id) {
        const { reservation, customer } = reservationDetails;
        if (
          (reservation.isNetReservation === true ||
            reservation.isLineReservation === true) &&
          reservation.reservationStatus !== 0
        ) {
          setShowModal(true);
          setIsNetorLineReservation(true);
          return;
        }
        const startDateTime = dayjs
          .tz(
            `${data.date.format("YYYY-MM-DD")} ${data.startTime}`,
            "Asia/Tokyo"
          )
          .toISOString();
        const endDateTime = dayjs
          .tz(`${data.date.format("YYYY-MM-DD")} ${data.endTime}`, "Asia/Tokyo")
          .toISOString();
        if (reservation.startTime !== startDateTime) {
          isChange = true;
          tempChange.reservation.startTime = startDateTime;
        }
        if (reservation.endTime !== endDateTime) {
          isChange = true;
          tempChange.reservation.endTime = endDateTime;
        }

        if (reservation.numberOfAdults !== data.adultNumber) {
          isChange = true;
          tempChange.reservation.numberOfAdults = data.adultNumber;
        }
        if (reservation.numberOfKids !== data.childNumber) {
          isChange = true;
          tempChange.reservation.numberOfKids = data.childNumber;
        }
        const changedSpelling = `${data.lastName} ${data.firstName}`;
        if (customer.spelling !== changedSpelling) {
          isChange = true;
          tempChange.customer.spelling = changedSpelling;
        }
      }

      if (
        (reservationDetails?.reservation?.isLineReservation && isChange) ||
        (isChange && data.phoneNumber && data.phoneNumber !== "") ||
        !id
      ) {
        setShowModal(true);
        if (isChange) {
          setHasChange(isChange);
          setChanges(tempChange);
        }
      } else {
        onSubmit(false, data);
      }
    } else {
      onSubmit(false, data);
    }
  };

  const onSubmit = (isSendSMS, receivedData) => {
    let data = {};
    if (receivedData) {
      data = receivedData;
    } else {
      data = dataModel;
    }
    const storeId = auth.getKey("loginUser.storeId");
    const customFieldsData = [];

    _.forEach(customItems.data, (customItem) => {
      if (_.has(data, `custom-${customItem.name}`)) {
        const temp = {
          customFieldId: customItem.id,
        };
        if (id) {
          const item = _.find(
            reservationDetails.customFields,
            (c) => c.customFieldId === customItem.id
          );
          temp.id = item?.id;
        }

        if (customItem.type.id === 1 || customItem.type.id === 6) {
          temp.textContent = data[`custom-${customItem.name}`];
        }
        if (customItem.type.id === 2) {
          temp.numberContent = data[`custom-${customItem.name}`];
        }
        if (customItem.type.id === 3) {
          temp.options = data[`custom-${customItem.name}`]
            ? [data[`custom-${customItem.name}`]]
            : [];
          _.remove(temp.options, (t) => !t);
        }
        if (customItem.type.id === 4) {
          temp.options = [
            ...data[`custom-${customItem.name}`].map((d) => d.id),
          ];
          _.remove(temp.options, (t) => !t);
        }
        if (customItem.type.id === 5) {
          temp.datePicker = dayjs(data[`custom-${customItem.name}`]).isValid()
            ? dayjs(data[`custom-${customItem.name}`]).toISOString()
            : null;
        }

        customFieldsData.push(temp);
      }
    });

    if (!id) {
      const customer = {
        spellingLastname: data.lastName ? data.lastName : "",
        phonenumber: data.phoneNumber ? data.phoneNumber : "",
      };
      customer.spellingFirstname = data.firstName ? data.firstName : "";

      const selectedMenus = data.menus.map((m) => ({ id: m.id }));
      const selectedTables = data.tables.map((m) => m.id.toString());
      const receptionist = _.find(
        receptionists,
        (i) => i.id === data.receptionistsOptions
      );
      const reserveMethod = _.find(
        reservationMethods,
        (i) => i.id === data.reservationOption
      );
      const startTime = dayjs(
        `${data.date.format("YYYY-MM-DD")} ${data.startTime}`
      );
      const endTime = dayjs(
        `${data.date.format("YYYY-MM-DD")} ${data.endTime}`
      );

      const reservation = {
        startTime: dayjs
          .tz(startTime.format("YYYY-MM-DD HH:mm"), "Asia/Tokyo")
          .toISOString(),
        numberOfAdults: data.adultNumber,
        numberOfCustomers:
          parseInt(data.adultNumber) + parseInt(data.childNumber),
        numberOfKids: data.childNumber,
        note: data.note,
        menus: selectedMenus,
        reservationStatus: data.status,
        receptionist: receptionist?.id
          ? {
              id: receptionist.id,
              name: receptionist.name,
            }
          : null,
        reserveMethod: reserveMethod?.id
          ? {
              id: reserveMethod.id,
              name: reserveMethod.name,
            }
          : null,
      };

      if (startTime < endTime) {
        reservation.endTime = dayjs
          .tz(endTime.format("YYYY-MM-DD HH:mm"), "Asia/Tokyo")
          .toISOString();
      } else {
        reservation.endTime = dayjs
          .tz(
            `${data.date.add(1, "d").format("YYYY-MM-DD")} ${data.endTime}`,
            "Asia/Tokyo"
          )
          .toISOString();
      }

      const dataModel2 = {
        customFields: { content: customFieldsData },
        customer: customer,
        reservation: reservation,
        storeId: storeId,
        tables: selectedTables,
      };
      dispatch(setLoading(true));
      dispatch(createReservation({ dataModel2, isSendSMS }));
    } else {
      const customer = {
        id: reservationDetails.customer.id,
        spellingLastname: data.lastName ? data.lastName : "",
        phonenumber: data.phoneNumber ? data.phoneNumber : "",
      };

      customer.spellingFirstname = data.firstName ? data.firstName : "";

      const selectedMenus = data.menus?.map((m) => ({ id: m.id }));
      const selectedTables = data.tables?.map((m) => m.id.toString());
      const receptionist = _.find(
        receptionists,
        (i) => i.id === data.receptionistsOptions
      );
      const reserveMethod = _.find(
        reservationMethods,
        (i) => i.id === data.reservationOption
      );

      const startTime = dayjs(
        `${data.date.format("YYYY-MM-DD")} ${data.startTime}`
      );

      const endTime = dayjs(
        `${data.date.format("YYYY-MM-DD")} ${data.endTime}`
      );

      const reservation = {
        id,
        startTime: dayjs
          .tz(startTime.format("YYYY-MM-DD HH:mm"), "Asia/Tokyo")
          .toISOString(),
        numberOfAdults: data.adultNumber,
        numberOfCustomers:
          parseInt(data.adultNumber) + parseInt(data.childNumber),
        numberOfKids: data.childNumber,
        note: data.note,
        menus: selectedMenus,
        reservationStatus: data.status,
        receptionist: receptionist?.id
          ? {
              id: receptionist.id,
              name: receptionist.name,
            }
          : null,
        reserveMethod: reserveMethod?.id
          ? {
              id: reserveMethod.id,
              name: reserveMethod.name,
            }
          : null,
      };

      if (startTime < endTime) {
        reservation.endTime = dayjs
          .tz(endTime.format("YYYY-MM-DD HH:mm"), "Asia/Tokyo")
          .toISOString();
      } else {
        reservation.endTime = dayjs
          .tz(
            `${data.date.add(1, "d").format("YYYY-MM-DD")} ${data.endTime}`,
            "Asia/Tokyo"
          )
          .toISOString();
      }
      const dataModel2 = {
        customFields: {
          content: customFieldsData,
          customerId: customer.id,
          reservationId: reservation.id,
        },
        customer: customer,
        reservation: reservation,
        storeId: storeId,
        tables: selectedTables,
      };

      dispatch(setLoading(true));
      if (!isSendSMS && isNetorLineReservation) {
        dispatch(
          updateReservation({
            dataModel2,
            isSendSMS,
            isNetorLineReservation: false,
          })
        );
      } else {
        dispatch(
          updateReservation({ dataModel2, isSendSMS, isNetorLineReservation })
        );
      }
    }

    dispatch(setReservationDetails({}));
  };

  const handleDateChange = (isStartDate = false) => {
    const date = getValues("date");
    const startTime = getValues("startTime");
    const endTime = getValues("endTime");
    const storeId = auth.getKey("loginUser.storeId");

    const startDate = dayjs(
      `${date?.format("YYYY-MM-DD")} ${startTime}`,
      "YYYY-MM-DD HH:mm"
    );

    let endDate = dayjs(
      `${date?.format("YYYY-MM-DD")} ${endTime}`,
      "YYYY-MM-DD HH:mm"
    );

    if (isStartDate) {
      endDate = startDate.add(2, "hour");
      setValue("endTime", endDate.format("HH:mm"));
    }

    if (
      storeId > 0 &&
      selectedStore.name &&
      startDate.isValid() &&
      endDate.isValid()
    ) {
      if (startDate >= endDate) {
        endDate = endDate.add(1, "day");
      }
      if (id) {
        dispatch(
          fetchTable({
            storeId,
            startTime: dayjs
              .tz(startDate.format("YYYY-MM-DD HH:mm"), "Asia/Tokyo")
              .toDate()
              .toString(),
            endTime: dayjs
              .tz(endDate.format("YYYY-MM-DD HH:mm"), "Asia/Tokyo")
              .toDate()
              .toString(),
            reservationId: id,
            self: true,
          })
        );
      } else {
        dispatch(
          fetchTable({
            storeId,
            startTime: dayjs
              .tz(startDate.format("YYYY-MM-DD HH:mm"), "Asia/Tokyo")
              .toDate()
              .toString(),
            endTime: dayjs
              .tz(endDate.format("YYYY-MM-DD HH:mm"), "Asia/Tokyo")
              .toDate()
              .toString(),
          })
        );
      }
    }
  };

  const onPhoneChange = (val) => {
    const storeId = auth.getKey("loginUser.storeId");
    if (val.length > 3) {
      if (storeId > 0 && selectedStore.name) {
        dispatch(
          fetchCustomer({
            storeId,
            phonenumber: val,
          })
        );
      }
    }
  };

  const handleCustomerSelection = (id) => {
    const selected = customerSuggestions.filter((s) => s.id === id);
    setValue("firstName", selected[0].spellingFirstname);
    setValue("lastName", selected[0].spellingLastname);
    _.forEach(selected[0].customFields, (customItem) => {
      const item = _.find(
        customItems.data,
        (i) => i.id === customItem.customFieldId
      );

      if (item) {
        if (
          customItem.customFieldType.id === 1 ||
          customItem.customFieldType.id === 6
        ) {
          setValue(`custom-${item.name}`, customItem.textContent);
        }
        if (customItem.customFieldType.id === 2) {
          setValue(`custom-${item.name}`, customItem.numberContent);
        }
        if (customItem.customFieldType.id === 3) {
          setValue(`custom-${item.name}`, customItem.options[0]?.id);
        }
        if (customItem.customFieldType.id === 4) {
          setValue(`custom-${item.name}`, customItem.options);
        }
        if (customItem.customFieldType.id === 5) {
          setValue(`custom-${item.name}`, dayjs(customItem.datePicker));
        }
      }
    });
  };

  const handleClearCustomerSuggestion = () => {
    dispatch(setCustomerSuggestion([]));
  };

  const onCancelHandler = () => {
    if (id) {
      confirm({
        icon: <ExclamationCircleOutlined />,
        title: "確認",
        content: "編集した内容は破棄されます。よろしいですか？",
        okText: "はい",
        okType: "danger",
        cancelText: "いいえ",
        centered: true,
        onOk() {
          history.goBack();
        },
        onCancel() {
          console.log("Cancel");
        },
      });
    }
  };

  const dataPreview = [
    {
      heading: "日時と人数",
      items: [
        {
          label: "日にち",
          value: (watcher) => {
            const v = dayjs(watcher?.date).isValid()
              ? watcher.date?.format("YYYY-MM-DD") +
                ` (${getDayOfWeek(watcher.date?.tz("Asia/Tokyo").day())})`
              : "";
            return v || "";
          },
        },
        {
          label: "予約時間",
          value: (watcher) => {
            const v = `${watcher.startTime} ~ ${watcher.endTime} `;
            return v || "";
          },
        },
        {
          label: "人数",
          value: (watcher) => {
            const v = `大人 ${watcher.adultNumber} 人 子供 ${watcher.childNumber}人`;
            return v || "";
          },
        },
      ],
    },
    {
      heading: "お客様情報",
      items: [
        {
          label: "名前",
          value: (watcher) => {
            const v = `${watcher.lastName} ${watcher.firstName}`;
            return v || "";
          },
        },
        {
          label: "お電話番号",
          value: (watcher) => {
            let v;
            if (watcher.phoneNumber) {
              v = `${watcher.phoneNumber} `;
            }
            return v || "";
          },
        },
      ],
    },
    {
      heading: "ご予約内容",
      items: [
        {
          label: "メニュー",
          value: (watcher) => {
            let v = "";
            _.forEach(watcher.menus, (m) => (v += `${m.name}, `));
            return v.slice(0, -2) || "";
          },
        },
        {
          label: "テーブル",
          value: (watcher) => {
            let v = "";
            _.forEach(watcher.tables, (m) => (v += `${m.name}, `));
            return v.slice(0, -2) || "";
          },
        },
        {
          label: "ステータス",
          value: (watcher) => {
            let v = "";
            if (watcher.status === "0") {
              v = "予約確定";
            }
            if (watcher.status === "1") {
              v = "仮予約";
            }
            if (watcher.status === "2") {
              v = "キャンセル待ち";
            }
            return v;
          },
        },
        {
          label: "予約メモ",
          value: (watcher) => {
            const v = watcher.note;
            return v || "";
          },
        },
        {
          label: "予約受付スタッフ",
          value: (watcher) => {
            const v = watcher.receptionistsOptions;
            return _.find(receptionists, (i) => v === i.id)?.name || "";
          },
        },
        {
          label: "予約経路",
          value: (watcher) => {
            const v = watcher.reservationOption;
            return _.find(reservationMethods, (i) => v === i.id)?.name || "";
          },
        },
      ],
    },
  ];

  const handleDelete = () => {
    confirm({
      icon: <ExclamationCircleOutlined />,
      title: "確認",
      content:
        "キャンセルした予約はもとに戻せません。予約をキャンセルしてもよろしいですか？",
      okText: "はい",
      okType: "danger",
      cancelText: "いいえ",
      centered: true,
      onOk() {
        dispatch(setReservationDetails({}));
        if (reservationDetails.reservation.isLineReservation) {
          confirm({
            icon: <ExclamationCircleOutlined />,
            content: "ご予約キャンセルのメッセージを送りますか？",
            okText: "送信する",
            okType: "danger",
            cancelText: "送信しない",
            centered: true,
            onOk() {
              dispatch(
                sendSMSReservationMessage({
                  reservationId: id,
                  reservationType: 3,
                  editedInfo: null,
                })
              );
            },
            onCancel() {
              dispatch(deleteReservation(id));
            },
          });
        } else {
          dispatch(deleteReservation(id));
        }
      },
      onCancel() {
        console.log("Cancel");
      },
    });
  };

  const customFields = [];
  _.forEach(customItems?.data, (c) => {
    if (c.displayOnReservation) {
      customFields.push({
        label: c.name,
        value: (watcher) => {
          if (c.type.id === 3) {
            return _.find(c.option, (o) => watcher[`custom-${c.name}`] === o.id)
              ?.name;
          }
          if (c.type.id === 4) {
            let v = "";
            _.forEach(watcher[`custom-${c.name}`], (x) => {
              v += _.find(c.option, (o) => x.id === o.id)?.name + " ";
            });
            return v;
          }
          if (c.type.id === 5) {
            const v = watcher[`custom-${c.name}`];
            return v?.isValid() ? v.format("YYYY年 MM月 DD日") : "";
          }
          return watcher[`custom-${c.name}`];
        },
      });
    }
  });

  if (customFields.length) {
    dataPreview[1].items = [...dataPreview[1].items, ...customFields];
  }

  const showErrorMsg = (err) => {
    if (err) {
      for (const key in err) {
        if (!key.includes("custom")) {
          return;
        }
        if (key.includes("custom")) {
          dispatch(setError(err[key].message));
          return;
        }
      }
    }
  };

  return (
    <Layout>
      <form
        className="form-container"
        onSubmit={handleSubmit(showSendSMSModal, showErrorMsg)}
      >
        <FormHeader
          title={id ? "ご予約の変更" : "ご予約の新規登録"}
          icon={<CalendarIcon width={"28"} height={"28"} type={"lg"} />}
        />
        <Row wrap={false}>
          <Col flex="auto">
            <ReservationForm
              control={control}
              errors={injectError(manualErrors, formErrors)}
              onDateChange={handleDateChange}
              menus={menus}
              tables={[
                { id: -1, name: "未割り当て" },
                ...tables.filter((t) => t.displayStatus),
              ]}
              reservationMethods={
                reservationMethods
                  ? reservationMethods.filter((r) => r.isDisplayed)
                  : null
              }
              receptionists={receptionists.filter((r) => r.isDisplayed)}
              customerSuggestions={customerSuggestions}
              fetchCustomerSuggestions={onPhoneChange}
              handlePhoneSelection={handleCustomerSelection}
              handleClearCustomerSuggestion={handleClearCustomerSuggestion}
              customItems={customItems?.data?.length ? customItems.data : []}
            />
          </Col>
          <DataSidePreview
            isEdit={!!id}
            onCancel={onCancelHandler}
            data={dataPreview}
            control={control}
            title={"ご予約内容"}
            deleteHandler={handleDelete}
          />
        </Row>
      </form>
      <SendReservationDetailsModal
        isModalVisible={showModal}
        handleCancel={closeModal}
        modalTitle={"メッセージ送信内容を確認"}
        onSubmit={onSubmit}
        data={dataModel}
        hasChange={hasChange}
        changes={changes}
      />
    </Layout>
  );
}
