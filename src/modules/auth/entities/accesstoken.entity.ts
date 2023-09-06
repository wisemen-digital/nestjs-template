export class AccessTokenInterface {
  uid: string
  cid: string
  scope: string[]
  user: {
    uuid: string
    role: string
  }
  client: {
    uuid: string
    id: string
    grants: string[]
    scopes: string[]
  }
  accessToken: string
  accessTokenExpiresAt: Date
}

export interface AccessTokenPayload {
  uid: string
  cid: string
  scope: string[]
  role: string
  exp: number
}
