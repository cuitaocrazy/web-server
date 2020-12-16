import { EmployeeDaily } from '../db/model'
import { userParse } from '../util/utils'
const testMe = { id: 'ct', name: 'ct', roles: ['supervisor', 'project_manager', 'group_leader', 'assistant', 'engineer'] }
const testsubordinates = [{ id: 'lfh', name: 'liufanghua' }, { id: 'ctk', name: 'cuitingkai' }]
const resolvers = {
  Query: {
    me: (_: any, __: any, context: any) => ({ ...testMe, id: userParse(context).username(), name: userParse(context).fullName() }),
    subordinates: (_: any, __: any, context: any) => testsubordinates,
    myDaily: (_: any, __: any, context: any) => EmployeeDaily.findOne({ _id: userParse(context).username() }),
  },
}

export default resolvers
