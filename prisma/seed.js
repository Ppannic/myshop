const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

async function main() {
  await prisma.product.createMany({
    data: [
      { name: 'รองเท้าผ้าใบ Nike', description: 'รองเท้าผ้าใบสไตล์ casual ใส่สบาย', price: 1290, image: '👟', stock: 50 },
      { name: 'กระเป๋าสะพาย Canvas', description: 'กระเป๋าผ้า canvas คุณภาพดี จุของได้เยอะ', price: 890, image: '👜', stock: 30 },
      { name: 'นาฬิกาข้อมือ Classic', description: 'นาฬิกาดีไซน์คลาสสิก กันน้ำ ใส่ได้ทุกวัน', price: 2490, image: '⌚', stock: 20 },
      { name: 'หูฟัง Bluetooth', description: 'หูฟังไร้สาย เสียงดี แบตอึด 20 ชั่วโมง', price: 1890, image: '🎧', stock: 40 },
      { name: 'เสื้อยืด Premium', description: 'เสื้อยืดผ้า cotton 100% นุ่ม ใส่สบาย', price: 490, image: '👕', stock: 100 },
      { name: 'แว่นกันแดด UV400', description: 'แว่นกันแดดป้องกัน UV400 ทรง trendy', price: 790, image: '🕶️', stock: 25 },
    ],
  })
  console.log('เพิ่มสินค้าสำเร็จ!')
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect())