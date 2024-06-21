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

        const browserTotalUsageCouts = async (browsername: string) => {
            return await this.prisma.linkstats.count({
                where: {
                    browser: browsername
                }
            })
        }

        const gen = await Promise.all(browserLists.map(async (val) => {
            return {
                browser: val.browser,
                total_user: await browserTotalUsageCouts(val.browser!)
            }
        }))

        // console.log(gen)
        return gen;
        
    }

    public async getMobilePrecentage() {
        const isMObile = await this.prisma.linkstats.findMany({
            distinct: ["is_mobile"],
            where: {
                token: this.token
            }
        })

        const mobileTotalUsageCouts = async (by: string) => {
            return await this.prisma.linkstats.count({
                where: {
                    is_mobile: by
                }
            })
        }

        const gen = await Promise.all(isMObile.map(async (val) => {
            return {
                is_mobile: val.is_mobile == "mobile" ? "mobile" : "non mobile",
                total_user: await mobileTotalUsageCouts(val.is_mobile!)
            }
        }))

        // console.log(gen)
        return gen;
        
    }

    public async getClickCount() {
        return await this.prisma.link.findUnique({
            where: {
                token: this.token
            }
        })
    }
}