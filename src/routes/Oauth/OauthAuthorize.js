import React, {Component} from 'react';
import {connect} from 'dva';
import {stringify,parse} from 'qs';
import {Link} from 'dva/router';
import {Alert, Checkbox} from 'antd';
import Login from '../../components/Login';
import styles from './OauthAuthorize.less';

const {  UserName, Password, Submit } = Login;

@connect(({ login, loading }) => ({
  login,
  submitting: loading.effects['login/login'],
}))

export default class OauthAuthorize extends Component{

  state = {
    autoLogin: true,
  };
  componentDidMount() {
    //校验是否登录
    const {dispatch,login:{status}} = this.props;

    if(!status){
      //未登录则进行登录
    }else{
      //进行授权页面
      let url = this.props.location.search;
      let data = parse(url.split('?')[1]);

      dispatch({
        type: 'login/oauth',
        payload: data
      });
    }
  }
  renderLogin=()=>{
    const { login, submitting } = this.props;
    const { type } = this.state;
    return(
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
    </Login>)
  }
  renderAuthorize=()=>{
    const { login, submitting } = this.props;
    const { type } = this.state;
    return(
      <Login defaultActiveKey={type} onTabChange={this.onTabChange} onSubmit={this.handleSubmit}>
        <div>
          授权
        </div>
        <Submit loading={submitting}>授权</Submit>
      </Login>
      )
  }
  renderLoginOrOauth=(status)=>{

    if(status){
      return this.renderAuthorize()
    }else{
      return this.renderLogin();
    }
  }
  handleSubmit = (err, values) => {
    if (!err) {
      this.props.dispatch({
        type: 'login/oauthLogin',
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
    const { login:{status}} = this.props;
    return (
      <div className={styles.main}>

        {this.renderLoginOrOauth(status)}

      </div>
    );
  }
}
