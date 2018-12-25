import React, {Component} from 'react';
import {orderbyprops, updateuser, updateorderAndupdaterepertory} from "../../gql";
import {Spin} from 'antd';
import gql from "graphql-tag";
import {Query, Mutation} from "react-apollo";
import {Card, WhiteSpace, Button} from 'antd-mobile';
import moment from 'moment';
import 'moment/locale/zh-cn'

moment.locale('zh-cn');

class Ordered extends Component {
    render() {
        let {userID} = this.props;
        return (
            <Query query={gql(orderbyprops)} variables={{user_id: userID, orderStatus: 'success'}}>
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

                        console.log(orders);

                        return (
                            <OrderedRender
                                orders={orders}
                                tip={tip}
                            />
                        )
                    }
                }
            </Query>
        );
    }
}

export default Ordered;

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
                                            <CancelButton/>
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

class CancelButton extends Component {
    constructor(props) {
        super(props);
        this.state = {}
    }

    render() {
        return (
            <Mutation mutation={gql(updateorderAndupdaterepertory)}
            >
                {(updateorderAndupdaterepertory, {loading, error}) => {
                    if (loading)
                        return <Spin style={{marginLeft: 30, marginTop: 10}}/>;
                    if (error)
                        return 'error';
                    // 未完待续
                    return (
                        <Button type='warning' onClick={() => {
                            updateorderAndupdaterepertory({
                                variable: {
                                    order_id: '',
                                    repertory_id: '',
                                    updatedAt: new Date().getTime(),
                                    orderStatus: 'cancelled',
                                    count: 1
                                }
                            })
                        }}>取消</Button>
                    )
                }}
            </Mutation>

        )
    }
}