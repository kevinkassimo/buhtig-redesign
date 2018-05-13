import { addNotification as notify } from 'reapop';
import { LoginReducer, getUserData, completeOAuth } from './login/login';
import { RepoReducer, submitCommitSelection, submitRepo, browseCommit, nextStep, prevStep, clearDataAndNavigateHome } from './repo/index';

const notifyError = (message) => {
  return notify({title: 'Error', status: 'error', message, position: 'tc'});
};

export const reducers = {
  LoginReducer,
  RepoReducer,
};

export const actions = {
  getUserData,
  completeOAuth,

  submitRepo,
  submitCommitSelection,
  browseCommit,
  goToNextStep: nextStep,
  goToPrevStep: prevStep,

  clearDataAndNavigateHome,

  notifyError,
};