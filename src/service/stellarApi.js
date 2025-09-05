import { getRequest, postRequest } from "./axiosClient";

const STELLAR_BASE_URL = import.meta.env.VITE_STELLAR_BASE_URL;

export const logIn = async (logInPayload) => {
  const logInPostFix = import.meta.env.VITE_LOGIN_POST_FIX;
  const logInUrl = STELLAR_BASE_URL + logInPostFix;
  return await postRequest(logInUrl, logInPayload);
};

export const signUp = async (signUpPayload) => {
  const signUpPostFix = import.meta.env.VITE_SIGNUP_POST_FIX;
  const signUpUrl = STELLAR_BASE_URL + signUpPostFix;
  return await postRequest(signUpUrl, signUpPayload);
};

export const forgotPassword = async (forgotPasswordPayload) => {
  const forgotPasswordPostFix = import.meta.env.VITE_FORGOT_PASSWORD_POST_FIX;
  const forgotPasswordUrl = STELLAR_BASE_URL + forgotPasswordPostFix;
  return await postRequest(forgotPasswordUrl, forgotPasswordPayload);
};

export const resetPassword = async (resetPasswordPayload) => {
  const resetPasswordPostFix = import.meta.env.VITE_RESET_PASSWORD_POST_FIX;
  const resetPasswordUrl = STELLAR_BASE_URL + resetPasswordPostFix;
  return await postRequest(resetPasswordUrl, resetPasswordPayload);
};

export const verifyEmail = async (verifyEmailPayload) => {
  const verifyEmailPostFix = import.meta.env.VITE_VERIFY_EMAIL_POST_FIX;
  const verifyEmailUrl = STELLAR_BASE_URL + verifyEmailPostFix;
  return await postRequest(verifyEmailUrl, verifyEmailPayload);
};

export const emailVerified = async (emailVerifiedPayload) => {
  const emailVerifiedPostFix = import.meta.env.VITE_EMAIL_VERIFIED_POST_FIX;
  const emailVerifiedURl = STELLAR_BASE_URL + emailVerifiedPostFix;
  return await postRequest(emailVerifiedURl, emailVerifiedPayload);
};

export const getSummaryData = async (summaryDataPayload) => {
  const summaryDataPostFix = import.meta.env.VITE_SUMMARY_DATA_POST_FIX;
  const summaryDataUrl = `${STELLAR_BASE_URL}${summaryDataPostFix}`;
  return await getRequest(summaryDataUrl, summaryDataPayload);
};

export const getSummaryDataMain = async (summaryDataPayload) => {
  const summaryDataMainPostFix = import.meta.env
    .VITE_SUMMARY_DATA_MAIN_POST_FIX;
  const summaryDataMainUrl = `${STELLAR_BASE_URL}${summaryDataMainPostFix}`;
  return await getRequest(summaryDataMainUrl, summaryDataPayload);
};

export const getOptionTradeDetails = async (optionTradePayload) => {
  const optionTradePostFix = import.meta.env.VITE_OPTION_TRADE_DETAILS_POST_FIX;
  const optionTradeUrl = `${STELLAR_BASE_URL}${optionTradePostFix}`;
  return await getRequest(optionTradeUrl, optionTradePayload);
};

export const getChartBarData = async (payload) => {
  const getChartBarDataPostFix = import.meta.env
    .VITE_GET_CHART_BAR_DATA_POST_FIX;
  const url = `${STELLAR_BASE_URL}${getChartBarDataPostFix}`;
  return await getRequest(url, payload);
};

export const getChartPieData = async (payload) => {
  const getChartPieDataPostFix = import.meta.env
    .VITE_GET_CHART_PIE_DATA_POST_FIX;
  const url = `${STELLAR_BASE_URL}${getChartPieDataPostFix}`;
  return await getRequest(url, payload);
};

export const getChartBubbleData = async (payload) => {
  const getChartBubbleDataPostFix = import.meta.env
    .VITE_GET_CHART_BUBBLE_DATA_POST_FIX;
  const url = `${STELLAR_BASE_URL}${getChartBubbleDataPostFix}`;
  return await getRequest(url, payload);
};

export const getChartBubbleExpiryData = async (payload) => {
  const getChartBubbleExpiryDataPostFix = import.meta.env
    .VITE_GET_CHART_BUBBLE_EXPIRY_DATA_POST_FIX;
  const url = `${STELLAR_BASE_URL}${getChartBubbleExpiryDataPostFix}`;
  return await getRequest(url, payload);
};

export const signout = async () => {
  const signOutPostFix = import.meta.env.VITE_SIGN_OUT_POST_FIX;
  const url = `${STELLAR_BASE_URL}${signOutPostFix}`;
  return await postRequest(url);
};

export const getAipowerAlerts = async (AipowerAlertspayload) => {
  const getAipowerAlertsPostFix = import.meta.env.VITE_GET_AI_POWER_ALERTS;
  const getAipowerAlertsUrl = `${STELLAR_BASE_URL}${getAipowerAlertsPostFix}`;
  return await getRequest(getAipowerAlertsUrl, AipowerAlertspayload);
};
export const getMagicOptionData = async (magicOptionDataPayload) => {
  const getMagicOptionDataPostFIx = import.meta.env.VITE_GET_MAGIC_OPTION_DATA;
  const getMagicOptionDataUrl = `${STELLAR_BASE_URL}${getMagicOptionDataPostFIx}`;
  return await getRequest(getMagicOptionDataUrl, magicOptionDataPayload);
};
export const getUnusualOptionData = async (unusualOptionDataPayload) => {
  const getUnusualOptionDataPostFIx = import.meta.env
    .VITE_GET_UNUSUAL_OPTION_DATA;
  const getUnusualOpyionDataUrl = `${STELLAR_BASE_URL}${getUnusualOptionDataPostFIx}`;
  return await getRequest(getUnusualOpyionDataUrl, unusualOptionDataPayload);
};
export const getUltraHighVolumeOptionData = async (
  ultraHighVolumeOptionDataPayload
) => {
  const getUltraHighVolumeOptionDataPostFIx = import.meta.env
    .VITE_GET_ULTRA_HIGH_VOLUME_OPTION_DATA;
  const getUltraHighVolumeOptionDataUrl = `${STELLAR_BASE_URL}${getUltraHighVolumeOptionDataPostFIx}`;
  return await getRequest(
    getUltraHighVolumeOptionDataUrl,
    ultraHighVolumeOptionDataPayload
  );
};
