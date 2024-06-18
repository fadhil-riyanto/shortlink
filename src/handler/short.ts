import { PrismaClient } from '@prisma/client'
import { Request } from "express"
import { v4 as uuid4 } from 'uuid'
import crypto from "crypto"
import { Exception } from '../exceptions/Index'

interface RandomGenerationData {
    conversion: string;
    token: string;
}

export class Short {
    protected link!: string;
    protected prisma!: PrismaClient

    public constructor(prisma: PrismaClient) {
        this.prisma = prisma;
    }

    private generateRandomTokenAndConvertion(): RandomGenerationData {
        return {
            conversion: crypto.randomBytes(4).toString("hex"),
            token: uuid4()
        }
    }

    private async isDataAlreadyAdded(data: RandomGenerationData): Promise<boolean> {
        return await this.prisma.link.findUnique({
            where: {
                conversion: data.conversion,
                token: data.token
            }
        }) != null ? true : false;
    }

    public setLink(link: string) {
        this.link = link;
        return this;
    }

    public async generateLinks() : Promise<RandomGenerationData> {
        let prototypeDataTemp: RandomGenerationData = this.generateRandomTokenAndConvertion();
        if (await this.isDataAlreadyAdded(prototypeDataTemp) == false) {
            await this.prisma.link.create({
                data: {
                    link: this.link,
                    conversion: prototypeDataTemp.conversion,
                    token: prototypeDataTemp.token
                }
            })
            return prototypeDataTemp;
            // console.log(a)
        } else {
            throw new Exception.DuplicationWarn("Link already", "link already added")
        }
        
    }
}

export class shortRequestValidate {
    private req!: Request;
    private url!: string;
    public constructor(req: Request) {
        this.req = req;
    }

    public isValid(): boolean {
        // console.log( == undefined)
        if (this.req.query.url != undefined && this.req.query.url != "") {
            this.url = this.req.query.url.toString();
            try {
                new URL(this.url)
                return true;
            } catch {
                return false;
            }
            
        }
        
        return false;
    }

    public getValidatedLinks() :string {
        return this.url;
    }
}