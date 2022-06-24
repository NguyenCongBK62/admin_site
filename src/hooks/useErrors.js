import _ from "lodash";
import { useState } from "react";

export default function useError() {
  const [manualErrors, setManualErrors] = useState({});

  return {
    manualErrors: manualErrors,
    addError: (key, error) => {
      setManualErrors((v) => ({ ...v, [key]: error }));
    },
    removeError: (key) => {
      setManualErrors((v) => _.omit({ ...v }, [key]));
    },
  };
}
