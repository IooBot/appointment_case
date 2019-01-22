import React, {Component} from 'react';
import {TabBar, ActivityIndicator} from 'antd-mobile';
import {Icon} from 'antd';
import './App.css';
import My from './page/home/My';
import Display from './page/display/Display';
import Manage from "./page/manage/Manage";
import {getCookie} from "./cookie";
import {userbyprops, createuser} from "./gql";
import {Query} from "react-apollo";
import gql from "graphql-tag";
import {request} from 'graphql-request'
import {graphqlFC} from './config';
import {idGen} from "./func";

class App extends Component {
    constructor(props) {
        super(props);
        this.state = {
            selectedTab: 'appointment'
        };
    }

    componentWillMount() {
        let openid = getCookie("openid");
        console.log('get openid', openid);

        if (!openid) {
            window.location.href = "/subscribe";
        }
    }

    render() {
        let openid = getCookie("openid");
        return (
            <div className="App">
                <Query query={gql(userbyprops)} variables={{openid}}>
                    {
                        ({loading, error, data}) => {
                            if (loading) {
                                return (
                                    <div className="loading">
                                        <div className="align">
                                            <ActivityIndicator text="Loading..." size="large"/>
                                        </div>
                                    </div>
                                )
                            }
                            if (error) {
                                return 'error!';
                            }
                            let user;
                            let userQueryNum = data.userbyprops.length;
                            if (userQueryNum > 1) {
                                user = {id: '', admin: 'false'};
                                console.log('openid 出现多于一个');
                            } else if (userQueryNum === 0) {
                                let userObj = {
                                    id: idGen('user'),
                                    admin: 'false',
                                    email: '',
                                    updatedAt: '',
                                    password: '',
                                    telephone: '',
                                    nickname: '',
                                    username: '',
                                    createdAt: new Date().getTime(),
                                    openid
                                };
                                request(graphqlFC, createuser, userObj).then(res => {
                                    console.log('注册成功');
                                    user = userObj
                                });
                                console.log('openid 为 0，尚未注册')
                            } else {
                                user = data.userbyprops[0];
                            }
                            let userID = user.id;
                            let admin = user.admin;
                            return (
                                <RenderPage
                                    admin={admin}
                                    userID={userID}
                                />
                            )
                        }
                    }
                </Query>
            </div>
        );
    }
}

export default App;


class RenderPage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            selectedTab: 'appointment'
        }
    }

    render() {
        let {userID, admin} = this.props;
        return (
            <div style={{position: 'fixed', height: '100%', width: '100%', top: 0}}>
                {
                    admin === 'true' ?
                        <TabBar
                            unselectedTintColor="#949494"
                            tintColor="#328cee"
                            barTintColor="white"
                        >
                            <TabBar.Item
                                icon={<Icon type="setting"/>}
                                selectedIcon={<Icon type="setting" style={{color: '#328cee'}}/>}
                                title="管理"
                                key="manage"
                                selected={true}
                                onPress={() => {
                                    this.setState({
                                        selectedTab: 'manage',
                                    });
                                }}
                            >
                                <Manage userID={userID}/>
                            </TabBar.Item>
                        </TabBar>
                        :
                        <TabBar
                            unselectedTintColor="#949494"
                            tintColor="#328cee"
                            barTintColor="white"
                        >
                            <TabBar.Item
                                title="预约"
                                key="appointment"
                                icon={<Icon type="fire"/>}
                                selectedIcon={<Icon type="fire"
                                                    style={{color: '#328cee'}}/>}
                                selected={this.state.selectedTab === 'appointment'}
                                onPress={() => {
                                    this.setState({
                                        selectedTab: 'appointment',
                                    });
                                }}
                                data-seed="logId"
                            >
                                <Display userID={userID}/>
                            </TabBar.Item>
                            <TabBar.Item
                                icon={<Icon type="home"/>}
                                selectedIcon={<Icon type="home"
                                                    style={{color: '#328cee'}}/>}
                                title="我的"
                                key="my"
                                selected={this.state.selectedTab === 'my'}
                                onPress={() => {
                                    this.setState({
                                        selectedTab: 'my',
                                    });
                                }}
                            >
                                <My userID={userID}/>
                            </TabBar.Item>
                        </TabBar>
                }
            </div>
        )
    }
};
