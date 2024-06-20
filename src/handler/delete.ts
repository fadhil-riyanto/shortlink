import { PrismaClient } from '@prisma/client'
import { ILink } from '../interface/ILink';

export class deleteUrl {
    private prisma!: PrismaClient;
    public constructor(prisma: PrismaClient) {
        this.prisma = prisma;
    }

    public async delete(token: string): Promise<ILink> {
        return await this.prisma.link.delete({
            where: {
                token: token
            }
        })
    }
}