import React, { useState, useEffect, useRef } from "react";
import PropTypes from "prop-types";
import { Modal, Row, Col, Button, Typography, Select as AntSelect } from "antd";
import { useForm } from "react-hook-form";
import _ from "lodash";
import {
  NumberInput,
  Input,
  Select,
  List,
  DatePicker,
  TextArea,
} from "components/FormControllers";
import { MinusSquareOutlined, PlusSquareOutlined } from "@ant-design/icons";
import { useMediaQuery } from "react-responsive";

const optionAvailable = [
  {
    label: "名前カナ（セイ）",
    value: 0,
    key: 0,
  },
  {
    label: "名前カナ（メイ）",
    value: 1,
    key: 1,
  },
  {
    label: "携帯番号",
    value: 2,
    key: 2,
  },
  {
    label: "メール",
    value: 3,
    key: 3,
  },
  {
    label: "性別",
    value: 4,
    key: 4,
  },
  {
    label: "住所１",
    value: 5,
    key: 5,
  },
  {
    label: "住所２",
    value: 6,
    key: 6,
  },
  {
    label: "来店回数",
    value: 7,
    key: 7,
  },
  {
    label: "前回来店日",
    value: 8,
    key: 8,
  },
  {
    label: "お客様メモ",
    value: 9,
    key: 9,
  },
  {
    label: "ステータス",
    value: 10,
    key: 10,
  },
  {
    label: "No Show回数",
    value: 11,
    key: 11,
  },
  {
    label: "DM配信",
    value: 12,
    key: 12,
  },
];

const defaultOptions = [
  {
    label: "名前カナ（セイ）",
    value: 0,
    key: 0,
  },
  {
    label: "名前カナ（メイ）",
    value: 1,
    key: 1,
  },
  {
    label: "携帯番号",
    value: 2,
    key: 2,
  },
];

const customStyles = {
  cursor: "pointer",
};

function SearchRow({
  isPhone,
  input,
  selectValue,
  selectedIndex,
  allOptions,
  selectedOptions,
  item,
  optionChanged,
  optionAdd,
  optionRemove,
}) {
  let availableOptions = [];

  if (item) {
    availableOptions = [item];
  }

  availableOptions = [
    ...availableOptions,
    ..._.filter(allOptions, (option) => {
      if (_.find(selectedOptions, (s) => s.value === option.value)) {
        return false;
      }
      return true;
    }),
  ];
  return (
    <Row style={{ marginTop: 10 }}>
      <Col span={isPhone ? 20 : 6}>
        <AntSelect
          options={availableOptions.map((a) => ({
            value: a.value,
            label: a.label,
          }))}
          virtual={false}
          defaultValue={selectValue}
          placeholder={"検索条件"}
          onChange={(v) => {
            optionChanged(selectedIndex, v);
          }}
          style={{ width: "100%" }}
        />
      </Col>
      <Col
        span={4}
        style={{
          display: isPhone ? "flex" : "none",
          justifyContent: "center",
          alignItems: "center",
          marginTop: 10,
        }}
      >
        <span
          onClick={() => {
            if (allOptions?.length - selectedOptions?.length) {
              optionAdd();
            }
          }}
          style={customStyles}
        >
          <PlusSquareOutlined style={{ fontSize: "24px", color: "#121958" }} />
        </span>
      </Col>
      <Col span={isPhone ? 20 : 14} style={{ marginTop: isPhone ? 10 : 0 }}>
        {input}
      </Col>
      <Col
        span={4}
        style={{
          display: isPhone ? "flex" : "none",
          justifyContent: "center",
          alignItems: "center",
          marginTop: 10,
        }}
      >
        {selectedOptions.length > 1 ? (
          <span
            onClick={() => optionRemove(selectedIndex)}
            style={customStyles}
          >
            <MinusSquareOutlined
              style={{ fontSize: "24px", color: "#121958" }}
            />
          </span>
        ) : null}
      </Col>
      <Col span={4} style={{ display: isPhone ? "none" : "block" }}>
        <Row
          justify="center"
          align="center"
          style={{ height: "100%", alignItems: "center" }}
        >
          <span
            onClick={() => {
              if (allOptions?.length - selectedOptions?.length) {
                optionAdd();
              }
            }}
            style={customStyles}
          >
            <PlusSquareOutlined
              style={{ fontSize: "24px", color: "#121958" }}
            />
          </span>
          {selectedOptions.length > 1 ? (
            <span
              onClick={() => optionRemove(selectedIndex)}
              style={customStyles}
            >
              <MinusSquareOutlined
                style={{ marginLeft: 10, fontSize: "24px", color: "#121958" }}
              />
            </span>
          ) : null}
        </Row>
      </Col>
    </Row>
  );
}

