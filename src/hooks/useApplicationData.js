import { useState, useEffect } from "react";
import axios from "axios";
import { getAppointmentsForDay } from "../helpers/selectors";
export default function useApplicationData() {
  const [state, setState] = useState({
    day: "Monday",
    days: [],
    appointments: {},
  });

  const setDay = (day) => setState({ ...state, day });

  function setSpots(deleting = false) {
    const toggle = deleting ? -1 : 1;
    const appointmentsForDay = getAppointmentsForDay(state, state.day);
    const spots = appointmentsForDay.length;
    const spotsRemaining =
      spots -
      appointmentsForDay
        .map(({ interview }) => (interview ? 1 : 0))
        .reduce((prev, curr) => prev + curr, toggle);

    const currDay = state.days.findIndex(({ name }) => name === state.day);
    const days = state.days.map((obj) => {
      return { ...obj };
    });
    days.find((el, index) => index === currDay).spots = spotsRemaining;
    return days;
  }

  function bookInterview(id, interview) {
    const appointment = {
      ...state.appointments[id],
      interview: { ...interview },
    };
    const appointments = {
      ...state.appointments,
      [id]: appointment,
    };

    const days = setSpots();

    setState({
      ...state,
      appointments,
      days,
    });

    return axios.put(`/api/appointments/${id}`, appointment);
  }

  function cancelInterview(id) {
    const days = setSpots(true);

    setState({
      ...state,
      days,
    });
    return axios.delete(`/api/appointments/${id}`);
  }

  useEffect(() => {
    Promise.all([
      axios.get("/api/days"),
      axios.get("/api/appointments"),
      axios.get("api/interviewers"),
    ]).then(([days, appointments, interviewers]) => {
      setState((prev) => ({
        ...prev,
        days: [...days.data],
        appointments: { ...appointments.data },
        interviewers: { ...interviewers.data },
      }));
    });
  }, []);

  return { state, setDay, bookInterview, cancelInterview };
}
