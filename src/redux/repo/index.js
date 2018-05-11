import { notify } from 'reapop';

const SAVE_REPO_DATA = 'save_repo_data';
const SAVE_TOTAL_COMMIT = 'save_curr_commit';
const SAVE_CURR_COMMIT = 'save_curr_commit';
const GOTO_NEXT_COMMIT = 'goto_next_commit';
const GOTO_PREV_COMMIT = 'goto_prev_commit';
const SAVE_COMMIT_RESULT = 'save_commit_result';
const GOTO_PREV_STEP = 'goto_prev_step';
const GOTO_NEXT_STEP = 'goto_next_step';

const defaultState = {
  step: 0,
  owner: null,
  repo: null,
  total: 0,
  commit: 1,
  cache: [],
  cacheIndex: 0,
  result: null,
};

const saveRepoData = (owner, repo) => {
  return {
    type: SAVE_REPO_DATA,
    owner,
    repo,
  };
};

const saveCurrCommit = (commit) => {
  return {
    type: SAVE_CURR_COMMIT,
    commit,
  }
};

const saveTotalCommit = (total) => {
  return {
    type: SAVE_TOTAL_COMMIT,
    total,
  };
};

const saveCommitResult = (result) => {
  return {
    type: SAVE_COMMIT_RESULT,
    result,
  };
};

const nextCommit = () => {
  return {
    type: GOTO_NEXT_COMMIT,
  }
};

const prevCommit = () => {
  return {
    type: GOTO_PREV_COMMIT,
  }
};

const nextStep = () => {
  return {
    type: GOTO_NEXT_STEP,
  }
};

const prevStep = () => {
  return {
    type: GOTO_PREV_STEP,
  }
};

const isProd = () => {
  return process.env.NODE_ENV === 'production'
};

const submitRepo = (owner, repo) => {
  return async (dispatch, getState) => {
    let state = getState();
    if (state.step !== 0) {
      dispatch(notify({message: "Wrong step!", status: 400}));
      return;
    }

    try {
      let url = isProd() ?
        '/api/' :
        'http://localhost:8000/api/total_commit';

      let res = await fetch(`${url}?owner=${owner}&repo=${repo}`, {
        method: 'GET',
        credentials: isProd() ? 'same-site' : 'include'
      });
      if (!res.ok) {
        dispatch(notify({message: "Cannot find repo or an error occurred", status: res.status}));
        return;
      }

      let json = await res.json();
      dispatch(saveRepoData(owner, repo));
      dispatch(saveTotalCommit(json.count));
      dispatch(nextStep());
    } catch (err) {
      dispatch(notify({message: "An error occurred", status: 400}));
    }
  }
};

const submitCommit = (commit) => {
  return async (dispatch, getState) => {
    let state = getState();
    if (state.step !== 1) {
      dispatch(notify({message: "Wrong step!", status: 400}));
      return;
    }

    if (!state.total || commit <= 0 || commit > state.total) {
      dispatch(notify({message: 'Invalid commit!', status: 400}));
      return;
    }

    try {
      dispatch(saveCurrCommit(commit));

      let url = isProd() ?
        '/api/' :
        'http://localhost:8000/api/commit';

      let res = await fetch(`${url}?owner=${state.owner}&repo=${state.repo}&total=${state.total}&which=${commit}`, {
        method: 'GET',
        credentials: isProd() ? 'same-site' : 'include'
      });
      if (!res.ok) {
        dispatch(notify({message: "Cannot get commit or an error occurred", status: res.status}));
        return;
      }

      let json = await res.json();
      dispatch(saveCommitResult(json));
      dispatch(nextStep());
    } catch (err) {
      dispatch(notify({message: "An error occurred", status: 400}));
    }
  };
};

