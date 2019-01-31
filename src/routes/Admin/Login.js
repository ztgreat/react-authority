import React, {Component} from 'react';
import {connect} from 'dva';
import {Link} from 'dva/router';
import {Alert, Checkbox} from 'antd';
import Login from '../../components/Login';
import styles from './Login.less';

const {  UserName, Password, Submit } = Login;
@connect(({ login, loading }) => ({
  login,
  submitting: loading.effects['login/login'],
}))
export default class LoginPage extends Component{

  state = {
    autoLogin: true,
  };
  handleSubmit = (err, values) => {
    if (!err) {
      this.props.dispatch({
        type: 'login/login',
        payload: {
          ...values
        },
      });
    }
  };
  changeAutoLogin = e => {
    this.setState({
      autoLogin: e.target.checked,
    });
  };
  renderMessage = content => {
    return <Alert style={{ marginBottom: 24 }} message={content} type="error" showIcon />;
  };
  render() {
    const { login, submitting } = this.props;
    const { type } = this.state;
    return (
      <div className={styles.main}>
        <Login defaultActiveKey={type} onTabChange={this.onTabChange} onSubmit={this.handleSubmit}>
          <div>
            {login.status === '1' && !submitting &&
            this.renderMessage('账户或密码错误（admin/888888）')}
            <UserName name="username" placeholder="请输入用户账号" />
            <Password name="password" placeholder="请输入登录密码" />
          </div>
          <div>
            <Checkbox checked={this.state.autoLogin} onChange={this.changeAutoLogin}>
              自动登录
            </Checkbox>
            <a style={{ float: 'right' }} href="">
              忘记密码
            </a>
          </div>
          <Submit loading={submitting}>登录</Submit>
          <div className={styles.other}>
            <Link className={styles.register} to="/user/register">
              注册账户
            </Link>
          </div>
        </Login>
      </div>
    );
  }
}
