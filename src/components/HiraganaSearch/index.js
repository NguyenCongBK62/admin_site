import React from "react";
import { Radio } from "antd";
import PropTypes from "prop-types";

import "components/HiraganaSearch/style/index.less";

function HiraganaSearch({ onChange }) {
  return (
    <Radio.Group
      defaultValue={"すべて"}
      className={"hiragana-list-radio"}
      onChange={(e) => {
        onChange(e.target.value);
      }}
    >
      <Radio.Button value="ア">ア</Radio.Button>
      <Radio.Button value="カ">カ</Radio.Button>
      <Radio.Button value="サ">サ</Radio.Button>
      <Radio.Button value="タ">タ</Radio.Button>
      <Radio.Button value="ハ">ハ</Radio.Button>
      <Radio.Button value="マ">マ</Radio.Button>
      <Radio.Button value="ヤ">ヤ</Radio.Button>
      <Radio.Button value="ラ">ラ</Radio.Button>
      <Radio.Button value="ワ">ワ</Radio.Button>
      <Radio.Button value="すべて">すべて</Radio.Button>
    </Radio.Group>
  );
}

HiraganaSearch.propTypes = {
  onChange: PropTypes.func,
};

export default HiraganaSearch;
