import reducer from "./application";

describe("reducer", () => {
  it("throws an error with an unsupported type", () => {
    const emptyState = {};
    const nullAction = { type: null };
    expect(() => reducer(emptyState, nullAction)).toThrowError(
      /tried to reduce with unsupported action type/i
    );
  });
});
