import Router from 'koa-router'
import multer from 'koa-multer'
import uploadController from '~/controllers/upload'

const router = new Router(),
  upload = new multer({
    storage: new multer.memoryStorage(),
  })

export default router.post(
  '/',
  upload.single('file'),
  uploadController.handleUploadFile,
)
