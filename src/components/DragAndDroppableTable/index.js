import React, { useState } from "react";
import "./style/index.less";
import { Button, Input, Table } from "antd";
import { sortableContainer, sortableElement } from "react-sortable-hoc";
import arrayMove from "array-move";
// import produce from "immer";
import PropTypes from "prop-types";
import SearchIcon from "components/Icons/SearchIcon";
import PlusIcon from "components/Icons/PlusIcon";

const SortableItem = sortableElement((props) => <tr {...props} />);
const SortableContainer = sortableContainer((props) => <tbody {...props} />);

export default function DragAndDroppableTable({
  data,
  columns,
  addNew,
  handleDataSource,
  fullDataSource,
  reOrder,
  emptyText,
  placeholder,
  hasAddBtn = true,
  hasSearchField = true,
}) {
  const [value, setValue] = useState("");
  const onSortEnd = ({ oldIndex, newIndex }) => {
    if (oldIndex !== newIndex) {
      const newData = arrayMove([].concat(data), oldIndex, newIndex).filter(
        (el) => !!el
      );
      reOrder(newData);
      handleDataSource(newData);
    }
  };

  const DraggableContainer = (props) => (
    <SortableContainer
      useDragHandle
      disableAutoscroll
      helperClass="row-dragging"
      onSortEnd={onSortEnd}
      {...props}
    />
  );

  const DraggableBodyRow = ({ className, style, ...restProps }) => {
    // function findIndex base on Table rowKey props and should always be a right array index
    const index = data.findIndex((x) => x.index === restProps["data-row-key"]);
    return <SortableItem index={index} {...restProps} />;
  };

  return (
    <>
      <div className={"table-header-container"}>
        {hasAddBtn ? (
          <div className={"responsive-btn"}>
            <Button onClick={addNew} className="add-btn">
              新規登録 <PlusIcon width="14" height="14" />
            </Button>
          </div>
        ) : null}
        {hasSearchField ? (
          <Input
            placeholder={placeholder}
            value={value}
            onChange={(e) => {
              const currValue = e.target.value;
              setValue(currValue);
              const filteredData = fullDataSource.filter((entry) =>
                " ".concat
                  .apply([], Object.values(entry))
                  .toLowerCase()
                  .includes(currValue.toLowerCase())
              );
              // setDataSource(filteredData);
              handleDataSource(filteredData);
            }}
            suffix={<SearchIcon />}
            className={"table-search"}
          />
        ) : null}
      </div>
      <Table
        pagination={false}
        dataSource={data}
        columns={columns}
        rowKey="index"
        components={{
          body: {
            wrapper: DraggableContainer,
            row: DraggableBodyRow,
          },
        }}
        className={"sortable-table"}
        locale={{
          emptyText: <span>{emptyText}</span>,
        }}
        scroll={
          data.length > 0
            ? {
                y: 300,
                x: 600,
              }
            : false
        }
      />
    </>
  );
}

DragAndDroppableTable.propTypes = {
  data: PropTypes.array,
  columns: PropTypes.array,
  className: PropTypes.any,
  style: PropTypes.any,
  addNew: PropTypes.func,
  handleDataSource: PropTypes.func,
  fullDataSource: PropTypes.array,
  reOrder: PropTypes.func,
  emptyText: PropTypes.string,
  placeholder: PropTypes.string,
  hasAddBtn: PropTypes.bool,
  hasSearchField: PropTypes.bool,
};
