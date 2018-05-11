import { LoginReducer, getUserData, completeOAuth } from './login/login';
import { RepoReducer, validateRepo, getCurrentCommit, getNextCommit, getPrevCommit, submitCommit, submitRepo, nextStep, prevStep } from './repo/index';

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
};