import React from 'react';
import {Form, Input, Modal, Switch,} from 'antd';

const FormItem = Form.Item;

@Form.create()
export default class AdminForm extends React.PureComponent {
  okHandle = () => {
    this.props.form.validateFields((err, fieldsValue) => {
      if (err) return;
      if (fieldsValue['status']) {
        fieldsValue['status'] = '1';
      } else {
        fieldsValue['status'] = '0';
      }
      this.props.handleSubmit(fieldsValue);
    });
  };
  handleCloseModal = () => {
    this.props.form.resetFields();
    this.props.handleCloseModal();
  };
  showMoreInfo = (modalVisible) => {
    if (modalVisible && !this.props.record.id) {
      return (
        <FormItem required labelCol={{span: 5}} wrapperCol={{span: 15}} label="密码">
          {this.props.form.getFieldDecorator('password', {
            initialValue: this.props.record.password || '',
            rules: [{required: true, message: '请输入密码'}],
          })(
            <Input  type='password' placeholder="密码" style={{width: 300}}/>
          )}
        </FormItem>
      );
    }
    return (
      <div></div>
    );
  };
  render() {
    const {title} = this.props;
    return (
      <Modal
        title={title}
        visible={this.props.modalVisible}
        onOk={this.okHandle}
        onCancel={this.handleCloseModal}
        destroyOnClose={true}
        maskClosable={false}
        confirmLoading={this.props.loading}
      >
        <FormItem required labelCol={{span: 5}} wrapperCol={{span: 15}} label="用户名">
          {this.props.form.getFieldDecorator('username', {
            initialValue: this.props.record.username || '',
            rules: [{required: true, message: '请输入用户名'}],
          })(
            <Input placeholder="用户名" style={{width: 300}}/>
          )}
        </FormItem>

        <FormItem required labelCol={{span: 5}} wrapperCol={{span: 15}} label="昵称">
          {this.props.form.getFieldDecorator('nickname', {
            initialValue: this.props.record.nickname || '',
            rules: [{required: true, message: '请输入昵称'}],
          })(
            <Input placeholder="昵称" style={{width: 300}}/>
          )}
        </FormItem>

        <FormItem required labelCol={{span: 5}} wrapperCol={{span: 15}} label="邮箱">
          {this.props.form.getFieldDecorator('email', {
            initialValue: this.props.record.email || '',
            rules: [{required: true, type:'email',message: '请输入邮箱'}],
          })(
            <Input placeholder="邮箱" style={{width: 300}}/>
          )}
        </FormItem>

        <FormItem required labelCol={{span: 5}} wrapperCol={{span: 15}} label="手机号">
          {this.props.form.getFieldDecorator('telephone', {
            initialValue: this.props.record.telephone || '',
            rules: [{required: true, message: '请输入手机号'}],
          })(
            <Input placeholder="手机号" style={{width: 300}}/>
          )}
        </FormItem>

        {this.showMoreInfo(this.props.modalVisible)}

        <FormItem required labelCol={{span: 5}} wrapperCol={{span: 15}} label="状态">

          {this.props.form.getFieldDecorator('status', {
            valuePropName: 'checked',
            initialValue: (this.props.record.status || '0') == '0' ? false : true,
            rules: [{required: true}],
          })(
            <Switch checkedChildren="启用"
                    unCheckedChildren="禁用"/>
          )}
        </FormItem>
      </Modal>
    );
  }
};
