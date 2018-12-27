import React, {Component} from 'react';
import {orderbyprops, repertorybyid, updateorderAndupdaterepertory} from "../../gql";
import gql from "graphql-tag";
import {Query, Mutation} from "react-apollo";
import {Card, WhiteSpace, Button, ActivityIndicator, WingBlank} from 'antd-mobile';
import {Row, Col} from 'antd';
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
                                                    <Col span={14}>
                                                        <div className={'order-name'}>{order.service_id.server_id.name}</div>
                                                        <div className={'order-price'}>{order.service_id.price}</div>
                                                        <div className={'order-time'}>{moment(Number(order.service_id.startTime)).format("YYYY-MM-DD HH:mm:ss")}</div>
                                                    </Col>
                                                    <Col span={6}>
                                                        <div className={'order-people'}>{order.customerNumber}人</div>
                                                        <div className={'order-remark'}>留言: {order.remark?order.remark:'无'}</div>
                                                    </Col>
                                                    <Col span={4}>
                                                        <CancelButton
                                                            repertoryID={order.service_id.repertory_id.id}
                                                            orderID={order.id}
                                                            userID={userID}
                                                        />
                                                    </Col>
                                                </Row>
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
                        return (
                            <Mutation
                                mutation={gql(updateorderAndupdaterepertory)}
                                refetchQueries={[
                                    {query: gql(orderbyprops), variables: {user_id: userID, orderStatus: 'success'}},
                                    {query: gql(orderbyprops), variables: {user_id: userID, orderStatus: 'cancelled'}},
                                    {query: gql(orderbyprops), variables: {orderStatus: 'success'}},
                                    {query: gql(orderbyprops), variables: {orderStatus: 'cancelled'}},
                                    {query: gql(orderbyprops), variables: {}}
                                ]}
                            >
                                {(updateBothTwo, {loading, error}) => {
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
                                        order_id: orderID,
                                        repertory_id: repertoryID,
                                        updatedAt: new Date().getTime(),
                                        orderStatus: 'cancelled',
                                        count: count + 1
                                    };
                                    return (
                                        <Button type='warning' inline size={'small'} onClick={() => {
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