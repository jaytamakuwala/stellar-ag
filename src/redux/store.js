import { legacy_createStore as createStore, combineReducers } from 'redux';
import themeReducer from './reducers/themeReducer';

const rootReducer = combineReducers({
  theme: themeReducer
});

const store = createStore(
    rootReducer,
    window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()

);

export default store;
