import { seedAdminUser } from '../lib/seed-admin'

async function runSeed() {
  console.log('Seeding admin user...')
  await seedAdminUser()
  console.log('Admin seeding completed!')
  process.exit(0)
}

runSeed().catch(error => {
  console.error('Seeding failed:', error)
  process.exit(1)
})
