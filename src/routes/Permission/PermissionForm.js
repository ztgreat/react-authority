import React from 'react';
import {Form, Input, Modal, Select, Switch,} from 'antd';

const FormItem = Form.Item;
const {Option} = Select;
@Form.create()
export default class PermissionForm extends React.PureComponent {

  okHandle = () => {
    this.props.form.validateFields((err, fieldsValue) => {
      if (err) return;
      if (fieldsValue['level'] == 0) {
        fieldsValue['parentId'] = 0;
      }
      if (fieldsValue['status']) {
        fieldsValue['status'] = '1';
      }else {
        fieldsValue['status'] = '0';
      }
      this.props.handleSubmit(fieldsValue);
    });
  };

  handleCloseModal = () => {
    this.props.form.resetFields();
    this.props.handleCloseModal();
  };
  showParentPermission = () => {
    if (this.props.form.getFieldValue('level')=='1') {
      return (
        <FormItem required labelCol={{span: 5}} wrapperCol={{span: 15}} label="父级权限">

          {this.props.form.getFieldDecorator('parentId', {
            initialValue: this.props.record.parentId || 1,
            rules: [{required: true, message: '请选择父级权限'}],
          })(

            <Select
              showSearch
              style={{width: 300}}
              placeholder="请选择父级权限"
              optionFilterProp="children"
            >
              {this.props.permissions.map(item => {
                return (
                  <Option key={item.id} value={item.id}>{item.name}</Option>
                )
              })}

            </Select>
          )}
        </FormItem>
      );
    }
    return (
      <div></div>
    );
  };
  render() {

    return (
      <Modal
        title="编辑权限"
        visible={this.props.modalVisible}
        onOk={this.okHandle}
        onCancel={this.handleCloseModal}
        destroyOnClose={true}
        maskClosable={false}
        confirmLoading={this.props.loading}
      >
        <FormItem required labelCol={{span: 5}} wrapperCol={{span: 15}} label="权限层级">
          {this.props.form.getFieldDecorator('level', {
            initialValue: this.props.record.level || 0,
            rules: [{required: true, message: '请选择权限层级'}],
          })(<Select
            showSearch={true}
            style={{width: 300}}
            placeholder="请选择权限层级"
            optionFilterProp="children"
          >
            <Option value={0}>一级权限</Option>
            <Option value={1}>二级权限</Option>
          </Select>)}
        </FormItem>

        {this.showParentPermission()}

        <FormItem labelCol={{span: 5}} wrapperCol={{span: 15}} label="权限名称">
          {this.props.form.getFieldDecorator('name', {
            initialValue: this.props.record.name || '',
            rules: [{required: true, message: '请输入权限名称'}],
          })(<Input placeholder="权限名称" style={{width: 300}}/>)}
        </FormItem>

        <FormItem labelCol={{span: 5}} wrapperCol={{span: 15}} label="权限字符串">
          {this.props.form.getFieldDecorator('code', {
            initialValue: this.props.record.code || '',
            rules: [{required: true, message: '请输入权限字符串'}],
          })(<Input placeholder="权限字符串" style={{width: 300}}/>)}
        </FormItem>
        <FormItem labelCol={{span: 5}} wrapperCol={{span: 15}} label="权限描述">
          {this.props.form.getFieldDecorator('descr', {
            initialValue: this.props.record.descr || '',
            rules: [{required: true, message: '请输入权限描述'}],
          })(<Input placeholder="权限描述" style={{width: 300}}/>)}
        </FormItem>

        {/*<FormItem labelCol={{span: 5}} wrapperCol={{span: 15}} label="排序规则">*/}
          {/*{this.props.form.getFieldDecorator('sorter', {*/}
            {/*initialValue: this.props.record.sorter || 0,*/}
            {/*rules: [{required: true, message: '请输入数字'}],*/}
          {/*})(<InputNumber min={0} placeholder="排序数字" style={{width: 300}}/>)}*/}
        {/*</FormItem>*/}

        <FormItem required labelCol={{span: 5}} wrapperCol={{span: 15}} label="权限状态">

          {this.props.form.getFieldDecorator('status', {
            valuePropName:'checked',
            initialValue: (this.props.record.status||'0')=='0'?false:true,
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


