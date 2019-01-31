import React from 'react';
import {Input, Modal, Tree} from 'antd';

const TreeNode = Tree.TreeNode;
const Search = Input.Search;
export default class MenuTree extends React.PureComponent {

  state = {
    /**
     * 被选中的
     */
    // checkedKeys: [],

    /**
     * 被展开的
     */
    expandedKeys: [],
    autoExpandParent: true,

    searchValue: '',
  };

  /**
   * 展开回调
   * @param expandedKeys
   */
  onExpand = (expandedKeys) => {
    // if not set autoExpandParent to false, if children expanded, parent can not collapse.
    // or, you can remove all expanded children keys.
    this.setState({
      expandedKeys,
      autoExpandParent: false,
    });
  };

  okHandle = () => {
      this.props.handleSubmit();
  };
  handleCloseModal = () => {
    this.setState({
      expandedKeys:[],
      searchValue: '',
    });
    this.props.handleCloseModal();
  };
  onCheck = (checkedKeys) => {
    this.props.onCheck(checkedKeys.checked);
  };
  renderTreeNodes = (data) => data.map((item) => {
    const index = item.title.indexOf(this.state.searchValue);
    const beforeStr = item.title.substr(0, index);
    const afterStr = item.title.substr(index + this.state.searchValue.length);
    const title = index > -1 ? (
      <span>
          {beforeStr}
        <span style={{ color: '#f50' }}>{this.state.searchValue}</span>
        {afterStr}
        </span>
    ) : <span>{item.title}</span>;
    if (item.children) {
      return (
        <TreeNode key={item.key} title={title}>
          {this.renderTreeNodes(item.children)}
        </TreeNode>
      );
    }
    return <TreeNode key={item.key} title={title} />;
  });
  getParentKey = (tree,value) => {
    for (let i = 0; i < tree.length; i++) {
      const node = tree[i];
      if (node.title.indexOf(value) > -1 && value !='') {
        return true
      }
    }
    return false;
  };
  onChangeSearch = (e) => {
    const value = e.target.value;
    const expandedKeys = this.props.treeData.map((item) => {
      if (item.title.indexOf(value) > -1 &&value !='') {
        return item.key;
      }
      if(this.getParentKey(item.children,value)){
        return item.key;
      }
      return null;
    }).filter((item, i, self) => item && self.indexOf(item) === i);


    this.setState({
      expandedKeys,
      searchValue: value,
      autoExpandParent: true,
    });
  };
  render() {
    return (
      <Modal
        title="菜单授权"
        visible={this.props.modalVisible}
        onOk={this.okHandle}
        onCancel={this.handleCloseModal}
        destroyOnClose={true}
        maskClosable={false}
        confirmLoading={this.props.loading}
      >
        <Search value ={this.state.searchValue} style={{ marginBottom: 8 }} placeholder="Search" onChange={this.onChangeSearch} />
        <Tree
          checkable
          checkStrictly={true}
          onExpand={this.onExpand}
          expandedKeys={this.state.expandedKeys}
          onCheck={this.onCheck}
          checkedKeys={this.props.checkedKeys}
          autoExpandParent={this.state.autoExpandParent}
        >
          {this.renderTreeNodes(this.props.treeData)}

        </Tree>
      </Modal>
    );
  };
};


