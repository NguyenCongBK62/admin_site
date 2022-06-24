import PrivateRoute from "components/PrivateRoute";
import AccountMaster from "containers/AccountMaster";
import AccountMasterCreateUpdate from "containers/AccountMasterCreateUpdate";
import CustomerCreateUpdate from "containers/CustomerCreateUpdate";
import CustomerList from "containers/CustomerList";
import CustomItemCreateUpdate from "containers/CustomItemCreateUpdate";
import CustomItems from "containers/CustomItems";
import EmailConfiguration from "containers/EmailConfiguration";
import EmailConfigurationConfirm from "containers/EmailConfigurationConfirm";
import GnaviMailConfiguration from "containers/GnaviMailConfiguration";
import TabelogMailConfiguration from "containers/TabelogMailConfiguration";
import HotpepperMailConfiguration from "containers/HotpepperMailConfiguration";
import Home from "containers/Home";
import LineConfiguration from "containers/LineConfiguration";
import Login from "containers/Login";
import MenuMaster from "containers/MenuMaster";
import MenuMasterCreateUpdate from "containers/MenuMasterCreateUpdate";
import NetReservation from "containers/NetReservation";
import NetReserveConfirm from "containers/NetReserveConfirm";
import NotFound from "containers/NotFound";
import OrderCustomerList from "containers/OrderCustomerList";
import ReservationCreateUpdate from "containers/ReservationCreateUpdate";
import ReservationList from "containers/ReservationList";
import ReservedRouteMaster from "containers/ReservedRouteMaster";
import ReservedRouteMasterCreateUpdate from "containers/ReservedRouteMasterCreateUpdate";
import StaffStoreMaster from "containers/StaffStoreMaster";
import StaffStoreMasterCreateUpdate from "containers/StaffStoreMasterCreateUpdate";
import StoreMaster from "containers/StoreMaster";
import StoreMasterCreateUpdate from "containers/StoreMasterCreateUpdate";
import TableMaster from "containers/TableMaster";
import TableMasterCreateUpdate from "containers/TableMasterCreateUpdate";
import React, { Component } from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";

const mapStateToProps = (state) => ({
  hostMailConfigType: state.emailConfigReducer.hostMailConfigType,
});

class RouteApp extends Component {
  render() {
    return (
      <Router>
        <Switch>
          <Route path="/rsv/" component={NetReservation} exact />
          <Route path="/rsv/confirm" component={NetReserveConfirm} exact />
          <Route path="/login" component={Login} exact />
          <PrivateRoute path="/" component={Home} exact />
          <PrivateRoute
            path="/reservation/create"
            component={ReservationCreateUpdate}
            exact
          />
          <PrivateRoute
            path="/reservation/edit/:id"
            component={ReservationCreateUpdate}
            exact
          />
          <PrivateRoute path="/customer/list" component={CustomerList} exact />
          <PrivateRoute
            path="/customer/create"
            component={CustomerCreateUpdate}
            exact
          />
          <PrivateRoute
            path="/customer/edit/:id"
            component={CustomerCreateUpdate}
            exact
          />
          <PrivateRoute
            path="/reservation/list"
            component={ReservationList}
            exact
          />
          <PrivateRoute
            path="/reservation/list/:searchText"
            component={ReservationList}
            exact
          />
          <PrivateRoute
            path="/settings/store-master"
            component={StoreMaster}
            exact
          />
          <PrivateRoute
            path="/settings/store-master/create"
            component={StoreMasterCreateUpdate}
            exact
          />
          <PrivateRoute
            path="/settings/store-master/edit/:id"
            component={StoreMasterCreateUpdate}
            exact
          />
          <PrivateRoute
            path="/settings/account-master"
            component={AccountMaster}
            exact
          />
          <PrivateRoute
            path="/settings/staff-store-master"
            component={StaffStoreMaster}
            exact
          />
          <PrivateRoute
            path="/settings/staff-store-master/create"
            component={StaffStoreMasterCreateUpdate}
            exact
          />
          <PrivateRoute
            path="/settings/staff-store-master/edit/:id"
            component={StaffStoreMasterCreateUpdate}
            exact
          />
          <PrivateRoute
            path="/customer/custom-item/list"
            component={CustomItems}
            exact
          />
          <PrivateRoute
            path="/customer/display-order"
            component={OrderCustomerList}
            exact
          />
          <PrivateRoute
            path="/customer/custom-item/create"
            component={CustomItemCreateUpdate}
            exact
          />
          <PrivateRoute
            path="/customer/custom-item/edit/:id"
            component={CustomItemCreateUpdate}
            exact
          />
          <PrivateRoute
            path="/settings/account-master/create"
            component={AccountMasterCreateUpdate}
            exact
          />
          <PrivateRoute
            path="/settings/account-master/edit/:id"
            component={AccountMasterCreateUpdate}
            exact
          />
          <PrivateRoute
            path="/settings/menu-master"
            component={MenuMaster}
            exact
          />
          <PrivateRoute
            path="/settings/menu-master/create"
            component={MenuMasterCreateUpdate}
            exact
          />
          <PrivateRoute
            path="/settings/table-master/create"
            component={TableMasterCreateUpdate}
            exact
          />
          <PrivateRoute
            path="/settings/table-master/edit/:id"
            component={TableMasterCreateUpdate}
            exact
          />
          <PrivateRoute
            path="/settings/menu-master/edit/:id"
            component={MenuMasterCreateUpdate}
            exact
          />
          <PrivateRoute
            path="/settings/reservation-route-master"
            component={ReservedRouteMaster}
            exact
          />
          <PrivateRoute
            path="/settings/reservation-route-master/create"
            component={ReservedRouteMasterCreateUpdate}
            exact
          />
          <PrivateRoute
            path="/settings/reservation-route-master/edit/:id"
            component={ReservedRouteMasterCreateUpdate}
            exact
          />
          <PrivateRoute
            path="/settings/table-master"
            component={TableMaster}
            exact
          />
          <PrivateRoute
            path="/line-configuration"
            component={LineConfiguration}
            exact
          />
          <PrivateRoute
            path="/email-configuration"
            component={EmailConfiguration}
            exact
          />
          <PrivateRoute
            path="/email-configuration/gnavi-mail-configuration"
            component={
              this.props.hostMailConfigType === "gnavi"
                ? GnaviMailConfiguration
                : NotFound
            }
            exact
          />
          <PrivateRoute
            path="/email-configuration/tabelog-mail-configuration"
            component={
              this.props.hostMailConfigType === "tabelog"
                ? TabelogMailConfiguration
                : NotFound
            }
            exact
          />
          <PrivateRoute
            path="/email-configuration/hotpepper-mail-configuration"
            component={
              this.props.hostMailConfigType === "hotpepper"
                ? HotpepperMailConfiguration
                : NotFound
            }
            exact
          />
          <PrivateRoute
            path="/email-configuration/confirm"
            component={
              this.props.hostMailConfigType !== ""
                ? EmailConfigurationConfirm
                : NotFound
            }
            exact
          />
          <Route component={NotFound} />
        </Switch>
      </Router>
    );
  }
}

RouteApp.propTypes = {
  hostMailConfigType: PropTypes.any,
};

export default connect(mapStateToProps)(RouteApp);
