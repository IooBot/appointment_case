import React, {Component} from 'react';
import {TabBar} from 'antd-mobile';
import {Icon} from 'antd';
import Display from "./display/Display";
import Home from "./home/Home";

class Customer extends Component {
    constructor(props) {
        super(props);
        this.state = {
            selectedTab: 'appointment'
        }
    }

    render() {
        let {userID} = this.props;
        let {selectedTab} = this.state;
        return (
            <TabBar
                unselectedTintColor="#949494"
                tintColor="#328cee"
                barTintColor="white"
            >
                <TabBar.Item
                    title="预约"
                    key="appointment"
                    icon={<Icon type="fire"/>}
                    selectedIcon={<Icon type="fire" style={{color: '#328cee'}}/>}
                    selected={selectedTab === 'appointment'}
                    onPress={() => {
                        this.setState({
                            selectedTab: 'appointment',
                        });
                    }}
                >
                    <Display userID={userID}/>
                </TabBar.Item>
                <TabBar.Item
                    icon={<Icon type="home"/>}
                    selectedIcon={
                        <Icon type="home" style={{color: '#328cee'}}/>
                    }
                    title="我的"
                    key="my"
                    selected={selectedTab === 'my'}
                    onPress={() => {
                        this.setState({
                            selectedTab: 'my',
                        });
                    }}
                >
                    <Home userID={userID}/>
                </TabBar.Item>
            </TabBar>
        );
    }
}

export default Customer;