function renderField(
  item,
  itemIndex,
  control,
  allOptions,
  selectedOptions,
  optionChanged,
  optionAdd,
  optionRemove,
  status,
  isPhone
) {
  switch (item.key) {
    case 0: {
      return (
        <SearchRow
          isPhone={isPhone}
          input={
            <Input
              control={control}
              inputName={"spellingLastname"}
              inputProps={{
                placeholder: "名前カナ（セイ）で検索します",
                style: {
                  width: isPhone ? "100%" : "80%",
                  marginLeft: isPhone ? 0 : "10%",
                  maxWidth: "none",
                },
              }}
            />
          }
          selectValue={0}
          key={`value-${itemIndex}-0`}
          selectedIndex={itemIndex}
          allOptions={allOptions}
          selectedOptions={selectedOptions}
          item={item}
          optionChanged={optionChanged}
          optionAdd={optionAdd}
          optionRemove={optionRemove}
        />
      );
    }
    case 1: {
      return (
        <SearchRow
          isPhone={isPhone}
          input={
            <Input
              control={control}
              inputName={"spellingFirstname"}
              inputProps={{
                placeholder: "名前カナ（メイ）で検索します",
                style: {
                  width: isPhone ? "100%" : "80%",
                  marginLeft: isPhone ? 0 : "10%",
                  maxWidth: "none",
                },
              }}
            />
          }
          key={`value-${itemIndex}-1`}
          selectValue={1}
          selectedIndex={itemIndex}
          allOptions={allOptions}
          selectedOptions={selectedOptions}
          item={item}
          optionChanged={optionChanged}
          optionAdd={optionAdd}
          optionRemove={optionRemove}
        />
      );
    }
    case 2: {
      return (
        <SearchRow
          isPhone={isPhone}
          input={
            <Input
              control={control}
              inputName={"phonenumber"}
              inputProps={{
                placeholder: "携帯番号で検索します",
                style: {
                  width: isPhone ? "100%" : "80%",
                  marginLeft: isPhone ? 0 : "10%",
                  maxWidth: "none",
                },
              }}
            />
          }
          key={`value-${itemIndex}-2`}
          selectValue={2}
          selectedIndex={itemIndex}
          allOptions={allOptions}
          selectedOptions={selectedOptions}
          item={item}
          optionChanged={optionChanged}
          optionAdd={optionAdd}
          optionRemove={optionRemove}
        />
      );
    }
    case 3: {
      return (
        <SearchRow
          isPhone={isPhone}
          input={
            <Input
              control={control}
              inputName={"email"}
              inputProps={{
                placeholder: "メールアドレスで検索します",
                style: {
                  width: isPhone ? "100%" : "80%",
                  marginLeft: isPhone ? 0 : "10%",
                  maxWidth: "none",
                },
              }}
            />
          }
          key={`value-${itemIndex}-3`}
          selectValue={3}
          selectedIndex={itemIndex}
          allOptions={allOptions}
          selectedOptions={selectedOptions}
          item={item}
          optionChanged={optionChanged}
          optionAdd={optionAdd}
          optionRemove={optionRemove}
        />
      );
    }
    case 4: {
      return (
        <SearchRow
          isPhone={isPhone}
          input={
            <Select
              control={control}
              inputName={"gender"}
              placeholder={"性別を選択してください"}
              Options={[
                {
                  key: "",
                  label: "性別を選択してください",
                },
                {
                  key: 0,
                  label: "女性",
                },
                {
                  key: 1,
                  label: "男性",
                },
                {
                  key: 2,
                  label: "その他",
                },
              ]}
              inputProps={{
                style: {
                  width: isPhone ? "100%" : "80%",
                  marginLeft: isPhone ? 0 : "10%",
                  maxWidth: "none",
                },
              }}
            />
          }
          key={`value-${itemIndex}-4`}
          selectValue={4}
          selectedIndex={itemIndex}
          allOptions={allOptions}
          selectedOptions={selectedOptions}
          item={item}
          optionChanged={optionChanged}
          optionAdd={optionAdd}
          optionRemove={optionRemove}
        />
      );
    }
    case 5: {
      return (
        <SearchRow
          isPhone={isPhone}
          input={
            <Input
              control={control}
              inputName={"address1"}
              inputProps={{
                placeholder: "住所で検索します",
                style: {
                  width: isPhone ? "100%" : "80%",
                  marginLeft: isPhone ? 0 : "10%",
                  maxWidth: "none",
                },
              }}
            />
          }
          key={`value-${itemIndex}-5`}
          selectValue={5}
          selectedIndex={itemIndex}
          allOptions={allOptions}
          selectedOptions={selectedOptions}
          item={item}
          optionChanged={optionChanged}
          optionAdd={optionAdd}
          optionRemove={optionRemove}
        />
      );
    }
    case 6: {
      return (
        <SearchRow
          isPhone={isPhone}
          input={
            <Input
              control={control}
              inputName={"address2"}
              inputProps={{
                placeholder: "住所で検索します",
                style: {
                  width: isPhone ? "100%" : "80%",
                  marginLeft: isPhone ? 0 : "10%",
                  maxWidth: "none",
                },
              }}
            />
          }
          key={`value-${itemIndex}-6`}
          selectValue={7}
          selectedIndex={itemIndex}
          allOptions={allOptions}
          selectedOptions={selectedOptions}
          item={item}
          optionChanged={optionChanged}
          optionAdd={optionAdd}
          optionRemove={optionRemove}
        />
      );
    }
    case 7: {
      return (
        <SearchRow
          isPhone={isPhone}
          input={
            <Row
              style={{
                marginLeft: isPhone ? 0 : "10%",
                width: isPhone ? "100%" : "80%",
                justifyContent: "space-between",
                alignItems: "center",
                flexWrap: "nowrap",
              }}
            >
              <div>
                <NumberInput
                  control={control}
                  inputName={"minNumberOfVisit"}
                  int
                  showNumpad={false}
                  inputNumberProps={{
                    placeholder: "半角数字で入力",
                    style: {
                      width: "calc(100% - 15px)",
                      maxWidth: "none",
                      padding: "4px 10px",
                    },
                  }}
                />
              </div>
              <span style={{ margin: "0 10px" }}>～</span>
              <div>
                <NumberInput
                  control={control}
                  int
                  showNumpad={false}
                  inputName={"maxNumberOfVisit"}
                  inputNumberProps={{
                    placeholder: "半角数字で入力",
                    style: {
                      marginLeft: 15,
                      width: "calc(100% - 15px)",
                      maxWidth: "none",
                      padding: "4px 10px",
                    },
                  }}
                />
              </div>
            </Row>
          }
          key={`value-${itemIndex}-7`}
          selectValue={7}
          selectedIndex={itemIndex}
          allOptions={allOptions}
          selectedOptions={selectedOptions}
          item={item}
          optionChanged={optionChanged}
          optionAdd={optionAdd}
          optionRemove={optionRemove}
        />
      );
    }
    case 8: {
      return (
        <SearchRow
          isPhone={isPhone}
          input={
            <>
              <Row
                style={{
                  marginLeft: isPhone ? 0 : "10%",
                  width: isPhone ? "100%" : "80%",
                  justifyContent: "space-between",
                  alignItems: "center",
                  flexWrap: "nowrap",
                }}
              >
                <DatePicker
                  control={control}
                  inputName={"lastVisitStartDate"}
                  inputProps={{
                    placeholder: "",
                    style: {
                      width: "calc(70% - 16px)",
                      maxWidth: "none",
                    },
                  }}
                />
                <span style={{ margin: "0 10px" }}>から</span>
              </Row>
              <Row
                style={{
                  marginLeft: isPhone ? 0 : "10%",
                  width: isPhone ? "100%" : "80%",
                  marginTop: 10,
                  justifyContent: "space-between",
                  alignItems: "center",
                  flexWrap: "nowrap",
                }}
              >
                <DatePicker
                  control={control}
                  inputName={"lastVisitEndDate"}
                  inputProps={{
                    placeholder: "",
                    style: {
                      width: "calc(70% - 16px)",
                      maxWidth: "none",
                    },
                  }}
                />
                <span style={{ margin: "0 10px" }}>までの間</span>
              </Row>
            </>
          }
          key={`value-${itemIndex}-8`}
          selectValue={8}
          selectedIndex={itemIndex}
          allOptions={allOptions}
          selectedOptions={selectedOptions}
          item={item}
          optionChanged={optionChanged}
          optionAdd={optionAdd}
          optionRemove={optionRemove}
        />
      );
    }
    case 9: {
      return (
        <SearchRow
          isPhone={isPhone}
          input={
            <Input
              control={control}
              inputName={"note"}
              inputProps={{
                placeholder: "キーワードを入力してください",
                style: {
                  width: isPhone ? "100%" : "80%",
                  marginLeft: isPhone ? 0 : "10%",
                  maxWidth: "none",
                },
              }}
            />
          }
          key={`value-${itemIndex}-9`}
          selectValue={9}
          selectedIndex={itemIndex}
          allOptions={allOptions}
          selectedOptions={selectedOptions}
          item={item}
          optionChanged={optionChanged}
          optionAdd={optionAdd}
          optionRemove={optionRemove}
        />
      );
    }
    case 10: {
      return (
        <SearchRow
          isPhone={isPhone}
          input={
            <Select
              control={control}
              inputName={"status"}
              placeholder={"ステータスを選択してください"}
              Options={[
                {
                  key: "",
                  label: "ステータスを選択してください",
                },
                ...status.map((s) => ({
                  key: s.id,
                  label: s.statusName,
                })),
              ]}
              inputProps={{
                style: {
                  width: isPhone ? "100%" : "80%",
                  marginLeft: isPhone ? 0 : "10%",
                  maxWidth: "none",
                },
              }}
            />
          }
          key={`value-${itemIndex}-10`}
          selectValue={10}
          selectedIndex={itemIndex}
          allOptions={allOptions}
          selectedOptions={selectedOptions}
          item={item}
          optionChanged={optionChanged}
          optionAdd={optionAdd}
          optionRemove={optionRemove}
        />
      );
    }
    case 11: {
      return (
        <SearchRow
          isPhone={isPhone}
          input={
            <Row
              style={{
                marginLeft: isPhone ? 0 : "10%",
                width: isPhone ? "100%" : "80%",
                justifyContent: "space-between",
                alignItems: "center",
                flexWrap: "nowrap",
              }}
            >
              <div>
                <NumberInput
                  control={control}
                  int
                  showNumpad={false}
                  inputName={"minNumberOfNoShow"}
                  inputNumberProps={{
                    placeholder: "半角数字で入力",
                    style: {
                      width: "calc(100% - 15px)",
                      maxWidth: "none",
                      padding: "4px 10px",
                    },
                  }}
                />
              </div>
              <span style={{ margin: "0 10px" }}>～</span>
              <div>
                <NumberInput
                  control={control}
                  int
                  showNumpad={false}
                  inputName={"maxNumberOfNoShow"}
                  inputNumberProps={{
                    placeholder: "半角数字で入力",
                    style: {
                      marginLeft: 15,
                      width: "calc(100% - 15px)",
                      maxWidth: "none",
                      padding: "4px 10px",
                    },
                  }}
                />
              </div>
            </Row>
          }
          key={`value-${itemIndex}-11`}
          selectValue={11}
          selectedIndex={itemIndex}
          allOptions={allOptions}
          selectedOptions={selectedOptions}
          item={item}
          optionChanged={optionChanged}
          optionAdd={optionAdd}
          optionRemove={optionRemove}
        />
      );
    }
    case 12: {
      return (
        <SearchRow
          isPhone={isPhone}
          input={
            <Select
              control={control}
              inputName={"allowGroupMessage"}
              placeholder={"選択してください"}
              Options={[
                {
                  key: "",
                  label: "選択してください",
                },
                {
                  key: false,
                  label: "不可",
                },
                {
                  key: true,
                  label: "可能",
                },
              ]}
              inputProps={{
                style: {
                  width: isPhone ? "100%" : "80%",
                  marginLeft: isPhone ? 0 : "10%",
                  maxWidth: "none",
                },
              }}
            />
          }
          key={`value-${itemIndex}-12`}
          selectValue={12}
          selectedIndex={itemIndex}
          allOptions={allOptions}
          selectedOptions={selectedOptions}
          item={item}
          optionChanged={optionChanged}
          optionAdd={optionAdd}
          optionRemove={optionRemove}
        />
      );
    }
    case -1: {
      switch (item.customField.type.id) {
        case 1: {
          return (
            <SearchRow
              isPhone={isPhone}
              input={
                <Input
                  control={control}
                  inputName={`customItems.${item.customField.id.toString()}-${
                    item.customField.type.id
                  }`}
                  inputProps={{
                    placeholder: "キーワードを入力してください",
                    style: {
                      width: isPhone ? "100%" : "80%",
                      marginLeft: isPhone ? 0 : "10%",
                      maxWidth: "none",
                    },
                  }}
                />
              }
              key={`value-${itemIndex}-custom-${item.customField.id}`}
              selectValue={`custom-${item.customField.id}`}
              selectedIndex={itemIndex}
              allOptions={allOptions}
              selectedOptions={selectedOptions}
              item={item}
              optionChanged={optionChanged}
              optionAdd={optionAdd}
              optionRemove={optionRemove}
            />
          );
        }
        case 2: {
          return (
            <SearchRow
              isPhone={isPhone}
              input={
                <Row
                  style={{
                    marginLeft: isPhone ? 0 : "10%",
                    width: isPhone ? "100%" : "80%",
                    justifyContent: "space-between",
                    alignItems: "center",
                    flexWrap: "nowrap",
                  }}
                >
                  <div>
                    <NumberInput
                      control={control}
                      int
                      showNumpad={false}
                      inputName={`customItems.${item.customField.id.toString()}-${
                        item.customField.type.id
                      }.min`}
                      inputNumberProps={{
                        placeholder: "半角数字で入力",
                        style: {
                          width: "calc(100% - 15px)",
                          maxWidth: "none",
                          padding: "4px 10px",
                        },
                      }}
                    />
                  </div>
                  <span style={{ margin: "0 10px" }}>～</span>
                  <div>
                    <NumberInput
                      control={control}
                      int
                      showNumpad={false}
                      inputName={`customItems.${item.customField.id.toString()}-${
                        item.customField.type.id
                      }.max`}
                      inputNumberProps={{
                        placeholder: "半角数字で入力",
                        style: {
                          marginLeft: 15,
                          width: "calc(100% - 15px)",
                          maxWidth: "none",
                          padding: "4px 10px",
                        },
                      }}
                    />
                  </div>
                </Row>
              }
              key={`value-${itemIndex}-custom-${item.customField.id}`}
              selectValue={`custom-${item.customField.id}`}
              selectedIndex={itemIndex}
              allOptions={allOptions}
              selectedOptions={selectedOptions}
              item={item}
              optionChanged={optionChanged}
              optionAdd={optionAdd}
              optionRemove={optionRemove}
            />
          );
        }

        case 3: {
          return (
            <SearchRow
              isPhone={isPhone}
              input={
                <Select
                  control={control}
                  inputName={`customItems.${item.customField.id.toString()}-${
                    item.customField.type.id
                  }`}
                  placeholder={"選択してください"}
                  Options={[
                    {
                      key: "選択してください",
                      value: "",
                      label: "選択してください",
                    },
                    ...item.customField.option.map((m) => ({
                      key: `${m.id}##${m.name}`,
                      label: m.name,
                    })),
                  ]}
                  inputProps={{
                    style: {
                      width: isPhone ? "100%" : "80%",
                      marginLeft: isPhone ? 0 : "10%",
                      maxWidth: "none",
                    },
                  }}
                />
              }
              key={`value-${itemIndex}-custom-${item.customField.id}`}
              selectValue={`custom-${item.customField.id}`}
              selectedIndex={itemIndex}
              allOptions={allOptions}
              selectedOptions={selectedOptions}
              item={item}
              optionChanged={optionChanged}
              optionAdd={optionAdd}
              optionRemove={optionRemove}
            />
          );
        }
        case 4: {
          return (
            <SearchRow
              isPhone={isPhone}
              input={
                <List
                  control={control}
                  inputName={`customItems.${item.customField.id.toString()}-${
                    item.customField.type.id
                  }`}
                  placeholder={"選択してください"}
                  options={item.customField.option}
                  className={"search-list-form"}
                  style={{
                    width: isPhone ? "100%" : "80%",
                    marginLeft: isPhone ? 0 : "10%",
                    maxWidth: "none",
                  }}
                  hasAllSelect={false}
                />
              }
              key={`value-${itemIndex}-custom-${item.customField.id}`}
              selectValue={`custom-${item.customField.id}`}
              selectedIndex={itemIndex}
              allOptions={allOptions}
              selectedOptions={selectedOptions}
              item={item}
              optionChanged={optionChanged}
              optionAdd={optionAdd}
              optionRemove={optionRemove}
            />
          );
        }
        case 5: {
          return (
            <SearchRow
              isPhone={isPhone}
              input={
                <>
                  <Row
                    style={{
                      marginLeft: isPhone ? 0 : "10%",
                      width: isPhone ? "100%" : "80%",
                      justifyContent: "space-between",
                      alignItems: "center",
                      flexWrap: "nowrap",
                    }}
                  >
                    <DatePicker
                      control={control}
                      inputName={`customItems.${item.customField.id.toString()}-${
                        item.customField.type.id
                      }.form`}
                      inputProps={{
                        placeholder: "",
                        style: {
                          width: "calc(70% - 16px)",
                          maxWidth: "none",
                        },
                      }}
                    />
                    <span style={{ margin: "0 10px" }}>から</span>
                  </Row>
                  <Row
                    style={{
                      marginLeft: isPhone ? 0 : "10%",
                      width: isPhone ? "100%" : "80%",
                      marginTop: 10,
                      justifyContent: "space-between",
                      alignItems: "center",
                      flexWrap: "nowrap",
                    }}
                  >
                    <DatePicker
                      control={control}
                      inputName={`customItems.${item.customField.id.toString()}-${
                        item.customField.type.id
                      }.to`}
                      inputProps={{
                        placeholder: "",
                        style: {
                          width: "calc(70% - 16px)",
                          maxWidth: "none",
                        },
                      }}
                    />
                    <span style={{ margin: "0 10px" }}>までの間</span>
                  </Row>
                </>
              }
              key={`value-${itemIndex}-custom-${item.customField.id}`}
              selectValue={`custom-${item.customField.id}`}
              selectedIndex={itemIndex}
              allOptions={allOptions}
              selectedOptions={selectedOptions}
              item={item}
              optionChanged={optionChanged}
              optionAdd={optionAdd}
              optionRemove={optionRemove}
            />
          );
        }
        case 6: {
          return (
            <SearchRow
              isPhone={isPhone}
              input={
                <TextArea
                  control={control}
                  inputName={`customItems.${item.customField.id.toString()}-${
                    item.customField.type.id
                  }`}
                  inputProps={{
                    placeholder: "キーワードを入力してください",
                    style: {
                      width: isPhone ? "100%" : "80%",
                      marginLeft: isPhone ? 0 : "10%",
                      maxWidth: "none",
                    },
                  }}
                />
              }
              key={`value-${itemIndex}-custom-${item.customField.id}`}
              selectValue={`custom-${item.customField.id}`}
              selectedIndex={itemIndex}
              allOptions={allOptions}
              selectedOptions={selectedOptions}
              item={item}
              optionChanged={optionChanged}
              optionAdd={optionAdd}
              optionRemove={optionRemove}
            />
          );
        }
      }
      break;
    }
    default: {
      return (
        <SearchRow
          isPhone={isPhone}
          input={
            <Input
              control={control}
              inputName={""}
              inputProps={{
                placeholder: "",
                style: {
                  width: isPhone ? "100%" : "80%",
                  marginLeft: isPhone ? 0 : "10%",
                  maxWidth: "none",
                },
              }}
            />
          }
          selectedIndex={itemIndex}
          selectValue={null}
          allOptions={allOptions}
          selectedOptions={selectedOptions}
          item={null}
          optionChanged={optionChanged}
          optionAdd={optionAdd}
          optionRemove={optionRemove}
        />
      );
    }
  }
}

