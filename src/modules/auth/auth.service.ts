import { Injectable } from '@nestjs/common';
import { UserService } from '../users/user.service.js';
import { ClientService, scopes } from './services/client.service.js';
import { OAuth2Server, createOAuth2 } from '@appwise/oauth2-server';
import { TokenService } from './services/token.service.js';
import { Request, Response } from 'express';
import { AccessTokenInterface } from './entities/accesstoken.entity.js';

@Injectable()
export class AuthService {
  private oauth: OAuth2Server

  constructor(
    private userService: UserService,
    private clientService: ClientService,
    private tokenService: TokenService
  ) {
    this.oauth = createOAuth2({
      scopes: scopes,
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
