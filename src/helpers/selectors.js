export function getAppointmentsForDay({ days, appointments }, filterDay) {
  return filterDayFor("appointments", appointments, days, filterDay);
}

export function getInterview({ interviewers }, interview) {
  return interview
    ? { ...interview, interviewer: interviewers[interview.interviewer] }
    : null;
}

export function getInterviewersForDay({ days, interviewers }, filterDay) {
  return filterDayFor("interviewers", interviewers, days, filterDay);
}

function filterDayFor(option, stateObj, days, filterDay) {
  const filteredDay = days.find((day) => day.name === filterDay);

  return filteredDay ? filteredDay[option].map((id) => stateObj[id]) : [];
}
