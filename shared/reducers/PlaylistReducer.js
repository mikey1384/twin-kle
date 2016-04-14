const defaultState = {
  allPlaylists: [],
  pinnedPlaylists: [],
  loadMoreButton: false,

  videoThumbsForModal: [],
  loadMoreButtonForModal: false,
  allVideosLoadedForModal: false,

  addPlaylistModalShown: false,
  editPlaylistModalType: null,
  selectedModalThumbs: [],

  selectPlaylistsToPinModalShown: false,
  loadMorePlaylistsToPinButton: false,
  playlistsToPin: []
};

let defaultPlaylists,
    defaultPinnedPlaylists

export default function PlaylistReducer(state = defaultState, action) {
  let loadMoreButtonForModal = false;
  let allVideosLoadedForModal = false;
  let loadMorePlaylistsToPinButton = false;
  switch(action.type) {
    case 'GET_PLAYLISTS':
      let loadMoreButton = false;
      if (action.res.data.playlists.length > 3) {
        action.res.data.playlists.pop();
        loadMoreButton = true;
      }
      if (action.initialRun) {
        defaultPlaylists = action.res.data.playlists;
        return {
          ...state,
          allPlaylists: defaultPlaylists,
          loadMoreButton
        }
      } else {
        return {
          ...state,
          allPlaylists: state.allPlaylists.concat(action.res.data.playlists),
          loadMoreButton
        };
      }
    case 'GET_PINNED_PLAYLISTS':
      defaultPinnedPlaylists = action.res.data.playlists;
      return {
        ...state,
        pinnedPlaylists: defaultPinnedPlaylists
      }
    case 'GET_VIDEOS_FOR_MODAL':
      if (action.res.data.length > 18) {
        action.res.data.pop();
        loadMoreButtonForModal = true;
      } else {
        allVideosLoadedForModal = true;
      }
      if (action.initialRun) {
        return {
          ...state,
          videoThumbsForModal: action.res.data,
          loadMoreButtonForModal,
          allVideosLoadedForModal
        }
      } else {
        return {
          ...state,
          videoThumbsForModal: state.videoThumbsForModal.concat(action.res.data),
          loadMoreButtonForModal,
          allVideosLoadedForModal
        }
      }
    case 'ADD_PL_MODAL_OPEN':
      return {
        ...state,
        addPlaylistModalShown: true
      };
    case 'ADD_PL_MODAL_CLOSE':
      return {
        ...state,
        addPlaylistModalShown: false
      }
    case 'SELECT_PL_TO_PIN_OPEN':
      if (action.res.data.error) {
        console.error(action.res.data.error);
        return state;
      }
      if (action.res.data.result.length > 10) {
        action.res.data.result.pop();
        loadMorePlaylistsToPinButton = true;
      }
      let playlistsToPin = action.res.data.result.map(item => {
        return {
          title: item.title,
          id: item.id
        }
      })
      return {
        ...state,
        playlistsToPin,
        loadMorePlaylistsToPinButton,
        selectPlaylistsToPinModalShown: true
      }
    case 'SELECT_PL_TO_PIN_CLOSE':
      return {
        ...state,
        loadMorePlaylistsToPinButton: false,
        selectPlaylistsToPinModalShown: false
      }
    case 'LOAD_MORE_PLAYLIST_LIST':
      if (action.res.data.error) {
        console.error(action.res.data.error);
        return state;
      }
      if (action.res.data.result.length > 10) {
        action.res.data.result.pop();
        loadMorePlaylistsToPinButton = true;
      }
      let morePlaylistsToPin = action.res.data.result.map(item => {
        return {
          title: item.title,
          id: item.id
        }
      })
      return {
        ...state,
        playlistsToPin: state.playlistsToPin.concat(morePlaylistsToPin),
        loadMorePlaylistsToPinButton
      }
    case 'CHANGE_PINNED_PLAYLISTS':
      if (action.res.data.error) {
        console.error(action.res.data.error);
        return state;
      }
      if (action.res.data.playlists) {
        defaultPinnedPlaylists = action.res.data.playlists;
        return {
          ...state,
          pinnedPlaylists: defaultPinnedPlaylists
        }
      }
      return state;
    case 'CHANGE_PL_VIDS_MODAL_OPEN':
      if (action.res.data.length > 18) {
        action.res.data.pop();
        loadMoreButtonForModal = true;
      } else {
        allVideosLoadedForModal = true;
      }
      return {
        ...state,
        editPlaylistModalType: action.modalType,
        videoThumbsForModal: action.res.data,
        loadMoreButtonForModal,
        allVideosLoadedForModal
      }
    case 'REORDER_PL_VIDS_MODAL_OPEN':
      const videoThumbs = action.playlistVideos.map(video => {
        return {
          id: video.videoid,
          title: video.video_title,
          uploadername: video.video_uploader,
          videocode: video.videocode
        }
      })
      return {
        ...state,
        editPlaylistModalType: action.modalType,
        videoThumbsForModal: videoThumbs
      }
    case 'UPLOAD_PLAYLIST':
      let loadMoreButtonDisplayed = false;
      if (defaultPlaylists.length > 2) {
        defaultPlaylists.pop();
        defaultPlaylists = [action.res.data.result].concat(defaultPlaylists);
        if (!state.loadMoreButton) loadMoreButtonDisplayed = true;
      } else {
        defaultPlaylists = [action.res.data.result].concat(state.allPlaylists);
      }
      return {
        ...state,
        allPlaylists: [action.res.data.result].concat(state.allPlaylists),
        loadMoreButton: loadMoreButtonDisplayed,
        addPlaylistModalShown: false
      }
    case 'EDIT_PLAYLIST_TITLE':
    if (action.res.data.result) {
      defaultPlaylists = state.allPlaylists.map(playlist => {
        if (playlist.id === action.playlistId) {
          playlist.title = action.res.data.result
        }
        return playlist;
      })
      defaultPinnedPlaylists = state.pinnedPlaylists.map(playlist => {
        if (playlist.id === action.playlistId) {
          playlist.title = action.res.data.result
        }
        return playlist;
      })
      return {
        ...state,
        pinnedPlaylists: defaultPinnedPlaylists,
        allPlaylists: defaultPlaylists
      }
    } else {
      console.error(action.res.data.error);
      return state;
    }
    case 'CHANGE_PLAYLIST_VIDEOS':
      if (action.res.data.error) {
        let { error } = action.res.data;
        console.error(error);
        return state;
      }
      if (action.res.data.result) {
        let { result } = action.res.data;
        defaultPlaylists = state.allPlaylists.map(playlist => {
          if (playlist.id === action.playlistId) {
            playlist.playlist = result;
          }
          return playlist;
        })
        defaultPinnedPlaylists = state.pinnedPlaylists.map(playlist => {
          if (playlist.id === action.playlistId) {
            playlist.playlist = result;
          }
          return playlist;
        })
        return {
          ...state,
          pinnedPlaylists: defaultPinnedPlaylists,
          allPlaylists: defaultPlaylists
        }
      }
    case 'DELETE_PLAYLIST':
      if (action.res.data.success) {
        defaultPlaylists = state.allPlaylists.filter(playlist => {
          if (playlist.id === action.playlistId) {
            return false;
          }
          return true;
        })
        defaultPinnedPlaylists = state.pinnedPlaylists.filter(playlist => {
          if (playlist.id === action.playlistId) {
            return false;
          }
          return true;
        })
        return {
          ...state,
          pinnedPlaylists: defaultPinnedPlaylists,
          allPlaylists: defaultPlaylists
        }
      }
      return state;
    case 'RESET_PL_STATE':
      return {
        allPlaylists: defaultPlaylists,
        pinnedPlaylists: defaultPinnedPlaylists,
        loadMoreButton: false,

        videoThumbsForModal: [],
        loadMoreButtonForModal: false,
        allVideosLoadedForModal: false,

        addPlaylistModalShown: false,
        editPlaylistModalType: null,
        selectedModalThumbs: [],

        selectPlaylistsToPinModalShown: false,
        playlistsToPin: []
      }
    case 'RESET_PL_MODAL_STATE':
      return {
        videoThumbsForModal: [],
        loadMoreButtonForModal: false,
        allVideosLoadedForModal: false,

        addPlaylistModalShown: false,
        editPlaylistModalType: null,
        selectedModalThumbs: [],

        selectPlaylistsToPinModalShown: false,
        loadMorePlaylistsToPinButton: false,
        playlistsToPin: []
      }
    default:
      return state;
  }
}
