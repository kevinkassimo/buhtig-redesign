import { addNotification as notify } from 'reapop';
import { LoginReducer, getUserData, completeOAuth } from './login/login';
import { RepoReducer, validateRepo, getCurrentCommit, getNextCommit, getPrevCommit, submitCommit, submitRepo, nextStep, prevStep } from './repo/index';

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

  validateRepo,
  getCurrentCommit,
  getNextCommit,
  getPrevCommit,
  submitRepo,
  submitCommit,
  goToNextStep: nextStep,
  goToPrevStep: prevStep,

  notifyError,
};