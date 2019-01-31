import React, {Fragment, PureComponent} from 'react';
import {connect} from 'dva';
import {Badge, Button, Card, Divider, Form, message, Modal, Select,} from 'antd';
import StandardTable from '../../components/StandardTable';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import styles from '../TableList.less';
import PermissionForm from "./PermissionForm";
const statusMap = ['default', 'success'];
const status = ['不可用', '可用'];
@connect(({permission, loading}) => ({
  permission,
  loading: loading.models.permission,
}))

export default class PermissionList extends PureComponent {
  state = {
    selectedRows: [],
    // 搜索条件字段
    searchFields: {
    },
    page:{
      //当前页数
      current:1,
      //每页大小
      pageSize:20,
    },
    record: {},
  };
  componentDidMount() {
    const {
      dispatch
    }
      = this.props;
    dispatch({
      type: 'permission/page',
      payload:{...this.state.searchFields,...this.state.page}
    });
    dispatch({
      type: 'permission/getPermissionByParentId',
      payload: {parentId:0},
    });
  }

  refush =()=>{
    const {dispatch} = this.props;
    dispatch({
      type: 'permission/page',
      payload:{...this.state.searchFields,...this.state.page}
    });
  };

  handleStandardTableChange = (pagination, filtersArg, sorter) => {
    this.setState({
      page:{
        current:pagination.current,
        pageSize:pagination.pageSize,
      }
    },this.refush)
  };
  showDeleteConfirm = (record) => {
    const confirm = Modal.confirm;
    const self = this;
    confirm({
      title: '你确定删除权限资源数据?',
      content: '',
      okText: '确定',
      okType: 'danger',
      cancelText: '取消',
      onOk() {
        if(record){
          self.handleDelete(record);
        }else {
          self.handleBatchDelete();
        }
      },
      onCancel() {
      },
    });
  };

  handleDelete = (record) => {
    const {dispatch} = this.props;
    if (!record) return;
    if (record.isParent == true) {
      message.error('需要先删除子菜单');
      return;
    }
    dispatch({
      type: 'permission/delete',
      payload: {
        ids: [record.id],
      },
    }).then(()=>{
      this.refush();
    });
  };

  handleBatchDelete = () => {
    const {dispatch} = this.props;
    const {selectedRows} = this.state;
    if (!selectedRows) return;
    for (var row of selectedRows) {
      if (row.isParent == true) {
        message.error('需要先删除子菜单');
        return;
      }
    }
    dispatch({
      type: 'permission/delete',
      payload: {
        ids: selectedRows.map(row => row.id),
      },
    }).then(()=>{
      this.refush();
    });

  };

  handleSelectRows = rows => {
    this.setState({
      selectedRows: rows,
    });
  };

  getAllParentPermission =()=>{
    const {dispatch} = this.props;
    dispatch({
      type: 'permission/getPermissionByParentId',
      payload: {parentId:0},
    });
  };


  /**
   * 提交 添加的权限
   * @param e
   */
  handleSubmitPermission = values => {
    const {dispatch,permission: {permissionItem}} = this.props;
    values['id'] = permissionItem.id;
    //更新按钮状态
    dispatch({
      type: 'permission/updateLoading',
      payload: true,
    })
    dispatch({
      type: 'permission/saveOrUpdate',
      payload: values,
    }).then(()=>{
      //更新按钮状态
      dispatch({
        type: 'permission/updateLoading',
        payload: false,
      })
      this.getAllParentPermission();
      this.refush();
    });
  };

  /**
   * 弹窗控制
   * @param flag
   */
  handleShowModal = (record) => {
    const {dispatch} = this.props;
    dispatch({
      type: 'permission/openPermissionForm',
      payload: record,
    })
  };

  handleCloseModal = () => {
    const {dispatch} = this.props;
    dispatch({
      type: 'permission/closePermissionForm',
    })
  };

  render() {
    const {permission: {pageData,parentPermission,permissionFormModalVisible,permissionItem,loading}} = this.props;
    const {selectedRows} = this.state;
    const columns = [
      /*{
        title: '主键',
        dataIndex: 'id',
      },*/
      {
        title: '权限名称',
        dataIndex: 'name',
        value: 'name',
      },
      /*{
        title: '代码',
        dataIndex: 'code',
        width:120,
      },*/
      {
        title: '权限字符串',
        dataIndex: 'code',
        width: 300,
      },
      {
        title: '状态',
        dataIndex: 'status',
        filters: [
          {
            text: status[0],
            value: 0,
          },
          {
            text: status[1],
            value: 1,
          }
        ],
        onFilter: (value, record) => record.status.toString() === value,
        render(val) {
          return <Badge status={statusMap[val]} text={status[val]}/>;
        },
      },
      {
        title: '操作',
        render: (record) => (
          <Fragment>
            <a onClick={() => this.handleShowModal(record)}>编辑</a>
            <Divider type="vertical"/>
            <a onClick={() => this.showDeleteConfirm(record)}>删除</a>
          </Fragment>
        ),
      },
    ];


    return (
      <PageHeaderLayout title="资源权限">
        <Card bordered={false}>
          <div className={styles.tableList}>

            <div className={styles.tableListOperator}>
              <Button icon="plus" type="primary" onClick={() => this.handleShowModal([])}>
                新建
              </Button>
              {selectedRows&&selectedRows.length > 0 && (
                <span>
                  <Button onClick={()=>this.showDeleteConfirm()}>批量删除</Button>
                </span>
              )}
            </div>
            <StandardTable
              selectedRows={selectedRows}
              loading={loading}
              data={pageData}
              rowKey="id"
              columns={columns}
              onSelectRow={this.handleSelectRows}
              onChange={this.handleStandardTableChange}
              // hiddenCheck={true}
            />
          </div>
        </Card>
        <PermissionForm
          record={permissionItem}
          modalVisible={permissionFormModalVisible}
          loading={loading}
          handleSubmit={this.handleSubmitPermission}
          handleCloseModal={this.handleCloseModal} permissions={parentPermission}/>
      </PageHeaderLayout>
    );
  }
}
