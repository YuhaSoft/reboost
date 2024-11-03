// src/services/BaseService.ts
import { Prisma, PrismaClient } from '@prisma/client';

export abstract class BaseService<I> {
  protected prisma: PrismaClient;
  protected model: any;

  constructor(model: any) {
    this.prisma = new PrismaClient();
    this.model = model;
  }

  public async create(data: I): Promise<any> {
    return await (this.model as any).create({ data });
  }

  public async findOne(id: number): Promise<I | null> {
    return await (this.model as any).findUnique({ where: { id } });
  }

  public async findOneByUUID(uuid: string): Promise<I | null> {
    return await (this.model as any).findUnique({ where: { uuid } });
  }

  public async getAll(filters?: any, orderBy?: any, page: number = 1, pageSize: number = 10): Promise<{ totalCount: number; results: I[] }> {
    const skip = (page - 1) * pageSize;

    const [totalCount, results] = await Promise.all([
        (this.model as any).count({ where: filters }),
        (this.model as any).findMany({
          where: filters,
          orderBy: orderBy,
          skip: skip,
          take: pageSize,
        })
    ]);

    return { totalCount, results };
}

  public async update(id: number, data: I): Promise<I> {
    return await (this.model as any).update({
      where: { id },
      data
    });
  }

  public async delete(id: number): Promise<void> {
    await (this.model as any).update({ where: { id } ,
    data:{deletedAt:new Date(),
    isActive:false}
    });
  }

  public async deactivate(id: number): Promise<I> {
    return await (this.model as any).update({
      where: { id },
      data: { isActive: false }
    });
  }

  public async activate(id: number): Promise<I> {
    return await (this.model as any).update({
      where: { id },
      data: { isActive: true }
    });
  }
}
