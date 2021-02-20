import React from "react";
import PropTypes from "prop-types";

import { connect } from "react-redux";

const Alert = ({ alert }) =>
  alert !== null &&
  alert.length > 0 &&
  alert.map((alert) => (
    <div key={alert.id} className={`alert alert-${alert.alertType}`}>
      {alert.msg}
    </div>
  ));

const mapStateToProps = (state) => ({
  alert: state.alert,
});

Alert.propTypes = {
  alert: PropTypes.array.isRequired,
};

export default connect(mapStateToProps)(Alert);