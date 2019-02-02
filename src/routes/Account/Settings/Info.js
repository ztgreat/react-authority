import React, { Component } from 'react';
import { connect } from 'dva';
import {routerRedux } from 'dva/router';
import { Menu ,Card} from 'antd';
import PageHeaderLayout from '../../../layouts/PageHeaderLayout';
import GridContent from '../../../components/PageHeaderWrapper/GridContent';
import styles from './Info.less';

const { Item } = Menu;

@connect(({ admin }) => ({
  currentUser: admin.currentUser,
}))
class Info extends Component {
  constructor(props) {
    super(props);
    const { match, location } = props;
    const menuMap = {
      base:  '基本设置',
      security: (
        '安全设置'
      ),
      binding: (
        '账号绑定'
      ),
      notification: (
        '新消息通知'
      ),
    };
    const key = location.pathname.replace(`${match.path}/`, '');
    this.state = {
      mode: 'inline',
      menuMap,
      selectKey: menuMap[key] ? key : 'base',
    };
  }

  static getDerivedStateFromProps(props, state) {
    const { match, location } = props;
    let selectKey = location.pathname.replace(`${match.path}/`, '');
    selectKey = state.menuMap[selectKey] ? selectKey : 'base';
    if (selectKey !== state.selectKey) {
      return { selectKey };
    }
    return null;
  }

  componentDidMount() {
    window.addEventListener('resize', this.resize);
    this.resize();
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.resize);
  }

  getmenu = () => {
    const { menuMap } = this.state;
    return Object.keys(menuMap).map(item => <Item key={item}>{menuMap[item]}</Item>);
  };

  getRightTitle = () => {
    const { selectKey, menuMap } = this.state;
    return menuMap[selectKey];
  };

  selectKey = ({ key }) => {
    this.setState({
      selectKey: key,
    });
    const {dispatch} = this.props;
    console.log(key)
    dispatch(routerRedux.push({pathname:`/account/settings/${key}`}))
  };

  resize = () => {
    if (!this.main) {
      return;
    }
    requestAnimationFrame(() => {
      let mode = 'inline';
      const { offsetWidth } = this.main;
      if (this.main.offsetWidth < 641 && offsetWidth > 400) {
        mode = 'horizontal';
      }
      if (window.innerWidth < 768 && offsetWidth > 400) {
        mode = 'horizontal';
      }
      this.setState({
        mode,
      });
    });
  };

  render() {
    const { children, currentUser } = this.props;
    if (!currentUser.id) {
      return '';
    }
    console.log(this.props)
    const { mode, selectKey } = this.state;
    return (

      <PageHeaderLayout title="资源权限">
        <Card bordered={false}>
            <div
              className={styles.main}
              ref={ref => {
                this.main = ref;
              }}
            >
              <div className={styles.leftmenu}>
                <Menu mode={mode} selectedKeys={[selectKey]} onClick={this.selectKey}>
                  {this.getmenu()}
                </Menu>
              </div>
              <div className={styles.right}>
                <div className={styles.title}>{this.getRightTitle()}</div>
                {children}
              </div>
            </div>

        </Card>
      </PageHeaderLayout>
    );
  }
}

export default Info;
