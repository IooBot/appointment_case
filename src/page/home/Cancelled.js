import React, { Component } from 'react';
import {orderbyprops} from "../../gql";
import {Spin} from 'antd';
import gql from "graphql-tag";
import {Query} from "react-apollo";
import {Card, WhiteSpace, Button} from 'antd-mobile';
import moment from 'moment';
import 'moment/locale/zh-cn'
moment.locale('zh-cn');

class Cancelled extends Component {
    render() {
        let {userID} = this.props;
        return (
            <Query query={gql(orderbyprops)} variables={{user_id: userID, orderStatus: 'cancelled'}}>
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
                            tip = '还没有取消的订单'
                        }

                        console.log(orders);

                        return (
                            <CancelledRender
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

export default Cancelled;

class CancelledRender extends Component {
    constructor(props) {
        super(props);
        this.state = {

        }
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
                    orders.map((order)=> {
                        return (
                            <div key={order.id}>
                                <WhiteSpace size="lg"/>
                                <Card full>
                                    <Card.Body>
                                        <div className={'card'}>
                                            <div>预约: {order.service_id.server_id.name} - {order.service_id.price}元</div>
                                            <div>留言: {order.remark}</div>
                                            <div>预约时间: {moment(Number(order.service_id.startTime)).format("YYYY-MM-DD HH:mm:ss")}</div>
                                            <div>取消时间: {moment(Number(order.updatedAt)).format("YYYY-MM-DD HH:mm:ss")}</div>
                                            <Button type='warning' onClick={()=>{}}>删除</Button>
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