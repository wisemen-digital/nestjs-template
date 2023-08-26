import { Controller, Post, Req, Res } from '@nestjs/common'
import { OAuth2Server, createOAuth2 } from '@appwise/oauth2-server'
import { UserService } from '../users/user.service.js'
import { ClientService, Scope, scopes } from './services/client.service.js'
import { TokenService } from './services/token.service.js'
import { AuthTransformer, AuthTransformerType } from './auth.transformer.js'
import { Response } from 'express'

@Controller('auth')
export class AuthController {
  private oauth: OAuth2Server

  constructor (
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

  @Post()
  public async createToken (@Req() req: Request, @Res() res: Response): Promise<void> {
    const request = new OAuth2Server.Request(req)
    const response = new OAuth2Server.Response(res)

    try {
      const token = await this.oauth.token(request, response, {
        requireClientAuthentication: {
          refresh_token: false
        }
      })

      res.json(new AuthTransformer().item(token))
    } catch (err) {
      res.status(err.code).json({
        error: err.name,
        error_description: err.message
      })
    }
  }
}
