import { Controller, Post, Req, Res } from '@nestjs/common'
import { Request, Response } from 'express'
import { Public } from '../../permissions/permissions.decorator.js'
import { AuthTransformer } from '../transformers/auth.transformer.js'
import { AuthService } from '../services/auth.service.js'

@Controller('auth')
export class AuthController {
  constructor (
    private readonly authService: AuthService
  ) { }

  @Post()
  @Public()
  public async createToken (@Req() req: Request, @Res() res: Response): Promise<void> {
    try {
      const token = await this.authService.signIn(req, res)

      res.json(new AuthTransformer().item(token))
    } catch (err) {
      res.status(err.code).json({
        error: err.name,
        error_description: err.message
      })
    }
  }
}
