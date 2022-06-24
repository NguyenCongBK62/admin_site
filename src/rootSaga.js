import { accountMasterWatcher } from "containers/AccountMaster/saga";
import { accountMasterCreateUpdateWatcher } from "containers/AccountMasterCreateUpdate/saga";
import { customerCreateWatcher } from "containers/CustomerCreateUpdate/saga";
import { customerWatcher } from "containers/CustomerList/saga";
import { customItemCreateUpdateWatcher } from "containers/CustomItemCreateUpdate/saga";
import { customItemsWatcher } from "containers/CustomItems/saga";
import { emailConfigWatcher } from "containers/EmailConfiguration/saga";
import { homeWatcher } from "containers/Home/saga";
import { layoutWatcher } from "containers/Layout/saga";
import { lineConfigWatcher } from "containers/LineConfiguration/saga";
import { loginWatcher } from "containers/Login/saga";
import { menuMasterWatcher } from "containers/MenuMaster/saga";
import { menuMasterCreateUpdateWatcher } from "containers/MenuMasterCreateUpdate/saga";
import { orderCustomerListWatcher } from "containers/OrderCustomerList/saga";
import { createReservationWatcher } from "containers/ReservationCreateUpdate/saga";
import { reservationListWatcher } from "containers/ReservationList/saga";
import { reservedRouteMasterWatcher } from "containers/ReservedRouteMaster/saga";
import { reservedRouteMasterCreateUpdateWatcher } from "containers/ReservedRouteMasterCreateUpdate/saga";
import { staffStoreMasterWatcher } from "containers/StaffStoreMaster/saga";
import { staffStoreCreateUpdateWatcher } from "containers/StaffStoreMasterCreateUpdate/saga";
import { storeMasterWatcher } from "containers/StoreMaster/saga";
import { storeMasterCreateUpdateWatcher } from "containers/StoreMasterCreateUpdate/saga";
import { tableMasterWatcher } from "containers/TableMaster/saga";
import { tableMasterCreateUpdateWatcher } from "containers/TableMasterCreateUpdate/saga";
import { netReservationWatcher } from "containers/NetReservation/saga";
import { gnaviEmailConfigWatcher } from "containers/GnaviMailConfiguration/saga";
import { tabelogEmailConfigWatcher } from "containers/TabelogMailConfiguration/saga";
import { hotpepperEmailConfigWatcher } from "containers/HotpepperMailConfiguration/saga";
import { all } from "redux-saga/effects";

export default function* rootSaga() {
  yield all([
    homeWatcher(),
    loginWatcher(),
    layoutWatcher(),
    storeMasterWatcher(),
    customerWatcher(),
    customerCreateWatcher(),
    createReservationWatcher(),
    storeMasterCreateUpdateWatcher(),
    reservationListWatcher(),
    accountMasterWatcher(),
    staffStoreMasterWatcher(),
    customItemsWatcher(),
    accountMasterCreateUpdateWatcher(),
    customItemCreateUpdateWatcher(),
    staffStoreCreateUpdateWatcher(),
    menuMasterWatcher(),
    menuMasterCreateUpdateWatcher(),
    tableMasterWatcher(),
    tableMasterCreateUpdateWatcher(),
    orderCustomerListWatcher(),
    reservedRouteMasterWatcher(),
    reservedRouteMasterCreateUpdateWatcher(),
    lineConfigWatcher(),
    netReservationWatcher(),
    emailConfigWatcher(),
    gnaviEmailConfigWatcher(),
    tabelogEmailConfigWatcher(),
    hotpepperEmailConfigWatcher(),
  ]);
}
