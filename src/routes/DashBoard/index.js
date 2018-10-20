import React, {Fragment, PureComponent} from 'react';
import {connect} from 'dva';
import styles from './DashBoard.less';

import {Card, Col, Form, Row,} from 'antd';

import PageHeaderLayout from '../../layouts/PageHeaderLayout';

@connect(({user, loading}) => ({
  user,
  loading: loading.models.product,
}))

@Form.create()

export default class Chat extends PureComponent {
  state = {};

  componentDidMount() {
    const {dispatch} = this.props;
    dispatch({
      type: 'user/queryById',
    });
  }


  render() {
    const {user: {userInfo}, loading} = this.props;
    return (
      <PageHeaderLayout title="DASHBOARD">
        <Fragment>
          <Row gutter={24}>
            <Col xl={12} lg={24} md={24} sm={24} xs={24} style={{marginBottom: 24}}>
              <Card title={`当前用户：${userInfo.username}`} bordered={false}>
                <Row>
                  <Col md={24} sm={24} xs={24}>
                    <div className={styles.content}>
                      <div className={styles.contentTitle}>昵称：{userInfo.nickname}</div>
                      <div className={styles.contentTitle}>邮箱：{userInfo.email}</div>
                      <div className={styles.contentTitle}>注册时间：{userInfo.createTime}</div>
                      <div className={styles.contentTitle}>最近一次登录时间：{userInfo.modifyTime}</div>
                    </div>
                  </Col>
                </Row>
              </Card>
            </Col>
          </Row>
        </Fragment>
      </PageHeaderLayout>
    )
  }

}
