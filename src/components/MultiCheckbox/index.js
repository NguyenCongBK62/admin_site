import React, { useEffect } from "react";
import { List, Checkbox } from "antd";
import PropTypes from "prop-types";
import { Controller, useFieldArray } from "react-hook-form";
import "components/MultiCheckbox/style/index.less";
export default function MultiCheckbox({
  control,
  options,
  inputName,
  listProps,
  itemProps,
  valueName = "name",
  label = () => {},
}) {
  const { append, remove } = useFieldArray({
    control,
    name: inputName,
  });

  useEffect(() => {
    options.forEach((o) => {
      append(o);
    });
  }, []);

  return (
    <List
      {...listProps}
      dataSource={options}
      renderItem={(item, index) => (
        <List.Item
          key={index}
          style={{
            color: item.disabled ? "#eee" : "inherit",
          }}
        >
          <div {...itemProps} className="multi-checkbox-container">
            <div className="multi-checkbox-left">
              <Controller
                control={control}
                defaultValue={""}
                name={`${inputName}[${index}].value`}
                render={({ onChange, value, name }) => (
                  <Checkbox
                    disabled={item.disabled}
                    onClick={(e) => {
                      if (e.target.checked) {
                        onChange(item);
                      } else {
                        remove(index);
                        onChange("");
                      }
                    }}
                    name={name}
                  >
                    {item[valueName]}
                  </Checkbox>
                )}
              />
            </div>
            <div className="multi-checkbox-right">{label(item)}</div>
          </div>
        </List.Item>
      )}
    />
  );
}

MultiCheckbox.propTypes = {
  control: PropTypes.any,
  inputName: PropTypes.string,
  valueName: PropTypes.string,
  itemProps: PropTypes.object,
  listProps: PropTypes.object,
  options: PropTypes.array,
  label: PropTypes.any,
};
