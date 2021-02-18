import React from "react";
import "./styles.scss";
import Header from "components/Appointment/Header";
import Show from "components/Appointment/Show";
import Empty from "components/Appointment/Empty";
import useVisualMode from "hooks/useVisualMode";
import Form from "./Form";

export default function Appointment({
  id,
  time,
  interview,
  interviewers,
  bookInterview,
  ...rest
}) {
  const EMPTY = "EMPTY";
  const SHOW = "SHOW";
  const CREATE = "CREATE";

  const { mode, transition, back } = useVisualMode(interview ? SHOW : EMPTY);

  function save(name, interviewer) {
    const interview = {
      student: name,
      interviewer,
    };
    bookInterview(id, interview);
  }

  return (
    <article className="appointment">
      <Header time={time} />
      {mode === "EMPTY" && <Empty onAdd={() => transition(CREATE)} />}
      {mode === SHOW && <Show {...interview} />}
      {mode === CREATE && (
        <Form
          onCancel={() => back()}
          interviewers={interviewers}
          onSave={save}
        />
      )}
    </article>
  );
}
