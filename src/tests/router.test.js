// app.test.js
import { render, screen } from "utils/test-utils";
import userEvent from "@testing-library/user-event";
import { createMemoryHistory } from "history";
import React from "react";
import { Router } from "react-router-dom";

import "@testing-library/jest-dom/extend-expect";

import RouteApp from "router";

test("full app rendering/navigating", () => {
  const history = createMemoryHistory();
  render(
    <Router history={history}>
      <RouteApp />
    </Router>
  );
  // verify page content for expected route
  // often you'd use a data-testid or role query, but this is also possible
  expect(screen.getByTestId("home-page")).toBeInTheDocument();

  const leftClick = { button: 0 };
  userEvent.click(screen.getByText(/ご予約/i), leftClick);

  // check that the content changed to the new page
  expect(screen.getByTestId("reservation-create-update")).toBeInTheDocument();
});

// test("landing on a bad page", () => {
//   const history = createMemoryHistory();
//   history.push("/some/bad/route");
//   render(
//     <Router history={history}>
//       <App />
//     </Router>
//   );

//   expect(screen.getByText(/no match/i)).toBeInTheDocument();
// });

// test("rendering a component that uses useLocation", () => {
//   const history = createMemoryHistory();
//   const route = "/some-route";
//   history.push(route);
//   render(
//     <Router history={history}>
//       <LocationDisplay />
//     </Router>
//   );

//   expect(screen.getByTestId("location-display")).toHaveTextContent(route);
// });
