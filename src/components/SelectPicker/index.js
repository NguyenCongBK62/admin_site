import React from "react";
import { Select } from "antd";
import PropTypes from "prop-types";
import { Controller } from "react-hook-form";
const { Option } = Select;

export default function SelectPicker({
  control,
  inputName,
  inputProps = {},
  defaultValue,
  reservationTimeValidation,
  Options,
  callback = () => {},
}) {
  return (
    <>
      <Controller
        control={control}
        name={inputName}
        defaultValue={defaultValue}
        render={({ onChange, value, name }) => (
          <Select
            {...inputProps}
            onChange={(v) => {
              onChange(v);
              callback();
            }}
            value={value}
            name={name}
            className="time-picker"
          >
            {Options.map((option) => (
              <Option key={`${name}_${option.key}`} value={option.key}>
                {option.label}
              </Option>
            ))}
          </Select>
        )}
      />
    </>
  );
}

SelectPicker.propTypes = {
  control: PropTypes.any,
  inputName: PropTypes.string,
  inputProps: PropTypes.object,
  Options: PropTypes.array,
  reservationTimeValidation: PropTypes.func,
  callback: PropTypes.func,
  defaultValue: PropTypes.any,
};
