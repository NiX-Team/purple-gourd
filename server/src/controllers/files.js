import { Context } from 'koa' // eslint-disable-line no-unused-vars

import File from '~/models/fileModel'

/**
 * File Controller
 * @class Files
 */
class Files {
  /**
   * Get a file to local machine.
   * @param {Context} ctx
   * @memberof Files
   */
  async getFile(ctx) {
    const id = ctx.params.id
    const result = await File.findById(id)
    if (result === null || !(result || { owner: '' }).owner.equals(ctx.session.uid)) ctx.throw(404, 'File not found')
    ctx.set('Content-Disposition', `inline;filename=${encodeURI(result.originalname)}`)
    ctx.set('Content-Type', result.mimetype)
    ctx.body = result.buffer
  }
}

export default new Files()
