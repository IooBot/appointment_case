import React, {Component} from 'react';
import {userbyid, updateuser} from "../../../gql";
import gql from "graphql-tag";
import {Query, Mutation} from "react-apollo";
import {InputItem, Toast, List, Button, ActivityIndicator, WhiteSpace} from 'antd-mobile';
import copy from 'copy-to-clipboard';
import moment from 'moment';

const Item = List.Item;
moment.locale('zh-cn');

class User extends Component {
    render() {
        let {userID} = this.props;
        return (
            <Query query={gql(userbyid)} variables={{id: userID}}>
                {
                    ({loading, error, data}) => {
                        if (loading) {
                            return (
                                <div className="tab-center">
                                    <ActivityIndicator text="Loading..." size="large"/>
                                </div>
                            )
                        }
                        if (error) {
                            return 'error!';
                        }

                        let user = data.userbyid;
                        let tip = '';
                        if (user === null) {
                            tip = '还没登录，出现了错误'
                        }

                        return (
                            <div>
                                {
                                    tip ?
                                        <div className={'center'}>{tip}</div>
                                        :
                                        ''
                                }
                                <Message user={user} header="填写你的信息"/>
                                <MoreMessage user={user}/>
                            </div>
                        )
                    }
                }
            </Query>
        );
    }
}

class Message extends Component {
    constructor(props) {
        super(props);
        this.state = {
            hasError: false,
            phone: props.user.telephone,
            name: props.user.nickname,
            userID: props.user.id
        };
    }

    onErrorClick = () => {
        if (this.state.hasError) {
            Toast.info('请输入11位手机号码');
        }
    };

    onChange = (phone) => {
        if (phone.replace(/\s/g, '').length < 11) {
            this.setState({
                hasError: true,
            });
        } else {
            this.setState({
                hasError: false,
            });
        }
        this.setState({
            phone,
        });
    };

    nameChange = (name) => {
        this.setState({
            name,
        });
    };

    render() {
        let {name, hasError, phone, userID} = this.state;
        let {header} = this.props;
        return (
            <div>
                {
                    header ?
                        <List renderHeader={() => header}>
                            <InputItem
                                placeholder="请输入联系人姓名"
                                value={name}
                                onChange={this.nameChange}
                            >姓名</InputItem>
                            <InputItem
                                type="phone"
                                placeholder="请输入手机号码"
                                error={hasError}
                                onErrorClick={this.onErrorClick}
                                onChange={this.onChange}
                                value={phone}
                            >手机号码</InputItem>
                        </List>
                        :
                        <List>
                            <InputItem
                                placeholder="请输入联系人姓名"
                                value={name}
                                onChange={this.nameChange}
                            >姓名</InputItem>
                            <InputItem
                                type="phone"
                                placeholder="请输入手机号码"
                                error={hasError}
                                onErrorClick={this.onErrorClick}
                                onChange={this.onChange}
                                value={phone}
                            >手机号码</InputItem>
                        </List>
                }
                <SaveButton
                    userID={userID}
                    telephone={phone}
                    name={name}
                />
            </div>
        );
    }
}

const MoreMessage = (props) => {
    let {id, createdAt} = props.user;
    let userUIDShow = id.replace('user_', '').replace('_', '&&');
    return (
        <div>
            <WhiteSpace/>
            <List renderHeader={() => '更多资料'}>
                <div className="my-list-subtitle">个人识别码（凭该码和商家沟通）</div>
                <Item
                    onClick={() => {
                        copy(userUIDShow);
                        Toast.success('复制成功', 1);
                    }}
                >
                    {userUIDShow}
                </Item>
                <div className="my-list-subtitle">创建时间</div>
                <Item>
                    {moment(Number(createdAt)).format("YYYY-MM-DD HH:mm:ss")}
                </Item>
            </List>
        </div>
    )
};

class SaveButton extends Component {
    constructor(props) {
        super(props);
        this.state = {}
    }

    render() {
        let {userID, telephone, name} = this.props;
        return (
            <Mutation mutation={gql(updateuser)}>
                {(updateuser, {loading, error}) => {
                    if (loading)
                        return (
                            <div className="tab-center">
                                <ActivityIndicator text="Loading..." size="large"/>
                            </div>
                        );
                    if (error)
                        return 'error';
                    return (
                        <Button type={'primary'} style={{margin: '5px 10px'}} onClick={() => {
                            console.log(1);
                            updateuser({
                                variables: {
                                    id: userID,
                                    telephone,
                                    nickname: name,
                                    updatedAt: new Date().getTime()
                                }
                            })
                        }}>保存</Button>
                    )
                }}
            </Mutation>
        )
    }
}

export {Message}
export default User;