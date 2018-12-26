import React, {Component} from 'react';
import './index.css';
import {NoticeBar, List, InputItem, ImagePicker, Button, Stepper} from 'antd-mobile';
import {Query, Mutation} from "react-apollo";
import {Spin} from 'antd';
import gql from "graphql-tag";
import {servicebyid, serverbyprops, servicebyprops, createserver} from "../../gql";
import {idGen} from "../../func";
import InputMoment from 'input-moment';
import moment from 'moment';

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

    componentWillReceiveProps() {
        this.setState({
            serviceID: ''
        });
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
                            <div>
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

                                {
                                    this.state.serviceID ?
                                        <ServiceDetail serviceID={this.state.serviceID}/>
                                        :
                                        ''
                                }
                            </div>


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
                <InputItem onChange={(e) => {
                    this.setState({name: e})
                }} value={name} placeholder="请输入名称">名称</InputItem>
                <InputItem onChange={(e) => {
                    this.setState({description: e})
                }} value={description} placeholder="请输入简介">简介</InputItem>
                <ImagePicker
                    files={files}
                    onChange={this.onChange}
                    onImageClick={(index, fs) => console.log(index, fs)}
                    selectable={files.length < 1}
                    multiple={false}
                />
                <Item>
                    <SubmitServerButton
                        img={files[0] ? files[0].url : ''}
                        name={name}
                        description={description}
                    />
                    <Button size="small" inline style={{marginLeft: '2.5px'}} onClick={this.onReset}>重置</Button>
                </Item>
            </List>
        );
    }
}

class SubmitServerButton extends Component {
    constructor(props) {
        super(props);
        this.state = {}
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
                        <Button type="primary" size="small" inline onClick={() => {
                            createserver({variables: varObj})
                        }}>提交</Button>
                    )
                }}
            </Mutation>
        )
    }
}

class ServiceDetail extends Component {
    constructor(props) {
        super(props);
        this.state = {}
    }


    render() {
        let {serviceID} = this.props;
        return (
            <Query query={gql(servicebyid)} variables={{id: serviceID}}>
                {
                    ({loading, error, data}) => {
                        if (loading) {
                            return <Spin className={'spin'}/>
                        }
                        if (error) {
                            return 'error!';
                        }
                        let service = data.servicebyid;

                        var description = '',
                            startTime = '',
                            lastTime = '',
                            price = '',
                            repertory = '';

                        if (service !== null) {
                            description = service.description;
                            startTime = service.startTime;
                            lastTime = service.lastTime;
                            price = service.price;
                            repertory = service.repertory_id.count;
                        }

                        return (
                            <ServiceDetailRender
                                serviceID={serviceID}
                                description={description}
                                startTime={startTime}
                                lastTime={lastTime}
                                price={price}
                                repertory={repertory}
                            />
                        )
                    }
                }
            </Query>
        )
    }
}

class ServiceDetailRender extends Component {
    constructor(props) {
        super(props);
        this.state = {
            serviceID: props.serviceID,
            description: props.description,
            lastTime: props.lastTime,
            startTime: props.startTime,
            price: props.price,
            repertory: props.repertory,
            showCalendar: false,
            m: moment()
        }
    }

    componentWillReceiveProps(next) {
        this.setState({
            serviceID: next.serviceID,
            description: next.description,
            lastTime: next.lastTime,
            startTime: next.startTime,
            price: next.price,
            repertory: next.repertory,
            showCalendar: false
        })
    }

    onReset = () => {
        this.setState({
            startTime: '',
            lastTime: '',
            description: '',
            price: '',
            repertory: 1
        })
    };

    handleChange = m => {
        this.setState({ m });
    };

    handleSave = () => {
        console.log('saved', this.state.m.format('llll'));
    };

    render() {
        let {serviceID, description, startTime, lastTime, price, repertory} = this.state;
        return (
            <div>
                <List renderHeader={() => '请输入服务项信息'}>
                    <InputItem onChange={(e) => {
                        this.setState({name: e})
                    }} value={description} placeholder="请输入服务类型">服务类型</InputItem>
                    <InputItem onChange={(e) => {
                        this.setState({price: e})
                    }} value={price} placeholder="请输入价格">价格</InputItem>
                    <Item arrow="horizontal"
                          onClick={() => {
                              document.getElementsByTagName('body')[0].style.overflowY = 'hidden';
                              this.setState({
                                  showCalendar: true
                              });
                          }}
                    >
                        选择开放时间
                    </Item>
                    <Item
                        wrap
                        extra={
                            <Stepper
                                style={{ width: '100%', minWidth: '100px' }}
                                showNumber
                                min={0}
                                value={repertory}
                                onChange={(e)=>{
                                    this.setState({repertory: e})
                                }}
                            />}
                    >
                        库存
                    </Item>
                    <Item>
                        {
                            serviceID === 'add'?
                                <SubmitServiceCreateButton/>
                                :
                                <SubmitServiceUpdateButton/>
                        }
                        <Button size="small" inline style={{marginLeft: '2.5px'}} onClick={this.onReset}>重置</Button>
                    </Item>
                </List>
                {
                    this.state.showCalendar?
                        <InputMoment
                            moment={this.state.m}
                            onChange={this.handleChange}
                            minStep={5}
                            onSave={this.handleSave}
                            prevMonthIcon="ion-ios-arrow-left"
                            nextMonthIcon="ion-ios-arrow-right"
                            style={{position: 'absoluted', top: 0, left: 0}}
                        />
                        :
                        ''
                }

            </div>

        )
    }
}

class SubmitServiceUpdateButton extends Component {
    constructor(props) {
        super(props);
        this.state = {}
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
                        <Button type="primary" size="small" inline onClick={() => {
                            createserver({variables: varObj})
                        }}>提交</Button>
                    )
                }}
            </Mutation>
        )
    }
}

class SubmitServiceCreateButton extends Component {
    constructor(props) {
        super(props);
        this.state = {}
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
                        <Button type="primary" size="small" inline onClick={() => {
                            createserver({variables: varObj})
                        }}>提交</Button>
                    )
                }}
            </Mutation>
        )
    }
}

export default Release;

