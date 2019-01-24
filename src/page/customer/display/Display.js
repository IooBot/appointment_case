import React, {Component} from 'react';
import {serverbyprops, servicebyprops} from "../../../gql";
import {ActivityIndicator} from 'antd-mobile';
import gql from "graphql-tag";
import {Query} from "react-apollo";
import Server from './Server';
import Service from './Service';
import TopBar from './TopBar';
import './index.css'

class Display extends Component {
    constructor(props) {
        super(props);
        this.state = {
            display: 'server',
            serverID: '',
            serverName: '',
            serverDescription: ''
        }
    }

    pageSwitchToService = (serverID, serverName, serverDescription) => {
        return () => {
            this.setState({
                serverID,
                serverName,
                serverDescription,
                display: 'service'
            })
        }
    };

    pageSwitchToServer = () => {
        this.setState({
            display: 'server',
            serverID: '',
            serverName: '',
            serverDescription: ''
        })
    };


    render() {
        let {userID} = this.props;
        let {serverID, serverName, serverDescription} = this.state;
        return (
            <div>
                {
                    this.state.display === 'server' ?
                        <div>
                            <TopBar/>
                            <Query query={gql(serverbyprops)} variables={{}}>
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

                                        let servers = data.serverbyprops;
                                        let tip = '';
                                        if (servers.length === 0) {
                                            servers = [];
                                            tip = '还没有服务'
                                        }

                                        return (
                                            <Server
                                                servers={servers}
                                                tip={tip}
                                                pageSwitchToService={this.pageSwitchToService}
                                            />
                                        )
                                    }
                                }
                            </Query>
                        </div>
                        :
                        <Query query={gql(servicebyprops)} variables={{server_id: serverID}}>
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

                                    let services = data.servicebyprops;
                                    let tip = '';
                                    if (services.length === 0) {
                                        services = [];
                                        tip = '本人休息'
                                    }

                                    return (
                                        <Service
                                            services={services}
                                            tip={tip}
                                            pageSwitchToServer={this.pageSwitchToServer}
                                            userID={userID}
                                            serverName={serverName}
                                            serverDescription={serverDescription}
                                        />
                                    )
                                }
                            }
                        </Query>
                }
            </div>

        );
    }
}

export default Display;
