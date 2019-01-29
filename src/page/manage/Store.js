import React, {Component} from 'react';
import './index.css';
import {WhiteSpace, List, ActivityIndicator, Modal, ImagePicker, InputItem, Button} from 'antd-mobile';
import {updateuser, userbyprops, storebyprops, createstore, updatestore} from "../../gql";
import {Query, Mutation} from "react-apollo";
import gql from "graphql-tag";
import {Message} from '../customer/home/User';
import {storeFile} from "../../config";
import axios from 'axios';
import {idGen} from "../../func";

axios.defaults.withCredentials = true;
const alert = Modal.alert;
const Item = List.Item;
const prompt = Modal.prompt;

class Store extends Component {
    constructor(props) {
        super(props);
        this.state = {}
    }

    render() {
        let {userID} = this.props;
        return (
            <div>
                <WhiteSpace/>
                <StoreDetailFetch/>
                <WhiteSpace/>
                <ManagePeople userID={userID}/>
            </div>
        );
    }
}

export default Store;

class StoreDetailFetch extends Component {
    constructor(props) {
        super(props);
        this.state = {}
    }

    render() {
        return (
            <Query query={gql(storebyprops)} variables={{}}>
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
                        let store, newStore;
                        let storeLength = data.storebyprops.length;
                        if (storeLength === 0) {
                            // console.log('尚未个性化 store');
                            store = {};
                            newStore = true;
                        } else if (storeLength === 1) {
                            // console.log('存在 store, update');
                            store = data.storebyprops[0];
                            newStore = false;
                        } else {
                            console.log('store 数据库出现错误');
                        }

                        let {name, description, address, alert, slideshow, id} = store;
                        let storeID = newStore ? idGen('store') : id;
                        return (
                            <StoreDetailRender
                                name={name}
                                description={description}
                                address={address}
                                alert={alert}
                                slideshow={slideshow}
                                newStore={newStore}
                                storeID={storeID}
                            />
                        )
                    }
                }
            </Query>
        )
    }
}

class StoreDetailRender extends Component {
    // files 和 slideshow 无法处理
    constructor(props) {
        super(props);
        this.state = {
            storeID: props.storeID,
            files: [],
            imgDatas: [],
            name: props.name,
            description: props.description,
            address: props.address,
            alert: props.alert,
            slideshow: props.slideshow, //未进行展示
        }
    }

    onReset = () => {
        this.setState({
            files: [],
            imgDatas: [],
            name: '',
            description: '',
            address: '',
            alert: ''
        })
    };

    onChange = (files, operationType) => {
        console.log("files", files, "operationType", operationType);

        let imgDatas = [];
        let {storeID} = this.state;

        files.forEach((file, index) => {
            let base64Cont = files[index].url.split(',')[1];
            let imgType = files[index].file.type.split('/')[1];
            let imgNewName = `slideshow_${index}_storeID_${storeID}.${imgType}`;

            const imgData = {
                'file-name': `appointment/images/${imgNewName}`,
                'bucket': 'case',
                'cont': base64Cont,
                'public': true,
                'format': 'base64'
            };

            imgDatas.push(imgData)
        });

        this.setState({
            imgDatas,
            files
        });

        console.log(imgDatas, 'imgDatas');
    };

    render() {
        let {files, name, description, address, alert, slideshow, imgDatas, storeID} = this.state;
        let {newStore} = this.props;
        return (
            <List renderHeader={() => '店铺个性化管理'} className="my-list">
                <InputItem onChange={(e) => {
                    this.setState({name: e})
                }} value={name} placeholder="名称暂时不会显示">名称</InputItem>
                <InputItem onChange={(e) => {
                    this.setState({description: e})
                }} value={description} placeholder="简介暂时不会显示">简介</InputItem>
                <InputItem onChange={(e) => {
                    this.setState({address: e})
                }} value={address} placeholder="地址暂时不会显示">地址</InputItem>
                <InputItem onChange={(e) => {
                    this.setState({alert: e})
                }} value={alert} placeholder="通告会显示在用户界面的服务首页">通告</InputItem>
                <div className={'my-list-subtitle'}>页面轮播图</div>
                <ImagePicker
                    files={files}
                    onChange={this.onChange}
                    onImageClick={(index, fs) => console.log(index, fs)}
                    selectable={true}
                    multiple={false}
                />
                <Item>
                    {
                        newStore ?
                            <CreateStoreButton
                                storeID={storeID}
                                imgDatas={imgDatas}
                                name={name}
                                description={description}
                                address={address}
                                alert={alert}
                                slideshow={slideshow}
                            />
                            :
                            <UpdateStoreButton
                                storeID={storeID}
                                imgDatas={imgDatas}
                                name={name}
                                description={description}
                                address={address}
                                alert={alert}
                                slideshow={slideshow}
                            />
                    }
                    <Button size="small" inline style={{marginLeft: '2.5px'}} onClick={this.onReset}>重置</Button>
                </Item>
            </List>
        )
    }
}

class UpdateStoreButton extends Component {
    constructor(props) {
        super(props);
        this.state = {}
    }

    uploadImg = () => {
        let {imgDatas} = this.props;

        return imgDatas.map((imgData) => (
            axios({
                url: storeFile,
                method: 'post',
                data: imgData
            })
        ));
    };

