import React, {Component} from 'react';
import {NavBar, Icon, WhiteSpace, Card, Button} from 'antd-mobile';
import CalendarPick from '../component/CalendarPick';
import moment from 'moment';
import 'moment/locale/zh-cn'
import {repertorybyid, createorderAndupdaterepertory, orderbyprops} from "../../gql";
import {Spin} from 'antd';
import gql from "graphql-tag";
import {idGen} from "../../func";
import {Query, Mutation} from "react-apollo";
moment.locale('zh-cn');

class Service extends Component {
    constructor(props) {
        super(props);
        this.state = {
            pick: false
        }
    }

    render() {
        let {pageSwitchToServer, tip, services} = this.props;
        return (
            <div>
                <NavBar
                    mode="light"
                    icon={<Icon type="left"/>}
                    onLeftClick={pageSwitchToServer}
                    rightContent={[
                        <Icon key="1" type="search" onClick={() => {
                            this.setState({pick: true})
                        }}/>,
                    ]}
                >服务详情</NavBar>

                {
                    this.state.pick ?
                        <CalendarPick show={true}/>
                        :
                        <div>

                            {
                                tip ?
                                    <div>{tip}</div>
                                    :
                                    ''
                            }

                            {
                                services.map(service => {
                                    return (
                                        <div key={service.id}>
                                            <WhiteSpace size="lg"/>
                                            <Card full>
                                                <Card.Body>
                                                    <div className={'card'}>
                                                        <div>{service.description}</div>
                                                        <div>价格: {service.price}</div>
                                                        <div>开始时间: {moment(Number(service.startTime)).format("YYYY-MM-DD HH:mm:ss")}</div>
                                                        <div>工作时间: {moment.duration(Number(service.lastTime), "milliseconds").humanize()}</div>
                                                        <div>剩余名额: {service.repertory_id.count}</div>
                                                        <OrderButton
                                                            repertoryID={service.repertory_id.id}
                                                            serviceID={service.id}
                                                        />
                                                    </div>
                                                </Card.Body>
                                            </Card>
                                        </div>
                                    )
                                })
                            }
                        </div>
                }
            </div>
        );
    }
}

class OrderButton extends Component {
    constructor(props) {
        super(props);
        this.state = {
            // todo: userID
            userID: 'handsome'
        }
    }

    render() {
        let {repertoryID, serviceID} = this.props;
        let {userID} = this.state;
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
                        if(count <= 0) {
                            return (
                                <div>名额已满</div>
                            )
                        } else {
                            return (
                                <Mutation
                                    mutation={gql(createorderAndupdaterepertory)}
                                    refetchQueries={[{query: gql(orderbyprops), variables: {user_id: userID, orderStatus: 'success'}}]}
                                >
                                    {(iwantu, {loading, error}) => {
                                        if (loading)
                                            return <Spin/>;
                                        if (error)
                                            return 'error';
                                        let varObj = {
                                            user_id: userID,
                                            service_id: serviceID,
                                            repertory_id: repertoryID,
                                            order_id: idGen('order'),
                                            payStatus: '',
                                            remark: '',
                                            payCount: '',
                                            payTime: '',
                                            customerNumber: 1,
                                            orderStatus: 'success',
                                            createdAt: new Date().getTime(),
                                            updatedAt: new Date().getTime(),
                                            count: count-1
                                        };
                                        return (
                                            <Button type='primary' onClick={() => {
                                                iwantu({variables: varObj})
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

export default Service;
