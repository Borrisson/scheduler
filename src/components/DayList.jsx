import React from "react";

import DayListItem from "./DayListItem";

export default function DayList({ days, day, setDay, ...rest }) {
  let parsedDayList = days.map(({ id, name, spots }) => (
    <DayListItem
      key={id}
      name={name}
      spots={spots}
      selected={day === id}
      setDay={(event) => setDay(id)}
    />
  ));
  return <ul>{parsedDayList}</ul>;
}
