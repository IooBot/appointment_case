import React, {Component} from 'react';
import {
    createorderAndupdaterepertory,
    orderbyprops,
    repertorybyid,
    updateuser,
    userbyid,
    createorderAndupdaterepertoryAndupdateuser
} from "../../gql";
import gql from "graphql-tag";
import {Query, Mutation} from "react-apollo";
import {InputItem, Toast, List, Button, Stepper, Icon, NavBar, Switch, ActivityIndicator} from 'antd-mobile';
import {idGen} from "../../func";
import {createForm} from 'rc-form';

const Item = List.Item;

class Ordering extends Component {
    constructor(props) {
        super(props);
        this.state = {}
    }

    render() {
        let {repertoryID, serviceID, donotShowOrdering, userID} = this.props;
        return (
            <div>
                <NavBar
                    mode="light"
                    icon={<Icon type="left"/>}
                    onLeftClick={donotShowOrdering}
                >服务项详情</NavBar>
                <Query query={gql(userbyid)} variables={{id: userID}}>
                    {
                        ({loading, error, data}) => {
                            if (loading) {
                                return (
                                    <div className="loading">
                                        <div className="align">
                                            <ActivityIndicator text="Loading..." size="large"/>
                                        </div>
                                    </div>
                                )
                            }
                            if (error) {
                                return 'error!';
                            }

                            let user = data.userbyid;
                            let tip = '';
                            if (user === null) {
                                tip = '还没登录，出现了错误'
                            }

                            return (
                                <div>
                                    {
                                        tip ?
                                            <div className={'center'}>{tip}</div>
                                            :
                                            ''
                                    }
                                    <MessageWrapper
                                        user={user}
                                        userID={user.id}
                                        repertoryID={repertoryID}
                                        serviceID={serviceID}
                                        donotShowOrdering={donotShowOrdering}
                                    />
                                </div>
                            )
                        }
                    }
                </Query>
            </div>

        )
    }
}

export default Ordering;


class Message extends Component {
    constructor(props) {
        super(props);
        this.state = {
            hasError: false,
            defaultPhone: props.user.telephone,
            defaultName: props.user.nickname,
            name: '',
            phone: '',
            tempName: '',
            tempPhone: '',
            remark: '',
            people: 1
        };
    }

    onErrorClick = () => {
        if (this.state.hasError) {
            Toast.info('请输入11位手机号码');
        }
    };

    onChange = (phone) => {
        if (phone.replace(/\s/g, '').length < 11) {
            this.setState({
                hasError: true,
            });
        } else {
            this.setState({
                hasError: false,
            });
        }
        this.setState({
            phone,
        });
    };

    somethingChange = (something) => {
        return (value) => {
            this.setState({
                [something]: value
            });
        };
    };


    render() {
        let {defaultName, defaultPhone, hasError, name, phone, people, remark, tempName, tempPhone} = this.state;
        let {repertoryID, serviceID, userID, donotShowOrdering} = this.props;
        const {getFieldProps} = this.props.form;
        return (
            <form>
                <List renderHeader={() => '填写你的信息'}>
                    <InputItem
                        placeholder="请输入联系人姓名"
                        value={name}
                        onChange={this.somethingChange('name')}
                    >姓名</InputItem>
                    <InputItem
                        type="phone"
                        placeholder="请输入手机号码"
                        error={hasError}
                        onErrorClick={this.onErrorClick}
                        onChange={this.onChange}
                        value={phone}
                    >手机号码</InputItem>

                    {
                        defaultName && defaultPhone ?
                            <Item extra={
                                <Switch {...getFieldProps('1', {initialValue: false, valuePropName: 'checked'})}
                                        onClick={(checked) => {
                                            if (checked) {
                                                this.setState({
                                                    tempName: name,
                                                    tempPhone: phone,
                                                    name: defaultName,
                                                    phone: defaultPhone,
                                                });
                                            } else {
                                                this.setState({
                                                    tempName: '',
                                                    tempPhone: '',
                                                    name: tempName,
                                                    phone: tempPhone,
                                                })
                                            }
                                        }}
                                />}
                            >为自己预约?</Item>
                            :
                            ''
                    }

                    <Item
                        wrap
                        extra={
                            <Stepper
                                style={{width: '100%', minWidth: '100px'}}
                                showNumber
                                min={1}
                                value={people}
                                onChange={this.somethingChange('people')}
                            />}
                    >
                        人数
                    </Item>
                    <InputItem
                        placeholder="留言给店家"
                        value={remark}
                        onChange={this.somethingChange('remark')}
                    >留言</InputItem>
                </List>

                {
                    defaultName && defaultPhone ?
                        <OrderButton
                            userID={userID}
                            repertoryID={repertoryID}
                            serviceID={serviceID}
                            telephone={phone}
                            name={name}
                            remark={remark}
                            people={people}
                            donotShowOrdering={donotShowOrdering}
                        />
                        :
                        <SaveAndOrderButton
                            userID={userID}
                            repertoryID={repertoryID}
                            serviceID={serviceID}
                            telephone={phone}
                            name={name}
                            remark={remark}
                            people={people}
                            donotShowOrdering={donotShowOrdering}
                        />
                }
            </form>
        );
    }
}

const MessageWrapper = createForm()(Message);

class SaveAndOrderButton extends Component {
    constructor(props) {
        super(props);
        this.state = {}
    }

