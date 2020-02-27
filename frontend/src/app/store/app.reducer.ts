import {
  InitialState,
  AppState,
  AppTypes,
  AppAction,
  AppFields
} from './app.models';

export function appReducer(s: AppState = InitialState, a: AppAction) {
  if (!a) {
    console.log('App module dispatched an invalid action.');
    return s;
  }
  switch (a.type) {
    case AppTypes.UpdateState:
      return { ...s, ...a.payload };
    default:
      return s;
  }
}
