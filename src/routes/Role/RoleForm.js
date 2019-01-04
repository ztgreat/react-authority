import React from 'react';
import {Form, Input, Modal, Switch,} from 'antd';

const FormItem = Form.Item;
@Form.create()
export default class RoleForm extends React.PureComponent {
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
        <FormItem required labelCol={{span: 5}} wrapperCol={{span: 15}} label="角色名称">
          {this.props.form.getFieldDecorator('name', {
            initialValue: this.props.record.name || '',
            rules: [{required: true, message: '请输入角色名称'}],
          })(
            <Input placeholder="角色名称" style={{width: 300}}/>
          )}
        </FormItem>
        <FormItem labelCol={{span: 5}} wrapperCol={{span: 15}} label="角色编码">
          {this.props.form.getFieldDecorator('code', {
            initialValue: this.props.record.code || '',
            rules: [{required: true, message: '请输入菜单编码'}],
          })(<Input placeholder="菜单编码" style={{width: 300}}/>)}
        </FormItem>
        <FormItem required labelCol={{span: 5}} wrapperCol={{span: 15}} label="菜单状态">

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


