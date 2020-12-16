import express from 'express'
import session from 'express-session'
import { ApolloServer, gql } from 'apollo-server-express'
import Keycloak from 'keycloak-connect'
import { KeycloakContext, KeycloakSchemaDirectives, KeycloakTypeDefs } from 'keycloak-connect-graphql'
import def from './graphql'
import config from './config/server'
import keycloakConfig from './config/keycloak'
import testInitDb from './test-init'

testInitDb()

// test
let testGrant: any
const server = new ApolloServer({
  typeDefs: [gql(KeycloakTypeDefs), def.typeDefs],
  resolvers: def.resolvers,
  schemaDirectives: KeycloakSchemaDirectives,
  context: ({ req }: any) => {
    // test
    req.kauth = testGrant
    const kauth = new KeycloakContext({ req })
    return {
      kauth,
    }
  },
})

const app = express()
const memoryStore = new session.MemoryStore()

app.use(session({
  secret: 'some secret',
  resave: false,
  saveUninitialized: true,
  store: memoryStore,
}))

const keycloak = new Keycloak({
  store: memoryStore,
}, keycloakConfig as any)

app.use(keycloak.middleware({
  logout: '/logout',
  admin: '/admin',
}))

app.use('/login', keycloak.protect(), (req, res) => {
  // test
  testGrant = (req as any).kauth
  res.send(`
<html><body>
<span>user name:</span>
<span>${(req as any).kauth.grant.access_token.content.preferred_username}</span>
<p />
<span>token:</span>
<span>${(req as any).kauth.grant.access_token.token}</span>
</body></html>
  `)
})

server.applyMiddleware({ app })

app.use('/', (req, res) => res.send('hello'))

app.listen(config.port, () => console.log(`server is started on port ${config.port}!`))
