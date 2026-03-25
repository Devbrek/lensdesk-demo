// scripts/hash.ts
import bcrypt from "bcrypt"

async function main() {
  const password = "Abz1!"
  const hash = await bcrypt.hash(password, 12)
  console.log(hash)
}

main()