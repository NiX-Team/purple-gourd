import fs from 'fs'
import crypto from 'crypto'

export default {
  async handleUploadFile(ctx) {
    const hash = crypto.createHash('sha512'),
      file = ctx.req.file
    hash.update(file.buffer)

    try {
      await new Promise((resolve, reject) => {
        fs.writeFile(
          `${process.cwd()}/uploads/${file.fieldname}-${hash.digest('hex')}`,
          file.buffer,
          e => (e ? reject(e) : resolve()),
        )
      })
    } catch (e) {
      ctx.throw(507, 'Storage fail')
    }

    ctx.body = 'Storage complete'
  },
}
