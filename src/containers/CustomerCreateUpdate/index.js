import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useHistory, useParams } from "react-router-dom";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
import { useForm } from "react-hook-form";
import { Row, Col, Modal } from "antd";

import FormHeader from "components/FormHeader";
import CustomerForm from "components/Form/CustomerForm";
import Layout from "containers/Layout";
import DataSidePreview from "components/DataSidePreview";
import FileTextIcon from "components/Icons/FileTextIcon";
import { injectError } from "utils/injectError";
import { fetchPostalCodeData } from "actions/store";
import { fetchCustomItemOrder, setError } from "actions/common";
import {
  fetchCustomerStatus,
  submitCustomerForm,
  setCustomerForm,
  fetchCustomerDetails,
  updateCustomerForm,
  deleteCustomer,
} from "actions/customers";

import _ from "lodash";
import { ExclamationCircleOutlined } from "@ant-design/icons";
import { useErrors } from "hooks";
import { SHOP_INFO_ERROR } from "constant";

dayjs.extend(utc);
dayjs.extend(timezone);

function CustomerCreateUpdate(props) {
  const history = useHistory();
  const methods = useForm({
    mode: "onSubmit",
  });
  const { manualErrors, addError, removeError } = useErrors();

  const { handleSubmit, control, errors: formErrors, setValue } = methods;

  const dispatch = useDispatch();
  const { id } = useParams();
  const { confirm } = Modal;

  const status = useSelector((state) => state.customerCreateReducer.status);
  const created = useSelector((state) => state.customerCreateReducer.created);

  const customerDisplayOrder = useSelector(
    (state) => state.layoutReducer.customOrder
  );

  const selectedStore = useSelector(
    (state) => state.layoutReducer.selectedStore
  );

  const postalCodeData = useSelector(
    (state) => state.storeMasterCreateUpdateReducer.postalCodeData
  );

  const customerDetails = useSelector(
    (state) => state.customerReducer.customerDetails
  );

  const onZipCodeChange = (code) => {
    if (code.length > 3) {
      dispatch(fetchPostalCodeData(code));
    }
  };

  const handleZipCodeSelection = (key) => {
    const item = _.find(postalCodeData, (i) => i.id === key);
    setValue("address1", `${item.prefecture} ${item.city} ${item.town}`);
  };

  useEffect(() => {
    if (selectedStore.id && selectedStore.companyCode) {
      dispatch(fetchCustomerStatus());
      dispatch(fetchCustomItemOrder({ storeID: selectedStore.id }));
    }
  }, [selectedStore]);

  useEffect(() => {
    if (created) {
      dispatch(setCustomerForm(false));
      history.push("/customer/list");
    }
  }, [created]);

  // execute start of render
  useEffect(() => {
    if (id) {
      dispatch(fetchCustomerDetails({ id }));
    }
  }, []);

  useEffect(() => {
    if (id && customerDetails.id) {
      setValue("firstName", customerDetails.firstname);
      setValue("lastName", customerDetails.lastname);
      setValue("firstNameKana", customerDetails.spellingFirstname);
      setValue("lastNameKana", customerDetails.spellingLastname);
      setValue("avatar", customerDetails.avatar);

      setValue("phoneNumber", customerDetails.phonenumber);
      setValue("email", customerDetails.email);
      setValue("sex", customerDetails.gender?.toString());

      setValue("postalCode", customerDetails.postalCode);
      setValue("address1", customerDetails.address);
      setValue("address2", customerDetails.address2);

      setValue("visit", customerDetails.visitBefore);
      setValue("note", customerDetails.note);

      setValue("dm", customerDetails.isAllowGroupMessage);
      const date = dayjs(customerDetails.birthday, "YYYY-MM-DD");

      setValue("year", date.isValid() ? date.year() : "");

      setValue("month", date.isValid() ? date.month() + 1 : "");
      setValue("day", date.isValid() ? date.date() : "");
      setTimeout(() => {
        _.forEach(customerDetails.customFields, (customItem) => {
          const c = _.find(customerDisplayOrder, function (o) {
            return o.id === customItem.customFieldId;
          });

          if (c?.type.id === 1 || c?.type.id === 6) {
            setValue(`custom-${c.name}`, customItem.textContent);
          }
          if (c?.type.id === 2) {
            setValue(`custom-${c.name}`, customItem.numberContent);
          }
          if (c?.type.id === 3) {
            setValue(
              `custom-${c.name}`,
              customItem.options.length ? customItem.options[0].id : ""
            );
          }
          if (c?.type.id === 4) {
            setValue(
              `custom-${c.name}`,
              customItem.options.length ? customItem.options : []
            );
          }
          if (c?.type.id === 5) {
            setValue(
              `custom-${c.name}`,
              dayjs(customItem.dateContent).isValid()
                ? dayjs(customItem.dateContent)
                : ""
            );
          }
        });
      }, 1500);
    }
  }, [customerDetails, customerDisplayOrder]);

  useEffect(() => {
    if (status.length && customerDetails.id) {
      const selected = _.find(status, (s) => s.id === customerDetails.status);
      if (selected?.id) {
        setValue("status", customerDetails.status);
      }
    }
  }, [customerDetails, status, setValue]);

  const onSubmit = (data) => {
    removeError("avatar");
    removeError("year");
    if (selectedStore.id < 1) {
      dispatch(setError(SHOP_INFO_ERROR));
    } else if (data?.avatar?.size > 5242880) {
      addError("avatar", { message: "5MB以下の画像をご指定下さい。" });
    } else if (
      !!(data.year || data.month || data.day) &&
      !dayjs(`${data.year}/${data.month}/${data.day}`, "YYYY/M/D").isValid()
    ) {
      dispatch(setError("無効な日付形式"));
    } else if (
      !!(data.year || data.month || data.day) &&
      dayjs(`${data.year}/${data.month}/${data.day}`, "YYYY/M/D") > dayjs()
    ) {
      dispatch(setError("誕生日は現在時刻より前でなければなりません"));
    } else {
      const formData = new FormData();

      formData.append(
        "spellingFirstname",
        data.firstNameKana ? data.firstNameKana : ""
      );
      formData.append(
        "spellingLastname",
        data.lastNameKana ? data.lastNameKana : ""
      );

      formData.append("firstname", data.firstName ? data.firstName : "");

      formData.append("lastname", data.lastName ? data.lastName : "");

      if (data.email) {
        formData.append("email", data.email);
      }
      if (data.phoneNumber) {
        formData.append("phonenumber", data.phoneNumber);
      }
      if (data.sex) {
        formData.append("gender", data.sex);
      }

      if (data?.postalCode) {
        formData.append("postalCode", data?.postalCode?.split("-")[0]);
      }
      if (data.address1) {
        formData.append("address", data.address1);
      }
      if (data.address2) {
        formData.append("address2", data.address2);
      }
      if (data.visit) {
        formData.append("visitBefore", data.visit ? data.visit : 0);
      }
      if (data.note) {
        formData.append("note", data.note);
      }

      if (data.status) {
        formData.append("customerStatus", data.status);
      }
      formData.append("isAllowGroupMessage", !!data.dm);

      if (typeof data.avatar !== "string" && data.avatar) {
        if (id) {
          formData.append("hasNewAvatar", true);
        } else {
          formData.append("hasNewAvatar", false);
        }
        formData.append("avatar", data.avatar);
      }
      if (id && customerDetails?.avatar && !data.avatar) {
        formData.append("hasNewAvatar", true);
      }
      if (
        dayjs(`${data.year}/${data.month}/${data.day}`, "YYYY/M/D").isValid()
      ) {
        formData.append(
          "birthday",
          dayjs(`${data.year}/${data.month}/${data.day}`, "YYYY/M/D")
            .toDate()
            .toString()
        );
      }

      formData.append("storeId", selectedStore.id);
      if (id) {
        formData.append("id", id);

        const customFieldsData = [];

        _.forEach(customerDisplayOrder, (customItem) => {
          if (_.has(data, `custom-${customItem.name}`)) {
            const c = _.find(
              customerDetails.customFields,
              (o) => o.customFieldId === customItem.id
            );

            const temp = {
              customFieldId: customItem.id,
            };
            if (c) {
              temp.id = c.id;
            }
            if (customItem.type.id === 1 || customItem.type.id === 6) {
              temp.textContent = data[`custom-${customItem.name}`];
            }
            if (customItem.type.id === 2) {
              temp.numberContent = data[`custom-${customItem.name}`];
            }
            if (customItem.type.id === 3) {
              // temp.options = [data[`custom-${customItem.name}`]];
              temp.options = data[`custom-${customItem.name}`]
                ? [data[`custom-${customItem.name}`]]
                : [];
            }
            if (customItem.type.id === 4) {
              temp.options = [
                ...data[`custom-${customItem.name}`].map((d) => d.id),
              ];
            }
            if (customItem.type.id === 5) {
              temp.dateContent = dayjs(
                data[`custom-${customItem.name}`]
              ).isValid()
                ? dayjs(data[`custom-${customItem.name}`]).toISOString()
                : "";
            }
            customFieldsData.push(temp);
          }
        });

        dispatch(
          updateCustomerForm({
            customerData: formData,
            customFieldsData,
            customerId: id,
          })
        );
      } else {
        const customFieldsData = [];
        _.forEach(customerDisplayOrder, (customItem) => {
          if (_.has(data, `custom-${customItem.name}`)) {
            const temp = {
              customFieldId: customItem.id,
            };
            if (customItem.type.id === 1 || customItem.type.id === 6) {
              temp.textContent = data[`custom-${customItem.name}`];
            }
            if (customItem.type.id === 2) {
              temp.numberContent = data[`custom-${customItem.name}`];
            }
            if (customItem.type.id === 3) {
              // temp.options = [data[`custom-${customItem.name}`]];
              temp.options = data[`custom-${customItem.name}`]
                ? [data[`custom-${customItem.name}`]]
                : [];
            }
            if (customItem.type.id === 4) {
              temp.options = [
                ...data[`custom-${customItem.name}`].map((d) => d.id),
              ];
            }
            if (customItem.type.id === 5) {
              temp.dateContent = dayjs(
                data[`custom-${customItem.name}`]
              ).isValid()
                ? dayjs(data[`custom-${customItem.name}`]).toISOString()
                : "";
            }
            customFieldsData.push(temp);
          }
        });
        dispatch(
          submitCustomerForm({ customerData: formData, customFieldsData })
        );
      }
    }
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
          window.location.href = "/customer/list";
        },
        onCancel() {
          console.log("Cancel");
        },
      });
    }
  };

  const deleteCustomerHandler = () => {
    if (id) {
      confirm({
        icon: <ExclamationCircleOutlined />,
        title: "確認",
        content:
          "削除したデータはもとに戻せません。 お客様情報を削除してもよろしいですか？ ※予約履歴も削除されます。",
        okText: "はい",
        okType: "danger",
        cancelText: "いいえ",
        centered: true,
        onOk() {
          dispatch(
            deleteCustomer({
              storeID: selectedStore.id,
              id,
            })
          );
          window.location.href = "/customer/list";
        },
        onCancel() {
          console.log("Cancel");
        },
      });
    }
  };

  const dataPreview = [
    {
      heading: "基本情報",
      items: [
        {
          label: "名前",
          value: (watcher) => {
            const v = `${watcher.firstName ? watcher.firstName : ""} ${
              watcher.lastName ? watcher.lastName : ""
            }`;
            return v || "";
          },
        },
        {
          label: "名前（カナ）",
          value: (watcher) => {
            const v = `${watcher.firstNameKana ? watcher.firstNameKana : ""} ${
              watcher.lastNameKana ? watcher.lastNameKana : ""
            }`;
            return v || "";
          },
        },
        {
          label: "携帯番号",
          value: (watcher) => {
            const v = `${watcher.phoneNumber ? watcher.phoneNumber : ""}`;
            return v || "";
          },
        },
        {
          label: "DM配信",
          value: (watcher) => {
            if (watcher.dm === true) {
              return "可能";
            } else if (watcher.dm === false) {
              return "不可";
            } else {
              return "";
            }
          },
        },
      ],
    },
    {
      heading: "連絡先情報",
      items: [
        {
          label: "メール",
          value: (watcher) => {
            const v = `${watcher.email ? watcher.email : ""} `;
            return v || "";
          },
        },
        {
          label: "郵便番号",
          value: (watcher) => {
            const v = `${watcher.postalCode ? watcher.postalCode : ""} `;
            return v || "";
          },
        },
        {
          label: "住所 1",
          value: (watcher) => {
            const v = `${watcher.address1 ? watcher.address1 : ""} `;
            return v || "";
          },
        },
        {
          label: "住所 2",
          value: (watcher) => {
            const v = `${watcher.address2 ? watcher.address2 : ""} `;
            return v || "";
          },
        },
      ],
    },
    {
      heading: "パーソナル情報",
      items: [
        {
          label: "性別",
          value: (watcher) => {
            if (watcher.sex?.toString() === "1") {
              return "男性";
            } else if (watcher.sex?.toString() === "0") {
              return "女性";
            } else if (watcher.sex?.toString() === "2") {
              return "その他";
            } else {
              return "";
            }
          },
        },
        {
          label: "生年月日",
          value: (watcher) => {
            const v = dayjs(
              `${watcher.year}/${watcher.month}/${watcher.day}`,
              "YYYY/M/D"
            );
            return v.isValid() ? v.format("YYYY年 MM月 DD日") : "";
          },
        },
        {
          label: "写真",
          value: (watcher) => {
            return watcher.avatar ? "設定済み" : "未設定";
          },
        },
      ],
    },
    {
      heading: "ご来店情報",
      items: [
        {
          label: "UMaT利用前の 来店回数",
          value: (watcher) => {
            const v = `${watcher.visit ? watcher.visit + "回" : ""}`;
            return v || "";
          },
        },
        {
          label: "ステータス",
          value: (watcher) => {
            const v = _.find(status, (s) => s.id === watcher.status);
            return v?.statusName || "";
          },
        },
        {
          label: "お客様メモ",
          value: (watcher) => {
            const v = `${watcher.note ? watcher.note : ""}`;
            return v || "";
          },
        },
      ],
    },
  ];

  const customFields = [];
  _.forEach(customerDisplayOrder, (c) => {
    if (c.displayOnCustomer) {
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
              v += (_.find(c.option, (o) => x.id === o.id)?.name || "") + " ";
            });
            return v;
          }
          if (c.type.id === 5) {
            const v = watcher[`custom-${c.name}`];
            return v ? v.format("YYYY年 MM月 DD日") : "";
          }
          return watcher[`custom-${c.name}`];
        },
      });
    }
  });

  if (customFields.length) {
    dataPreview.push({
      heading: "カスタム項目",
      items: customFields,
    });
  }
  // useEffect(() => {
  //   if (formErrors) {
  //     console.log(formErrors);
  //   }
  // });

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
        onSubmit={handleSubmit(onSubmit, showErrorMsg)}
        // onError={showErrorMsg}
      >
        <FormHeader
          title={
            history.location.pathname.includes("/customer/create")
              ? "お客様情報の新規登録"
              : "お客様情報の編集"
          }
          icon={<FileTextIcon width="28" height="28" />}
        />
        <Row wrap={false}>
          <Col flex="auto">
            <CustomerForm
              control={control}
              errors={injectError(manualErrors, formErrors)}
              postalCodeData={postalCodeData}
              onZipCodeChange={onZipCodeChange}
              handleZipCodeSelection={handleZipCodeSelection}
              status={status}
              customOrder={customerDisplayOrder}
            />
          </Col>
          <DataSidePreview
            isEdit={!!id}
            onCancel={onCancelHandler}
            deleteHandler={deleteCustomerHandler}
            data={dataPreview}
            control={control}
            title={"お客様情報"}
          />
        </Row>
      </form>
    </Layout>
  );
}

export default CustomerCreateUpdate;
