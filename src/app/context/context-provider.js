import React from 'react';
import AppReducer, { appInitialState } from './reducer';

export const Context = React.createContext();
const Provider = Context.Provider;

const AppContextProvider = props => {
  const [appState, appDispatch] = React.useReducer(AppReducer, appInitialState);

  return (
    <Provider
      {...props}
      value={{
        appState,
        appDispatch,
      }}
    />
  );
};

export default AppContextProvider;
