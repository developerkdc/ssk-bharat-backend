import fs from "fs";
import multer from "multer";

export const MulterFunction = (dist) => {
    const storage = multer.diskStorage({
        destination: function (req, file, cb) {
            if(!fs.existsSync(dist)){
                fs.mkdirSync(dist, { recursive: true });
            }
            cb(null, dist)
        },
        filename: function (req, file, cb) {
            cb(null, `${Date.now()}-${file.originalname}`)
        }
    });
    const upload = multer({ storage: storage });
    return upload
}