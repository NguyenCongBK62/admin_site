import homeReducer from "./containers/Home/reducer";
import loginReducer from "./containers/Login/reducer";
import layoutReducer from "./containers/Layout/reducer";
import storeMasterReducer from "./containers/StoreMaster/reducer";
import customerReducer from "./containers/CustomerList/reducer";
import storeMasterCreateUpdateReducer from "./containers/StoreMasterCreateUpdate/reducer";
import createReservationReducer from "containers/ReservationCreateUpdate/reducer";
import reservationListReducer from "containers/ReservationList/reducer";
import accountMasterReducer from "containers/AccountMaster/reducer";
import staffStoreMasterReducer from "containers/StaffStoreMaster/reducer";
import customItemsReducer from "containers/CustomItems/reducer";
import accountMasterCreateUpdateReducer from "containers/AccountMasterCreateUpdate/reducer";
import customItemCreateUpdateReducer from "containers/CustomItemCreateUpdate/reducer";
import staffStoreCreateUpdateReducer from "containers/StaffStoreMasterCreateUpdate/reducer";
import menuMasterReducer from "containers/MenuMaster/reducer";
import customerCreateReducer from "containers/CustomerCreateUpdate/reducer";
import tableMasterReducer from "containers/TableMaster/reducer";
import tableMasterCreateUpdateReducer from "containers/TableMasterCreateUpdate/reducer";
import menuMasterCreateUpdateReducer from "containers/MenuMasterCreateUpdate/reducer";
import reservedRouteMasterReducer from "containers/ReservedRouteMaster/reducer";
import reservedRouteMasterCreateUpdateReducer from "containers/ReservedRouteMasterCreateUpdate/reducer";
import lineConfigReducer from "containers/LineConfiguration/reducer";
import netReservationReducer from "containers/NetReservation/reducer";
import emailConfigReducer from "containers/EmailConfiguration/reducer";
import gnaviConfirmMailReducer from "containers/GnaviMailConfiguration/reducer";
import tabelogConfirmMailReducer from "containers/TabelogMailConfiguration/reducer";
import hotpepperConfirmMailReducer from "containers/HotpepperMailConfiguration/reducer";

import { combineReducers } from "redux";

const rootReducer = combineReducers({
  homeReducer,
  loginReducer,
  layoutReducer,
  storeMasterReducer,
  customerReducer,
  createReservationReducer,
  storeMasterCreateUpdateReducer,
  reservationListReducer,
  accountMasterReducer,
  staffStoreMasterReducer,
  customItemsReducer,
  accountMasterCreateUpdateReducer,
  customItemCreateUpdateReducer,
  staffStoreCreateUpdateReducer,
  customerCreateReducer,
  menuMasterReducer,
  tableMasterReducer,
  tableMasterCreateUpdateReducer,
  menuMasterCreateUpdateReducer,
  reservedRouteMasterReducer,
  reservedRouteMasterCreateUpdateReducer,
  lineConfigReducer,
  netReservationReducer,
  emailConfigReducer,
  gnaviConfirmMailReducer,
  tabelogConfirmMailReducer,
  hotpepperConfirmMailReducer,
});

export default rootReducer;
