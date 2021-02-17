export function getAppointmentsForDay({ days, appointments }, day) {
  const filteredDay = days.find((filterDay) => filterDay.name === day);

  return filteredDay
    ? filteredDay.appointments.map((id) => appointments[id])
    : [];
}
