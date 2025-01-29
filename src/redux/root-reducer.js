import { combineReducers } from 'redux';
import languageReducer from './slices/language-slice';
import themeReduser from './slices/theme-slice';
import userReduser from './slices/user-slice';
import exercisesReduser from './slices/exercises-slice';
import templatesReduser from './slices/templates-slice';
import mesocyclesReduser from './slices/mesocycles-slice';

const rootReducer = combineReducers({
  language: languageReducer,
  theme: themeReduser,
  user: userReduser,
  exercises: exercisesReduser,
  templates: templatesReduser,
  mesocycles: mesocyclesReduser,
});

export default rootReducer;