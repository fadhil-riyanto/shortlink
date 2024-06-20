import express from "express";
import { Request, Response } from "express"
import path from "path"
import { PrismaClient, Prisma } from '@prisma/client'
import { Exception } from './exceptions/Index'

import { shortRequestValidate, Short } from './handler/short'
import { DataCollector } from './handler/collector'
import { deleteUrl } from "./handler/delete";
import { calculateStats } from './handler/statsCalc'
import { Helper } from './helper'

const app = express();
const port = 8000;

const prisma = new PrismaClient()

app.set("view engine", "ejs")
app.set("views", path.join(__dirname, '../template/page'))

app.get("/", function(req: Request, res: Response) {
    res.render('index');
})

app.get("/api/stats", function(req: Request, res: Response) {
    let stats: calculateStats = new calculateStats(prisma);
    stats.setTokenData(req.query.token!.toString()).getBrowserStats()
})

app.get("/:conversion", function(req: Request, res: Response) {

    let collector: DataCollector = new DataCollector(prisma);
    collector.setConversion(req.params.conversion)
        .then((next) => next.incrementClick())
        .then((next) => next.collectData(req))
        .then((next) => next.getRedirectionData())
        .then((str2redirect) => res.redirect(str2redirect))
        .catch((e) => {
            if (e instanceof Exception.RouteNotFound) {
                res.render("_404")
            }
        })
})

app.get("/api/delete", function(req: Request, res: Response) {
    let deleter: deleteUrl = new deleteUrl(prisma);
    deleter.delete(req.query.token!.toString())
        .then(() => res.send("deleted"))
        .catch((e) => {
            if (e instanceof Prisma.PrismaClientValidationError) {
                Helper.send_500(res, "Request invalid")
            } else if (e instanceof Prisma.PrismaClientKnownRequestError) {
                Helper.send_500(res, "Token not found")
            }
        })

})



app.get("/api/short", function(req: Request, res: Response) {
    let validation: shortRequestValidate = new shortRequestValidate(req);
    
    if (validation.isValid()) {
        let shorthandler: Short = new Short(prisma);

            shorthandler.setLink(validation.getValidatedLinks())
                .generateLinks()
                .then((data) => {
                    res.json(data)
                })
                .catch ((e) => {
                    if (e instanceof Exception.DuplicationWarn) {
                        Helper.send_500(res, "Duplication error")
                    }
                })
        
    } else {
        Helper.send_500(res, "Link invalid")
    }
})

app.listen(port, function() {
    console.log("server run on " + port)
})