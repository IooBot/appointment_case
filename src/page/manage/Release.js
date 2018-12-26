import React, {Component} from 'react';
import './index.css';
import {NoticeBar, List, InputItem, ImagePicker, Button} from 'antd-mobile';
import {Query, Mutation} from "react-apollo";
import {Spin} from 'antd';
import gql from "graphql-tag";
import {serverbyprops, servicebyprops, createserver} from "../../gql";
import {idGen} from "../../func";

const Item = List.Item;

class Release extends Component {
    constructor(props) {
        super(props);
        this.state = {
            serverID: ''
        }
    }

    render() {
        return (
            <div>
                <NoticeBar mode="closable" marqueeProps={{loop: true, style: {padding: '0 7.5px'}}}>
                    只有管理员的微信才能看到此界面，此处作为样例全部展示
                </NoticeBar>
                <Query query={gql(serverbyprops)} variables={{}}>
                    {
                        ({loading, error, data}) => {
                            if (loading) {
                                return <Spin className={'spin'}/>
                            }
                            if (error) {
                                return 'error!';
                            }

                            return (
                                <div>
                                    <List renderHeader={() => '服务'} className="my-list">
                                        {
                                            data.serverbyprops.map(server =>
                                                <Item
                                                    key={server.id}
                                                    arrow="horizontal"
                                                    thumb={server.img}
                                                    multipleLine
                                                    onClick={() => {
                                                        this.setState({
                                                            serverID: server.id
                                                        })
                                                    }}
                                                >
                                                    {server.name}
                                                </Item>
                                            )
                                        }
                                        <Item
                                            arrow="horizontal"
                                            multipleLine
                                            onClick={() => {
                                                this.setState({
                                                    serverID: 'add'
                                                })
                                            }}
                                        >
                                            {
                                                data.serverbyprops.length === 0 ?
                                                    '没有服务，点我添加' : '添加'
                                            }
                                        </Item>
                                    </List>

                                    {
                                        this.state.serverID === 'add' ?
                                            <AddServer/>
                                            :
                                            this.state.serverID ?
                                                <ServiceList serverID={this.state.serverID}/>
                                                :
                                                ''
                                    }
                                </div>
                            )
                        }
                    }
                </Query>
            </div>
        );
    }
}

class ServiceList extends Component {
    constructor(props) {
        super(props);
        this.state = {
            serviceID: ''
        }
    }

    render() {
        let {serverID} = this.props;
        return (
            <Query query={gql(servicebyprops)} variables={{server_id: serverID}}>
                {
                    ({loading, error, data}) => {
                        if (loading) {
                            return <Spin className={'spin'}/>
                        }
                        if (error) {
                            return 'error!';
                        }
                        return (
                            <List renderHeader={() => 'TA的服务项'} className="my-list">
                                {
                                    data.servicebyprops.map(service =>
                                        <Item
                                            key={service.id}
                                            arrow="horizontal"
                                            multipleLine
                                            onClick={() => {
                                                this.setState({
                                                    serviceID: service.id
                                                })
                                            }}
                                        >
                                            {service.description}
                                        </Item>
                                    )
                                }

                                <Item
                                    arrow="horizontal"
                                    multipleLine
                                    onClick={() => {
                                        this.setState({
                                            serviceID: 'add'
                                        })
                                    }}
                                >
                                    {
                                        data.servicebyprops.length === 0 ?
                                            '没有服务项，点我添加' : '添加'
                                    }
                                </Item>


                            </List>
                        )
                    }
                }
            </Query>
        )
    }
}

class AddServer extends Component {
    constructor(props) {
        super(props);
        this.state = {
            files: [],
            name: '',
            description: ''
        }
    }

    onReset = () => {
        this.setState({
            files: [],
            name: '',
            description: ''
        })
    };

    onChange = (files, type) => {
        console.log(files, type);
        this.setState({
            files,
        });
    };

    render() {
        const {files, name, description} = this.state;
        return (
            <List renderHeader={() => '请输入服务信息'}>
                <InputItem onChange={(e)=>{this.setState({name: e})}} value={name} placeholder="请输入名称">名称</InputItem>
                <InputItem onChange={(e)=>{this.setState({description: e})}} value={description} placeholder="请输入简介">简介</InputItem>
                <ImagePicker
                    files={files}
                    onChange={this.onChange}
                    onImageClick={(index, fs) => console.log(index, fs)}
                    selectable={files.length < 1}
                    multiple={false}
                />
                <Item>
                    <SubmitButton
                        img={files[0]?files[0].url:''}
                        name={name}
                        description={description}
                    />
                    <Button size="small" inline style={{marginLeft: '2.5px'}} onClick={this.onReset}>重置</Button>
                </Item>
            </List>
        );
    }
}

class SubmitButton extends Component {
    constructor(props) {
        super(props);
        this.state = {
        }
    }

    render() {
        let {name, description, img} = this.props;
        return (
            <Mutation
                mutation={gql(createserver)}
                refetchQueries={[{query: gql(serverbyprops), variables: {}}]}
            >
                {(createserver, {loading, error}) => {
                    if (loading)
                        return <Spin style={{marginLeft: 30, marginTop: 10}}/>;
                    if (error)
                        return 'error';
                    let varObj = {
                        id: idGen('server'),
                        name,
                        description,
                        img,
                        createdAt: new Date().getTime(),
                        updatedAt: ''
                    };
                    return (
                        <Button type="primary" size="small" inline onClick={()=>{createserver({variables: varObj})}}>提交</Button>
                    )
                }}
            </Mutation>
        )
    }
}

export default Release;

