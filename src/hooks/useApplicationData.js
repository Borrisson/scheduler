import { useReducer, useEffect } from "react";
import axios from "axios";
import { getAppointmentsForDay } from "../helpers/selectors";

const SET_DAY = "SET_DAY";
const SET_APPLICATION_DATA = "SET_APPLICATION_DATA";
const SET_INTERVIEW = "SET_INTERVIEW";

function reducer(state, action) {
  switch (action.type) {
    case SET_DAY:
      return {
        ...state,
        day: action.day,
      };
    case SET_APPLICATION_DATA:
      return {
        ...state,
        days: action.days,
        appointments: action.appointments,
        interviewers: action.interviewers,
      };
    case SET_INTERVIEW:
      return {
        ...state,
        appointments: action.appointments,
        days: action.days,
      };

    default:
      throw new Error(
        `Tried to reduce with unsupported action type: ${action.type}`
      );
  }
}

export default function useApplicationData() {
  const [state, dispatch] = useReducer(reducer, {
    day: "Monday",
    days: [],
    appointments: {},
    interviewers: {},
  });

  const setDay = (day) => dispatch({ type: SET_DAY, day });

  function setSpots(appointments) {
    const appointmentsForDay = getAppointmentsForDay(
      { days: state.days, appointments },
      state.day
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
    const days = setSpots(appointments);
    dispatch({
      type: SET_INTERVIEW,
      appointments,
      days,
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
    const days = setSpots(appointments);
    dispatch({
      type: SET_INTERVIEW,
      appointments,
      days,
    });

    return axios.delete(`/api/appointments/${id}`);
  }

  useEffect(() => {
    const webSocket = new WebSocket("ws://localhost:8001");
    Promise.all([
      axios.get("/api/days"),
      axios.get("/api/appointments"),
      axios.get("api/interviewers"),
      webSocket,
    ]).then(([days, appointments, interviewers, webSocket]) => {
      dispatch({
        type: SET_APPLICATION_DATA,
        days: [...days.data],
        appointments: { ...appointments.data },
        interviewers: { ...interviewers.data },
      });
    });
  }, []);

  return { state, setSpots, setDay, bookInterview, cancelInterview };
}
