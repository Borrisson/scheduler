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

  function setSpots() {
    setState((prevState) => {
      const appointmentsForDay = getAppointmentsForDay(
        prevState,
        prevState.day
      );
      const spots = appointmentsForDay.length;
      const spotsRemaining =
        spots -
        appointmentsForDay
          .map(({ interview }) => (interview ? 1 : 0))
          .reduce((prev, curr) => prev + curr);

      const currDay = state.days.findIndex(({ name }) => name === state.day);
      const days = state.days.map((obj) => {
        return { ...obj };
      });
      days.find((el, index) => index === currDay).spots = spotsRemaining;

      return { ...prevState, days };
    });
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

    setState({
      ...state,
      appointments,
    });

    return axios.put(`/api/appointments/${id}`, appointment);
  }

  function cancelInterview(id) {
    const appointment = {
      ...state.appointments[id],
      interview: null,
    };
    const appointments = {
      ...state.appointments,
      [id]: appointment,
    };

    setState({
      ...state,
      appointments,
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

  return { state, setSpots, setDay, bookInterview, cancelInterview };
}
