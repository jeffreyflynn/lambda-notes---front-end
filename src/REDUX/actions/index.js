import axios from 'axios';

export const FETCHING_ERROR = "FETCHING_ERROR";
export const FETCH_NOTES = "FETCH_NOTES";
export const TOGGLE_NIGHT = "TOGGLE_NIGHT";
export const REORDER = "REORDER";
export const OLDEST_NEWEST = "REVERSE";
export const NEWEST_OLDEST = "ORDER";
export const LIST = "LIST";
export const SORT_TITLE = "SORT_TITLE";
export const SET_HOME = "SET_HOME";

export const getNotes = requestOptions => {
  return dispatch => {
    axios
      .get("https://lambdanotes-jeffreyflynn.herokuapp.com/api/notes", requestOptions)
      .then(res => dispatch({ type: FETCH_NOTES, payload: res.data })) 
      .catch(err => dispatch({ type: FETCHING_ERROR }))
  }
}

export const handleReverse = () => {
  return dispatch => { dispatch({ type: OLDEST_NEWEST }) }
}

export const handleOrder = () => {
  return dispatch => { dispatch({ type: NEWEST_OLDEST }) }
}

export const listViews = () => {
  return dispatch => { dispatch({ type: LIST }) }
}

export const sortTitle = () => {
  return dispatch => { dispatch({ type: SORT_TITLE }) }
}

export const setHome = bool => {
  return dispatch => { dispatch({ type: SET_HOME, payload: bool }) }
}

export const toggleNight = () => { return dispatch => dispatch({ type: TOGGLE_NIGHT }) }