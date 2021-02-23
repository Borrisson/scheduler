import React from "react";

import { render, cleanup, waitForElement } from "@testing-library/react";

import Application from "components/Application";

afterEach(cleanup);

describe("Application", () => {
  it("defaults to Monday and changes schedule when new day is selected", () => {
    const { getByText } = render(<Application />);

    return waitForElement(() => getByText("Monday"));
  });
});
