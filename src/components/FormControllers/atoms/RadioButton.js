import React from "react";
import PropTypes from "prop-types";
import { Controller } from "react-hook-form";
import { Radio } from "antd";

export default function RadioButton({
  control,
  inputName,
  defaultValue,
  validation = {},
  buttons,
  classes = "radio-button-container",
}) {
  return (
    <Controller
      control={control}
      name={inputName}
      rules={validation}
      defaultValue={defaultValue}
      render={({ onChange, value, name }) => (
        <Radio.Group
          className={classes}
          defaultValue={defaultValue}
          onChange={(v) => onChange(v.target.value)}
          value={value}
          name={name}
        >
          {buttons.map((button, index) => (
            <Radio.Button
              value={button.value}
              className="button-radio button-radio-default"
              key={index}
            >
              {button.label}
            </Radio.Button>
          ))}
        </Radio.Group>
      )}
    />
  );
}

RadioButton.propTypes = {
  control: PropTypes.any,
  validation: PropTypes.any,
  inputName: PropTypes.string,
  inputProps: PropTypes.object,
  buttons: PropTypes.array,
  defaultValue: PropTypes.string,
  classes: PropTypes.string,
};
