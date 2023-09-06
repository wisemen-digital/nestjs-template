import type * as OAuth2Server from '@appwise/oauth2-server'
import { Transformer } from '@appwise/transformer'

export interface AuthTransformerType {
  access_token: string
  token_type: string
  expires_in?: number
  refresh_token?: string
}
export class AuthTransformer extends Transformer<OAuth2Server.Token, AuthTransformerType> {
  transform (token: OAuth2Server.Token): AuthTransformerType {
    return {
      access_token: token.accessToken,
      token_type: 'Bearer',
      expires_in: (token.accessTokenExpiresAt != null)
        ? Math.floor((token.accessTokenExpiresAt.getTime() - Date.now()) / 1000)
        : undefined,
      refresh_token: token.refreshToken
    }
  }
}
