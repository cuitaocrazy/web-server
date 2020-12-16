import path from 'path'
import { userParse } from '../util/utils'
import keycloakConfig from '../config/keycloak'
import { any, compose, flatten, map, unnest, uniqBy } from 'ramda'
import axios, { AxiosInstance } from 'axios'

type Group = {
  id: string
  path: string
  subGroups: Group[]
}

type User = {
  username: string
  firstName?: string
  lastName?: string
}

const groupUrl = path.join(keycloakConfig.serverUrl, 'admin/realms', keycloakConfig.realm, 'groups')
const groupMembersUrl = (groupId: string) => path.join(keycloakConfig.serverUrl, 'admin/realms', keycloakConfig.realm, 'groups', groupId, 'members')

const existGroup: (groupPath: string) => (group: Group) => boolean = groupPath => group => group.path === groupPath || existGroupByAs(groupPath)(group.subGroups)

type A = (g: Group) => boolean
type B = (gs: Group[]) => boolean
const existGroupByAs = compose<string, A, B>(any, existGroup)

const getGroupIds: (group: Group) => string[] = (group) => [...flatten(map(getGroupIds)(group.subGroups)), group.id]

async function getAllGroups (ins:AxiosInstance, groupPath: string) {
  const groups = await ins.get<Group[]>(groupUrl).then(res => res.data)
  const g = groups.find(existGroup(groupPath))
  if (g) {
    return getGroupIds(g)
  } else {
    return []
  }
}

async function getAllGroupsMembers (ins:AxiosInstance, groupIds: string[]) {
  const users = unnest(await Promise.all(groupIds.map(id => ins.get<User[]>(groupMembersUrl(id)).then(res => res.data))))
  return uniqBy(u => u.username, users)
}

export async function getUsers (req: any) {
  const currentUser = userParse(req)
  const ins = axios.create({
    headers: {
      Authorization: `Bearer ${currentUser.token()}`,
    },
  })
  const allGroups = await getAllGroups(ins, currentUser.group())
  return await getAllGroupsMembers(ins, allGroups)
}