function AdvanceSearchModal({
  isModalVisible,
  handleCancel,
  handleOk,
  status,
  customOrder,
}) {
  const { Text } = Typography;
  const [allOptions, setAllOptions] = useState(optionAvailable);
  const [selectedOptions, setSelectedOptions] = useState(defaultOptions);
  const { control, handleSubmit, reset } = useForm();
  useEffect(() => {
    const customItems = customOrder.map((c) => ({
      label: c.name,
      key: -1,
      value: `custom-${c.id}`,
      customField: c,
    }));

    // customItems = _.filter(customItems, (c) => {
    //   if (_.find(allOptions, (o) => o.value === c.value)) {
    //     return false;
    //   }
    //   return true;
    // });

    setAllOptions([...optionAvailable, ...customItems]);
  }, [customOrder]);
  const submitButton = useRef();

  const footer = [
    <Button
      key="cancel"
      onClick={() => {
        setSelectedOptions(defaultOptions);
        reset({ phonenumber: "", spellingFirstname: "", spellingLastname: "" });
      }}
      style={{ color: "#000" }}
    >
      クリア
    </Button>,
    <Button
      key="click"
      onClick={() => submitButton.current.click()}
      type="primary"
    >
      検索する
    </Button>,
  ];

  const optionChanged = (index, newValue) => {
    const temp = [...selectedOptions];
    temp[index] = _.find(allOptions, (f) => f.value === newValue);
    setSelectedOptions(temp);
  };

  const optionRemoved = (index) => {
    const temp = [...selectedOptions];
    _.pullAt(temp, index);
    setSelectedOptions(temp);
  };

  const optionAdded = () => {
    if (selectedOptions.length < allOptions.length) {
      setSelectedOptions([
        ...selectedOptions,
        {
          label: "",
          value: null,
        },
      ]);
    }
  };
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
  return (
    <Modal
      visible={isModalVisible}
      onCancel={handleCancel}
      footer={footer}
      title={"検索条件を入力してください"}
      className="advance-search-modal"
    >
      <form onSubmit={handleSubmit(handleOk)}>
        <Row>
          <Col span={24} style={{ paddingBottom: 25 }}>
            <Text
              style={{
                fontWeight: 600,
                fontSize: 16,
              }}
            >
              複数の条件で検索するときは「＋」を押してください。「−」を押すと条件を削除できます。
            </Text>
          </Col>
        </Row>
        {selectedOptions.map((item, itemIndex) =>
          renderField(
            item,
            itemIndex,
            control,
            allOptions,
            selectedOptions,
            optionChanged,
            optionAdded,
            optionRemoved,
            status,
            isIphone
          )
        )}
        <button type="submit" style={{ display: "none" }} ref={submitButton}>
          submit
        </button>
      </form>
    </Modal>
  );
}

AdvanceSearchModal.propTypes = {
  isModalVisible: PropTypes.bool,
  handleCancel: PropTypes.func,
  handleOk: PropTypes.func,
  status: PropTypes.any,
  customOrder: PropTypes.any,
  control: PropTypes.any,
  handleSubmit: PropTypes.any,
};

SearchRow.propTypes = {
  input: PropTypes.any,
  selectValue: PropTypes.any,
  selectedIndex: PropTypes.any,
  allOptions: PropTypes.any,
  selectedOptions: PropTypes.any,
  item: PropTypes.any,
  optionChanged: PropTypes.any,
  optionAdd: PropTypes.any,
  optionRemove: PropTypes.any,
  isPhone: PropTypes.any,
};

export default AdvanceSearchModal;
