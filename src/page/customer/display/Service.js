import React, {Component} from 'react';
import {NavBar, Icon, WhiteSpace, Card, Button, WingBlank} from 'antd-mobile';
import CalendarPick from '../../component/CalendarPick';
import moment from 'moment';
import 'moment/locale/zh-cn'
import Ordering from './Ordering';
import { Row, Col } from 'antd';

moment.locale('zh-cn');

class Service extends Component {
    constructor(props) {
        super(props);
        this.state = {
            pick: false,
            ordering: false,
            servicePrice: '',
            serviceDescription: '',
            serviceStartTime: '',
            serviceLastTime: '',
            repertoryID: ''
        }
    }

    donotShowOrdering = () => {
        this.setState({
            ordering: false
        })
    };

    render() {
        let {pageSwitchToServer, tip, services, userID, serverName, serverDescription} = this.props;
        let {repertoryID, servicePrice, serviceDescription, serviceStartTime, serviceLastTime} = this.state;
        return (
            <div>
                {
                    this.state.ordering ?
                        ''
                        :
                        <NavBar
                            mode="light"
                            icon={<Icon type="left"/>}
                            onLeftClick={pageSwitchToServer}
                        >服务详情</NavBar>
                }

                <div>

                    {
                        this.state.pick ?
                            <CalendarPick show={true}/>
                            :
                            this.state.ordering ?
                                <Ordering
                                    donotShowOrdering={this.donotShowOrdering}
                                    servicePrice={servicePrice}
                                    serviceDescription={serviceDescription}
                                    serviceStartTime={serviceStartTime}
                                    serviceLastTime={serviceLastTime}
                                    repertoryID={repertoryID}
                                    serverName={serverName}
                                    serverDescription={serverDescription}
                                    userID={userID}
                                />
                                :
                                <div>

                                    {
                                        tip ?
                                            <div className={'center'}>{tip}</div>
                                            :
                                            ''
                                    }

                                    {
                                        services.map(service => {
                                            return (
                                                <div key={service.id}>
                                                    <WingBlank size="lg">
                                                        <WhiteSpace size="lg"/>
                                                        <Card full className={'card'}>
                                                            <Card.Body>
                                                                <div>
                                                                    <Row>
                                                                        <Col span={15}>
                                                                            <div className={'service-description'}>{service.description}</div>
                                                                            <div className={'service-time'}>开始: {moment(Number(service.startTime)).format("YYYY-MM-DD HH:mm:ss")}</div>
                                                                            {/*<div className={'service-time'}>工作时长: {moment.duration(Number(service.lastTime), "milliseconds").humanize()}</div>*/}
                                                                            <div className={'service-time'}>工作时长: {Math.floor(Number(service.lastTime)/3600000)}小时 {Math.floor((Number(service.lastTime)%3600000)/60000)} 分钟</div>
                                                                        </Col>
                                                                        <Col span={5}>
                                                                            <div className={'service-price'}>{service.price}</div>
                                                                            <div className={'service-count'}>剩余 {service.repertory_id.count}</div>
                                                                        </Col>
                                                                        <Col span={4}>
                                                                            <Button inline size="small" type='primary' onClick={() => {
                                                                                this.setState({
                                                                                    ordering: true,
                                                                                    servicePrice: service.price,
                                                                                    serviceDescription: service.description,
                                                                                    serviceStartTime: service.startTime,
                                                                                    serviceLastTime: service.lastTime,
                                                                                    repertoryID: service.repertory_id.id
                                                                                })
                                                                            }}>预约</Button>
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
                    }
                </div>
            </div>

        );
    }
}


export default Service;
