import React from "react";
import { Button, Col, Row } from "antd";
import PropTypes from "prop-types";
import { useFieldArray } from "react-hook-form";

import { RadioButton, Checkbox } from "components/FormControllers";
import BusinessHourElement from "./BusinessHourElement";
import {
  statusButtons,
  weeklyHolidays,
} from "containers/StoreMasterCreateUpdate/data";
import PlusIcon from "components/Icons/PlusIcon";
import TrashIcon from "components/Icons/TrashIcon";
import SectionHeader from "components/Form/atoms/SectionHeader";
import Label from "components/Form/atoms/Label";

export default function SalesInformation({
  control,
  onChangeHolidays,
  checkedHolidays,
}) {
  const { fields, append, remove } = useFieldArray({
    control,
    name: "businessHours",
  });

  return (
    <Row className="form-section" style={{ marginTop: 30 }}>
      <Col span={24}>
        <SectionHeader label={"営業情報"} />
      </Col>
      <Col span={24}>
        <div className="input-group">
          <Label label={"営業時間"} required={false} />
          <div className="input-element">
            <ul style={{ listStyleType: "none" }}>
              {fields.map((item, index) => {
                return (
                  <li key={item.id}>
                    <div className="store-master-form__inputField store-master-form__inputField-flex">
                      <Row gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }}>
                        <Col
                          className="gutter-row"
                          span={18}
                          style={{
                            display: "flex",
                            flexWrap: "wrap",
                            marginBottom: "10px",
                          }}
                        >
                          <BusinessHourElement
                            control={control}
                            index={index}
                          />
                        </Col>
                        <Col className="gutter-row" span={6}>
                          {index === 0 ? (
                            <Button
                              className="business-hour-add-btn"
                              onClick={() => {
                                append({
                                  startTimeHour: "00",
                                  startTimeMinute: "00",
                                  endTimeHour: "00",
                                  endTimeMinute: "00",
                                });
                              }}
                            >
                              <PlusIcon height={"18"} width={"18"} />
                            </Button>
                          ) : (
                            <Button
                              className="business-hour-delete-btn"
                              onClick={() => remove(index)}
                            >
                              <TrashIcon stroke={"white"} />
                            </Button>
                          )}
                        </Col>
                      </Row>
                    </div>
                  </li>
                );
              })}
            </ul>
          </div>
        </div>
      </Col>
      <Col span={24} style={{ marginTop: 12 }}>
        <div className="input-group">
          <Label label={"定休日"} required={false} />
          <div className="input-element" style={{ marginRight: 25 }}>
            <Checkbox
              control={control}
              defaultValue={checkedHolidays}
              inputName={"weeklyHolidays"}
              options={weeklyHolidays}
              callback={onChangeHolidays}
            />
          </div>
        </div>
      </Col>
      <Col span={24} style={{ marginTop: 12 }}>
        <div className="input-group">
          <Label label={"公開ステータス"} required={false} />
          <div className="input-element" style={{ marginRight: 25 }}>
            <RadioButton
              control={control}
              defaultValue={"0"}
              inputName={"status"}
              buttons={statusButtons}
              classes={"radio-button-container-flex-start"}
            />
          </div>
        </div>
      </Col>
    </Row>
  );
}

SalesInformation.propTypes = {
  control: PropTypes.any,
  onChangeHolidays: PropTypes.func,
  checkedHolidays: PropTypes.array,
};
