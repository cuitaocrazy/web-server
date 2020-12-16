import { gql } from 'apollo-server-express'

const defs = gql`
type SimpleUser {
  id: ID!
  name: String!
}

type SimpleProjs {
  id: ID!
  name: String!
}

type User {
  id: ID!
  name: String
  roles: [String!]!
}

type EmployeeDaily {
  id: ID!
  dailies(date: String): [Daily!]!
}

type Daily {
  date: String
  projs: [ProjDaily!]!
}

type ProjDaily {
  projId: String!
  timeConsuming: Int!
  content: String
}

type Project {
  id: ID!
  name: String!
  leader: String!
  budget: Int!
  createDate: String!
  status: ProjectStatus!
  participants: [String!]!
  contacts: [Contact!]!
}

type Contact {
  name: String!
  duties: String
  phone: String
}

enum ProjectStatus {
  create
  dev
  test
  acceptance
  complete
}

type Query {
  me: User! @auth
  subordinates: [SimpleUser!]! @hasRole(role: ["realm:app-admin"])
  myDaily: EmployeeDaily
  iLeaderProjs: [Project!]!
  iLeaderProj(projId: String!): Project!
}
`

export default defs
