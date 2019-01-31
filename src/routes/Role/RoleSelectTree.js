import React from 'react';
import {Form, Modal, TreeSelect} from 'antd';

const FormItem = Form.Item;
@Form.create()
export default  class RoleSelect extends React.Component {

  /**
   * 确定 提交数据
   */
  handleSubmit = () => {
      this.props.handleSubmit(this.props.form.getFieldValue('selectRoleIds'));
  };

  /**
   * 隐藏弹窗
   */
  handleCloseModal = () => {
    this.props.form.resetFields();
    this.props.handleCloseModal();
  };
  treeProps = {
    // treeData:this.props.userRoles,
    // value: this.state.selectRoleIds,
    allowClear:true,
    treeCheckable: true,
    showCheckedStrategy: TreeSelect.SHOW_PARENT,
    searchPlaceholder: 'Please select',
    style: {
      width: 360,
    },
  };
  render() {
    return (
      <div>
          <Modal
            title="角色分配"
            visible={this.props.modalVisible}
            onOk={this.handleSubmit}
            onCancel={this.handleCloseModal}
            destroyOnClose={true}
            maskClosable={false}
            confirmLoading={this.props.loading}
          >
            <FormItem labelCol={{span: 5}}wrapperCol={{span: 15}} label="角色选择">

              {this.props.form.getFieldDecorator('selectRoleIds', {
                initialValue: this.props.treeData.map(item =>
                                item.allocationFlag =='1'?item.value:''
                              ).filter(value =>
                                value !=''
                              ),
              })(
                <TreeSelect
                  {...this.treeProps}
                  treeData={this.props.treeData}
                />
              )}
            </FormItem>
          </Modal>
        </div>
    )
  };
}


