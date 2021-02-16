import React from "react";

import InterviewerListItem from "./InterviewerListItem";

import "./InterviewerList.scss";

export default function InterviewerList({
  interviewers,
  interviewer,
  setInterviewer,
}) {
  const parsedInterviewers = interviewers.map(({ id, name, avatar }) => (
    <InterviewerListItem
      id={id}
      name={name}
      avatar={avatar}
      selected={id === interviewer}
      setInterviewer={(event) => setInterviewer(id)}
    />
  ));

  return (
    <section className="interviewers">
      <h4 className="interviewers__header text--light">Interviewer</h4>
      <ul className="interviewers__list">{parsedInterviewers}</ul>
    </section>
  );
}
