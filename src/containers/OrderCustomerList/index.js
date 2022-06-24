import React, { useEffect, useState } from "react";
import { sortableHandle } from "react-sortable-hoc";
import { useDispatch, useSelector } from "react-redux";

import { Col, Row, Select } from "antd";
import { MinusSquareOutlined, PlusSquareOutlined } from "@ant-design/icons";

import Layout from "containers/Layout";
import "containers/StoreMaster/style/index.less";
import DragAndDroppableTable from "components/DragAndDroppableTable";
import DragIcon from "components/Icons/DragIcon";
import FormHeader from "components/FormHeader";

import {
  fetchCustomerCustomItemOrder,
  fetchCustomItemOrder as fetchCustomFieldList,
  setLoading,
} from "actions/common";
import { reOrderCustomerCustomField } from "actions/customItemsAction";
import _ from "lodash";
import produce from "immer";
import FileTextIcon from "components/Icons/FileTextIcon";

const optionAvailable = [
  "名前",
  "名前（カナ）",
  "携帯番号",
  "メール",
  "郵便番号",
  "住所１",
  "住所２",
  "性別",
  "前回来店日",
  "写真",
  "来店回数",
  "ステータス",
  "お客様メモ",
  "DM配信",
];

const defaultDataTable = [
  { key: 1, name: "名前（カナ）", index: 1 },
  { key: 2, name: "携帯番号", index: 2 },
  { key: 3, name: "来店回数", index: 3 },
  { key: 4, name: "前回来店日", index: 4 },
  { key: 5, name: "ステータス", index: 5 },
];

