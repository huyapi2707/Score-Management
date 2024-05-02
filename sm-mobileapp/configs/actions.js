const turnOffAlert = () => {
  return {
    type: "ALERT_OFF",
  };
};

const turnOnIndicator = () => {
  return {
    type: "INDICATOR_ON",
  };
};

const turnOffIndicator = () => {
  return {
    type: "INDICATOR_OFF",
  };
};

const setErrorAlert = (payload) => {
  return {
    type: "ALERT_ERROR",
    payload: payload,
  };
};

const setWarningAlert = (payload) => {
  return {
    type: "ALERT_WARNING",
    payload: payload,
  };
};

const setSuccessAlert = (payload) => {
  return {
    type: "ALERT_SUCCESS",
    payload: payload,
  };
};

export {
  turnOffAlert,
  setErrorAlert,
  setSuccessAlert,
  setWarningAlert,
  turnOffIndicator,
  turnOnIndicator,
};
