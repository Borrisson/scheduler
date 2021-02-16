import React from "react";

import classNames from "classnames";

import "./InterviewerListItem.scss";

export default function InterviewerListItem({
  name,
  avatar,
  selected,
  setInterviewer,
  ...rest
}) {
  const classStyle = classNames("interviewers__item", {
    "interviewers__item--selected": selected,
  });

  return (
    <li className={classStyle} onClick={setInterviewer}>
      <img className="interviewers__item-image" src={avatar} alt={name} />
      {selected && name}
    </li>
  );
}
