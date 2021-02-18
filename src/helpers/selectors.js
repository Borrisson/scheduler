export function getAppointmentsForDay({ days, appointments }, filterDay) {
  const filteredDay = days.find((day) => day.name === filterDay);

  return filteredDay
    ? filteredDay.appointments.map((id) => appointments[id])
    : [];
}

export function getInterview({ interviewers }, interview) {
  return interview
    ? { ...interview, interviewer: interviewers[interview.interviewer] }
    : null;
}

export function getInterviewersForDay(
  { days, appointments, interviewers },
  filterDay
) {
  const filteredDay = days.find((day) => day.name === filterDay);
  if (!filteredDay) {
    return [];
  }
  const filteredInterviews = filteredDay.appointments
    .map((id) => appointments[id].interview)
    .filter((interview) => interview !== null);

  return filteredInterviews.map(({ interviewer: id }) => interviewers[id]);
}
