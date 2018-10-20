import React, {Fragment, PureComponent} from 'react';
import {connect} from 'dva';
import {Badge, Button, Card, Divider, Form, message, Modal, Select,} from 'antd';
import StandardTable from '../../components/StandardTable';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import MenuForm from '../../components/Menu/MenuForm';

import styles from '../TableList.less';

const statusMap = ['default', 'success'];
const status = ['不可用', '可用'];


@connect(({menu, loading}) => ({
  menu,
  loading: loading.models.menu,
}))


export default class MenuList extends PureComponent {
  state = {
    selectedRows: [],
  };

  componentDidMount() {
    const {dispatch} = this.props;
    dispatch({
      type: 'menu/getMenuTree',
    });
  }

  refush =()=>{
    const {dispatch} = this.props;
    dispatch({
      type: 'menu/getMenuTree',
    });
  };

  handleStandardTableChange = (pagination, filtersArg, sorter) => {
    const {dispatch} = this.props;
    const params = {
      currentPage: pagination.current,
      pageSize: pagination.pageSize,
    };
    dispatch({
      type: 'menu/getMenuTree',
      payload: params,
    });
  };

  showDeleteConfirm = (record) => {

    const confirm = Modal.confirm;
    const self = this;
    confirm({
      title: '你确定删除菜单?',
      content: '',
      okText: '确定',
      okType: 'danger',
      cancelText: '取消',
      onOk() {
        if (record){
          self.handleDelete(record);
        }else {
          self.handleBatchDelete();
        }
      },
      onCancel() {
      },
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
      type: 'menu/delete',
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


    if (record.isParent == true) {
      message.error('需要先删除子菜单');
      return;
    }
    dispatch({
      type: 'menu/delete',
      payload: {
        ids: [record.id],
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


  /**
   * 提交 添加的菜单
   * @param e
   */
  handleSubmitMenu = values => {
    const {dispatch,menu: {menuItem}} = this.props;
    values['id'] = menuItem.id;
    console.log('formvalue', values);
    dispatch({
      type: 'menu/saveOrUpdate',
      payload: values,
    }).then(()=>{
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
      type: 'menu/openMenuForm',
      payload: record,
    })


  };

  handleCloseModal = () => {
    const {dispatch} = this.props;
    dispatch({
      type: 'menu/closeMenuForm',
    })

  };

  render() {
    const {menu: {menuTree,menuFormModalVisible,menuItem}, loading} = this.props;
    const {selectedRows} = this.state;
    const columns = [
      /*{
        title: '主键',
        dataIndex: 'id',
      },*/
      {
        title: '菜单名称',
        dataIndex: 'name',
        value: 'name',
      },
      /*{
        title: '代码',
        dataIndex: 'code',
        width:120,
      },*/
      {
        title: '链接',
        dataIndex: 'url',
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
      <PageHeaderLayout title="菜单管理">
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
              data={menuTree}
              rowKey="id"
              columns={columns}
              onSelectRow={this.handleSelectRows}
              onChange={this.handleStandardTableChange}
              // hiddenCheck={true}
            />
          </div>
        </Card>
        <MenuForm record={menuItem} modalVisible={menuFormModalVisible}
                  handleSubmit={this.handleSubmitMenu}
                  handleCloseModal={this.handleCloseModal} menus={menuTree.list}/>
      </PageHeaderLayout>
    );
  }
}
