import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import type { JwtPayload } from 'jsonwebtoken'
import { v4 as uuidv4 } from 'uuid'
import { RefreshToken } from '../entities/refreshtoken.entity.js'
import { Repository } from 'typeorm'
import { verifyToken } from '../../../utils/token.js'
import { AccessToken } from '../entities/accesstoken.entity.js'
import { Client } from '../entities/client.entity.js'
import { User } from '../../users/user.entity.js'

export interface RefreshTokenPayload {
  tid: string
  uid: string
  cid: string
  scope: string[]
  exp: number
}

@Injectable()
export class TokenService {
  constructor (
    @InjectRepository(RefreshToken)
    private readonly refreshTokenRepository: Repository<RefreshToken>
  ) {}

  private parseLifetime (lifetime?: string): number {
    const value = Number(lifetime)

    if (isNaN(value)) return 3600
    else return value
  }

  getAccessTokenLifetime (): number {
    return this.parseLifetime(process.env.ACCESS_TOKEN_LIFETIME)
  }

  getRefreshTokenLifetime (): number {
    return this.parseLifetime(process.env.REFRESH_TOKEN_LIFETIME)
  }

  async getAccessToken (token: string): Promise<AccessToken | false> {
    try {
      const decoded = verifyToken<JwtPayload>(token)

      const accessToken = new AccessToken()

      accessToken.exp = decoded.exp
      accessToken.iat = decoded.iat

      accessToken.uid = decoded.uid
      accessToken.cid = decoded.cid
      accessToken.scope = decoded.scope

      accessToken.user = {
        uuid: decoded.uid,
        role: decoded.role
      }

      accessToken.client = {
        uuid: decoded.cid,
        id: decoded.cid,
        scopes: decoded.scope,
        grants: ['password', 'refresh_token', 'ad']
      }

      return accessToken
    } catch (e) {
      return false
    }
  }

  async generateAccessToken (
    client: Client, user: User, scope: string | string[]
  ): Promise<string> {
    const token = new AccessToken()

    if (typeof scope === 'string') scope = scope.split(' ')

    const now = Math.floor(Date.now() / 1000)

    token.iat = now
    token.exp = now + AccessToken.lifetime

    token.uid = user.uuid
    token.cid = client.uuid
    token.scope = scope

    token.user = user
    token.client = client

    return token.accessToken
    // return token as unknown as string
  }

  async getRefreshToken (token: string): Promise<RefreshToken | false> {
    try {
      const decoded = verifyToken<RefreshTokenPayload>(token)

      const refreshToken = await this.refreshTokenRepository.findOne({
        where: {
          uuid: decoded.tid
        },
        relations: {
          client: true,
          user: true
        }
      })

      if (refreshToken == null) return false

      return refreshToken
    } catch (e) {
      return false
    }
  }

  async generateRefreshToken (
    client: Client, user: User, scope: string | string[]
  ): Promise<string> {
    const token = new RefreshToken()

    if (typeof scope === 'string') scope = scope.split(' ')

    token.uuid = uuidv4()
    token.scope = scope ?? []
    token.client = client
    token.clientUuid = client.uuid
    token.user = user
    token.userUuid = user.uuid
    token.expiresAt = new Date(Date.now() + RefreshToken.lifetime * 1000)

    return token.refreshToken
  }

  async revokeToken (token: RefreshToken | AccessToken): Promise<boolean> {
    if (token instanceof RefreshToken) await this.refreshTokenRepository.remove(token)

    return true
  }

  async saveRefreshToken (token: string): Promise<void> {
    const decoded = verifyToken<RefreshTokenPayload>(token)

    const refreshToken = new RefreshToken()

    refreshToken.expiresAt = new Date(decoded.exp * 1000)
    refreshToken.uuid = decoded.tid
    refreshToken.clientUuid = decoded.cid
    refreshToken.userUuid = decoded.uid
    refreshToken.scope = decoded.scope

    await this.refreshTokenRepository.save(refreshToken)
  }
}
