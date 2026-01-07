import { db } from './server/utils/db'
import { users } from './server/database/schema'
import bcrypt from 'bcryptjs'

async function seedUsers() {
    try {
        console.log('Seeding users...')
        const hashedPassword = await bcrypt.hash('password123', 10)

        const newUsers = [
            {
                email: 'student1@example.com',
                password: hashedPassword,
                name: 'Juan Pérez',
                role: 'student',
                active: true,
                status: 'active'
            },
            {
                email: 'student2@example.com',
                password: hashedPassword,
                name: 'María García',
                role: 'student',
                active: true,
                status: 'active'
            },
            {
                email: 'student3@example.com',
                password: hashedPassword,
                name: 'Carlos López',
                role: 'student',
                active: false,
                status: 'pending'
            },
            {
                email: 'admin@edmi.com',
                password: hashedPassword,
                name: 'Super Admin',
                role: 'superadmin',
                active: true,
                status: 'active'
            }
        ]

        for (const user of newUsers) {
            await db.insert(users).values(user).run()
        }

        console.log('Users seeded successfully!')
    } catch (e) {
        console.error('Error seeding users:', e)
    }
}

seedUsers()
