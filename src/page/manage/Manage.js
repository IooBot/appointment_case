import React, {Component} from 'react';
import './index.css';
import AllOrder from './AllOrder';
import Release from './Release';
import Store from './Store';
import {TabBar} from 'antd-mobile';
import {Icon} from 'antd';

class Manage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            selectedTab: 'orderManage'
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
                    icon={<Icon type="shopping-cart"/>}
                    selectedIcon={<Icon type="shopping-cart" style={{color: '#328cee'}}/>}
                    title="订单管理"
                    key="orderManage"
                    selected={selectedTab === 'orderManage'}
                    onPress={() => {
                        this.setState({
                            selectedTab: 'orderManage',
                        });
                    }}
                >
                    <AllOrder userID={userID}/>
                </TabBar.Item>
                <TabBar.Item
                    icon={<Icon type="team"/>}
                    selectedIcon={<Icon type="team" style={{color: '#328cee'}}/>}
                    title="服务管理"
                    key="serverManage"
                    selected={selectedTab === 'serverManage'}
                    onPress={() => {
                        this.setState({
                            selectedTab: 'serverManage',
                        });
                    }}
                >
                    <Release userID={userID}/>
                </TabBar.Item>
                <TabBar.Item
                    icon={<Icon type="home"/>}
                    selectedIcon={<Icon type="home" style={{color: '#328cee'}}/>}
                    title="店铺管理"
                    key="storeManage"
                    selected={selectedTab === 'storeManage'}
                    onPress={() => {
                        this.setState({
                            selectedTab: 'storeManage',
                        });
                    }}
                >
                    <Store userID={userID}/>
                </TabBar.Item>
            </TabBar>
        );
    }
}

export default Manage;
