import React, {Component} from 'react';
import {serverbyprops, servicebyprops} from "../../gql";
import {Spin} from 'antd';
import gql from "graphql-tag";
import {Query} from "react-apollo";
import Server from './Server';
import Service from './Service';
import './index.css'

class Display extends Component {
    constructor(props) {
        super(props);
        this.state = {
            display: 'server',
            serverID: ''
        }
    }

    pageSwitchToService = (serverID) => {
        return () => {
            this.setState ({
                serverID,
                display: 'service'
            })

        }
    };

    pageSwitchToServer = () => {
        this.setState ({
            display: 'server',
            serverID: ''
        })
    };


    render() {
        let {userID} = this.props;
        return (
            <div>
                {
                    this.state.display === 'server' ?
                        <Query query={gql(serverbyprops)} variables={{}}>
                            {
                                ({loading, error, data}) => {
                                    if (loading) {
                                        return <Spin className={'spin'}/>
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
                        :
                        <Query query={gql(servicebyprops)} variables={{server_id: this.state.serverID}}>
                            {
                                ({loading, error, data}) => {
                                    if (loading) {
                                        return <Spin className={'spin'}/>
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
