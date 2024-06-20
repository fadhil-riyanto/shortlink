import { Response } from "express"

export class Helper {
    public static send_500(res: Response, msg: string) {
        res.status(500).send({
            message: msg
        })
    }
}