import React from "react";

import classNames from "classnames";

import "./InterviewerListItem.scss";

export default function InterviewerListItem({
  id,
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
    <li key={id} onClick={() => setInterviewer(name)} className={classStyle}>
      <img className="interviewers__item-image" src={avatar} alt={name} />
      {selected && name}
    </li>
  );
}
