import { PrismaClient } from '@prisma/client'

export class calculateStats {
    private prisma: PrismaClient;
    private token!: string;

    public constructor(prisma: PrismaClient) {
        this.prisma = prisma;
    }

    public setTokenData(token: string) {
        this.token = token;
        return this;
    }

    public async getBrowserStats() {
        const browserLists = await this.prisma.linkstats.findMany({
            distinct: ["browser"],
            where: {
                token: this.token
            }
        })

        const browserTotalUsageCouts = await this.prisma.linkstats.count({
            where: {
                browser: "windows"
            }
          })
        // console.log("running")
        console.log(browserTotalUsageCouts)
    }
}