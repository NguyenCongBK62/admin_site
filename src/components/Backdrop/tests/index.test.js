import { render, screen } from "utils/test-utils";
import "@testing-library/jest-dom/extend-expect";
import Backdrop from "components/Backdrop";

test("Check backdrop class", async () => {
  render(<Backdrop show={true} />);
  expect(screen.getByTestId("backdrop")).toHaveClass("backdrop");
});
