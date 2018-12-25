import React, {Component} from 'react';
import {TabBar} from 'antd-mobile';
import './App.css';
import My from './page/home/My';
import Display from './page/display/Display';

class App extends Component {
    constructor(props) {
        super(props);
        this.state = {
            selectedTab: 'appointment',
            fullScreen: true,
        };
    }

    render() {
        return (
            <div className="App">
                <div style={{position: 'fixed', height: '100%', width: '100%', top: 0}}>
                    <TabBar
                        unselectedTintColor="#949494"
                        tintColor="#33A3F4"
                        barTintColor="white"
                    >
                        <TabBar.Item
                            title="预约"
                            key="appointment"
                            icon={<div style={{
                                width: '22px',
                                height: '22px',
                                background: 'url(https://zos.alipayobjects.com/rmsportal/sifuoDUQdAFKAVcFGROC.svg) center center /  21px 21px no-repeat'
                            }}
                            />
                            }
                            selectedIcon={<div style={{
                                width: '22px',
                                height: '22px',
                                background: 'url(https://zos.alipayobjects.com/rmsportal/iSrlOTqrKddqbOmlvUfq.svg) center center /  21px 21px no-repeat'
                            }}
                            />
                            }
                            selected={this.state.selectedTab === 'appointment'}
                            onPress={() => {
                                this.setState({
                                    selectedTab: 'appointment',
                                });
                            }}
                            data-seed="logId"
                        >
                            <Display/>
                        </TabBar.Item>
                        <TabBar.Item
                            icon={{uri: 'https://zos.alipayobjects.com/rmsportal/asJMfBrNqpMMlVpeInPQ.svg'}}
                            selectedIcon={{uri: 'https://zos.alipayobjects.com/rmsportal/gjpzzcrPMkhfEqgbYvmN.svg'}}
                            title="我的"
                            key="my"
                            selected={this.state.selectedTab === 'my'}
                            onPress={() => {
                                this.setState({
                                    selectedTab: 'my',
                                });
                            }}
                        >
                            <My/>
                        </TabBar.Item>
                    </TabBar>
                </div>
            </div>
        );
    }
}

export default App;

