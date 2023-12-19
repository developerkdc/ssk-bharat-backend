import fs from "fs";
import multer from "multer";

export const MulterFunction = (dist) => {

    if(!fs.existsSync(dist)){
        fs.mkdirSync(dist, { recursive: true });
    }

    const storage = multer.diskStorage({
        destination: function (req, file, cb) {
            cb(null, dist)
        },
        filename: function (req, file, cb) {
            cb(null, `${Date.now()}-${file.originalname}`)
        }
    });
    const upload = multer({ storage: storage });
    return upload
}