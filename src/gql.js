// 注意是否使用 gql
// apollo client 需要使用 gql
// graphql-request 不需要使用 gql
// import gql from "graphql-tag";

const serverbyprops = `
    query serverbyprops($name: String, $description: String, $img: String, $createdAt: String, $updatedAt: String) {
      serverbyprops: server_by_props(name: $name description: $description img: $img createdAt: $createdAt updatedAt: $updatedAt) {
        id
        name
        description
        img
        createdAt
        updatedAt
      }
    }
`;

const servicebyprops = `
    query servicebyprops($server_id: ID) {
      servicebyprops: service_by_props(server_id: $server_id) {
        id
        server_id {
          id
          name
          description
          img
          createdAt
          updatedAt
        }
        repertory_id {
          id
          count
          createdAt
          updatedAt
        }
        description
        price
        startTime
        lastTime
      }
    }
`;

const orderbyprops = `
    query orderbyprops($orderStatus: String, $user_id: ID) {
      orderbyprops: order_by_props(orderStatus: $orderStatus user_id: $user_id) {
        payStatus
        remark
        payCount
        updatedAt
        payTime
        createdAt
        orderStatus
        id
        user_id {
          id
          openid
          admin
          username
          password
          telephone
          email
          createdAt
          updatedAt
        }
        service_id {
          id
          description
          price
          startTime
          lastTime
          createdAt
          updatedAt
          server_id {
              id
              name
              description
              img
              createdAt
              updatedAt
           }
        }
        customerNumber
      }
    }
`;

const userbyid = `
    query userbyid($id: ID) {
      userbyid: user_by_id(id: $id) {
        id
        openid
        admin
        username
        password
        telephone
        email
        createdAt
        updatedAt
      }
    }
`;

const updateuser = `
    mutation updateuser($id: ID, $username: String, $telephone: String, $updatedAt: String) {
      updateuser: update_user(id: $id username: $username  telephone: $telephone updatedAt: $updatedAt) {
        id
        openid
        admin
        username
        password
        telephone
        email
        createdAt
        updatedAt
      }
    }

`;

const updateorderAndupdaterepertory = `
    mutation updateorderAndupdaterepertory ($order_id: ID, $repertory_id: ID, $updatedAt: String, $orderStatus: String, $count: Int) {
      updateorder: update_order(id: $order_id updatedAt: $updatedAt orderStatus: $orderStatus) {
        payStatus
        remark
        payCount
        updatedAt
        payTime
        createdAt
        orderStatus
        id
        customerNumber
      }
      
      updaterepertory: update_repertory(id: $repertory_id count: $count updatedAt: $updatedAt) {
        id
        count
        updatedAt
      }
    }
`;

export {
    serverbyprops,
    servicebyprops,
    orderbyprops,
    userbyid,
    updateuser,
    updateorderAndupdaterepertory
}