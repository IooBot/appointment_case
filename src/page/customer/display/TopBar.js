import React, {Component} from 'react';
import {WhiteSpace, Carousel, WingBlank, NoticeBar, ActivityIndicator} from 'antd-mobile';
import {storebyprops} from "../../../gql";
import {Query} from "react-apollo";
import gql from "graphql-tag";

class TopBar extends Component {
    constructor(props) {
        super(props);
        this.state = {
            data: ['AiyWuByWklrrUDlFignR', 'TekJlZRVCjLFexlOCuWn', 'IJOtIlfsYdTyaDTRVrLI'],
            imgHeight: 176,
        }
    }

    render() {
        return (
            <div>
                <WhiteSpace/>
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

                            let store;
                            let storeLength = data.storebyprops.length;
                            if (storeLength === 0) {
                                console.log('首页 尚未个性化 store');
                            } else if (storeLength === 1) {
                                store = data.storebyprops[0];
                                if(store.alert !== '') {
                                    return (
                                        <div>
                                            <NoticeBar marqueeProps={{ loop: true, style: { padding: '0 7.5px' } }}>
                                                {store.alert}
                                            </NoticeBar>
                                            <WhiteSpace/>
                                        </div>
                                    )
                                }
                            } else {
                                console.log('首页 store 数据库出现错误');
                            }
                            return ''
                        }
                    }
                </Query>

                <WingBlank>
                    <Carousel
                        autoplay={true}
                        infinite
                    >
                        {this.state.data.map(val => (
                            <a
                                key={val}
                                href="http://www.alipay.com"
                                style={{display: 'inline-block', width: '100%', height: this.state.imgHeight}}
                            >
                                <img
                                    src={`https://zos.alipayobjects.com/rmsportal/${val}.png`}
                                    alt=""
                                    style={{width: '100%', verticalAlign: 'top'}}
                                    onLoad={() => {
                                        window.dispatchEvent(new Event('resize'));
                                        this.setState({imgHeight: 'auto'});
                                    }}
                                />
                            </a>
                        ))}
                    </Carousel>
                </WingBlank>
            </div>
        );
    }
}

export default TopBar;
