import React, {Component} from 'react';
import {TabBar} from 'antd-mobile';
import {Icon} from 'antd';
import './App.css';
import My from './page/home/My';
import Display from './page/display/Display';
import Manage from "./page/manage/Manage";

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
                        tintColor="orange"
                        barTintColor="white"
                    >
                        <TabBar.Item
                            title="预约"
                            key="appointment"
                            icon={<Icon type="fire" />}
                            selectedIcon={<Icon type="fire" style={{color: 'orange'}}/>}
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
                            icon={<Icon type="home" />}
                            selectedIcon={<Icon type="home" style={{color: 'orange'}}/>}
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
                        <TabBar.Item
                            icon={<Icon type="setting" />}
                            selectedIcon={<Icon type="setting" style={{color: 'orange'}}/>}
                            title="管理"
                            key="manage"
                            selected={this.state.selectedTab === 'manage'}
                            onPress={() => {
                                this.setState({
                                    selectedTab: 'manage',
                                });
                            }}
                        >
                            <Manage/>
                        </TabBar.Item>
                    </TabBar>
                </div>
            </div>
        );
    }
}

export default App;

