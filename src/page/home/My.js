import React, {Component} from 'react';
import {Tabs, WhiteSpace} from 'antd-mobile';
import {StickyContainer, Sticky} from 'react-sticky';
import Ordered from './Ordered';
import Cancelled from './Cancelled';
import User from './User';

function renderTabBar(props) {
    return (<Sticky>
        {({style}) => <div style={{...style, zIndex: 1}}><Tabs.DefaultTabBar {...props} /></div>}
    </Sticky>);
}

const tabs = [
    {title: '已预约'},
    {title: '已取消'},
    {title: '个人信息'},
];

class My extends Component {
    constructor(props) {
        super(props);
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
                            <Ordered userID={this.state.userID}/>
                            <Cancelled userID={this.state.userID}/>
                            <User userID={this.state.userID}/>
                        </Tabs>
                    </StickyContainer>
                    <WhiteSpace/>
                </div>
            </div>
        );
    }
}

export default My;
