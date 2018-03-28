const types = {
  CLEAR: 'CLEAR',
  DELETE_COMMENT: 'DELETE_COMMENT',
  DELETE_CONTENT: 'DELETE_CONTENT',
  EDIT_COMMENT: 'EDIT_COMMENT',
  EDIT_CONTENT: 'EDIT_CONTENT',
  EDIT_DISCUSSION: 'EDIT_DISCUSSION',
  EDIT_QUESTION: 'EDIT_QUESTION',
  LIKE_COMMENT: 'LIKE_COMMENT',
  LIKE_CONTENT: 'LIKE_CONTENT',
  LIKE_QUESTION: 'LIKE_QUESTION',
  LIKE_TARGET_COMMENT: 'LIKE_TARGET_COMMENT',
  LOAD: 'LOAD',
  LOAD_MORE: 'LOAD_MORE',
  LOAD_MORE_COMMENTS: 'LOAD_MORE_COMMENTS',
  LOAD_MORE_REPLIES: 'LOAD_MORE_REPLIES',
  LOAD_DETAIL: 'LOAD_DETAIL',
  SHOW_COMMENTS: 'SHOW_COMMENTS',
  STAR_VIDEO: 'STAR_VIDEO',
  UPLOAD_COMMENT: 'UPLOAD_COMMENT',
  UPLOAD_CONTENT: 'UPLOAD_CONTENT',
  UPLOAD_REPLY: 'UPLOAD_REPLY',
  UPLOAD_TC_COMMENT: 'UPLOAD_TC_COMMENT'
}

for (let key in types) {
  types[key] = `${types[key]}_FEED`
}

export default types
