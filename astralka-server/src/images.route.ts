import sharp from "sharp";
import path from "node:path";
import { promises as fsp } from "node:fs";
import fs from "node:fs";
import _ from "lodash";

export async function imagesRoute(req: any, res: any): Promise<void> {
    const images_dir: string = process.env.IMAGES_DIR!;

    let tarot_filename!: string;
    const folder = req.query.src.split('.')[0];
    if (folder === 'Tarot') {
        tarot_filename = req.query.src.split('.')[1];
    }
    const width = _.toNumber(req.query.width);

    const list = await fsp.readdir(path.join(images_dir, folder));
    let files = list.filter((file: string) => {
        if (file.indexOf('.png') === -1 || file.indexOf('-x') !== -1) {
            return false;
        }
        const filePath = path.join(path.join(images_dir, folder), file);
        return fs.statSync(filePath).isFile();
    });
    if (files.length === 0) {
        files = list.filter((file: string) => {
            if (file.indexOf('-x640.png') === -1) {
                return false;
            }
            const filePath = path.join(path.join(images_dir, folder), file);
            return fs.statSync(filePath).isFile();
        });
    }
    //console.log(files);
    if (files.length) {

        const original_filename = tarot_filename
            ? tarot_filename.toLowerCase()+".png"
            : files[_.random(files.length - 1)];

        const original_filepath = path.join(path.join(images_dir, folder), original_filename);

        const resolution_filename = _.replace(original_filename.replace('-x640', ''), '.png', `-x${width}.png`);
        const resolution_filepath = path.join(path.join(images_dir, folder), resolution_filename);

        try {
            fs.accessSync(resolution_filepath, fs.constants.R_OK);
            //console.log(`sending ${resolution_filename}`);
            res.sendFile(resolution_filepath);
        } catch(err) {
            console.log(`Cannot find resolution version. Making one`);
            try {
                await sharp(original_filepath)
                    .resize(width)
                    .png()
                    .toFile(resolution_filepath);
            } catch (err) {
                console.log(err);
                res.status(500).end();
            } finally {
                //console.log(`sending ${resolution_filename}`);
                res.sendFile(resolution_filepath);
            }
        }
    }

    return;
}