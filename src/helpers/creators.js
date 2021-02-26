export function appointmentCreator(state, id, setSpots, interview = null) {
  const appointment = {
    ...state.appointments[id],
    interview: interview,
  };
  const appointments = {
    ...state.appointments,
    [id]: appointment,
  };
  const days = setSpots(id, interview ? "decr" : "incr");

  return { appointment, appointments, days };
}
