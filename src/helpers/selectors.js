export function getAppointmentsForDay({ days, appointments }, filterDay) {
  const filteredDay = days.find((day) => day.name === filterDay);

  return filteredDay
    ? filteredDay.appointments.map((id) => appointments[id])
    : [];
}