    render() {
        let {name, description, address, alert, imgDatas, storeID} = this.props;
        return (
            <Mutation
                mutation={gql(updatestore)}
                refetchQueries={[{query: gql(storebyprops), variables: {}}]}
            >
                {(updatestore, {loading, error}) => {
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
                        id: storeID,
                        name,
                        description,
                        address,
                        alert,
                        updatedAt: new Date().getTime(),
                    };
                    return (
                        <Button type="primary" size="small" inline onClick={() => {
                            if (imgDatas.length !== 0) {
                                Promise.all(this.uploadImg()).then(res => {
                                    let prefix = 'https://case-1254337200.cos.ap-beijing.myqcloud.com/';
                                    let slideshow = imgDatas.length === 1 ? prefix + imgDatas[0]['file-name'] : imgDatas.map((imgData, index) => (
                                        prefix + imgDatas[index]['file-name']
                                    ));
                                    updatestore({variables: {...varObj, slideshow}})
                                });
                            } else {
                                updatestore({variables: varObj})
                            }
                        }}>更新</Button>
                    )
                }}
            </Mutation>
        )
    }
}

class CreateStoreButton extends Component {
    constructor(props) {
        super(props);
        this.state = {}
    }

    uploadImg = () => {
        let {imgDatas} = this.props;

        return imgDatas.map((imgData) => (
            axios({
                url: storeFile,
                method: 'post',
                data: imgData
            })
        ));
    };

    render() {
        let {name, description, address, alert, imgDatas, storeID} = this.props;
        return (
            <Mutation
                mutation={gql(createstore)}
                refetchQueries={[{query: gql(storebyprops), variables: {}}]}
            >
                {(createstore, {loading, error}) => {
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
                        id: storeID,
                        name: name ? name : '',
                        description: description ? description : '',
                        address: address ? address : '',
                        alert: alert ? alert : '',
                        createdAt: new Date().getTime(),
                        updatedAt: ''
                    };
                    return (
                        <Button type="primary" size="small" inline onClick={() => {
                            Promise.all(this.uploadImg()).then(res => {
                                let prefix = 'https://case-1254337200.cos.ap-beijing.myqcloud.com/';
                                let slideshow = imgDatas.length === 1 ? prefix + imgDatas[0]['file-name'] : imgDatas.map((imgData, index) => (
                                    prefix + imgDatas[index]['file-name']
                                ));
                                createstore({variables: {...varObj, slideshow}})
                            });
                        }}>创建</Button>
                    )
                }}
            </Mutation>
        )
    }
}

class ManagePeople extends Component {
    constructor(props) {
        super(props);
        this.state = {
            modal: false
        }
    }

    render() {
        let {userID} = this.props;
        return (
            <Query query={gql(userbyprops)} variables={{}}>
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

                        let admins = data.userbyprops.filter(user => user.admin === 'true');
                        let me = admins.find(user => user.id === userID);
                        let meIndex = admins.findIndex(user => user.id === userID);
                        admins.splice(meIndex, 1);

                        return (
                            <List renderHeader={() => '管理员成员'} className="my-list">
                                <div className={'my-list-subtitle'}>我</div>
                                <Item
                                    arrow="horizontal"
                                    multipleLine
                                    onClick={() => {
                                        this.setState({
                                            modal: true
                                        })
                                    }}
                                >
                                    点击设置我的信息
                                </Item>
                                <Modal
                                    visible={this.state.modal}
                                    transparent
                                    maskClosable={true}
                                    closable={true}
                                    title="设置你的联系方式"
                                    onClose={() => {
                                        this.setState({
                                            modal: false
                                        })
                                    }}
                                >
                                    <Message user={me}/>
                                </Modal>
                                <div className={'my-list-subtitle'}>其他管理员</div>
                                {
                                    admins.map((user, index) =>
                                        <Mutation
                                            mutation={gql(updateuser)}
                                            refetchQueries={[
                                                {query: gql(userbyprops), variables: {}},
                                            ]}
                                            key={user.id}
                                        >
                                            {(updateuser, {loading, error}) => {
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
                                                    <div>
                                                        <Item
                                                            key={user.id}
                                                            arrow="horizontal"
                                                            multipleLine
                                                            onClick={() => {
                                                                alert('取消该管理员', '取消后作为普通用户存在', [
                                                                    {
                                                                        text: '取消',
                                                                        onPress: () => console.log('cancel'),
                                                                        style: 'default'
                                                                    },
                                                                    {
                                                                        text: '确定', onPress: () => {
                                                                            updateuser({
                                                                                variables: {
                                                                                    id: user.id,
                                                                                    admin: 'false'
                                                                                }
                                                                            })
                                                                        }
                                                                    },
                                                                ]);
                                                            }}
                                                        >
                                                            {
                                                                (user.nickname || user.telephone) ?
                                                                    `${index + 1}. ${user.nickname}：${user.telephone}`
                                                                    :
                                                                    `${index + 1}. 请通知该管理员设置姓名和号码`
                                                            }
                                                        </Item>
                                                    </div>
                                                )
                                            }}
                                        </Mutation>
                                    )
                                }

                                <Mutation
                                    mutation={gql(updateuser)}
                                    refetchQueries={[
                                        {query: gql(userbyprops), variables: {}},
                                    ]}
                                >
                                    {(updateuser, {loading, error}) => {
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
                                                onClick={() => prompt(
                                                    '输入用户识别码',
                                                    '可在 "我的-个人信息-更多资料" 里点击复制',
                                                    [
                                                        {text: '取消'},
                                                        {
                                                            text: '确认',
                                                            onPress: userUIDShow => {
                                                                let userID = 'user_' + userUIDShow.replace('&&', '_');
                                                                updateuser({variables: {id: userID, admin: 'true'}})
                                                            }
                                                        },
                                                    ],
                                                    'default',
                                                )}
                                            >
                                                添加管理员
                                            </Item>
                                        )
                                    }}
                                </Mutation>
                            </List>
                        )
                    }
                }
            </Query>
        )
    }
}

