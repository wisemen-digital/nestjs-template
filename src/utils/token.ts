import crypto from 'crypto'
import jwt from 'jsonwebtoken'

class TokenHelper {
  private static _privateKey: string | Buffer
  private static _publicKey: string | Buffer

  static get privateKey (): string | Buffer {
    if (this._privateKey == null) {
      this._privateKey = crypto.createPrivateKey({
        key: Buffer.from(process.env.RSA_PRIVATE as string, 'base64'),
        passphrase: process.env.RSA_PASSPHRASE
      }).export({ type: 'pkcs1', format: 'pem' })
    }

    return this._privateKey
  }

  static get publicKey (): string | Buffer {
    if (this._publicKey == null) {
      this._publicKey = crypto.createPublicKey({
        key: Buffer.from(process.env.RSA_PUBLIC as string, 'base64')
      }).export({ type: 'pkcs1', format: 'pem' })
    }

    return this._publicKey
  }
}

// eslint-disable-next-line max-len
export function signToken<T extends string | Buffer | object = string | Buffer | object> (payload: T, options: jwt.SignOptions = {}): string {
  options.algorithm = 'RS256'
  options.expiresIn ??= Number(process.env.JWT_EXPIRES_IN) ?? 3600

  return jwt.sign(payload, TokenHelper.privateKey, options)
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function verifyToken <T = any> (token: string): T {
  return jwt.verify(token, TokenHelper.publicKey, {
    algorithms: ['RS256']
  }) as T
}

export class Token {
  exp?: number | undefined
  iat?: number | undefined
  jti?: string | undefined
}
