import React from "react";

import classNames from "classnames";

import "./DayListItem.scss";

export default function DayListItem({ name, spots, selected, setDay }) {
  function formatSpots(spots) {
    return `${!spots ? "no" : spots} spot${spots !== 1 ? "s" : ""} remaining`;
  }

  const classStyle = classNames("day-list__item", {
    "day-list__item--selected": selected,
    "day-list__item--full": !spots,
  });

  return (
    <li className={classStyle} onClick={setDay} data-testid="day">
      <h2 className="text--regular">{name}</h2>
      <h3 className="text--light">{formatSpots(spots)}</h3>
    </li>
  );
}
