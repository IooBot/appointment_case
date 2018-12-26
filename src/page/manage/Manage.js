import React, { Component } from 'react';
import './index.css';
import {Tabs, WhiteSpace} from 'antd-mobile';
import {StickyContainer, Sticky} from 'react-sticky';
import AllOrder from './AllOrder';
import Release from './Release';

function renderTabBar(props) {
    return (<Sticky>
        {({style}) => <div style={{...style, zIndex: 1}}><Tabs.DefaultTabBar {...props} /></div>}
    </Sticky>);
}

const tabs = [
    {title: '所有订单'},
    {title: '发布服务'}
];

class Manage extends Component {
    constructor(props) {
        super(props);
        //todo: userID
        this.state = {
            userID: 'handsome'
        }
    }

    render() {
        return (
            <div>
                <div>
                    <WhiteSpace/>
                    <StickyContainer>
                        <Tabs tabs={tabs}
                              initalPage={'t2'}
                              renderTabBar={renderTabBar}
                        >
                            <AllOrder userID={this.state.userID}/>
                            <Release userID={this.state.userID}/>
                        </Tabs>
                    </StickyContainer>
                    <WhiteSpace/>
                </div>
            </div>
        );
    }
}

export default Manage;
