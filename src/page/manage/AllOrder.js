import React, {Component} from 'react';
import './index.css';
import {createForm} from 'rc-form';
import {Picker} from 'antd-mobile';
import gql from "graphql-tag";
import {Query} from "react-apollo";
import {adminorderbyprops} from "../../gql";
import {Card, WhiteSpace, ActivityIndicator, WingBlank} from 'antd-mobile';
import moment from 'moment';
import 'moment/locale/zh-cn'
import {Row, Col} from 'antd';

moment.locale('zh-cn');

const data = [
    {
        "value": "success",
        "label": "成功（可选）",
    },
    {
        "value": "cancelled",
        "label": "已取消（可选）",
    },
    {
        "value": "deleted",
        "label": "已删除（可选）",
    },
    {
        "value": "",
        "label": "全部（可选）",
    }
];

const CustomChildren = props => (
    <div
        onClick={props.onClick}
        style={{backgroundColor: '#fff', paddingLeft: 15}}
    >
        <div className="test" style={{display: 'flex', height: '45px', lineHeight: '45px'}}>
            <div style={{
                flex: 1,
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap'
            }}>{props.children}</div>
            <div style={{textAlign: 'right', color: '#888', marginRight: 15}}>{props.extra}</div>
        </div>
    </div>
);


class AllOrder extends Component {
    constructor(props) {
        super(props);
        this.state = {
            sValue: ['success']
        }
    }

    render() {
        const {getFieldProps} = this.props.form;
        return (
            <div>
                <WhiteSpace/>
                <Picker
                    data={data}
                    cols={1}
                    {...getFieldProps('district3')}
                    className="forss"
                    value={this.state.sValue}
                    onChange={v => this.setState({sValue: v})}
                    onOk={v => this.setState({sValue: v})}
                >
                    <CustomChildren>选择订单类型</CustomChildren>
                </Picker>
                <AdminShowOrders
                    orderStatus={this.state.sValue[0]}
                />
            </div>
        )
    }
}


class AdminShowOrders extends Component {
    render() {
        let {orderStatus} = this.props;
        return (
            <Query query={gql(adminorderbyprops)} variables={orderStatus ? {orderStatus} : {}}>
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

                        let orders = data.orderbyprops;
                        let tip = '';
                        if (orders.length === 0) {
                            orders = [];
                            tip = '还没有订单'
                        }

                        return (
                            <OrderedRender
                                orders={orders}
                                tip={tip}
                            />
                        )
                    }
                }
            </Query>
        )
    }
}

class OrderedRender extends Component {
    constructor(props) {
        super(props);
        this.state = {}
    }

    render() {
        let {orders, tip} = this.props;
        return (
            <div>
                {
                    tip ?
                        <div className={'center-fix'}>{tip}</div>
                        :
                        ''
                }

                {
                    orders.map((order) => {
                        return (
                            <div key={order.id}>
                                <WingBlank size="lg">
                                    <WhiteSpace size="lg"/>
                                    <Card className={'card'}>
                                        <Card.Body>
                                            <div>
                                                <Row>
                                                    <Col span={20}>
                                                        <div
                                                            className={'order-name'}>{order.serverName}</div>
                                                    </Col>
                                                    <Col span={4}>
                                                        <div className={'order-price'}>{order.servicePrice}</div>
                                                    </Col>
                                                </Row>
                                                <div>人数: {order.customerNumber}</div>
                                                <div
                                                    className={'order-remark'}>留言: {order.remark ? order.remark : '无'}</div>
                                                <div>预约人: {order.contactName}</div>
                                                <div>联系方式: {order.contactTelephone}</div>
                                                <div>预约账号: {order.user_id.username? order.user_id.username: '用户通过微信登录'}</div>
                                                <div
                                                    className={'order-time'}>预约时间: {moment(Number(order.serviceStartTime)).format("YYYY-MM-DD HH:mm:ss")}</div>
                                                <div
                                                    className={'order-time'}>下单时间: {moment(Number(order.createdAt)).format("YYYY-MM-DD HH:mm:ss")}</div>
                                            </div>
                                        </Card.Body>
                                    </Card>
                                </WingBlank>
                            </div>
                        )
                    })
                }
            </div>
        )
    }
}


export default createForm()(AllOrder);