import { useReducer, useEffect } from "react";
import axios from "axios";
import { getAppointmentsForDay } from "../helpers/selectors";

import reducer, {
  SET_DAY,
  SET_APPLICATION_DATA,
  SET_INTERVIEW,
} from "reducers/application";

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

    return axios.put(`/api/appointments/${id}`, appointment).then(() =>
      dispatch({
        type: SET_INTERVIEW,
        appointments,
        days,
      })
    );
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

    return axios.delete(`/api/appointments/${id}`).then(() =>
      dispatch({
        type: SET_INTERVIEW,
        appointments,
        days,
      })
    );
  }

  useEffect(() => {
    Promise.all([
      axios.get("/api/days"),
      axios.get("/api/appointments"),
      axios.get("/api/interviewers"),
    ]).then(([days, appointments, interviewers]) => {
      dispatch({
        type: SET_APPLICATION_DATA,
        days: [...days.data],
        appointments: { ...appointments.data },
        interviewers: { ...interviewers.data },
      });
    });
  }, []);

  useEffect(() => {
    const webSocket = new WebSocket(process.env.REACT_APP_WEBSOCKET_URL);
    webSocket.onmessage = function (event) {
      const { id, type, interview } = JSON.parse(event.data);
      if (
        type === SET_INTERVIEW &&
        state.days[0] &&
        interview !== state.appointments[id].interview
      ) {
        const appointment = {
          ...state.appointments[id],
          interview: interview,
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
      }
    };
    return () => {
      webSocket.close();
    };
  });
  return { state, setDay, bookInterview, cancelInterview };
}
