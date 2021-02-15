import React from "react";

import classNames from "classnames";

import "./DayListItem.scss";


export default function DayListItem({name, spots, selected, setDay, ...rest}) {
  return (
    <li onClick={() => setDay(name)}>
      <h2 className="text--regular">{name}</h2>
      <h3 className="text--light">{spots}</h3>
    </li>
  )
}