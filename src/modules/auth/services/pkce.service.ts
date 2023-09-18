import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { Pkce } from '../entities/pkce.entity.js'

@Injectable()
export class PkceService {
  constructor (
    @InjectRepository(Pkce)
    private readonly pkceRepository: Repository<Pkce>
  ) {}

  async find (uuid: string): Promise<Pkce> {
    const pkce = await this.pkceRepository.findOneByOrFail({ uuid })

    return pkce
  }

  async create (body: Pkce): Promise<Pkce> {
    const pkce = this.pkceRepository.create(body)

    await this.pkceRepository.save(pkce)

    return pkce
  }
}
