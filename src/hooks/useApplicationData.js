import { useReducer, useEffect } from "react";
import axios from "axios";

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

  function setSpots(id, operator) {
    const spotsAction =
      {
        incr: 1,
        decr: -1,
      }[operator] ||
      new Error("Must provide correct operator either increment or decrement");

    //checks to see if this is an edit
    if (operator === "decr" && state.appointments[id].interview) {
      return state.days;
    }

    // updates spots
    const bufferDays = state.days.map((day) => {
      if (day.appointments.includes(id)) {
        return {
          ...day,
          spots: day.spots + spotsAction,
        };
      } else {
        return day;
      }
    });

    return bufferDays;
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

    const days = setSpots(id, "decr", interview);

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
    const days = setSpots(id, "incr");

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
      //state.days[0] is here to make sure we are never using the initial
      //state, interview !== state.appointments[id].interview is to make sure
      //the user making the change doesn't change the state once more
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
        const days = setSpots(id, interview ? "decr" : "incr");
        dispatch({
          type: SET_INTERVIEW,
          appointments,
          days,
        });
      }
    };
    return () => webSocket.close();
  });
  return { state, setDay, bookInterview, cancelInterview };
}
