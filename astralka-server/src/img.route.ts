import sharp from "sharp";
import path from "node:path";
import { promises as fsp } from "node:fs";
import fs from "node:fs";
import _ from "lodash";

export async function imgRoute(req: any, res: any): Promise<void> {
    const images_dir: string = process.env.IMAGES_DIR!;
    const dest_image_dir: string = process.env.DEST_IMAGES_DIR!;

    const width = 640;
    const folders_list = await fsp.readdir(path.join(images_dir));
    const folders = folders_list.filter((folder: string) => {
        const folderPath = path.join(images_dir, folder);
        return fs.statSync(folderPath).isDirectory();
    });
    for (const folder of folders) {
        if (folder !== 'Jupiter') continue;
        const list = await fsp.readdir(path.join(images_dir, folder));
        const files = list.filter((file: string) => {
            if (file.indexOf('.png') === -1 || file.indexOf('-x') !== -1) {
                return false;
            }
            const filePath = path.join(images_dir, folder, file);
            return fs.statSync(filePath).isFile();
        });

        const resolution_folder = path.join(dest_image_dir, folder);
        try {
            fs.accessSync(resolution_folder, fs.constants.W_OK);
        } catch(err) {
            await fsp.mkdir(resolution_folder);
        }

        for (const original_filename of files) {
            const original_filepath = path.join(path.join(images_dir, folder),original_filename);

            const resolution_filename = _.replace(original_filename, '.png', `-x${width}.png`);
            const resolution_filepath = path.join(dest_image_dir, folder, resolution_filename);
            try {
                await sharp(original_filepath)
                    .resize(width)
                    .png()
                    .toFile(resolution_filepath);
            } catch (err) {
                console.log(err);
                res.status(500).end();
            }
        }
        res.status(200).end();
    }
}