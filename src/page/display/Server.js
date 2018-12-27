import React, {Component} from 'react';
import {Card, WhiteSpace, Button, Carousel, WingBlank, Flex} from 'antd-mobile';

class Server extends Component {
    constructor(props) {
        super(props);
        this.state = {
            data: ['AiyWuByWklrrUDlFignR', 'TekJlZRVCjLFexlOCuWn', 'IJOtIlfsYdTyaDTRVrLI'],
            imgHeight: 176,
        }
    }

    render() {
        let {tip, servers} = this.props;
        return (
            <div>
                <WingBlank>
                    <Carousel
                        autoplay={true}
                        infinite
                    >
                        {this.state.data.map(val => (
                            <a
                                key={val}
                                href="http://www.alipay.com"
                                style={{display: 'inline-block', width: '100%', height: this.state.imgHeight}}
                            >
                                <img
                                    src={`https://zos.alipayobjects.com/rmsportal/${val}.png`}
                                    alt=""
                                    style={{width: '100%', verticalAlign: 'top'}}
                                    onLoad={() => {
                                        window.dispatchEvent(new Event('resize'));
                                        this.setState({imgHeight: 'auto'});
                                    }}
                                />
                            </a>
                        ))}
                    </Carousel>
                </WingBlank>


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
                                                                onClick={this.props.pageSwitchToService(server.id)}>选我</Button>
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
