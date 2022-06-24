import { useState } from "react";

export default function useModal() {
  const [show, setShow] = useState(false);

  const toggleShow = (val = show) => {
    setShow(val);
  };

  return {
    show,
    toggleShow,
  };
}
