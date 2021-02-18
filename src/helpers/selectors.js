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

export function getInterviewersForDay({ days, interviewers }, filterDay) {
  const filteredDay = days.find((day) => day.name === filterDay);

  return filteredDay
    ? filteredDay.interviewers.map((id) => interviewers[id])
    : [];
}
