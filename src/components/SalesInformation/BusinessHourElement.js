import SelectPicker from "components/SelectPicker";
import PropTypes from "prop-types";
import {
  hourOptions,
  minutesOptions,
} from "containers/StoreMasterCreateUpdate/data";
import React from "react";

export default function BusinessHourElement({ control, index }) {
  return (
    <>
      <div>
        <SelectPicker
          control={control}
          inputName={`businessHours.${index}.startTimeHour`}
          // defaultValue={""}
          inputProps={{
            placeholder: "--",
            style: { width: 80 },
          }}
          Options={hourOptions.map((h, idx) =>
            h === "--" ? { key: "", label: h } : { key: idx - 1, label: h }
          )}
        />
        <span className={"span-padding-left-right"}>:</span>
        <SelectPicker
          control={control}
          inputName={`businessHours.${index}.startTimeMinute`}
          // defaultValue={""}
          inputProps={{
            placeholder: "--",
            style: { width: 80 },
          }}
          Options={minutesOptions.map((m) =>
            m === "--" ? { key: "", label: m } : { key: m, label: m }
          )}
        />
      </div>
      <div style={{ marginTop: "10px" }}>
        <span className={"span-padding-left-right"}>から{"   "}</span>
      </div>
      <div>
        <SelectPicker
          control={control}
          inputName={`businessHours.${index}.endTimeHour`}
          // defaultValue={""}
          inputProps={{
            placeholder: "--",
            style: { width: 80 },
          }}
          Options={hourOptions.map((h, idx) =>
            h === "--" ? { key: "", label: h } : { key: idx - 1, label: h }
          )}
        />
        <span className={"span-padding-left-right"}>:</span>
        <SelectPicker
          control={control}
          inputName={`businessHours.${index}.endTimeMinute`}
          // defaultValue={""}
          inputProps={{
            placeholder: "--",
            style: { width: 80 },
          }}
          Options={minutesOptions.map((m) =>
            m === "--" ? { key: "", label: m } : { key: m.toString(), label: m }
          )}
        />
      </div>
      <div style={{ marginTop: "10px" }}>
        <span className={"span-padding-left-right"}>まで {"   "}</span>
      </div>
    </>
  );
}

BusinessHourElement.propTypes = {
  control: PropTypes.any,
  index: PropTypes.any,
};
