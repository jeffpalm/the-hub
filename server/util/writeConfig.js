const fs = require('fs')
const path = require('path')
const ADMIN = 1, FINANCE_MGR = 2, EG = 3

module.exports = async (req, res, next) => {
  const db = req.app.get('db')
  const config = {}
  
  config.admins = await db.get_users_by_role(ADMIN)
  config.managers = await db.get_users_by_role(FINANCE_MGR)
  config.sales = await db.get_users_by_role(EG)
  config.roles = await db.user_role.find()
  config.types = await db.admin_ticket_type.find()
  config.statuses = await db.admin_ticket_status.find()
  config.attachmentTypes = await db.admin_attachment_type.find()

  fs.writeFileSync(path.join(__dirname, `./config.json`), JSON.stringify(config))

}
