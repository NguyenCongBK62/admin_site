import React from "react";
import PropTypes from "prop-types";
import { Controller } from "react-hook-form";
import TextArea from "antd/lib/input/TextArea";

export default function TextAreaComponent({
  control,
  inputName,
  inputProps = {},
  defaultValue = "",
}) {
  return (
    <Controller
      control={control}
      name={inputName}
      defaultValue={defaultValue}
      render={({ onChange, value, name }, { invalid, isTouched, isDirty }) => (
        <TextArea
          {...inputProps}
          name={name}
          value={value}
          onChange={(v) => onChange(v)}
        />
      )}
    />
  );
}

TextAreaComponent.propTypes = {
  control: PropTypes.any,
  inputName: PropTypes.string,
  inputProps: PropTypes.object,
  defaultValue: PropTypes.string,
};
