import React, {Component} from 'react';
import './index.css';
import {
    List,
    InputItem,
    ImagePicker,
    Button,
    Stepper,
    DatePicker,
    ActivityIndicator,
    WhiteSpace,
    Modal
} from 'antd-mobile';
import {Query, Mutation} from "react-apollo";
import gql from "graphql-tag";
import {
    servicebyid,
    serverbyprops,
    servicebyprops,
    createserver,
    deleteserveranddeleteserviceAnddeleterepertory,
    updateserviceAndupdaterepertory,
    createserviceAndcreaterepertory,
    deleteserviceAnddeleterepertory
} from "../../gql";
import {idGen} from "../../func";
import axios from 'axios';
import {storeFile} from "../../config";

axios.defaults.withCredentials = true;
const Item = List.Item;
const nowTimeStamp = Date.now();
const now = new Date(nowTimeStamp);
const alert = Modal.alert;

class Release extends Component {
    constructor(props) {
        super(props);
        this.state = {
            serverID: ''
        }
    }

    dontShowMe = () => {
        this.setState({
            serverID: ''
        })
    };

    render() {
        return (
            <div>
                <WhiteSpace/>
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
                                );
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
                                                <ServiceList serverID={this.state.serverID} dontShowMe={this.dontShowMe}/>
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

    donotShowDetail = () => {
        this.setState({
            serviceID: ''
        });
    };

    render() {
        let {serverID, dontShowMe} = this.props;
        return (
            <Query query={gql(servicebyprops)} variables={{server_id: serverID}}>
                {
                    ({loading, error, data}) => {
                        if (loading) {
                            return (
                                <div className="center-fix">
                                    <div className="align">
                                        <ActivityIndicator text="Loading..." size="large"/>
                                    </div>
                                </div>
                            );
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

                                    <Mutation
                                        mutation={gql(deleteserveranddeleteserviceAnddeleterepertory)}
                                        refetchQueries={[
                                            {query: gql(serverbyprops), variables: {}},
                                            {query: gql(servicebyprops), variables: {server_id: serverID}}
                                        ]}
                                        onCompleted={()=>{
                                            dontShowMe()
                                        }}
                                    >
                                        {(deleteEvery, {loading, error}) => {
                                            if (loading)
                                                return (
                                                    <div className="loading">
                                                        <div className="align">
                                                            <ActivityIndicator text="Loading..." size="large"/>
                                                        </div>
                                                    </div>
                                                );
                                            if (error)
                                                return 'error';
                                            return (
                                                <Item
                                                    arrow="horizontal"
                                                    multipleLine
                                                    onClick={() => {
                                                        alert('删除服务', '服务及其服务项会被一并删除', [
                                                            {
                                                                text: '取消',
                                                                onPress: () => console.log('cancel'),
                                                                style: 'default'
                                                            },
                                                            {
                                                                text: '确定', onPress: () => {
                                                                    deleteEvery({variables: {server_id: serverID}})
                                                                }
                                                            },
                                                        ]);
                                                    }}
                                                >
                                                    <span style={{color: 'red'}}>删除该服务</span>
                                                </Item>
                                            )
                                        }}
                                    </Mutation>

                                </List>

                                {
                                    this.state.serviceID ?
                                        <ServiceDetail
                                            serviceID={this.state.serviceID}
                                            serverID={serverID}
                                            donotShowDetail={this.donotShowDetail}
                                        />
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
            description: '',
            imgData:{}
        }
    }

    onReset = () => {
        this.setState({
            files: [],
            name: '',
            description: '',
            imgData:{}
        })
    };

    onChange = (files, operationType) => {
        // console.log("files",files, "operationType",operationType);

        let base64Cont = files[0].url.split(',')[1];
        let imgType = files[0].file.type.split('/')[1];
        let imgNewName = `${Date.now()}.${imgType}`;

        const imgData = {
            'file-name': `appointment/images/${imgNewName}`,
            'bucket': 'case',
            'cont': base64Cont,
            'public': true,
            'format': 'base64'
        };

        this.setState({
            files,
            imgData
        });
    };

    render() {
        const {files, name, description,imgData} = this.state;
        return (
            <List renderHeader={() => '请输入服务信息'}>
                <InputItem onChange={(e) => {
                    this.setState({name: e})
                }} value={name} placeholder="请输入名称">名称</InputItem>
                <InputItem onChange={(e) => {
                    this.setState({description: e})
                }} value={description} placeholder="请输入简介">简介</InputItem>
                <div className={'my-list-subtitle'}>添加图片</div>
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
                        imgData={imgData}
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

    uploadImg = () => {
        let {imgData} = this.props;
        console.log("imgData",imgData);

        axios({
            url:storeFile,
            method:'post',
            data: imgData
        }).then((res)=>{
            console.log("upload image to cos res",res);
        });
    };

    render() {
        let {name, description, img} = this.props;
        return (
            <Mutation
                mutation={gql(createserver)}
                refetchQueries={[{query: gql(serverbyprops), variables: {}}]}
            >
                {(createserver, {loading, error}) => {
                    if (loading)
                        return (
                            <div className="loading">
                                <div className="align">
                                    <ActivityIndicator text="Loading..." size="large"/>
                                </div>
                            </div>
                        );
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
                            this.uploadImg();
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
        let {serviceID, serverID, donotShowDetail} = this.props;
        return (
            <Query query={gql(servicebyid)} variables={{id: serviceID}}>
                {
                    ({loading, error, data}) => {
                        if (loading) {
                            return (
                                <div className="center-fix">
                                    <div className="align">
                                        <ActivityIndicator text="Loading..." size="large"/>
                                    </div>
                                </div>
                            );
                        }
                        if (error) {
                            return 'error!';
                        }
                        let service = data.servicebyid;

                        let description = '',
                            startTime = '',
                            lastTime = '',
                            price = '',
                            repertory = 1,
                            repertoryID = '';

                        if (service !== null) {
                            description = service.description;
                            startTime = service.startTime;
                            lastTime = service.lastTime;
                            price = service.price;
                            repertory = service.repertory_id.count;
                            repertoryID = service.repertory_id.id;
                        }

                        return (
                            <ServiceDetailRender
                                serverID={serverID}
                                serviceID={serviceID}
                                description={description}
                                startTime={startTime}
                                lastTime={lastTime}
                                price={price}
                                repertory={repertory}
                                repertoryID={repertoryID}
                                donotShowDetail={donotShowDetail}
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
            serverID: props.serverID,
            serviceID: props.serviceID,
            repertoryID: props.repertoryID,
            description: props.description,
            lastTime: props.lastTime,
            startTime: props.startTime,
            price: props.price,
            repertory: props.repertory,
            showCalendar: false,
            date: props.startTime ? new Date(Number(props.startTime)) : now,
            endDate: props.startTime ? new Date(Number(props.startTime) + Number(props.lastTime)) : now,
        }
    }

    componentWillReceiveProps(next) {
        this.setState({
            serverID: next.serverID,
            serviceID: next.serviceID,
            repertoryID: next.repertoryID,
            description: next.description,
            lastTime: next.lastTime,
            startTime: next.startTime,
            price: next.price,
            repertory: next.repertory
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

    render() {
        let {serverID, serviceID, repertoryID, description, price, repertory, date, endDate} = this.state;
        let {donotShowDetail} = this.props;
        return (
            <div>
                <List renderHeader={() => '请输入服务项信息'}>
                    <InputItem onChange={(e) => {
                        this.setState({description: e})
                    }} value={description} placeholder="请输入服务类型">服务类型</InputItem>
                    <InputItem onChange={(e) => {
                        this.setState({price: e})
                    }} value={price} placeholder="请输入价格">价格</InputItem>
                    <Item
                        wrap
                        extra={
                            <Stepper
                                style={{width: '100%', minWidth: '100px'}}
                                showNumber
                                min={0}
                                value={repertory}
                                onChange={(e) => {
                                    this.setState({repertory: e})
                                }}
                            />}
                    >
                        库存
                    </Item>
                    <DatePicker
                        value={this.state.date}
                        onChange={date => this.setState({date})}
                    >
                        <List.Item arrow="horizontal">选择开放时间</List.Item>
                    </DatePicker>
                    <DatePicker
                        value={this.state.endDate}
                        onChange={endDate => this.setState({endDate})}
                    >
                        <List.Item arrow="horizontal">选择结束时间</List.Item>
                    </DatePicker>
                    <Item>
                        {
                            serviceID === 'add' ?
                                <SubmitServiceCreateButton
                                    serverID={serverID}
                                    count={repertory}
                                    description={description}
                                    price={price}
                                    startTime={date.getTime()}
                                    lastTime={endDate.getTime() - date.getTime()}
                                />
                                :
                                <SubmitServiceUpdateButton
                                    serverID={serverID}
                                    serviceID={serviceID}
                                    repertoryID={repertoryID}
                                    count={repertory}
                                    description={description}
                                    price={price}
                                    startTime={date.getTime()}
                                    lastTime={endDate.getTime() - date.getTime()}
                                />
                        }
                        <Button size="small" inline style={{marginLeft: '2.5px'}} onClick={this.onReset}>重置</Button>
                        {
                            serviceID === 'add' ?
                                ''
                                :
                                <SubmitServiceDeleteButton
                                    serverID={serverID}
                                    serviceID={serviceID}
                                    repertoryID={repertoryID}
                                    donotShowDetail={donotShowDetail}
                                />
                        }
                    </Item>
                </List>
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
        let {serverID, serviceID, description, startTime, lastTime, price, count, repertoryID} = this.props;
        return (
            <Mutation
                mutation={gql(updateserviceAndupdaterepertory)}
                refetchQueries={[
                    {query: gql(servicebyprops), variables: {server_id: serverID}}
                ]}
            >
                {(updateBothTwo, {loading, error}) => {
                    if (loading)
                        return (
                            <div className="loading">
                                <div className="align">
                                    <ActivityIndicator text="Loading..." size="large"/>
                                </div>
                            </div>
                        );
                    if (error)
                        return 'error';
                    let varObj = {
                        server_id: serverID,
                        service_id: serviceID,
                        repertory_id: repertoryID,
                        description,
                        startTime,
                        lastTime,
                        price,
                        count,
                        updatedAt: new Date().getTime()
                    };
                    return (
                        <Button type="primary" size="small" inline onClick={() => {
                            updateBothTwo({variables: varObj})
                        }}>修改</Button>
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
        let {serverID, description, startTime, lastTime, price, count} = this.props;
        return (
            <Mutation
                mutation={gql(createserviceAndcreaterepertory)}
                refetchQueries={[
                    {query: gql(servicebyprops), variables: {server_id: serverID}}
                ]}
            >
                {(createBothTwo, {loading, error}) => {
                    if (loading)
                        return (
                            <div className="loading">
                                <div className="align">
                                    <ActivityIndicator text="Loading..." size="large"/>
                                </div>
                            </div>
                        );
                    if (error)
                        return 'error';
                    let varObj = {
                        server_id: serverID,
                        service_id: idGen('service'),
                        repertory_id: idGen('repertory'),
                        description,
                        startTime,
                        lastTime,
                        price,
                        count,
                        createdAt: new Date().getTime(),
                        updatedAt: ''
                    };
                    return (
                        <Button type="primary" size="small" inline onClick={() => {
                            createBothTwo({variables: varObj})
                        }}>创建</Button>
                    )
                }}
            </Mutation>
        )
    }
}

class SubmitServiceDeleteButton extends Component {
    constructor(props) {
        super(props);
        this.state = {}
    }

    render() {
        let {serverID, serviceID, repertoryID, donotShowDetail} = this.props;
        return (
            <Mutation
                mutation={gql(deleteserviceAnddeleterepertory)}
                refetchQueries={[
                    {query: gql(servicebyprops), variables: {server_id: serverID}}
                ]}
            >
                {(deleteBothTwo, {loading, error}) => {
                    if (loading)
                        return (
                            <div className="loading">
                                <div className="align">
                                    <ActivityIndicator text="Loading..." size="large"/>
                                </div>
                            </div>
                        );
                    if (error)
                        return 'error';
                    let varObj = {
                        service_id: serviceID,
                        repertory_id: repertoryID
                    };
                    return (
                        <Button size="small" type="warning" inline style={{marginLeft: '10px'}} onClick={() => {
                            deleteBothTwo({variables: varObj});
                            donotShowDetail();
                        }}>删除</Button>
                    )
                }}
            </Mutation>

        )
    }
}

export default Release;

