import React from 'react';
import PropTypes from 'prop-types';
import EmailExists from './EmailExists';

EmailSection.propTypes = {
  account: PropTypes.object.isRequired
};

export default function EmailSection({ account }) {
  return (
    <div>
      {account.email || account.verifiedEmail ? (
        <EmailExists
          email={account.email}
          verifiedEmail={account.verifiedEmail}
          userId={account.id}
        />
      ) : (
        <div>You have no email</div>
      )}
    </div>
  );
}
