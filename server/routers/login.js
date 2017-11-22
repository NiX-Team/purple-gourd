import Router from 'koa-router'
import userController from '../controllers/user'

const router = new Router()

export default router
  .get('/', async ctx => {
    // console.log('wow')
    ctx.body = `
      <form id="formLogin" name="formLogin" method="post">
          <fieldset>
          <div>
            <label for="username">Username</label>
            <input name="username" type="text" id="username" tabindex="1" value="" size="32">
          </div>
          <div><label for="password">Password</label><input name="password" type="password" size="32">
          </div>
          <div><input name="submit" type="submit" value="Submit"></div>
      </fieldset>
      </form>`
  })
  .post('/', userController.login)
