import React, { useEffect, useState } from "react";
import { Form, Input, Button, Card, Spin, message } from "antd";
import { useDispatch, useSelector } from "react-redux";
import { login as loginAction } from "actions/login";
import { useHistory } from "react-router";
import "./style/index.less";
import bg from "assets/login-bg.svg";
import loginCover from "assets/login-cover.svg";
import auth from "utils/auth";
import jwtDecode from "jwt-decode";
import { checkVersion } from "utils/common";

export default function Login() {
  const loginInfo = useSelector((state) => state.loginReducer.login_info);

  const [isLoading, setIsLoading] = useState(false);
  const dispatch = useDispatch();
  const history = useHistory();

  useEffect(() => () => checkVersion(), []);

  useEffect(() => {
    setIsLoading(loginInfo?.isLoading);
    const token = auth.getToken();
    if (token) {
      const { exp } = jwtDecode(token);
      if (Date.now() >= exp * 1000) {
        auth.logout();
        window.location.reload();
      }
    }

    if (loginInfo.token === token && token !== null) {
      history.push("/");
    } else if (loginInfo.errorMsg !== "") {
      message.error({
        content: loginInfo.errorMsg,
        style: {
          color: "#EB516D",
        },
      });
    }
  }, [loginInfo]);
  const onFinish = (values) => {
    setIsLoading(true);
    const { username, password } = values;
    dispatch(loginAction(username, password));
  };

  const onFinishFailed = (errorInfo) => {
    console.log("Failed:", errorInfo);
  };

  return (
    <Spin tip="ログイン中です" size="large" spinning={isLoading}>
      <div
        className={"main"}
        style={{ backgroundImage: `url(${bg})`, backgroundPosition: "center" }}
      >
        <Card
          className={"login-card"}
          cover={<img alt="example" src={loginCover} />}
        >
          <Form
            name="normal_login"
            className="login-form"
            layout={"vertical"}
            initialValues={{ remember: false }}
            onFinish={onFinish}
            onFinishFailed={onFinishFailed}
          >
            <Form.Item
              label="ユーザーID"
              name="username"
              rules={[
                { required: true, message: "ユーザーIDを入力してください。" },
              ]}
            >
              <Input
                placeholder="ユーザーIDを入力してください"
                className={"login-input"}
              />
            </Form.Item>
            <Form.Item
              label="パスワード"
              name="password"
              rules={[
                { required: true, message: "パスワードを入力してください。" },
              ]}
            >
              <Input
                type="password"
                placeholder="パスワードを入力してください"
                className={"login-input"}
              />
            </Form.Item>

            <Form.Item>
              <Button
                type="primary"
                htmlType="submit"
                className="login-form-button login-btn"
              >
                ログインする
              </Button>
            </Form.Item>
          </Form>
        </Card>
      </div>
    </Spin>
  );
}
