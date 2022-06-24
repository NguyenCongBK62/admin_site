import React from "react";
import PropTypes from "prop-types";
import { Controller } from "react-hook-form";
import { Radio } from "antd";

export default function RadioButton({
  control,
  inputName,
  defaultValue,
  inputProps = {},
  buttons,
}) {
  return (
    <Controller
      control={control}
      name={inputName}
      defaultValue={defaultValue}
      render={({ onChange, value, name }, { invalid, isTouched, isDirty }) => (
        <Radio.Group
          {...inputProps}
          defaultValue={defaultValue}
          onChange={(v) => onChange(v.target.value)}
          value={value}
          name={name}
        >
          {buttons.map((button, index) => (
            <Radio.Button
              value={button.value}
              {...button.buttonProps}
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
  inputName: PropTypes.string,
  inputProps: PropTypes.object,
  buttons: PropTypes.array,
  defaultValue: PropTypes.string,
};
