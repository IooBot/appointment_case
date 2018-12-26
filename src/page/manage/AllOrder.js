import React, { Component } from 'react';
import './index.css';
import { createForm } from 'rc-form';
import { NoticeBar,Picker } from 'antd-mobile';
import {Spin} from 'antd';
import gql from "graphql-tag";
import {Query} from "react-apollo";
import {adminorderbyprops} from "../../gql";
import {Card, WhiteSpace} from 'antd-mobile';
import moment from 'moment';
import 'moment/locale/zh-cn'
moment.locale('zh-cn');

const data = [
    {
        "value": "success",
        "label": "成功",
    },
    {
        "value": "cancelled",
        "label": "已取消",
    },
    {
        "value": "deleted",
        "label": "已删除",
    },
    {
        "value": "",
        "label": "全部",
    }
];

const CustomChildren = props => (
    <div
        onClick={props.onClick}
        style={{ backgroundColor: '#fff', paddingLeft: 15 }}
    >
        <div className="test" style={{ display: 'flex', height: '45px', lineHeight: '45px' }}>
            <div style={{ flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{props.children}</div>
            <div style={{ textAlign: 'right', color: '#888', marginRight: 15 }}>{props.extra}</div>
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
        const { getFieldProps } = this.props.form;
        return (
            <div>
                <NoticeBar mode="closable" marqueeProps={{ loop: true, style: { padding: '0 7.5px' } }}>
                    只有管理员的微信才能看到此界面，此处作为样例全部展示
                </NoticeBar>
                <Picker data={data} cols={1} {...getFieldProps('district3')} className="forss"
                        value={this.state.sValue}
                        onChange={v => this.setState({ sValue: v })}
                        onOk={v => this.setState({ sValue: v })}
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
            <Query query={gql(adminorderbyprops)} variables={orderStatus? {orderStatus}: {}}>
                {
                    ({loading, error, data}) => {
                        if (loading) {
                            return <Spin className={'spin'}/>
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
                        <div>{tip}</div>
                        :
                        ''
                }

                {
                    orders.map((order) => {
                        return (
                            <div key={order.id}>
                                <WhiteSpace size="lg"/>
                                <Card full>
                                    <Card.Body>
                                        <div className={'card'}>
                                            <div>预约: {order.service_id.server_id.name} - {order.service_id.price}元</div>
                                            <div>人数: {order.customerNumber}</div>
                                            <div>留言: {order.remark}</div>
                                            <div>时间: {moment(Number(order.service_id.startTime)).format("YYYY-MM-DD HH:mm:ss")}</div>
                                        </div>
                                    </Card.Body>
                                </Card>
                            </div>
                        )
                    })
                }
            </div>
        )
    }
}


export default createForm()(AllOrder);