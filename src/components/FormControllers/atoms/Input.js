import React from "react";
import { Input as AntInput } from "antd";
import PropTypes from "prop-types";
import { Controller } from "react-hook-form";
export default function Input({
  control,
  inputName,
  validation = {},
  errors,
  inputProps = {},
  defaultValue = "",
  callback = () => {},
}) {
  return (
    <>
      <Controller
        control={control}
        name={inputName}
        rules={validation}
        defaultValue={defaultValue}
        render={({ onChange, value, name }) => (
          <AntInput
            {...inputProps}
            autoComplete="new-password"
            className={"ant-input-custom"}
            name={name}
            value={value}
            onChange={(v) => {
              onChange(v);
              callback(v);
            }}
          />
        )}
      />
      <small className="invalid-feedback">{errors && errors.message}</small>
    </>
  );
}

Input.propTypes = {
  control: PropTypes.any,
  inputName: PropTypes.string,
  inputProps: PropTypes.object,
  validation: PropTypes.object,
  errors: PropTypes.any,
  getValues: PropTypes.any,
  defaultValue: PropTypes.string,
  callback: PropTypes.func,
};
