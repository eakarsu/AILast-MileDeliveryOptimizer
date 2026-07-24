require('dotenv').config({ path: require('path').join(__dirname, '..', '..', '.env') });
const bcrypt = require('bcryptjs');
const { sequelize, User } = require('../models');

async function main() {
  await sequelize.sync();
  const email=(process.env.ADMIN_EMAIL||'runtime-admin@example.com').trim().toLowerCase();
  const password=await bcrypt.hash(process.env.ADMIN_PASSWORD||'RuntimeAcceptance123!',12);
  await User.upsert({ email, password, name:'Runtime Administrator', role:'admin' });
}
main().then(()=>sequelize.close()).catch(async e=>{console.error(`Runtime initialization failed: ${e.message}`);await sequelize.close().catch(()=>{});process.exit(1)});
