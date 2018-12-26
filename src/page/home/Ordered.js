import React, {Component} from 'react';
import {orderbyprops, repertorybyid, updateorderAndupdaterepertory} from "../../gql";
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

                        return (
                            <OrderedRender
                                orders={orders}
                                tip={tip}
                                userID={userID}
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
        let {orders, tip, userID} = this.props;
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
                                            <CancelButton
                                                repertoryID={order.service_id.repertory_id.id}
                                                orderID={order.id}
                                                userID={userID}
                                            />
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
        let {repertoryID, orderID, userID} = this.props;
        return (
            <Query query={gql(repertorybyid)} variables={{id: repertoryID}}>
                {
                    ({loading, error, data}) => {
                        if (loading) {
                            return <Spin className={'spin'}/>
                        }
                        if (error) {
                            return 'error!';
                        }
                        let count = data.repertorybyid.count;
                        return (
                            <Mutation
                                mutation={gql(updateorderAndupdaterepertory)}
                                refetchQueries={[{query: gql(orderbyprops), variables: {user_id: userID, orderStatus: 'success'}}, {query: gql(orderbyprops), variables: {user_id: userID, orderStatus: 'cancelled'}}]}
                            >
                                {(updateBothTwo, {loading, error}) => {
                                    if (loading)
                                        return <Spin style={{marginLeft: 30, marginTop: 10}}/>;
                                    if (error)
                                        return 'error';
                                    let varObj = {
                                        order_id: orderID,
                                        repertory_id: repertoryID,
                                        updatedAt: new Date().getTime(),
                                        orderStatus: 'cancelled',
                                        count: count+1
                                    };
                                    return (
                                        <Button type='warning' onClick={() => {
                                            updateBothTwo({variables: varObj})
                                        }}>取消</Button>
                                    )
                                }}
                            </Mutation>
                        )
                    }
                }
            </Query>

        )
    }
}