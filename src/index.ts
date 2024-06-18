import express from "express";
import { Request, Response } from "express"
import path from "path"
import { PrismaClient } from '@prisma/client'
import { Exception } from './exceptions/Index'

import { shortRequestValidate, Short } from './handler/short'

const app = express();
const port = 8000;

const prisma = new PrismaClient()

app.set("view engine", "ejs")
app.set("views", path.join(__dirname, '../template/page'))

app.get("/", function(req: Request, res: Response) {
    res.render('index');
})

app.get("/api/short", function(req: Request, res: Response) {
    let validation: shortRequestValidate = new shortRequestValidate(req);
    
    if (validation.isValid()) {
        let shorthandler: Short = new Short(prisma);

        try {
            shorthandler.setLink(validation.getValidatedLinks())
                .generateLinks()
                .then((data) => {
                    res.json(data)
                })
        } catch (e) {
            if (e instanceof Exception.DuplicationWarn) {
                res.send("duplicate")
            }
        }
        
    } else {
        res.send("invalid")
    }
})

app.listen(port, function() {
    console.log("server run on " + port)
})