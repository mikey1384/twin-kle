import PropTypes from 'prop-types'
import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Link, Route } from 'react-router-dom'
import Profile from './Profile'
import People from './People'
import Stories from './Stories'
import Notification from 'containers/Notification'
import ProfileWidget from './ProfileWidget'
import { Color } from 'constants/css'
import { Container, Left, MenuItems } from './Styles'

class Home extends Component {
  static propTypes = {
    history: PropTypes.object,
    location: PropTypes.object,
    username: PropTypes.string
  }

  render() {
    const { history, location, username: myUsername } = this.props
    let username = ''
    if (location.pathname.includes('/users/')) {
      username = location.pathname.split('/')[2]
    }
    return (
      <Container>
        <Left>
          <ProfileWidget history={history} />
          <MenuItems className="unselectable">
            <Route
              path="/"
              exact
              children={({ match }) => (
                <li
                  className={match && 'active'}
                  onClick={() => history.push('/')}
                >
                  <a>
                    <img alt="Thumbnail" src="/img/feed.png" />
                  </a>
                  <a>Stories</a>
                </li>
              )}
            />
            <Route
              exact
              path="/users"
              children={({ match }) => (
                <li
                  className={
                    match || (username && myUsername && username !== myUsername)
                      ? 'active'
                      : ''
                  }
                  onClick={() => history.push('/users')}
                >
                  <div>
                    <a>
                      <img
                        alt="Thumbnail"
                        style={{ width: '3vw', height: '3vw' }}
                        src="/img/people.png"
                      />
                    </a>
                  </div>
                  <a>People</a>
                </li>
              )}
            />
          </MenuItems>
        </Left>
        <div className="center">
          <Route exact path="/" component={Stories} />
          <Route path="/users/:username" component={Profile} />
          <Route exact path="/users" component={People} />
        </div>
        <Notification className="right" style={{ right: '1rem' }}>
          <div
            style={{
              marginBottom: '0px',
              textAlign: 'center',
              padding: '1rem',
              background: '#fff',
              border: `1px solid #eeeeee`,
              borderRadius: '5px'
            }}
          >
            <p
              style={{
                fontSize: '3rem',
                fontWeight: 'bold',
                marginBottom: '0px'
              }}
            >
              <span style={{ color: Color.logoGreen }}>Twin</span>
              <span style={{ color: Color.logoBlue }}>kle</span>&nbsp;
              <span style={{ color: Color.orange }}>XP!</span>
            </p>
            <Link
              to="/twinklexp"
              style={{ fontSize: '1.5rem', fontWeight: 'bold' }}
            >
              Click here to learn how to earn them
            </Link>
          </div>
        </Notification>
      </Container>
    )
  }
}

export default connect(state => ({
  realName: state.UserReducer.realName,
  username: state.UserReducer.username,
  userId: state.UserReducer.userId,
  profilePicId: state.UserReducer.profilePicId
}))(Home)
