import { Router } from "express"
import { upload } from '../middleware/multer.middleware.js'
import { getAssets, uploadAsset } from "../controllers/asset.controller.js";
const router = Router();

router.route("/upload").post(
    upload.single("file"),
    uploadAsset
)
router.route("/get_assets").get(
    getAssets
)

export default router;