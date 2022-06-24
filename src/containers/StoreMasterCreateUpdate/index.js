import React, { useEffect, useState } from "react";
import Layout from "containers/Layout";
import "./style/index.less";
import { Col, Row, Modal } from "antd";
import SettingsIcon from "components/Icons/SettingsIcon";
import { useForm } from "react-hook-form";
import { useHistory } from "react-router";
import { translateHolidays } from "utils/common";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchByZipCode,
  fetchPostalCodeData,
  generateUUID,
  setPostalCodeData,
  fetchStoreById,
  deleteStore,
  setLoadedStore,
  isCreatedStore,
  // createStore,
} from "actions/store";
import { setError, setLoading, setSuccessMessage } from "actions/common";
import dayjs from "dayjs";
import { useParams } from "react-router-dom";
import { ExclamationCircleOutlined } from "@ant-design/icons";
import FormHeader from "components/FormHeader";
import { dataPreview } from "./data";
import DataSidePreview from "components/DataSidePreview";
import StoreMasterForm from "components/Form/StoreMasterForm";

const { confirm } = Modal;

export default function StoreMasterCreateUpdate() {
  const [businessHour, setBusinessHour] = useState([
    {
      startTimeHour: "",
      startTimeMinute: "",
      endTimeHour: "",
      endTimeMinute: "",
    },
  ]);
  const { handleSubmit, watch, setValue, control, reset } = useForm({
    defaultValues: {
      businessHours: businessHour,
    },
  });
  const history = useHistory();
  const dispatch = useDispatch();
  const { id } = useParams();

  // useState
  const [hasHolidays, setHasHolidays] = useState(false);
  const [checkedHolidays, setCheckedHolidays] = useState([]);
  const [isEdit, setIsEdit] = useState(false);

  // useSelector
  const postalCodeSource = useSelector(
    (state) => state.storeMasterCreateUpdateReducer.postalCodeData
  );
  const uuid = useSelector(
    (state) => state.storeMasterCreateUpdateReducer.UUID
  );
  const created = useSelector(
    (state) => state.storeMasterCreateUpdateReducer.isCreatedStore
  );
  const loadedStoreData = useSelector(
    (state) => state.storeMasterCreateUpdateReducer.loadedStoreData
  );

  // useEffect
  useEffect(() => {
    if (id) {
      dispatch(setLoading(true));
      setIsEdit(true);
      if (!loadedStoreData) {
        dispatch(fetchStoreById(id));
      }
    } else {
      dispatch(generateUUID());
    }
  }, [id]);

  useEffect(() => {
    if (id && loadedStoreData) {
      const netReservation = loadedStoreData.netReservation;
      if (!window.location.origin) {
        window.location.origin =
          window.location.protocol +
          "//" +
          window.location.hostname +
          (window.location.port ? ":" + window.location.port : "");
      }
      const weeklyHolidays = [];
      loadedStoreData.weeklyHolidays.forEach((item) => {
        weeklyHolidays.push(item.id);
      });
      if (loadedStoreData.hasHolidays) weeklyHolidays.push(-2);
      // onChangeHolidays(weeklyHolidays);
      setCheckedHolidays(weeklyHolidays);
      const concatHolidays = [];
      setHasHolidays(false);
      weeklyHolidays.forEach((id) => {
        if (id === -2) {
          setHasHolidays(true);
          concatHolidays.push({ id: id, name: translateHolidays(id) });
        } else {
          concatHolidays.push({ id: id, name: translateHolidays(id) });
        }
      });
      const loadedBusinessHour = [];
      loadedStoreData.businessHours.forEach((item) => {
        loadedBusinessHour.push({
          startTimeHour: parseInt(item.openHours.split(":")[0]),
          startTimeMinute: item.openHours.split(":")[1],
          endTimeHour: parseInt(item.closeHours.split(":")[0]),
          endTimeMinute: item.closeHours.split(":")[1],
        });
      });
      setBusinessHour(
        loadedBusinessHour.length > 0 ? loadedBusinessHour : businessHour
      );
      reset({
        name: loadedStoreData.name,
        displayName: loadedStoreData.displayName,
        postalCode: loadedStoreData.postalCode,
        address: loadedStoreData.address,
        phonenumber: loadedStoreData.phonenumber,
        nameTaberogu: loadedStoreData.nameTaberogu,
        nameGurunavi: loadedStoreData.nameGurunavi,
        nameHotopepper: loadedStoreData.nameHotopepper,
        businessHours:
          loadedBusinessHour.length > 0 ? loadedBusinessHour : businessHour,
        weeklyHolidays: concatHolidays,
        status: loadedStoreData.status.toString(),
        remindHour: loadedStoreData.remindHour,
        remindBeforeDate: loadedStoreData.remindBeforeDate,
        "netReservation.displayCrowdedPercent":
          netReservation.displayCrowdedPercent,
        "netReservation.netReservationNote": netReservation.netReservationNote,
        "netReservation.reservedBeforeDay": netReservation.reservedBeforeDay,
        "netReservation.reservedBeforeDayEnd":
          netReservation.reservedBeforeDayEnd,
        "netReservation.reservedBeforeHourStart":
          netReservation.reservedBeforeHourStart,
        "netReservation.staffEmail": netReservation.staffEmail,
        "netReservation.staffPhonenumber": netReservation.staffPhonenumber,
        displayNetReservation: loadedStoreData.displayNetReservation.toString(),
        formReservationStores:
          window.location.origin + "/rsv/?id=" + netReservation.uuid,
      });
      dispatch(setLoadedStore(null));
    }
  }, [loadedStoreData, reset]);

  useEffect(() => {
    if (created) {
      history.push("/settings/store-master");
      dispatch(setLoading(false));
      dispatch(isCreatedStore(false));
    }
  }, [created]);
  // Methods
  // PostalCode
  const updatePostalCode = (inputNumber) => {
    if (inputNumber.length <= 8) {
      setValue("postalCode", inputNumber);
      if (inputNumber.length > 3) dispatch(fetchPostalCodeData(inputNumber));
      else {
        dispatch(setPostalCodeData([]));
      }
    }
  };

  const handlePostalCodeSelection = (id) => {
    const detailsPostalCodeById = postalCodeSource.filter((postalCode) => {
      return postalCode.id === id;
    });
    updatePostalCode(detailsPostalCodeById[0].zipCode);
    const location =
      detailsPostalCodeById[0].prefecture.trim() +
      "" +
      detailsPostalCodeById[0].city.trim() +
      "" +
      detailsPostalCodeById[0].town.trim();
    setValue("address", location);
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
          history.push("/settings/store-master");
        },
        onCancel() {
          console.log("Cancel");
        },
      });
    } else {
      history.push("/settings/store-master");
    }
  };

  // Holidays
  const onChangeHolidays = (checkedHolidays) => {
    setCheckedHolidays(checkedHolidays);
    const concatHolidays = [];
    setHasHolidays(false);
    checkedHolidays.forEach((id) => {
      if (id === -2) {
        setHasHolidays(true);
        concatHolidays.push({ id: id, name: translateHolidays(id) });
      } else {
        concatHolidays.push({ id: id, name: translateHolidays(id) });
      }
    });
    setValue("weeklyHolidays", concatHolidays);
  };

  // StaffPhoneNumber

  const onCopyText = () => {
    dispatch(setSuccessMessage("クリップボードへコピーしました。"));
  };

  const onUpdate = (data) => {
    confirm({
      icon: <ExclamationCircleOutlined />,
      title: "確認",
      content: "更新します。よろしいですか？",
      okText: "はい",
      okType: "danger",
      cancelText: "いいえ",
      centered: true,
      onOk() {
        onSubmit(data);
      },
      onCancel() {
        return false;
      },
    });
  };
  const onSubmit = (data) => {
    data.netReservation.uuid = uuid;
    if (data.name === "" || data.name === undefined) {
      dispatch(setError("店舗名を入力してください。"));
      return false;
    }
    // businessHour
    const formattedBusinessHours = [];
    data.businessHours.forEach((businessHour) => {
      if (
        businessHour.startTimeHour &&
        businessHour.startTimeHour !== "" &&
        businessHour.startTimeMinute &&
        businessHour.startTimeMinute !== "" &&
        businessHour.endTimeHour &&
        businessHour.endTimeHour !== "" &&
        businessHour.endTimeMinute &&
        businessHour.endTimeMinute !== ""
      ) {
        formattedBusinessHours.push({
          openHours:
            businessHour.startTimeHour + ":" + businessHour.startTimeMinute,
          closeHours:
            businessHour.endTimeHour + ":" + businessHour.endTimeMinute,
        });
      }
      data.businessHours = formattedBusinessHours;
    });

    let error = false;
    if (data.businessHours.length > 0) {
      const cloneList = data.businessHours;
      cloneList.forEach((item) => {
        const startTime = dayjs(item.openHours, "HH:mm");
        const endTime = dayjs(item.closeHours, "HH:mm");
        if (startTime.isAfter(endTime) || startTime.isSame(endTime)) {
          dispatch(setError("開始時間と終了時間が不正です。"));
          error = true;
          return false;
        }
      });
      cloneList.sort(function (arg1, arg2) {
        const startTime1 = dayjs(arg1.openHours, "HH:mm").toDate();
        const startTime2 = dayjs(arg2.openHours, "HH:mm").toDate();
        return startTime2 > startTime1 ? -1 : startTime2 < startTime1 ? 1 : 0;
      });
      for (let i = 0; i < cloneList.length - 1; i++) {
        const endTime1 = dayjs(cloneList[i].closeHours, "HH:mm");
        const startTime2 = dayjs(cloneList[i + 1].openHours, "HH:mm");
        if (endTime1.isAfter(startTime2)) {
          dispatch(setError("開始時間と終了時間が不正です。"));
          error = true;
          return false;
        }
      }
    }
    if (error) return false;
    data.weeklyHolidays = data.weeklyHolidays ? data.weeklyHolidays : [];
    data.hasHolidays = hasHolidays;
    if (
      data.netReservation.staffEmail !== "" &&
      data.netReservation.staffEmail.match(
        /^[a-z][a-z0-9_\\.\\-]{5,32}@[a-z0-9_\\-]{2,}(\.[a-z0-9]{2,4}){1,2}$/
      ) === null
    ) {
      dispatch(
        setError("メールアドレスのフォーマットが正しく入力してください。")
      );
      return false;
    }
    dispatch(setLoading(true));
    if (id) data.id = id;
    dispatch(fetchByZipCode(data, id));
  };

  const deleteStoreById = () => {
    confirm({
      icon: <ExclamationCircleOutlined />,
      title: "確認",
      content:
        "削除したデータはもとに戻せません。店舗を削除してもよろしいですか？",
      okText: "はい",
      okType: "danger",
      cancelText: "いいえ",
      centered: true,
      onOk() {
        dispatch(setLoading(true));
        dispatch(setLoadedStore(null));
        dispatch(deleteStore(id));
      },
      onCancel() {
        console.log("Cancel");
      },
    });
  };

  return (
    <Layout>
      <form
        className="form-container"
        onSubmit={!id ? handleSubmit(onSubmit) : handleSubmit(onUpdate)}
      >
        <FormHeader
          title={id ? "店舗の編集" : "店舗の新規登録"}
          icon={<SettingsIcon width={"28"} height={"28"} />}
        />
        <Row wrap={false}>
          <Col flex="auto">
            <StoreMasterForm
              control={control}
              handlePostalCodeSelection={handlePostalCodeSelection}
              fetchPostalCodeSuggestions={updatePostalCode}
              postalCodeSuggestions={postalCodeSource}
              watch={watch}
              onCopyText={onCopyText}
              isEdit={!!id}
              onChangeHolidays={onChangeHolidays}
              checkedHolidays={checkedHolidays}
            />
          </Col>
          <DataSidePreview
            data={dataPreview}
            control={control}
            title={"店舗マスタ"}
            onCancel={onCancelHandler}
            isEdit={isEdit}
            deleteHandler={deleteStoreById}
            submitButtonTitle={id ? "更新する" : "登録する"}
          />
        </Row>
      </form>
    </Layout>
  );
}
