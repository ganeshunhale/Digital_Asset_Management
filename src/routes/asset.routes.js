import { Router } from "express"
import { upload } from '../middleware/multer.middleware.js'
import { uploadAsset } from "../controllers/asset.controller.js";
const router = Router();

router.route("/upload").post(
    upload.single("file"),
    uploadAsset
)

export default router;