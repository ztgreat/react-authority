import React, { Component, Fragment } from 'react';
import { formatMessage, FormattedMessage } from 'umi/locale';
import { Form, Input, Upload, Select, Button } from 'antd';
import { connect } from 'dva';
import styles from './BaseView.less';

const FormItem = Form.Item;
const { Option } = Select;

// 头像组件 方便以后独立，增加裁剪之类的功能
const AvatarView = ({ avatar }) => (
  <Fragment>
    <div className={styles.avatar_title}>
      <FormattedMessage id="app.settings.basic.avatar" defaultMessage="Avatar" />
    </div>
    <div className={styles.avatar}>
      <img src={avatar} alt="avatar" />
    </div>
    <Upload fileList={[]}>
      <div className={styles.button_view}>
        <Button icon="upload">
          <FormattedMessage id="app.settings.basic.change-avatar" defaultMessage="Change avatar" />
        </Button>
      </div>
    </Upload>
  </Fragment>
);

@connect(({ admin }) => ({
  currentUser: admin.currentUser,
}))
@Form.create()
class BaseView extends Component {
  componentDidMount() {
    this.setBaseInfo();
  }

  setBaseInfo = () => {
    const { currentUser, form } = this.props;
    Object.keys(form.getFieldsValue()).forEach(key => {
      const obj = {};
      obj[key] = currentUser[key] || null;
      form.setFieldsValue(obj);
    });
  };

  getAvatarURL() {
    const { currentUser } = this.props;
    if (currentUser.avatar) {
      return currentUser.avatar;
    }
    const url = 'https://gw.alipayobjects.com/zos/rmsportal/BiazfanxmamNRoxxVxka.png';
    return url;
  }

  getViewDom = ref => {
    this.view = ref;
  };

  render() {
    const {
      form: { getFieldDecorator },
    } = this.props;
    return (
      <div className={styles.baseView} ref={this.getViewDom}>
        <div className={styles.left}>
          <Form layout="vertical" onSubmit={this.handleSubmit} hideRequiredMark>
            <FormItem label={formatMessage({ id: 'app.settings.basic.email' })}>
              {getFieldDecorator('email', {
                rules: [
                  {
                    required: true,
                    message: formatMessage({ id: 'app.settings.basic.email-message' }, {}),
                  },
                ],
              })(<Input />)}
            </FormItem>
            <FormItem label={formatMessage({ id: 'app.settings.basic.nickname' })}>
              {getFieldDecorator('name', {
                rules: [
                  {
                    required: true,
                    message: formatMessage({ id: 'app.settings.basic.nickname-message' }, {}),
                  },
                ],
              })(<Input />)}
            </FormItem>
            <FormItem label={formatMessage({ id: 'app.settings.basic.profile' })}>
              {getFieldDecorator('profile', {
                rules: [
                  {
                    required: true,
                    message: formatMessage({ id: 'app.settings.basic.profile-message' }, {}),
                  },
                ],
              })(
                <Input.TextArea
                  placeholder={formatMessage({ id: 'app.settings.basic.profile-placeholder' })}
                  rows={4}
                />
              )}
            </FormItem>
            <FormItem label={formatMessage({ id: 'app.settings.basic.country' })}>
              {getFieldDecorator('country', {
                rules: [
                  {
                    required: true,
                    message: formatMessage({ id: 'app.settings.basic.country-message' }, {}),
                  },
                ],
              })(
                <Select style={{ maxWidth: 220 }}>
                  <Option value="China">中国</Option>
                </Select>
              )}
            </FormItem>
            <FormItem label={formatMessage({ id: 'app.settings.basic.address' })}>
              {getFieldDecorator('address', {
                rules: [
                  {
                    required: true,
                    message: formatMessage({ id: 'app.settings.basic.address-message' }, {}),
                  },
                ],
              })(<Input />)}
            </FormItem>
            <Button type="primary">
              <FormattedMessage
                id="app.settings.basic.update"
                defaultMessage="Update Information"
              />
            </Button>
          </Form>
        </div>
        <div className={styles.right}>
          <AvatarView avatar={this.getAvatarURL()} />
        </div>
      </div>
    );
  }
}

export default BaseView;
