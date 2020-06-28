const { v4: uuidv4 } = require('uuid')
const fs = require('fs')

for (let i = 1; i <= 1; i++) {
    fs.appendFileSync(`../../db/dev_seed_data.sql/`, `${uuidv4()}\n`)
}