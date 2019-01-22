import React, {Component} from 'react';
import {orderbyprops, updateorder} from "../../gql";
// import {deleteorder} from "../../gql";
import gql from "graphql-tag";
import {Query, Mutation} from "react-apollo";
import {Card, WhiteSpace, Button, ActivityIndicator, WingBlank} from 'antd-mobile';
import moment from 'moment';
import 'moment/locale/zh-cn'
import {Row, Col} from 'antd';

moment.locale('zh-cn');

class Cancelled extends Component {
    render() {
        let {userID} = this.props;
        return (
            <Query query={gql(orderbyprops)} variables={{user_id: userID, orderStatus: 'cancelled'}}>
                {
                    ({loading, error, data}) => {
                        if (loading) {
                            return (
                                <div className="tab-center">
                                    <ActivityIndicator text="Loading..." size="large"/>z
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
                            tip = '还没有取消的订单'
                        }

                        return (
                            <CancelledRender
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

export default Cancelled;

class CancelledRender extends Component {
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
                                                        <div
                                                            className={'order-name'}>{order.service_id.server_id.name}</div>
                                                    </Col>
                                                    <Col span={6}>
                                                        <div
                                                            className={'order-remark'}>留言: {order.remark ? order.remark : '无'}</div>
                                                    </Col>
                                                    <Col span={4}>
                                                        {/*<DeleteButton1*/}
                                                        {/*orderID={order.id}*/}
                                                        {/*userID={userID}*/}
                                                        {/*/>*/}
                                                        <DeleteButton2
                                                            orderID={order.id}
                                                            userID={userID}
                                                        />
                                                    </Col>
                                                </Row>
                                                <Row>
                                                    <div
                                                        className={'order-time'}>预约于: {moment(Number(order.service_id.startTime)).format("YYYY-MM-DD HH:mm:ss")}</div>
                                                    <div
                                                        className={'order-time'}>取消于: {moment(Number(order.updatedAt)).format("YYYY-MM-DD HH:mm:ss")}</div>
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

// 用户直接删除数据库的按钮
// class DeleteButton1 extends Component {
//     constructor(props) {
//         super(props);
//         this.state = {
//
//         }
//     }
//
//     render() {
//         let {orderID, userID} = this.props;
//         return (
//             <Mutation
//                 mutation={gql(deleteorder)}
//                 refetchQueries={[{query: gql(orderbyprops), variables: {user_id: userID, orderStatus: 'cancelled'}}]}
//             >
//                 {(deleteorder, {loading, error}) => {
//                     if (loading)
//                         return <Spin style={{marginLeft: 30, marginTop: 10}}/>;
//                     if (error)
//                         return 'error';
//                     let varObj = {
//                         id: orderID,
//                         user_id: userID
//                     };
//                     return (
//                         <Button inline size={'small'} type='warning' onClick={()=>{
//                             deleteorder({variables: varObj})
//                         }}>删除</Button>
//                     )
//                 }}
//             </Mutation>
//
//         )
//     }
// }

// 用户无法直接删除数据库，只是改变订单状态的按钮
class DeleteButton2 extends Component {
    constructor(props) {
        super(props);
        this.state = {}
    }

    render() {
        let {orderID, userID} = this.props;
        return (
            <Mutation
                mutation={gql(updateorder)}
                refetchQueries={[{query: gql(orderbyprops), variables: {user_id: userID, orderStatus: 'cancelled'}}]}
            >
                {(updateorder, {loading, error}) => {
                    if (loading)
                        return (
                            <div className="tab-center">
                                <ActivityIndicator text="Loading..." size="large"/>
                            </div>
                        );
                    if (error)
                        return 'error';
                    let varObj = {
                        id: orderID,
                        user_id: userID,
                        orderStatus: 'deleted',
                        updatedAt: new Date().getTime()
                    };
                    return (
                        <Button type='warning' inline size={'small'} onClick={() => {
                            updateorder({variables: varObj})
                        }}>删除</Button>
                    )
                }}
            </Mutation>

        )
    }
}