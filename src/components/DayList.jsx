import React from "react";

import DayListItem from "./DayListItem";

export default function DayList({ days, day, setDay }) {
  let parsedDayList = days.map(({ id, name, spots }) => (
    <DayListItem
      key={id}
      name={name}
      spots={spots}
      selected={day === name}
      setDay={(event) => setDay(name)}
    />
  ));
  return <ul>{parsedDayList}</ul>;
}
