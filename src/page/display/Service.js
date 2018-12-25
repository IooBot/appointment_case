import React, {Component} from 'react';
import {NavBar, Icon, WhiteSpace, Card, Button} from 'antd-mobile';
import CalendarPick from '../component/CalendarPick';
import moment from 'moment';
import 'moment/locale/zh-cn'
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
                                                        <Button type='primary' onClick={()=>{}}>预约</Button>
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

export default Service;
