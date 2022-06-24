import React from "react";
import PropTypes from "prop-types";
import { Table as AntTable } from "antd";
import Pagination from "components/Table/atoms/Pagination";
import "./style/index.less";
import "components/DragAndDroppableTable/style/index.less";

export default function Table({
  columns,
  data,
  totalItems = 0,
  hasPagination = true,
  rowSelection = null,
  emptyText = "No data found.",
  onChange = () => {},
  currentPage = 1,
  scrollX = 1540,
  scrollY = 886,
}) {
  return (
    <>
      <div className="table-container">
        <AntTable
          pagination={false}
          columns={columns}
          dataSource={data}
          rowSelection={rowSelection}
          locale={{
            emptyText: <span>{emptyText}</span>,
          }}
          scroll={
            scroll && data?.length > 0
              ? {
                  y: scrollY,
                  x: scrollX,
                }
              : false
          }
          className={"sortable-table"}
        />
      </div>
      {hasPagination && totalItems ? (
        <Pagination
          onChange={onChange}
          totalItems={totalItems}
          currentPage={currentPage}
        />
      ) : null}
    </>
  );
}

Table.propTypes = {
  data: PropTypes.array,
  columns: PropTypes.array,
  rowSelection: PropTypes.object,
  emptyText: PropTypes.string,
  totalItems: PropTypes.number,
  hasPagination: PropTypes.bool,
  onChange: PropTypes.func,
  currentPage: PropTypes.any,
  scrollX: PropTypes.number,
  scrollY: PropTypes.number,
};
