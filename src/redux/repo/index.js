import { addNotification as notify } from 'reapop';
// import { notify } from 'reapop';

const SAVE_REPO_DATA = 'save_repo_data';
const SAVE_TOTAL_COMMIT = 'save_total_commit';
const SAVE_CACHED_COMMIT_INDEX_UPDATE = 'save_cached_commit_index_update';
const GOTO_NEXT_COMMIT = 'goto_next_commit';
const GOTO_PREV_COMMIT = 'goto_prev_commit';
const SAVE_COMMIT_RESULT = 'save_commit_result';
const GOTO_PREV_STEP = 'goto_prev_step';
const GOTO_NEXT_STEP = 'goto_next_step';

const defaultState = {
  step: 0,
  owner: null,
  repo: null,
  branch: '',
  total: 0,
  commit: 0,
  cache: [],
  cacheIndex: 0,
};

const notifyError = (message) => {
  return notify({title: 'Error', status: 'error', message, position: 'tc'});
};

const saveRepoData = (owner, repo, branch = '') => {
  return {
    type: SAVE_REPO_DATA,
    owner,
    repo,
    branch,
  };
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

const saveCachedCommitIndexUpdate = (commit, cacheIndex) => {
  return {
    type: SAVE_CACHED_COMMIT_INDEX_UPDATE,
    commit,
    cacheIndex,
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

const submitRepo = (owner, repo, branch = '') => {
  return async (dispatch, getState) => {
    let state = getState().repo; // notice should be state.repo!
    if (state.step !== 0) {
      dispatch(notifyError('Wrong step!'));
      return;
    }

    try {
      let url = isProd() ?
        '/api/total_commit' :
        'http://localhost:8000/api/total_commit';

      let res = await fetch(`${url}?owner=${owner}&repo=${repo}&sha=${branch}`, {
        method: 'GET',
        credentials: isProd() ? 'same-site' : 'include'
      });
      if (!res.ok) {
        dispatch(notifyError('Cannot find repo/branch, or an error occurred'));
        return;
      }

      let json = await res.json();
      dispatch(saveRepoData(owner, repo, branch));
      dispatch(saveTotalCommit(json.count));
      dispatch(nextStep());
    } catch (err) {
      dispatch(notifyError('An error occurred'));
    }
  }
};

const submitCommitSelection = (commit) => {
  return async (dispatch, getState) => {
    let state = getState().repo;
    if (state.step !== 1) {
      dispatch(notifyError('Wrong step!'));
      return;
    }

    if (!state.total || commit <= 0 || commit > state.total) {
      dispatch(notifyError('Invalid commit!'));
      return;
    }

    if (state.commit && state.cacheIndex && state.cache) { // exists cache
      if ((state.commit+state.cacheIndex) >= commit && (state.commit-21+state.cacheIndex) < commit) { // check if it is in cache first
        // Cached version usable
        dispatch(saveCachedCommitIndexUpdate(commit, state.cacheIndex+state.commit-commit));
        dispatch(nextStep());
        return;
      }
    }

    try {
      let url = isProd() ?
        '/api/commit' :
        'http://localhost:8000/api/commit';

      let res = await fetch(`${url}?owner=${state.owner}&repo=${state.repo}&sha=${state.branch}&total=${state.total}&which=${commit}`, {
        method: 'GET',
        credentials: isProd() ? 'same-site' : 'include'
      });
      if (!res.ok) {
        dispatch(notifyError('Cannot get commit, or an error occurred'));
        return;
      }

      let json = await res.json();
      dispatch(saveCommitResult(json));
      dispatch(nextStep());
    } catch (err) {
      dispatch(notifyError('An error occurred'));
    }
  };
};

const browseCommit = (commit) => {
  return async (dispatch, getState) => {
    let state = getState().repo;
    if (state.step !== 2) {
      dispatch(notifyError('Wrong step!'));
      return;
    }

    if (!state.total || commit <= 0 || commit > state.total) {
      dispatch(notifyError('Invalid commit!'));
      return;
    }

    if (state.commit && state.cacheIndex && state.cache) { // exists cache
      if ((state.commit+state.cacheIndex) >= commit && (state.commit-21+state.cacheIndex) < commit) { // check if it is in cache first
        // Cached version usable
        dispatch(saveCachedCommitIndexUpdate(commit, state.cacheIndex+state.commit-commit));
        return;
      }
    }

    try {
      let url = isProd() ?
        '/api/commit' :
        'http://localhost:8000/api/commit';

      let res = await fetch(`${url}?owner=${state.owner}&repo=${state.repo}&sha=${state.branch}&total=${state.total}&which=${commit}`, {
        method: 'GET',
        credentials: isProd() ? 'same-site' : 'include'
      });
      if (!res.ok) {
        dispatch(notifyError('Cannot get commit, or an error occurred'));
        return;
      }

      let json = await res.json();
      dispatch(saveCommitResult(json));
    } catch (err) {
      dispatch(notifyError('An error occurred'));
    }
  };
};

const validateRepo = (owner, repo, branch = '') => {
  return async (dispatch) => {
    let res = {};
    try {
      let url = isProd() ?
        '/api/total_commit' :
        'http://localhost:8000/api/total_commit';

      res = await fetch(`${url}?owner=${owner}&repo=${repo}&sha=${branch}`, {
        method: 'GET',
        credentials: isProd() ? 'same-site' : 'include'
      });
      if (!res.ok) {
        dispatch(notifyError('Cannot find repo/branch, or an error occurred'));
        return;
      }

      let json = await res.json();
      dispatch(saveRepoData(owner, repo));
      dispatch(saveTotalCommit(json.count));
    } catch (err) {
      dispatch(notifyError('An error occurred'));
    }
  }
};

const getCurrentCommit = (commit) => {
  return async (dispatch, getState) => {
    let res = {};
    try {

      let state = getState().repo;
      let url = isProd() ?
        '/api/commit' :
        'http://localhost:8000/api/commit';

      res = await fetch(`${url}?owner=${state.owner}&repo=${state.repo}&sha=${state.branch}&total=${state.total}&which=${commit}`, {
        method: 'GET',
        credentials: isProd() ? 'same-site' : 'include'
      });
      if (!res.ok) {
        dispatch(notifyError('Cannot get commit or an error occurred'));
        return;
      }

      let json = await res.json();
      dispatch(saveCommitResult(json));
    } catch (err) {
      dispatch(notifyError('An error occurred'));
    }
  };
};

const getNextCommit = () => {
  return async (dispatch, getState) => {
    let state = getState().repo;

    if (!state.total || !state.commit || state.commit <= 0 || state.commit > state.total) {
      dispatch(notifyError('Invalid commit!'));
      return;
    }

    if (state.commit === state.total) {
      dispatch(notifyError('At last commit, cannot go forward'));
      return;
    }

    dispatch(nextCommit());
    dispatch(getCurrentCommit(state.commit));
  };
};

const getPrevCommit = () => {
  return async (dispatch, getState) => {
    let state = getState().repo;

    if (!state.total || !state.commit || state.commit <= 0 || state.commit > state.total) {
      dispatch(notifyError('Invalid commit!'));
      return;
    }

    if (state.commit === 1) {
      dispatch(notifyError('At first commit, cannot go forward'));
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
        branch: action.branch || '',
      };
    case SAVE_TOTAL_COMMIT:
      return {
        ...state,
        total: +action.total || 0,
      };
    case SAVE_CACHED_COMMIT_INDEX_UPDATE:
      return {
        ...state,
        commit: action.commit,
        cacheIndex: action.cacheIndex,
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
        commit: action.result.curr_commit,
        cacheIndex: action.result.curr_index,
        cache: action.result.commits,
      };
    case GOTO_PREV_STEP:
      switch (state.step) {
        case 1:
          return {
            ...state,
            step: 0,
            // Clear fields to avoid switch branch problems
            total: 0,
            commit: 0,
            cache: [],
            cacheIndex: 0,
          };
        case 2:
          return {
            ...state,
            step: 1,
          };
        default:
          return {
            ...state,
            step: 0,
            // Clear fields to avoid switch branch problems
            total: 0,
            commit: 0,
            cache: [],
            cacheIndex: 0,
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
  submitCommitSelection,
  browseCommit,

  prevStep,
  nextStep,
};