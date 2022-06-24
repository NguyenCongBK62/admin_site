import React from "react";
import PropTypes from "prop-types";
import "../style/index.less";

import { Pagination as AntPagination } from "antd";

export default function Pagination({ totalItems, onChange, currentPage }) {
  return (
    <AntPagination
      className={"pagination"}
      currentPage={currentPage}
      onChange={(page, pageSize) => {
        onChange(page);
      }}
      total={totalItems}
      showTotal={(total, range) => {
        return `${range[0]}〜${range[1]}件（全${totalItems}件中）`;
      }}
      defaultPageSize={10}
      defaultCurrent={1}
      showSizeChanger={false}
    />
  );
}

Pagination.propTypes = {
  totalItems: PropTypes.number,
  onChange: PropTypes.func,
  currentPage: PropTypes.any,
};
