import React, {Fragment, PureComponent} from 'react';
import {connect} from 'dva';
import {Badge, Button, Card, Col, Dropdown, Form, Icon, Input, Menu, message, Modal, Row, Select,} from 'antd';
import StandardTable from '../../components/StandardTable';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import RoleSelectTree from './RoleSelectTree';
import styles from '../TableList.less';
const FormItem = Form.Item;
const statusMap = ['default', 'success'];
const status = ['不可用', '可用'];
@connect(({ role, loading }) => ({
  role,
  loading: loading.models.role,
}))
@Form.create()
export default class RoleAllocation extends PureComponent {
  state = {
    roleModalVisible: false,
    selectedRows: [],
    // 搜索条件字段
    searchFields: {
      search:'',
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
      type: 'role/pageUserRoles',
      payload:{...this.state.searchFields,...this.state.page}
    });
  }
  refush =()=>{
    const { dispatch } = this.props;
    dispatch({
      type: 'role/pageUserRoles',
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

  showDeleteConfirm=()=> {
    const confirm = Modal.confirm;
    confirm({
      title: '你确定删除选中的数据?',
      content: '',
      okText: '确定',
      okType: 'danger',
      cancelText: '取消',
      onOk() {
        message.error('不需要删除');
      },
      onCancel() {
      },
    });
  };

  handleMenuClick = e => {
    const { dispatch } = this.props;
    const { selectedRows } = this.state;
    if (!selectedRows) return;
    switch (e.key) {
      case 'remove':
        dispatch({
          type: 'rule/remove',
          payload: {
            id: selectedRows.map(row => row.id).join(','),
          },
          callback: () => {
            this.setState({
              selectedRows: [],
            });
          },
        });
        break;
      default:
        break;
    }
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

    this.props.dispatch({
      type: 'role/updateUserRoles',
      payload: {
        userId:this.state.userId,
        roleIds:values.map(item=>{
          return parseInt(item);
        })
      },
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
    const { role: { pageData },role:{ userRoles },loading } = this.props;
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
        width:120,
      },
      {
        title: '角色名称',
        dataIndex: 'roleNames',
        width:300,
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
            <a onClick={()=>this.roleSelectShowModal(record)}>分配角色</a>
          </Fragment>
        ),
      },
    ];

    const menu = (
      <Menu onClick={this.handleMenuClick} selectedKeys={[]}>
        <Menu.Item key="remove">删除</Menu.Item>
        <Menu.Item key="approval">批量审批</Menu.Item>
      </Menu>
    );
    return (
      <PageHeaderLayout title="角色分配">
        <Card bordered={false}>
          <div className={styles.tableList}>
            <div className={styles.tableListForm}>{this.renderSimpleForm()}</div>
            <div className={styles.tableListOperator}>
              {selectedRows.length > 0 && (
                <span>

                  <Button onClick={this.showDeleteConfirm}>批量删除</Button>
                  <Dropdown overlay={menu}>
                    <Button>
                      更多操作 <Icon type="down" />
                    </Button>
                  </Dropdown>
                </span>
              )}
            </div>
            <StandardTable
              selectedRows={selectedRows}
              hiddenCheck={true}
              loading={loading}
              data={pageData}
              rowKey="id"
              columns={columns}
              onSelectRow={this.handleSelectRows}
              onChange={this.handleStandardTableChange}
            />
          </div>
        </Card>
        <RoleSelectTree
          modalVisible={this.state.roleModalVisible}
          treeData={userRoles}
          handleSubmit={this.roleSelectSubmitHandle}
          handleCloseModal={this.roleSelectHidenModal}
        />
      </PageHeaderLayout>
    );
  }
}
