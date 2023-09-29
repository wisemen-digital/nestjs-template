import { Injectable } from '@nestjs/common'
import { OAuth2Server, createOAuth2 } from '@appwise/oauth2-server'
import { type Request, type Response } from 'express'
import { UserService } from '../users/user.service.js'
import { ClientService, scopes } from './services/client.service.js'
import { TokenService } from './services/token.service.js'
import { type AccessTokenInterface } from './entities/accesstoken.entity.js'

@Injectable()
export class AuthService {
  private readonly oauth: OAuth2Server

  constructor (
    private readonly userService: UserService,
    private readonly clientService: ClientService,
    private readonly tokenService: TokenService
  ) {
    this.oauth = createOAuth2({
      scopes,
      services: {
        userService: this.userService,
        clientService: this.clientService,
        tokenService: this.tokenService
      }
    })
  }

  public async signIn (req: Request, res: Response): Promise<OAuth2Server.Token> {
    const request = new OAuth2Server.Request(req)
    const response = new OAuth2Server.Response(res)

    return await this.oauth.token(request, response, {
      requireClientAuthentication: {
        refresh_token: false
      }
    })
  }

  public async authenticate (req: Request, res: Response): Promise<AccessTokenInterface> {
    const request = new OAuth2Server.Request(req)
    const response = new OAuth2Server.Response(res)

    const authres = await this.oauth.authenticate(request, response)

    return authres as AccessTokenInterface
  }
}
