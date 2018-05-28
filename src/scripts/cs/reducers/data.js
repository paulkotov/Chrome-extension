import { ADD_DATA, DELETE_DATA, EDIT_DATA } from '../constants/ActionTypes';

const initialState = [
  { id: 1,
    name: 'Pavel',
    phone: '1-900-123456',
    email: 'pavel@pavel.com',
    memo: 'Pavel'
  }, {
    id: 2,
    name: 'Alex',
    phone: '1-600-123456',
    email: 'alex@gmail.com',
    memo: 'Friend'
  }, {
    id: 3,
    name: 'Yuri',
    phone: '1-500-9876541',
    email: 'yura@gmailhmail.com',
    memo: 'Some memo'
  }];

export default function data(state = initialState, action) {
  switch (action.type) {
    case ADD_DATA:
      return [
        {
          id: state.reduce((maxId, info) => Math.max(info.id, maxId), -1) + 1,
          name: action.data.name,
          phone: action.data.phone,
          email: action.data.email,
          memo: action.data.memo
        }
      ];

    case DELETE_DATA:
      return state.filter(blog =>
        blog.id !== action.id
      );

    case EDIT_DATA:
      return state.map(data =>
        data.id === action.data.id ?
          { ...data, name: action.data.name, phone: action.data.phone, email: action.data.email, memo: action.data.memo } :
          data
      );

    default:
      return state;
  }
}
