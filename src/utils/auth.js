export default {
  setAuthToken(token) {
    localStorage.setItem("user_token", token);
  },
  getToken() {
    return localStorage.getItem("user_token");
  },
  setAuthProfile(profile) {
    const maxLength = profile.userName.length;
    const posBeginCode = profile.userName.indexOf("@");
    const identificationCode = profile.userName.substr(
      posBeginCode,
      maxLength - posBeginCode
    );
    const userName = profile.userName.substr(0, posBeginCode);
    const storeId = this.getKey("loginUser.storeId");
    localStorage.setItem("loginUser.name", profile.name);
    localStorage.setItem("loginUser.mail", profile.email);
    localStorage.setItem("loginUser.companyCode", profile.companyCode);
    localStorage.setItem("loginUser.userName", userName);
    localStorage.setItem("loginUser.indentificationCode", identificationCode);
    localStorage.setItem("loginUser.hasSms", profile.hasSms);
    localStorage.setItem("loginUser.hasReservation", profile.hasReservation);
    localStorage.setItem("loginUser.role", profile.role);
    localStorage.setItem("loginUser.StoreIdMaster", profile.storeId);
    if (!storeId) {
      localStorage.setItem("loginUser.storeId", profile.storeId);
    }
  },
  setKey(key, value) {
    return localStorage.setItem(key, value);
  },
  getKey(key = "loginUser") {
    return localStorage.getItem(key);
  },
  logout() {
    const deleteItems = [
      "user_token",
      "loginUser.name",
      "loginUser.mail",
      "loginUser.companyCode",
      "loginUser.userName",
      "loginUser.indentificationCode",
      "loginUser.hasSms",
      "loginUser.hasReservation",
      "loginUser.role",
      "loginUser.storeId",
    ];
    deleteItems.forEach((i) => localStorage.removeItem(i));
  },
};
