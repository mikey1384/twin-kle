import request from 'axios'
import { handleError } from '../constants'
import { URL } from 'constants/URL'
import CONTENT from '../constants/Content'

const API_URL = `${URL}/content`

export const clearSearchResults = () => ({
  type: CONTENT.CLEAR_SEARCH_RESULTS
})

export const searchContent = text => dispatch =>
  request
    .get(`${API_URL}/search?query=${text}`)
    .then(response =>
      dispatch({
        type: CONTENT.SEARCH,
        data: response.data
      })
    )
    .catch(error => {
      console.error(error.response || error)
      handleError(error, dispatch)
    })
