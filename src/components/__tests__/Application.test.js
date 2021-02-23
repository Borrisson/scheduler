import React from "react";

import {
  render,
  cleanup,
  waitForElement,
  fireEvent,
  prettyDOM,
  getByText,
  getAllByAltText,
  getByAltText,
  getByPlaceholderText,
  getAllByTestId,
  queryByText,
  queryByAltText,
} from "@testing-library/react";

import Application from "components/Application";
import { configureActions } from "@storybook/addon-actions/dist/preview";

afterEach(cleanup);

describe("Application", () => {
  it("defaults to Monday and changes schedule when new day is selected", async () => {
    const { getByText, queryByText } = render(<Application />);

    await waitForElement(() => getByText("Monday"));
    fireEvent.click(getByText("Tuesday"));
    expect(getByText("Leopold Silvers")).toBeInTheDocument();
    expect(queryByText("Archie Cohen")).not.toBeInTheDocument();
  });
  it("loads data, books an interview and reduces the spots remaining for the first day by 1", async () => {
    const { container } = render(<Application />);
    await waitForElement(() => getByText(container, "Archie Cohen"));
    const firstAdd = getAllByAltText(container, "Add")[0];
    fireEvent.click(firstAdd);
    fireEvent.change(getByPlaceholderText(container, /enter student name/i), {
      target: { value: "Lydia Miller-Jones" },
    });
    fireEvent.click(getByAltText(container, "Sylvia Palmer"));
    fireEvent.click(getByText(container, "Save"));
    expect(getByText(container, "Saving")).toBeInTheDocument();
    await waitForElement(() => getByText(container, "Lydia Miller-Jones"));
    const day = getAllByTestId(container, "day").find((day) =>
      queryByText(day, "Monday")
    );
    expect(getByText(day, "no spots remaining")).toBeInTheDocument();
  });
  it("loads data, cancels an interview and increases the spots remaining for Monday by 1", async () => {
    const { container } = render(<Application />);
    await waitForElement(() => getByText(container, "Archie Cohen"));
    const appointment = getAllByTestId(
      container,
      "appointment"
    ).find((appointment) => queryByText(appointment, "Archie Cohen"));
    fireEvent.click(queryByAltText(appointment, "Delete"));
    expect(
      getByText(appointment, "Delete the appointment?")
    ).toBeInTheDocument();
    fireEvent.click(queryByText(appointment, "Confirm"));
    expect(getByText(appointment, "Deleting")).toBeInTheDocument();
    await waitForElement(() => getByAltText(appointment, "Add"));
    const day = getAllByTestId(container, "day").find((day) =>
      queryByText(day, "Monday")
    );
    expect(getByText(day, "2 spots remaining")).toBeInTheDocument();
  });
  xit("loads data, edits an interview and keeps the spots remaining for Monday the same", () => {});
  xit("shows the save error when failing to save an appointment", () => {});
  xit("shows the delete error when failing to delete an existing appointment", () => {});
});