    render() {
        let {repertoryID, serviceID, userID, telephone, name, donotShowOrdering, remark, people} = this.props;
        return (
            <Query query={gql(repertorybyid)} variables={{id: repertoryID}}>
                {
                    ({loading, error, data}) => {
                        if (loading) {
                            return (
                                <div className="loading">
                                    <div className="align">
                                        <ActivityIndicator text="Loading..." size="large"/>
                                    </div>
                                </div>
                            )
                        }
                        if (error) {
                            return 'error!';
                        }
                        let count = data.repertorybyid.count;
                        if (count <= 0) {
                            return (
                                <Mutation
                                    mutation={gql(updateuser)}
                                    refetchQueries={[{query: gql(userbyid), variables: {id: userID}}]}
                                >
                                    {(updateuser, {loading, error}) => {
                                        if (loading)
                                            return (
                                                <div className="loading">
                                                    <div className="align">
                                                        <ActivityIndicator text="Loading..." size="large"/>
                                                    </div>
                                                </div>
                                            );
                                        if (error)
                                            return 'error';
                                        return (
                                            <Button type={'primary'} onClick={() => {
                                                updateuser({
                                                    variables: {
                                                        id: userID,
                                                        telephone,
                                                        nickname: name,
                                                        updatedAt: new Date().getTime()
                                                    }
                                                });
                                                donotShowOrdering();
                                            }}>名额已满，点击保存联系人</Button>
                                        )
                                    }}
                                </Mutation>
                            )
                        } else {
                            return (
                                <Mutation
                                    mutation={gql(createorderAndupdaterepertoryAndupdateuser)}
                                    refetchQueries={[
                                        {
                                            query: gql(orderbyprops),
                                            variables: {user_id: userID, orderStatus: 'success'}
                                        },
                                        {query: gql(orderbyprops), variables: {orderStatus: 'success'}},
                                        {query: gql(orderbyprops), variables: {}},
                                        {query: gql(userbyid), variables: {id: userID}}
                                    ]}
                                >
                                    {(iwantu, {loading, error}) => {
                                        if (loading)
                                            return (
                                                <div className="loading">
                                                    <div className="align">
                                                        <ActivityIndicator text="Loading..." size="large"/>
                                                    </div>
                                                </div>
                                            );
                                        if (error)
                                            return 'error';
                                        let varObj = {
                                            user_id: userID,
                                            service_id: serviceID,
                                            repertory_id: repertoryID,
                                            order_id: idGen('order'),
                                            payStatus: '',
                                            remark,
                                            payCount: '',
                                            payTime: '',
                                            customerNumber: people,
                                            orderStatus: 'success',
                                            createdAt: new Date().getTime(),
                                            updatedAt: new Date().getTime(),
                                            count: count - 1,
                                            contactTelephone: telephone,
                                            contactName: name
                                        };
                                        return (
                                            <Button type='primary' onClick={() => {
                                                iwantu({variables: varObj});
                                                donotShowOrdering();
                                            }}>预约</Button>
                                        )
                                    }}
                                </Mutation>
                            )
                        }

                    }
                }
            </Query>

        )
    }
}

class OrderButton extends Component {
    constructor(props) {
        super(props);
        this.state = {}
    }

    render() {
        let {repertoryID, serviceID, userID, telephone, name, donotShowOrdering, remark, people} = this.props;
        return (
            <Query query={gql(repertorybyid)} variables={{id: repertoryID}}>
                {
                    ({loading, error, data}) => {
                        if (loading) {
                            return (
                                <div className="loading">
                                    <div className="align">
                                        <ActivityIndicator text="Loading..." size="large"/>
                                    </div>
                                </div>
                            )
                        }
                        if (error) {
                            return 'error!';
                        }
                        let count = data.repertorybyid.count;
                        if (count <= 0) {
                            return (
                                <div className={'center'}>名额已满</div>
                            )
                        } else {
                            return (
                                <Mutation
                                    mutation={gql(createorderAndupdaterepertory)}
                                    refetchQueries={[
                                        {
                                            query: gql(orderbyprops),
                                            variables: {user_id: userID, orderStatus: 'success'}
                                        },
                                        {query: gql(orderbyprops), variables: {orderStatus: 'success'}},
                                        {query: gql(orderbyprops), variables: {}}
                                    ]}
                                >
                                    {(iwantu, {loading, error}) => {
                                        if (loading)
                                            return (
                                                <div className="loading">
                                                    <div className="align">
                                                        <ActivityIndicator text="Loading..." size="large"/>
                                                    </div>
                                                </div>
                                            );
                                        if (error)
                                            return 'error';
                                        let varObj = {
                                            user_id: userID,
                                            service_id: serviceID,
                                            repertory_id: repertoryID,
                                            order_id: idGen('order'),
                                            payStatus: '',
                                            remark,
                                            payCount: '',
                                            payTime: '',
                                            customerNumber: people,
                                            orderStatus: 'success',
                                            createdAt: new Date().getTime(),
                                            updatedAt: new Date().getTime(),
                                            count: count - 1,
                                            contactTelephone: telephone,
                                            contactName: name
                                        };
                                        return (
                                            <Button type='primary' onClick={() => {
                                                iwantu({variables: varObj});
                                                donotShowOrdering();
                                            }} style={{margin: '5px 10px'}}>预约</Button>
                                        )
                                    }}
                                </Mutation>
                            )
                        }

                    }
                }
            </Query>
        )
    }
}