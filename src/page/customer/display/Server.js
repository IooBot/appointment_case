import React, {Component} from 'react';
import {Card, WhiteSpace, Button, WingBlank, Flex} from 'antd-mobile';

class Server extends Component {
    constructor(props) {
        super(props);
        this.state = {
        }
    }

    render() {
        let {tip, servers} = this.props;
        return (
            <div>
                {
                    tip ?
                        <div className={'center'}>{tip}</div>
                        :
                        ''
                }

                {
                    servers.map((server) => {
                        return (
                            <div key={server.id}>
                                <WingBlank size="lg">
                                    <WhiteSpace size="lg"/>
                                    <Card className={'card'}>
                                        <Card.Body>
                                            <div>
                                                <Flex>
                                                    <Flex.Item>
                                                        <div className={'avatar'}
                                                             style={{backgroundImage: `url(${server.img})`}}>1
                                                        </div>
                                                    </Flex.Item>
                                                    <Flex.Item>
                                                        <div className={'server-name'}>{server.name}</div>
                                                        <div className={'server-description'}>{server.description}</div>
                                                    </Flex.Item>
                                                    <Flex.Item>
                                                        <Button type='ghost' size='small'
                                                                onClick={this.props.pageSwitchToService(server.id, server.name, server.description)}>选我</Button>
                                                    </Flex.Item>
                                                </Flex>
                                            </div>
                                        </Card.Body>
                                    </Card>
                                </WingBlank>
                            </div>
                        )
                    })
                }

            </div>
        );
    }
}

export default Server;
