/*
    本地开发版
*/
// const graphqlFC = 'http://demo.ioobot.cn/graphql';


/*
    上线版
*/
let graphqlFC;

if(window.location.hostname.includes('apigateway.myqcloud.com')) {
    // 未配域名
    graphqlFC = window.location.origin + '/test/graphql';
} else {
    // 已配域名
    graphqlFC = window.location.origin + '/graphql';
}

const storeFile = 'http://deploy.ioobot.cn/api/store-file';

export {graphqlFC, storeFile}