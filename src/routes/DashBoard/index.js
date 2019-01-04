import React, {Fragment, PureComponent} from 'react';
import {connect} from 'dva';
import styles from './DashBoard.less';

import {Card, Col, Form, Row,} from 'antd';

import PageHeaderLayout from '../../layouts/PageHeaderLayout';

@connect(({admin, loading}) => ({
  admin,
  loading: loading.models.admin,
}))
@Form.create()
export default class Chat extends PureComponent {
  state = {};
  render() {
    const {admin: {currentUser}, loading} = this.props;
    return (
      <PageHeaderLayout title="DASHBOARD">
        <Fragment>
          <Row gutter={24}>
            <Col xl={12} lg={24} md={24} sm={24} xs={24} style={{marginBottom: 24}}>
              <Card title={`当前用户：${currentUser.username||''}`} bordered={false}>
                <Row>
                  <Col md={24} sm={24} xs={24}>
                    <div className={styles.content}>
                      <div className={styles.contentTitle}>昵称：{currentUser.nickname||''}</div>
                      <div className={styles.contentTitle}>邮箱：{currentUser.email||''}</div>
                      <div className={styles.contentTitle}>注册时间：{currentUser.createTime||''}</div>
                      <div className={styles.contentTitle}>最近一次登录时间：{currentUser.lastLoginTime||''}</div>
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
