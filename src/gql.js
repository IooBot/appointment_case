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

export {
    serverbyprops,
    servicebyprops
}