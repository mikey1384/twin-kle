import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Route, Switch } from 'react-router-dom';
import Notification from 'components/Notification';
import ProfileWidget from 'components/ProfileWidget';
import HomeMenuItems from 'components/HomeMenuItems';
import { container, Left, Center, Right } from './Styles';
import Loading from 'components/Loading';
import ImageEditModal from 'components/Modals/ImageEditModal';
import AlertModal from 'components/Modals/AlertModal';
import { uploadProfilePic } from 'redux/actions/UserActions';
import ErrorBoundary from 'components/Wrappers/ErrorBoundary';
import loadable from 'loadable-components';
const People = loadable(() => import('./People'), {
  LoadingComponent: Loading
});
const Stories = loadable(() => import('./Stories'), {
  LoadingComponent: Loading
});

class Home extends Component {
  static propTypes = {
    history: PropTypes.object.isRequired,
    location: PropTypes.object.isRequired,
    uploadProfilePic: PropTypes.func.isRequired
  };

  state = {
    alertModalShown: false,
    imageEditModalShown: false,
    imageUri: null,
    processing: false
  };

  render() {
    const { history, location } = this.props;
    const {
      alertModalShown,
      imageEditModalShown,
      imageUri,
      processing
    } = this.state;
    return (
      <ErrorBoundary>
        <div className={container}>
          <div className={Left}>
            <ProfileWidget
              history={history}
              showAlert={() => this.setState({ alertModalShown: true })}
              loadImage={upload =>
                this.setState({
                  imageEditModalShown: true,
                  imageUri: upload.target.result
                })
              }
            />
            <HomeMenuItems
              style={{ marginTop: '1rem' }}
              history={history}
              location={location}
            />
          </div>
          <div className={Center}>
            <Switch>
              <Route
                path="/users"
                render={({ history }) => <People history={history} />}
              />
              <Route
                exact
                path="/"
                render={({ history }) => <Stories history={history} />}
              />
            </Switch>
          </div>
          <Notification className={Right} />
          {imageEditModalShown && (
            <ImageEditModal
              imageUri={imageUri}
              onHide={() =>
                this.setState({
                  imageUri: null,
                  imageEditModalShown: false,
                  processing: false
                })
              }
              processing={processing}
              onConfirm={this.uploadImage}
            />
          )}
          {alertModalShown && (
            <AlertModal
              title="Image is too large (limit: 5mb)"
              content="Please select a smaller image"
              onHide={() => this.setState({ alertModalShown: false })}
            />
          )}
        </div>
      </ErrorBoundary>
    );
  }

  uploadImage = async image => {
    const { uploadProfilePic } = this.props;
    this.setState({
      processing: true
    });
    await uploadProfilePic(image);
    this.setState({
      imageUri: null,
      processing: false,
      imageEditModalShown: false
    });
  };
}

export default connect(
  null,
  { uploadProfilePic }
)(Home);
