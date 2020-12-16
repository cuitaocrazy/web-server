
import { range } from 'ramda'
import { EmployeeDaily, IEmployeeDaily, IProject, ProjDaily, Project } from './db/model'
import moment from 'moment'
import { client } from './db/init'

const users = ['eng1', 'eng2', 'pm1', 'pm2', 'gl1', 'gl2']

function makeProj (index: number): IProject {
  return {
    _id: `proj_${index}`,
    name: `项目_${index}`,
    leader: 'admin',
    budget: 1000000,
    createDate: moment('20201210', 'YYYYMMDD').toDate(),
    status: 'create',
    participants: ['admin', 'cuitao'],
    contacts: [{ name: 'ct', phone: '13811111111' }],
  }
}

const randomNumber = (s: number) => Math.floor(Math.random() * 10) % s

function makeProjDaily (index: number): ProjDaily {
  return {
    projId: `proj_${index}`,
    timeConsuming: randomNumber(10),
    content: 'test worke content',
  }
}

function makeDaily (date: string): {date: string, projs: ProjDaily[]} {
  return {
    date,
    projs: range(1, 10).map(i => makeProjDaily(i)),
  }
}

function makeEmpDaily (name: string): IEmployeeDaily {
  return {
    _id: name,
    dailies: range(1, 10).map(i => `2020120${i}`).map(makeDaily),
  }
}

export default () => {
  client.db().dropDatabase().then(() => {
    Project.insertMany(range(1, 10).map(i => makeProj(i)))
    EmployeeDaily.insertMany(users.map(u => makeEmpDaily(u)))
  })
}
