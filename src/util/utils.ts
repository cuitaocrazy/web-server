import * as R from 'ramda'

const getUserInfo = (p: string[]) => (context: any) => {
  const username = () => R.path([...p, 'content', 'preferred_username'])(context) as string
  const group = () => R.path([...p, 'content', 'group_path'])(context) as string
  const fullName = () => {
    const fn = R.path([...p, 'family_name'])(context) as string || ''
    const gn = R.path([...p, 'given_name'])(context) as string || ''
    return (fn + gn) || username()
  }
  const token = () => R.path([...p, 'token'])(context) as string

  return {
    username,
    group,
    fullName,
    token,
  }
}

const getPath = (context: any) => context.kauth && context.kauth.grant
  ? ['kauth', 'grant', 'access_token']
  : ['kauth', 'accessToken']

const userParse = R.chain(getUserInfo, getPath)
export {
  userParse,
}
