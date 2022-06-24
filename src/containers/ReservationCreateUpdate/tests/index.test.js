import { render, screen } from "utils/test-utils";
import "@testing-library/jest-dom/extend-expect";
import Backdrop from "components/Backdrop";

test("Checking the form", async () => {
  render(<Backdrop show={true} />);
  expect(screen.getByTestId("backdrop")).toHaveClass("backdrop");
});
