import React from "react";
import { Col, Divider, Menu, Row } from "antd";
import Heading from "components/Heading";
import PropTypes from "prop-types";

export default function StoreDropdown({ stores, selectedStore, changeStore }) {
  return (
    <Menu className="store">
      <Menu.Item>
        <Heading>店舗選択</Heading>
      </Menu.Item>
      {stores.length !== 0 ? (
        <>
          <Menu.Item>
            <Divider />
            <Row>
              <Col span={20}>
                <p className="selected-store">{selectedStore.name}</p>
              </Col>
              <Col span={4}>
                {" "}
                <span>選択中</span>
              </Col>
            </Row>

            <Divider />
          </Menu.Item>
          {stores.length > 0
            ? stores.map((store) => {
                if (store.id !== selectedStore.id && store.status === 0) {
                  return (
                    <Menu.Item
                      key={store.id}
                      onClick={() => changeStore(store.id)}
                    >
                      <p>{store.name}</p>
                    </Menu.Item>
                  );
                }
                return null;
              })
            : null}
        </>
      ) : null}
    </Menu>
  );
}

StoreDropdown.propTypes = {
  stores: PropTypes.array,
  selectedStore: PropTypes.object,
  changeStore: PropTypes.func,
};
