import React, {Fragment, PureComponent} from 'react';
import {connect} from 'dva';
import {Badge, Button, Card, Divider, Form, Modal,} from 'antd';
import StandardTable from '../../components/StandardTable';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import RoleForm from './RoleForm';
import MenuTree from '../Menu/MenuTree';
import PermissionTree from '../Permission/PermissionTree';
import styles from '../TableList.less';

const statusMap = ['default', 'success'];
const status = ['不可用', '可用'];
@connect(({role, loading}) => ({
  role,
  loading: loading.models.role,
}))
@Form.create()
export default class RoleList extends PureComponent {
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
  };
  componentDidMount() {
    const {dispatch} = this.props;
    dispatch({
      type: 'role/page',
      payload:{...this.state.searchFields,...this.state.page}
    });
  }
  refush =()=>{
    const {dispatch} = this.props;
    dispatch({
      type: 'role/page',
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

  //批量刪除显示
  showDeleteConfirm = (record) => {
    const confirm = Modal.confirm;
    const self = this;
    confirm({
      title: '你确定删除选中的数据?',
      content: '',
      okText: '确定',
      okType: 'danger',
      cancelText: '取消',
      onOk() {
        self.handleDelete(record);
      },
      onCancel() {
      },
    });
  };
//批量删除业务处理
  handleBatchDelete = () => {
    const {dispatch} = this.props;
    const {selectedRows} = this.state;
    if (!selectedRows) return;
    dispatch({
      type: 'role/delete',
      payload: {
        ids: selectedRows.map(row => row.id),
      },
    }).then(()=>{
      this.refush();
    });
  };

  handleDelete = (record) => {
    const {dispatch} = this.props;
    if (!record) return;
    dispatch({
      type: 'role/delete',
      payload: {
        ids: [record.id],
      },
    }).then(()=>{
      this.refush();
    });

  };

  //存储多选内容
  handleSelectRows = rows => {
    this.setState({
      selectedRows: rows,
    });
  };

  /**
   * 树形结构,选中的value
   * @param checkedKeys
   */
  onChangeSelectKeys = (checkedKeys) => {
      const {dispatch} = this.props;
      dispatch({
        type: 'role/updateCheckedKeys',
        payload:checkedKeys
      });
  };


  /**
   * 提交 添加的角色
   * @param e
   */
  handleSubmitRole = values => {
    const {dispatch,role:{roleItem}} = this.props;
    console.log('formvalue3', values);
    values['id']=roleItem.id||null;
    dispatch({
      type: 'role/saveOrUpdate',
      payload: values,
    }).then(()=>{
      this.refush();
    });
  };

//菜单授权提交
  handleSubmitRoleMenu = () => {
    const {dispatch,role:{checkedKeys,roleMenu}} = this.props;

    let vaildKey=checkedKeys.map(item=>{
      return parseInt(item);
    });
    //更新按钮状态
    dispatch({
      type: 'role/updateLoading',
      payload: true,
    })
    dispatch({
      type: 'role/updateMenus',
      payload: {
        menusIds:vaildKey
      },
    }).then(()=>{
      //更新按钮状态
      dispatch({
        type: 'role/updateLoading',
        payload: false,
      })
    });


  };

//角色资源提交
  handleSubmitRolePermission = () => {
    const {dispatch,role:{checkedKeys,rolePermission}} = this.props;
    let parentKey = rolePermission.map(item=>{
      return(item.key);
    });
    let vaildKey=checkedKeys.map(item=>{
      return parseInt(item);
    }).filter(item =>
      parentKey.indexOf(item)==-1
    );

    //更新按钮状态
    dispatch({
      type: 'role/updateLoading',
      payload: true,
    })

    dispatch({
      type: 'role/updatePermission',
      payload: {
        permissionIds:vaildKey
      },
    }).then(()=>{
      //更新按钮状态
      dispatch({
        type: 'role/updateLoading',
        payload: false,
      })
    });

  };

  /**
   * 显示角色信息弹窗
   * @param record
   */
  showModalRoleForm = (record) => {
    const {dispatch} = this.props;
    dispatch({
      type: 'role/openEdit',
      payload: record,
    });
  };

  /**
   * 显示菜单树弹窗
   * @param record
   */
  showModalRoleMenu = (record) => {
    const {dispatch} = this.props;
    dispatch({
      type: 'role/showModalRoleMenu',
      payload: {record: record},
    });

  };

  /**
   * 显示资源树弹窗
   * @param record
   */
  showModalRolePermission = (record) => {
    const {dispatch} = this.props;

    dispatch({
      type: 'role/showModalRolePermission',
      payload: {record: record},
    });
  };

  closeModal = (type) => {
    const {dispatch} = this.props;
    dispatch({
      type: 'role/closeModal',
      payload: {modalType: type},
    });
  };


  render() {
    const {role: {pageData, roleMenu, rolePermission, roleFormModalVisible,
      roleItem, permissionAuthModalVisible, menuAuthModalVisible,roleFormOption,checkedKeys,loading} } = this.props;
    const {selectedRows} = this.state;
    const columns = [
      /*{
        title: '主键',
        dataIndex: 'id',
      },*/
      {
        title: '角色代码',
        dataIndex: 'code',
      },
      {
        title: '角色名称',
        dataIndex: 'name',
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
            <a onClick={() => this.showModalRoleForm(record)}>编辑</a>
            <Divider type="vertical"/>
            <a onClick={() => this.showDeleteConfirm(record)}>删除</a>
            <Divider type="vertical"/>
            <a onClick={() => this.showModalRoleMenu(record)}>菜单授权</a>
            <Divider type="vertical"/>
            <a onClick={() => this.showModalRolePermission(record)}>资源授权</a>
          </Fragment>
        ),
      },
    ];
    return (
      <PageHeaderLayout title="角色管理">
        <Card bordered={false}>
          <div className={styles.tableList}>
            <div className={styles.tableListOperator}>
              <Button icon="plus" type="primary" onClick={() => this.showModalRoleForm([])}>
                新建
              </Button>
              {selectedRows.length > 0 && (
                <span>
                  <Button onClick={()=>this.showDeleteConfirm()}>批量删除</Button>
                </span>
              )}
            </div>
            <StandardTable
              selectedRows={selectedRows}
              loading={this.props.loading}
              hiddenCheck={true}
              data={pageData}
              rowKey="id"
              columns={columns}
              onSelectRow={this.handleSelectRows}
              onChange={this.handleStandardTableChange}
            />
          </div>
        </Card>
        <RoleForm title={`${roleFormOption}角色`} record={roleItem} modalVisible={roleFormModalVisible}
                  handleSubmit={this.handleSubmitRole}
                  handleCloseModal={(p) => this.closeModal('role')}/>
        <MenuTree
          treeData={roleMenu}
          checkedKeys={checkedKeys}
          loading={loading}
          onCheck={this.onChangeSelectKeys}
          modalVisible={menuAuthModalVisible}
          handleSubmit={this.handleSubmitRoleMenu}
          handleCloseModal={(p) => this.closeModal('authMenu')}
        />

        <PermissionTree
          treeData={rolePermission}
          checkedKeys={checkedKeys}
          onCheck={this.onChangeSelectKeys}
          loading={loading}
          modalVisible={permissionAuthModalVisible}
          handleSubmit={this.handleSubmitRolePermission}
          handleCloseModal={(p) => this.closeModal('authPermission')}
        />
      </PageHeaderLayout>
    );
  }
}
