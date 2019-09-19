import { initialUserState } from '../initialStates';

export default function UserReducer(state, action) {
  switch (action.type) {
    case 'CHANGE_DEFAULT_FILTER':
      return {
        ...state,
        searchFilter: action.filter
      };
    case 'CHANGE_PROFILE_THEME':
      return {
        ...state,
        profileTheme: action.theme,
        profile: {
          ...state.profile,
          profileTheme: action.theme
        }
      };
    case 'CHANGE_XP':
      return {
        ...state,
        twinkleXP: action.xp,
        rank: action.rank
      };
    case 'CLEAR_USER_SEARCH':
      return {
        ...state,
        searchedProfiles: []
      };
    case 'CLOSE_SIGNIN_MODAL':
      return {
        ...state,
        signinModalShown: false
      };
    case 'DELETE_STATUS_MSG':
      return {
        ...state,
        profile: {
          ...state.profile,
          statusMsg: '',
          statusColor: ''
        },
        profiles: state.profiles.map(profile => ({
          ...profile,
          ...(profile.id === action.userId
            ? { statusMsg: '', statusColor: '' }
            : {})
        }))
      };
    case 'EDIT_BIO':
      return {
        ...state,
        profile: {
          ...state.profile,
          ...action.bio
        },
        profiles: state.profiles.map(profile => ({
          ...profile,
          ...(profile.id === action.userId ? action.bio : {})
        }))
      };
    case 'EDIT_PROFILE_PICTURE':
      return {
        ...state,
        profilePicId: action.data.imageId,
        profile: {
          ...state.profile,
          profilePicId:
            state.profile.id === action.data.userId
              ? action.data.imageId
              : state.profile.profilePicId
        },
        profiles: state.profiles.map(profile => ({
          ...profile,
          profilePicId:
            profile.id === action.data.userId
              ? action.data.imageId
              : profile.profilePicId
        }))
      };
    case 'EDIT_STATUS_MSG':
      return {
        ...state,
        profile: {
          ...state.profile,
          statusMsg: action.statusMsg,
          statusColor: action.statusColor
        },
        profiles: state.profiles.map(profile => ({
          ...profile,
          ...(profile.id === action.userId
            ? { statusMsg: action.statusMsg, statusColor: action.statusColor }
            : {})
        }))
      };
    case 'INIT_SESSION':
      return {
        ...state,
        ...action.data,
        isCreator: action.data.userType === 'creator'
      };
    case 'LOAD_USERS': {
      let loadMoreButton = false;
      if (action.data.length > 20) {
        action.data.pop();
        loadMoreButton = true;
      }
      return {
        ...state,
        profiles: action.data,
        loadMoreButton
      };
    }
    case 'LOAD_MORE_USERS': {
      let loadMoreButton = false;
      if (action.data.length > 5) {
        action.data.pop();
        loadMoreButton = true;
      }
      return {
        ...state,
        profiles: state.profiles.concat(action.data),
        loadMoreButton
      };
    }
    case 'LOGOUT':
      return {
        ...initialUserState,
        profile: state.profile,
        profiles: state.profiles,
        searchedProfiles: state.searchedProfiles
      };
    case 'LOGOUT_AND_OPEN_SIGNIN_MODAL':
      return {
        ...initialUserState,
        signinModalShown: true,
        profile: state.profile,
        profiles: state.profiles,
        searchedProfiles: state.searchedProfiles
      };
    case 'SEARCH_USERS':
      return {
        ...state,
        searchedProfiles: action.users
      };
    case 'USER_NOT_EXIST':
      return {
        ...state,
        profile: {
          unavailable: true
        }
      };
    default:
      return state;
  }
}

/*
export function UserReducerClone(state = defaultState, action) {
  switch (action.type) {
    case USER.SHOW_PROFILE:
      return {
        ...state,
        profile: action.data
      };
    case USER.LOGIN:
      return {
        ...state,
        ...action.data,
        loggedIn: true,
        signinModalShown: false,
        isCreator: action.data.userType === 'creator'
      };
    case USER.SET_GREETING:
      return {
        ...state,
        profile: {
          ...state.profile,
          greeting: action.greeting
        }
      };
    case USER.SET_PROFILE_INFO:
      return {
        ...state,
        ...action.data,
        profile: {
          ...state.profile,
          ...action.data
        }
      };
    case USER.SIGNUP:
      return {
        ...state,
        ...action.data,
        loggedIn: true,
        signinModalShown: false
      };
    case USER.OPEN_SIGNIN_MODAL:
      return {
        ...state,
        signinModalShown: true
      };
    case USER.SHOW_PROFILE_COMMENTS:
      return {
        ...state,
        profiles: state.profiles.map(profile => ({
          ...profile,
          commentsShown:
            profile.id === action.profileId
              ? action.shown
              : profile.commentsShown
        }))
      };
    case USER.TOGGLE_HIDE_WATCHED:
      return {
        ...state,
        hideWatched: action.hideWatched
      };
    case USER.UNMOUNT_PROFILE:
      return {
        ...state,
        profile: {}
      };
    default:
      return state;
  }
}
*/
