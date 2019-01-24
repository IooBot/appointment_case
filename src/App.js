import React, {Component} from 'react';
import {ActivityIndicator} from 'antd-mobile';
import './App.css';
import Manage from "./page/manage/Manage";
import Customer from './page/customer/Customer';
import {getCookie, setCookie} from "./cookie";
import {userbyprops, createuser, userbypropsNum} from "./gql";
import {Query} from "react-apollo";
import gql from "graphql-tag";
import {request} from 'graphql-request'
import {graphqlFC} from './config';
import {idGen} from "./func";

class App extends Component {
    constructor(props) {
        super(props);
        this.state = {

        }
    }

    componentWillMount() {
        // 本地开发
        // 管理员
        setCookie('openid', 'o2fcFvxE5nCQSb4BBHaB4kXcikSE');
        // 用户
        // setCookie('openid', 'o2fcFv6Rh2-4rCh3d5_1uCWCT5Yc');

        // 微信版
        // let openid = getCookie("openid");
        // console.log('get openid', openid);
        //
        // if (!openid) {
        //     window.location.href = "/subscribe";
        // }
    }

    render() {
        let openid = getCookie("openid");
        return (
            <div className="App">
                <Query query={gql(userbypropsNum)} variables={{}}>
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
                            let adminFist = false;
                            if (data.userbyprops.length === 0) {
                                adminFist = true;
                            }
                            return (
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
                                                    admin: adminFist ? 'true' : 'false',
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
                                                <div style={{position: 'fixed', height: '100%', width: '100%', top: 0}}>
                                                    {
                                                        admin === 'true' ?
                                                            <Manage userID={userID}/>
                                                            :
                                                            <Customer userID={userID}/>
                                                    }
                                                </div>
                                            )
                                        }
                                    }
                                </Query>
                            )
                        }
                    }
                </Query>
            </div>
        );
    }
}

export default App;