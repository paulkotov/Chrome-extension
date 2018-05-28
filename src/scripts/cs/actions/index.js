import * as types from '../constants/ActionTypes';

export const addData = data => ({ type: types.ADD_DATA, data });
export const editData = data => ({ type: types.EDIT_DATA, data });
export const deleteData = id => ({ type: types.DELETE_DATA, id });
