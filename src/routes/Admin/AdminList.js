import React, {Fragment, PureComponent} from 'react';
import {connect} from 'dva';
import {Badge, Button, Card, Col, Divider, Form, Input, Modal, Row, Select,} from 'antd';
import StandardTable from '../../components/StandardTable';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import RoleSelectTree from '../Role/RoleSelectTree';
import AdminForm from './AdminForm';
import styles from '../TableList.less';
const FormItem = Form.Item;
const statusMap = ['default', 'success'];
const status = ['不可用', '可用'];
@connect(({ role,admin,loading }) => ({
  role,
  admin,
  loading: loading.models.admin,
}))
@Form.create()
export default class RoleAllocation extends PureComponent {
  state = {
    roleModalVisible: false,
    selectedRows: [],
    // 搜索条件字段
    searchFields: {
      search: '',
      status:'',
    },
    page:{
      //当前页数
      current:1,
      //每页大小
      pageSize:20,
    },
    userId:null,
  };
  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'admin/list',
      payload:{...this.state.searchFields,...this.state.page}
    });
  }
  refush =()=>{
    const {dispatch} = this.props;
    dispatch({
      type: 'admin/list',
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

  /**
   * 搜索
   * @param e
   */
  handleSearch = e => {
    e.preventDefault();
    const {form } = this.props;
    form.validateFields((err, fieldsValue) => {
      if (err) return;
      this.setState({
        searchFields: fieldsValue,
        page:{...this.state.page,current: 1},
      },this.refush);
    });
  };


  /**
   * 搜索条件清空 handler
   */
  handleSearchFormReset = () => {
    const { form} = this.props;
    form.resetFields();
    this.setState({
      searchFields: {
      },
      page:{...this.state.page,current: 1},
    },this.refush);
  };


  /**
   * 显示编辑信息弹窗
   * @param record
   */
  showModalAdminForm = (record) => {
    const {dispatch} = this.props;
    dispatch({
      type: 'admin/openEdit',
      payload: record,
    });
  };


  /**
   * 提交 添加的admin
   * @param e
   */
  handleSubmitAdmin = values => {
    const {dispatch,admin:{adminItem}} = this.props;
    values['id']=adminItem.id||null;

    //更新按钮状态
    dispatch({
      type: 'admin/updateLoading',
      payload: true,
    })
    dispatch({
      type: 'admin/saveOrUpdate',
      payload: values,
    }).then(()=>{
      //更新按钮状态
      this.props.dispatch({
        type: 'admin/updateLoading',
        payload: false,
      });
      this.refush();
    });
  };

  closeModal = (type) => {
    const {dispatch} = this.props;
    dispatch({
      type: 'admin/closeModal',
      payload: {modalType: type},
    });
  };

  showDeleteConfirm=(record)=> {
    const confirm = Modal.confirm;
    let self =this;
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


  handleDelete = (record) => {
    const {dispatch} = this.props;
    if (!record) return;
    dispatch({
      type: 'admin/delete',
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
   *  角色选择提交
   */
  roleSelectSubmitHandle = values=>{

    //更新按钮状态
    this.props.dispatch({
      type: 'admin/updateLoading',
      payload: true,
    })


    this.props.dispatch({
      type: 'role/updateUserRoles',
      payload: {
        userId:this.state.userId,
        roleIds:values.map(item=>{
          return parseInt(item);
        })
      },
    }).then(()=>{
      //更新按钮状态
      this.props.dispatch({
        type: 'admin/updateLoading',
        payload: false,
      })
    });
  };

  roleSelectHidenModal =()=>{
    this.setState({
      roleModalVisible:false
    });
  };

  roleSelectShowModal =(record)=>{

    /**
     * 请求数据
     */
    this.props.dispatch({
      type: 'role/querySingleUserRole',
      payload:record.id
    });
    this.setState({
      roleModalVisible:true,
      userId:record.id
    });
  };

  renderSimpleForm() {
    const { getFieldDecorator } = this.props.form;
    return (
      <Form onSubmit={this.handleSearch} layout="inline">
        <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
          <Col md={8} sm={24}>
            <FormItem label="用户名">
              {getFieldDecorator('search')(<Input placeholder="请输入" />)}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <span className={styles.submitButtons}>
              <Button type="primary" htmlType="submit">
                查询
              </Button>
              <Button style={{ marginLeft: 8 }} onClick={this.handleSearchFormReset}>
                重置
              </Button>
            </span>
          </Col>
        </Row>
      </Form>
    );
  }

  render() {
    const {role:{ userRoles },admin:{pageData,adminFormModalVisible,adminItem,adminFormOption,loading} ,} = this.props;

    const { selectedRows } = this.state;
    const columns = [
      /*{
        title: '主键',
        dataIndex: 'id',
      },*/
      {
        title: '用户名称',
        dataIndex: 'username',
      },
      {
        title: '用户昵称',
        dataIndex: 'nickname',
      },
      {
        title: '邮箱',
        dataIndex: 'email',
      },
      {
        title: '手机号',
        dataIndex: 'telephone',
      },
      {
        title: '用户状态',
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
          return <Badge status={statusMap[val]} text={status[val]} />;
        },
      },
      {
        title: '操作',
        render: (record) => (
          <Fragment>
            <a onClick={() => this.showModalAdminForm(record)}>编辑</a>
            <Divider type="vertical"/>
            <a onClick={() => this.showDeleteConfirm(record)}>删除</a>
            <Divider type="vertical"/>
            <a onClick={()=>this.roleSelectShowModal(record)}>分配角色</a>

          </Fragment>
        ),
      },
    ];

    return (
      <PageHeaderLayout title="系统用户列表">
        <Card bordered={false}>
          <div className={styles.tableList}>
            <div className={styles.tableListForm}>{this.renderSimpleForm()}</div>
            <div className={styles.tableListOperator}>
              <Button icon="plus" type="primary" onClick={() => this.showModalAdminForm([])}>
                新建
              </Button>
            </div>
            <StandardTable
              selectedRows={selectedRows}
              hiddenCheck={true}
              loading={this.props.loading}
              data={pageData}
              rowKey="id"
              columns={columns}
              onSelectRow={this.handleSelectRows}
              onChange={this.handleStandardTableChange}
            />
          </div>
        </Card>

        <AdminForm
          title={`${adminFormOption}管理员`}
          loading={loading}
          record={adminItem} modalVisible={adminFormModalVisible}
          handleSubmit={this.handleSubmitAdmin}
          handleCloseModal={(p) => this.closeModal('admin')}/>

        <RoleSelectTree
          modalVisible={this.state.roleModalVisible}
          loading={loading}
          treeData={userRoles}
          handleSubmit={this.roleSelectSubmitHandle}
          handleCloseModal={this.roleSelectHidenModal}
        />
      </PageHeaderLayout>
    );
  }
}
