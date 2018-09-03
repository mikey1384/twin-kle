import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { Color } from 'constants/css';

DiscussionTopicLink.propTypes = {
  discussion: PropTypes.object.isRequired
};
export default function DiscussionTopicLink({ discussion }) {
  return (
    <Link
      style={{
        fontWeight: 'bold',
        color: Color.green()
      }}
      to={`/discussions/${discussion.id}`}
    >
      {discussion.title}
    </Link>
  );
}
