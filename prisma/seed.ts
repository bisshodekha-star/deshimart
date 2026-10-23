/**
 * লোকাল ডেভেলপমেন্টের জন্য সিড স্ক্রিপ্ট।
 * চালানোর নিয়ম: DATABASE_URL=<আপনার postgres url> bunx tsx prisma/seed.ts
 *
 * ⚠️ Vercel-এ এটি লাগে না — সেখানে অ্যাডমিন প্যানেলে লগইন করে
 * "ডেমো পণ্য লোড করুন" বাটনে ক্লিক করলেই একই ডেটা যোগ হয়।
 */
import { PrismaClient } from '@prisma/client'
import { DEMO_CATEGORIES, DEMO_PRODUCTS, DEMO_NOTIFICATIONS } from '../src/lib/demo-data'

const db = new PrismaClient()

async function main() {
  console.log('Seeding database...')

  // clear existing
  await db.notification.deleteMany()
  await db.orderItem.deleteMany()
  await db.order.deleteMany()
  await db.product.deleteMany()
  await db.category.deleteMany()

  const catMap = new Map<string, string>()
  for (const c of DEMO_CATEGORIES) {
    const created = await db.category.create({
      data: { name: c.name, nameEn: c.nameEn, icon: c.icon },
    })
    catMap.set(c.key, created.id)
  }

  for (const p of DEMO_PRODUCTS) {
    await db.product.create({
      data: {
        name: p.name,
        description: p.description,
        price: p.price,
        oldPrice: p.oldPrice ?? null,
        image: p.image,
        categoryId: catMap.get(p.categoryKey)!,
        stock: p.stock ?? 50,
        rating: p.rating ?? 4.5,
        reviews: p.reviews ?? 0,
        featured: p.featured ?? false,
      },
    })
  }

  await db.notification.createMany({ data: DEMO_NOTIFICATIONS })

  const cats = await db.category.findMany({ include: { _count: { select: { products: true } } } })
  for (const c of cats) console.log(`${c.name}: ${c._count.products} products`)
  console.log('Seed complete!')
}

main()
  .catch((e) => { console.error(e); process.exit(1) })
  .finally(() => db.$disconnect())
