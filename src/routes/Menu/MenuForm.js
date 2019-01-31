import React from 'react';
import {Form, Input, InputNumber, Modal, Select, Switch,} from 'antd';

const FormItem = Form.Item;
const {Option} = Select;
@Form.create()
export default class MenuForm extends React.PureComponent {
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
  }

  showParentMenu = () => {
    if (this.props.form.getFieldValue('level')=='1') {
      return (
        <FormItem required labelCol={{span: 5}} wrapperCol={{span: 15}} label="父级菜单">

          {this.props.form.getFieldDecorator('parentId', {
            initialValue: this.props.record.parentId || 1,
            rules: [{required: true, message: '请输入父级菜单'}],
          })(

            <Select
              showSearch
              style={{width: 300}}
              placeholder="请选择父级菜单"
              optionFilterProp="children"
            >
              {this.props.menus.map(item => {
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
        title="编辑菜单"
        visible={this.props.modalVisible}
        onOk={this.okHandle}
        onCancel={this.handleCloseModal}
        destroyOnClose={true}
        maskClosable={false}
        confirmLoading={this.props.loading}
      >
        <FormItem required labelCol={{span: 5}} wrapperCol={{span: 15}} label="菜单层级">
          {this.props.form.getFieldDecorator('level', {
            initialValue: this.props.record.level || 0,
            rules: [{required: true, message: '请输入菜单图标'}],
          })(<Select
            showSearch={true}
            style={{width: 300}}
            placeholder="请选择菜单层级"
            optionFilterProp="children"
          >
            <Option value={0}>一级菜单</Option>
            <Option value={1}>二级菜单</Option>
          </Select>)}

        </FormItem>

        {this.showParentMenu()}

        <FormItem labelCol={{span: 5}} wrapperCol={{span: 15}} label="菜单名称">
          {this.props.form.getFieldDecorator('name', {
            initialValue: this.props.record.name || '',
            rules: [{required: true, message: '请输入菜单名称'}],
          })(<Input placeholder="菜单名称" style={{width: 300}}/>)}
        </FormItem>

        <FormItem labelCol={{span: 5}} wrapperCol={{span: 15}} label="菜单编码">
          {this.props.form.getFieldDecorator('code', {
            initialValue: this.props.record.code || '',
            rules: [{required: true, message: '请输入菜单编码'}],
          })(<Input placeholder="菜单编码" style={{width: 300}}/>)}
        </FormItem>
        <FormItem labelCol={{span: 5}} wrapperCol={{span: 15}} label="菜单图标">
          {this.props.form.getFieldDecorator('icon', {
            initialValue: this.props.record.icon || '',
            rules: [{required: true, message: '请输入菜单图标'}],
          })(<Input placeholder="菜单图标" style={{width: 300}}/>)}
        </FormItem>
        <FormItem labelCol={{span: 5}} wrapperCol={{span: 15}} label="菜单链接">
          {this.props.form.getFieldDecorator('url', {
            initialValue: this.props.record.url || '',
            rules: [{required: true, message: '请输入菜单链接'}],
          })(<Input placeholder="菜单链接" style={{width: 300}}/>)}
        </FormItem>

        <FormItem labelCol={{span: 5}} wrapperCol={{span: 15}} label="排序规则">
          {this.props.form.getFieldDecorator('sorter', {
            initialValue: this.props.record.sorter || 0,
            rules: [{required: true, message: '请输入数字'}],
          })(<InputNumber min={0} placeholder="排序数字" style={{width: 300}}/>)}
        </FormItem>

        <FormItem required labelCol={{span: 5}} wrapperCol={{span: 15}} label="菜单状态">

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


