import { PrismaClient } from '@prisma/client'
import { ILink } from '../interface/ILink'
import { Exception } from '../exceptions/Index';
import { UAParser } from 'ua-parser-js';
import { Request } from "express"

export class DataCollector {
    private conversion!: string;
    private prisma!: PrismaClient;
    private currentData!: ILink;
    public constructor(prisma: PrismaClient) {
        this.prisma = prisma;
    }

    private async findCorrespondingData() : Promise<ILink | null> {
        return await this.prisma.link.findUnique({
            where: {
                conversion: this.conversion
            }
        })
    }

    public async setConversion(conversion: string) : Promise<this> {
        this.conversion = conversion;
        let data: ILink | null = await this.findCorrespondingData()
        if (data == null) {
            throw new Exception.RouteNotFound("link invalid", "you may entered wrong link")
        } else {
            this.currentData = data;
        }

        return this;
    }

    public async incrementClick() : Promise<this>{
        await this.prisma.link.update({
            where: {
                id: this.currentData.id
            },
            data: {
                clickcount: this.currentData.clickcount + 1
            }
        })
        return this;
    }

    public async getRedirectionData() : Promise<string> {
        return this.currentData.link
    }

    public async collectData(req: Request) {
        const parser = new UAParser(req.get('user-agent'));
        let result: UAParser.IResult = parser.getResult();
        await this.prisma.linkstats.create({
            data: {
                conversion: this.currentData.conversion,
                token: this.currentData.token,
                browser: result.browser.name,
                is_mobile: result.device.type
                
            }
        })
        
        return this
    }
}