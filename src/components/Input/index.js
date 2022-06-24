import React from "react";
import { Input } from "antd";
import PropTypes from "prop-types";
import { Controller } from "react-hook-form";
export default function InputComponent({
  control,
  inputName,
  validationOptions,
  error,
  getValues,
  inputProps = {},
  defaultValue = "",
}) {
  return (
    <>
      <Controller
        control={control}
        name={inputName}
        rules={validationOptions?.[inputName]}
        defaultValue={defaultValue}
        render={(
          { onChange, value, name },
          { invalid, isTouched, isDirty }
        ) => (
          <Input
            {...inputProps}
            name={name}
            value={value}
            onChange={(v) => onChange(v)}
          />
        )}
      />
      <small className="invalid-feedback">{error && error.message}</small>
    </>
  );
}

InputComponent.propTypes = {
  control: PropTypes.any,
  inputName: PropTypes.string,
  inputProps: PropTypes.object,
  validationOptions: PropTypes.object,
  error: PropTypes.any,
  getValues: PropTypes.any,
  defaultValue: PropTypes.string,
};