export default function OrderCustomerList() {
  const customStyles = {
    cursor: "pointer",
  };
  const columns = [
    {
      dataIndex: "sort",
      width: 51,
      className: "drag-visible",
      render: function dragHandleMethod() {
        return <DragHandle />;
      },
    },
    {
      title: "項目名",
      dataIndex: "name",
      width: "70%",
      render: function allAttrSelect(_, row) {
        const filteredOptions = allOptions.filter((item) => {
          const itemName = item.name || item;
          return !selectedOptions.includes(itemName) || itemName === row.name;
        });

        return (
          <Select
            defaultValue={row.name}
            name="requiredType"
            onChange={(_, event) => changeOrder(row, event)}
            style={{ width: "50%" }}
          >
            {filteredOptions.map((option) => (
              <Select.Option
                value={option.name || option}
                key={option.id || option}
              >
                {option.name || option}
              </Select.Option>
            ))}
          </Select>
        );
      },
    },
    {
      title: "",
      dataIndex: "edit",
      width: 70,
      render: function renderAddIcon() {
        return dataSource.length >= 1 ? (
          <div onClick={addMoreCustomSelectBox} style={customStyles}>
            <PlusSquareOutlined
              style={{ fontSize: "24px", color: "#121958" }}
            />
          </div>
        ) : null;
      },
    },
    {
      title: "",
      dataIndex: "delete",
      width: 70,
      render: function renderDeleteIcon(_, record) {
        return dataSource.length > 1 ? (
          <div
            onClick={() => removeCustomSelectBox(record)}
            style={customStyles}
          >
            <MinusSquareOutlined
              style={{ fontSize: "24px", color: "#121958" }}
            />
          </div>
        ) : null;
      },
    },
  ];

  const dispatch = useDispatch();

  // useSelector
  const customerDisplayOrder = useSelector(
    (state) => state.layoutReducer.customerCustomOrder
  );
  const customFieldList = useSelector(
    (state) => state.layoutReducer.customOrder
  );
  const selectedStore = useSelector(
    (state) => state.layoutReducer.selectedStore
  );

  // useState
  const [dataSource, setDataSource] = useState([]);
  const [allOptions, setAllOptions] = useState(optionAvailable);
  const [selectedOptions, setSelectedOptions] = useState([]);
  useEffect(() => {
    if (!_.isEmpty(customerDisplayOrder)) {
      dispatch(setLoading(false));
      const formattedData = formatData(customerDisplayOrder);

      setDataSource(formattedData);
      const checkValAvailable = [];
      formattedData.forEach((item) => {
        checkValAvailable.push(item.name);
      });
      setSelectedOptions(checkValAvailable);
      const allAttrSelect = [];
      customFieldList.forEach((val) => {
        allAttrSelect.push({ id: val.id, name: val.name });
      });
      setAllOptions(optionAvailable.concat(allAttrSelect));
    }
  }, [customerDisplayOrder, customFieldList]);

  useEffect(() => {
    const storeID = selectedStore.id;
    dispatch(setLoading(true));
    dispatch(fetchCustomerCustomItemOrder({ storeID }));
    dispatch(fetchCustomFieldList({ storeID }));
  }, [selectedStore]);

  function formatData(data) {
    const dataToTable = [];
    const dataCustomFieldToTable = [];

    const valAndCountCol = data;
    if (valAndCountCol.nameOrder) {
      dataToTable.push({
        key: valAndCountCol.nameOrder,
        name: "名前",
        index: valAndCountCol.nameOrder,
      });
    }
    if (valAndCountCol.spellingOrder) {
      dataToTable.push({
        key: valAndCountCol.spellingOrder,
        name: "名前（カナ）",
        index: valAndCountCol.spellingOrder,
      });
    }
    if (valAndCountCol.phoneOrder) {
      dataToTable.push({
        key: valAndCountCol.phoneOrder,
        name: "携帯番号",
        index: valAndCountCol.phoneOrder,
      });
    }
    if (valAndCountCol.mailOrder) {
      dataToTable.push({
        key: valAndCountCol.mailOrder,
        name: "メール",
        index: valAndCountCol.mailOrder,
      });
    }
    if (valAndCountCol.postalOrder) {
      dataToTable.push({
        key: valAndCountCol.postalOrder,
        name: "郵便番号",
        index: valAndCountCol.postalOrder,
      });
    }
    if (valAndCountCol.address1Order) {
      dataToTable.push({
        key: valAndCountCol.address1Order,
        name: "住所１",
        index: valAndCountCol.address1Order,
      });
    }
    if (valAndCountCol.address2Order) {
      dataToTable.push({
        key: valAndCountCol.address2Order,
        name: "住所２",
        index: valAndCountCol.address2Order,
      });
    }
    if (valAndCountCol.genderOrder) {
      dataToTable.push({
        key: valAndCountCol.genderOrder,
        name: "性別",
        index: valAndCountCol.genderOrder,
      });
    }
    if (valAndCountCol.birthdayOrder) {
      dataToTable.push({
        key: valAndCountCol.birthdayOrder,
        name: "生年月日",
        index: valAndCountCol.birthdayOrder,
      });
    }
    if (valAndCountCol.avatarOrder) {
      dataToTable.push({
        key: valAndCountCol.avatarOrder,
        name: "写真",
        index: valAndCountCol.avatarOrder,
      });
    }
    if (valAndCountCol.visitBeforeOrder) {
      dataToTable.push({
        key: valAndCountCol.visitBeforeOrder,
        name: "来店回数",
        index: valAndCountCol.visitBeforeOrder,
      });
    }
    if (valAndCountCol.lastVisitOrder) {
      dataToTable.push({
        key: valAndCountCol.lastVisitOrder,
        name: "前回来店日",
        index: valAndCountCol.lastVisitOrder,
      });
    }
    if (valAndCountCol.statusOrder) {
      dataToTable.push({
        key: valAndCountCol.statusOrder,
        name: "ステータス",
        index: valAndCountCol.statusOrder,
      });
    }
    if (valAndCountCol.noteOrder) {
      dataToTable.push({
        key: valAndCountCol.noteOrder,
        name: "お客様メモ",
        index: valAndCountCol.noteOrder,
      });
    }
    if (valAndCountCol.allowGroupMessageOrder) {
      dataToTable.push({
        key: valAndCountCol.allowGroupMessageOrder,
        name: "DM配信",
        index: valAndCountCol.allowGroupMessageOrder,
      });
    }
    if (valAndCountCol.customFields.length > 0) {
      valAndCountCol.customFields.forEach((val) => {
        if (val.customerDisplayOrder) {
          dataCustomFieldToTable.push({
            key: val.id,
            name: val.name,
            index: val.customerDisplayOrder,
          });
        }
      });
    }
    let dataTable = dataToTable.concat(dataCustomFieldToTable);
    if (dataTable.length === 0) {
      dataTable = defaultDataTable;
    }
    dataTable.sort((a, b) => a.index - b.index);
    return dataTable;
  }
  const removeCustomSelectBox = (record) => {
    const deletedDataSource = produce(dataSource, (draft) => {
      draft.splice(record.index - 1, 1);
    });
    setDataSource(deletedDataSource);
    reOrder(deletedDataSource);
  };

  const addMoreCustomSelectBox = () => {
    const difference = allOptions.filter((x) => {
      const item = x.name || x;
      return !selectedOptions.includes(item);
    });

    if (difference === undefined || difference.length <= 0) {
      return;
    }
    const optionSelected = difference[0].name || difference[0];
    const addedDataSource = produce(dataSource, (draft) => {
      draft.push({
        key: difference[0].id || dataSource.length + 1,
        name: optionSelected,
        index: dataSource.length + 1,
      });
    });
    setDataSource(addedDataSource);
    reOrder(addedDataSource);
  };
  const changeOrder = (row, event) => {
    const updatedDataSource = produce(dataSource, (draft) => {
      draft[row.index - 1].name = event.value;
      draft[row.index - 1].key = parseInt(event.key);
    });

    setDataSource(updatedDataSource);
    reOrder(updatedDataSource);
  };
  const DragHandle = sortableHandle(() => (
    <DragIcon customStyles={{ cursor: "grab" }} />
  ));
  const handleDataSource = (newData) => {
    setDataSource(newData);
  };
  const reOrder = (data) => {
    const reOrderedData = {
      customFields: [],
      storeId: selectedStore.id,
    };
    data.forEach((row, index) => {
      switch (row.name) {
        case "名前": {
          reOrderedData.nameOrder = index + 1;
          break;
        }
        case "名前（カナ）": {
          reOrderedData.spellingOrder = index + 1;
          break;
        }
        case "携帯番号": {
          reOrderedData.phoneOrder = index + 1;
          break;
        }
        case "メール": {
          reOrderedData.mailOrder = index + 1;
          break;
        }
        case "郵便番号": {
          reOrderedData.postalOrder = index + 1;
          break;
        }
        case "住所１": {
          reOrderedData.address1Order = index + 1;
          break;
        }
        case "住所２": {
          reOrderedData.address2Order = index + 1;
          break;
        }
        case "性別": {
          reOrderedData.genderOrder = index + 1;
          break;
        }
        case "生年月日": {
          reOrderedData.birthdayOrder = index + 1;
          break;
        }
        case "写真": {
          reOrderedData.avatarOrder = index + 1;
          break;
        }
        case "来店回数": {
          reOrderedData.visitBeforeOrder = index + 1;
          break;
        }
        case "ステータス": {
          reOrderedData.statusOrder = index + 1;
          break;
        }
        case "前回来店日": {
          reOrderedData.lastVisitOrder = index + 1;
          break;
        }
        case "お客様メモ": {
          reOrderedData.noteOrder = index + 1;
          break;
        }
        case "DM配信": {
          reOrderedData.allowGroupMessageOrder = index + 1;
          break;
        }
        default: {
          reOrderedData.customFields.push({
            id: parseInt(row.key),
            displayOrder: index + 1,
          });
        }
      }
    });
    dispatch(setLoading(true));
    dispatch(reOrderCustomerCustomField(reOrderedData, selectedStore.id));
  };

  return (
    <Layout>
      <div className="list-container">
        <Row style={{ marginBottom: "6.17px" }}>
          <FormHeader
            title={"お客様情報一覧　表示項目設定"}
            icon={<FileTextIcon width="28" height="28" />}
          />
        </Row>
        <Row
          justify="space-between"
          align="middle"
          style={{ marginBottom: "20px" }}
        >
          <Col span={24}>
            <p style={{ margin: "0px 15px" }}>
              項目を追加するときは
              <span style={{ fontWeight: "bold" }}>「＋」</span>
              を押してください。
              <span style={{ fontWeight: "bold" }}>「−」</span>
              を押すと項目を削除できます。
            </p>
            <DragAndDroppableTable
              data={dataSource}
              columns={columns}
              handleDataSource={handleDataSource}
              reOrder={reOrder}
              emptyText={"該当するアカウント名はありません。"}
              hasAddBtn={false}
              hasSearchField={false}
            />
          </Col>
        </Row>
      </div>
    </Layout>
  );
}
