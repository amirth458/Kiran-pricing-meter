import * as  ActionTypes from './profile-screener-estimator.actions';

const defaultAction = {
  RFQInfo: {},
  screenedProfiles: [],
  estimatedPrices: [],
  status: 'DONE'
};

export type Action = ActionTypes.All;


const newState = (state, currentState) => Object.assign({}, state, currentState);


export function screenerEstimatorReducer(state = defaultAction, action: Action) {
  switch (action.type) {
    case ActionTypes.Types.SetRFQInfo:
      return newState(state, { RFQInfo: action.payload });
    case ActionTypes.Types.SetScreenedProfiles:
      return newState(state, { screenedProfiles: action.payload });
    case ActionTypes.Types.SetEstimatedPrices:
      return newState(state, { estimatedPrices: action.payload });
    case ActionTypes.Types.Status:
      return newState(state, { status: action.payload });
    default:
      return state;
  }
}

