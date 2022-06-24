import React, { useState } from "react";
import { Dropdown, Input } from "antd";
import PropTypes from "prop-types";
import { Controller } from "react-hook-form";
import NumberPad from "components/NumberPad";
import { useSelector } from "react-redux";

export default function NumberInput({
  control,
  validation = {},
  defaultValue = 0,
  inputName,
  inputNumberProps,
  errors,
  int = false,
  type = "number",
  label = "",
  menuItems = [1, 2, 3, 4, 5, 6, 7, 8, 9, "CLEAR", 0],
  className = "number-input",
  stringMode = false,
  showNumpad = true,
}) {
  const [visible, setVisible] = useState(false);
  const isIphone = useSelector((state) => state.layoutReducer.isIphone);
  return (
    <Controller
      control={control}
      name={inputName}
      defaultValue={defaultValue}
      rules={validation}
      render={({ onChange: originalOnchange, value, name }) => {
        const onChange = (v) => {
          if (int) {
            originalOnchange(parseInt(v));
          } else {
            originalOnchange(v);
          }
        };
        return (
          <>
            <Dropdown
              overlay={NumberPad({
                value,
                menuItems,
                onChange,
                stringMode,
              })}
              placement={"bottomLeft"}
              arrow={true}
              trigger={["click"]}
              className={"number-pad-dropdown"}
              onVisibleChange={(flag) =>
                showNumpad ? setVisible(flag) : setVisible(false)
              }
              visible={visible}
              getPopupContainer={(trigger) => trigger.parentElement}
              value={value}
            >
              <Input
                {...inputNumberProps}
                name={name}
                value={value}
                onChange={(e) => {
                  const inputNumber = e.target.value;
                  if (
                    inputNumber !== "" &&
                    !inputNumber[inputNumber.length - 1].match(/\d{1}/) &&
                    !inputNumber[inputNumber.length - 1].match(/-/)
                  ) {
                    console.log("");
                  } else {
                    if (
                      inputNumber[inputNumber.length - 1] === "-" &&
                      !menuItems.includes("-")
                    ) {
                      console.log("");
                    } else onChange(inputNumber);
                  }
                }}
                className={className}
                type={type}
                readOnly={isIphone && showNumpad}
              />
            </Dropdown>
            {label ? <span style={{ marginLeft: 5 }}>{label}</span> : null}

            <small className="invalid-feedback">
              {errors && errors.message}
            </small>
          </>
        );
      }}
    />
  );
}

NumberInput.propTypes = {
  control: PropTypes.any,
  validation: PropTypes.object,
  inputNumberProps: PropTypes.object,
  defaultValue: PropTypes.any,
  type: PropTypes.string,
  label: PropTypes.string,
  errors: PropTypes.any,
  inputName: PropTypes.string,
  menuItems: PropTypes.array,
  className: PropTypes.string,
  stringMode: PropTypes.bool,
  int: PropTypes.bool,
  showNumpad: PropTypes.bool,
};
