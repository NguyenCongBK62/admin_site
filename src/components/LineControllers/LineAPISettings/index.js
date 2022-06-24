import React from "react";
import PropTypes from "prop-types";
import CommonSteps from "../atoms/CommonSteps.js";

function LineAPISettings({ isIphone }) {
  const tootlTipTitle =
    "LINE Official Account Managerにログインしたら、画面右上の「設定」を選択。左メニューから、「Messaging API」を選択し、利用するボタンを押してください。";
  const headings =
    "LINE公式アカウントのMessaging API設定を行ってください。すでに設定済みの方は次のステップにお進みください。";
  const buttonTitle = "Messaging APIを設定する";
  const buttonLink = "https://manager.line.biz/";
  return (
    <CommonSteps
      headings={headings}
      tootlTipTitle={tootlTipTitle}
      buttonTitle={buttonTitle}
      buttonLink={buttonLink}
      isIphone={isIphone}
    />
  );
}

LineAPISettings.propTypes = {
  isIphone: PropTypes.bool,
};
export default LineAPISettings;
