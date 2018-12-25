import React, {Component} from 'react';
import {Card, WhiteSpace, Button, Carousel, WingBlank} from 'antd-mobile';

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
                        <div>{tip}</div>
                        :
                        ''
                }

                {
                    servers.map((server) => {
                        return (
                            <div key={server.id}>
                                <WhiteSpace size="lg"/>
                                <Card full>
                                    <Card.Body>
                                        <div className={'card'}>
                                            <div className={'avatar'}
                                                 style={{backgroundImage: `url(${server.img})`}}>1
                                            </div>
                                            <div>{server.name}</div>
                                            <div>{server.description}</div>
                                            <Button type='primary'
                                                    onClick={this.props.pageSwitchToService(server.id)}>选我</Button>
                                        </div>
                                    </Card.Body>
                                </Card>
                            </div>
                        )
                    })
                }

            </div>
        );
    }
}

export default Server;
