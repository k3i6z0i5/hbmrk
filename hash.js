const bcrypt = require('bcryptjs');
const password = process.argv[2];

if (!password) {
  console.log("Error: Please provide a password.");
  console.log("Usage: node hash.js YOUR_NEW_PASSWORD");
  process.exit(1);
}

const hash = bcrypt.hashSync(password, 12);
console.log("\nCopy and paste this hash into your .env file as ADMIN_PASSWORD_HASH:\n");
console.log(hash);
console.log();