const validateRepo = (owner, repo) => {
  return async (dispatch) => {
    let res = {};
    try {
      let url = isProd() ?
        '/api/' :
        'http://localhost:8000/api/total_commit';

      res = await fetch(`${url}?owner=${owner}&repo=${repo}`, {
        method: 'GET',
        credentials: isProd() ? 'same-site' : 'include'
      });
      if (!res.ok) {
        dispatch(notify({message: "Cannot find repo or an error occurred", status: res.status}));
        return;
      }

      let json = await res.json();
      dispatch(saveRepoData(owner, repo));
      dispatch(saveTotalCommit(json.count));
    } catch (err) {
      dispatch(notify({message: "An error occurred", status: res.status || 400}));
    }
  }
};

const getCurrentCommit = (commit) => {
  return async (dispatch, getState) => {
    let res = {};
    try {
      dispatch(saveCurrCommit(commit));

      let state = getState();
      let url = isProd() ?
        '/api/' :
        'http://localhost:8000/api/commit';

      res = await fetch(`${url}?owner=${state.owner}&repo=${state.repo}&total=${state.total}&which=${commit}`, {
        method: 'GET',
        credentials: isProd() ? 'same-site' : 'include'
      });
      if (!res.ok) {
        dispatch(notify({message: "Cannot get commit or an error occurred", status: res.status}));
        return;
      }

      let json = await res.json();
      dispatch(saveCommitResult(json));
    } catch (err) {
      dispatch(notify({message: "An error occurred", status: res.status || 400}));
    }
  };
};

const getNextCommit = () => {
  return async (dispatch, getState) => {
    let state = getState();

    if (!state.total || !state.commit || state.commit <= 0 || state.commit > state.total) {
      dispatch(notify({message: 'Invalid commit!', status: 400}));
      return;
    }

    if (state.commit === state.total) {
      dispatch(notify({message: 'At last commit, cannot go forward', status: 400}));
      return;
    }

    dispatch(nextCommit());
    dispatch(getCurrentCommit(state.commit));
  };
};

const getPrevCommit = () => {
  return async (dispatch, getState) => {
    let state = getState();

    if (!state.total || !state.commit || state.commit <= 0 || state.commit > state.total) {
      dispatch(notify({message: 'Invalid commit!', status: 400}));
      return;
    }

    if (state.commit === 1) {
      dispatch(notify({message: 'At first commit, cannot go back', status: 400}));
      return;
    }

    dispatch(prevCommit());
    dispatch(getCurrentCommit(state.commit));
  };
};

const RepoReducer = (state = defaultState, action) => {
  switch (action.type) {
    case SAVE_REPO_DATA:
      return {
        ...state,
        owner: action.owner,
        repo: action.repo,
      };
    case SAVE_TOTAL_COMMIT:
      return {
        ...state,
        total: +action.total || 0,
      };
    case SAVE_CURR_COMMIT:
      if (!state.total || action.commit <= 0 || action.commit > state.total) {
        throw new Error('invalid commit');
      }
      return {
        ...state,
        commit: +action.commit || 0,
      };
    case GOTO_NEXT_COMMIT:
      if (!state.total) {
        throw new Error('invalid total commit');
      }
      if (state.commit + 1 > state.total) {
        return state; // silently fail
      }
      return {
        ...state,
        commit: state.commit + 1,
      };
    case GOTO_PREV_COMMIT:
      if (!state.total) {
        throw new Error('invalid total commit');
      }
      if (state.commit - 1 <= 0) {
        return state; // silently fail
      }
      return {
        ...state,
        commit: state.commit - 1,
      };
    case SAVE_COMMIT_RESULT:
      return {
        ...state,
        result: action.result,
      };
    case GOTO_PREV_STEP:
      switch (state.step) {
        case 1:
        case 2:
          return {
            ...state,
            step: state.step - 1,
          };
        default:
          return {
            ...state,
            step: 0,
          };
      }
    case GOTO_NEXT_STEP:
      switch (state.step) {
        case 0:
        case 1:
          return {
            ...state,
            step: state.step + 1,
          };
        default:
          return {
            ...state,
            step: 0,
          };
      }
    default:
      return state;
  }
};

export {
  RepoReducer,
  validateRepo,
  getCurrentCommit,
  getNextCommit,
  getPrevCommit,

  submitRepo,
  submitCommit,

  prevStep,
  nextStep,
};