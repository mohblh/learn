const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seed...');

  console.log('🧹 Clearing existing data...');
  await prisma.activityLog.deleteMany();
  await prisma.transactionItem.deleteMany();
  await prisma.transaction.deleteMany();
  await prisma.inventory.deleteMany();
  await prisma.product.deleteMany();
  await prisma.category.deleteMany();
  await prisma.customer.deleteMany();
  await prisma.supplier.deleteMany();
  await prisma.user.deleteMany();
  await prisma.branch.deleteMany();
  await prisma.store.deleteMany();
  console.log('✅ Cleared existing data');

  const demoStore = await prisma.store.create({
    data: {
      name: 'Demo Retail Store',
      slug: 'demo-retail',
      email: 'admin@demoretail.com',
      phone: '+1234567890',
      subscriptionPlan: 'PROFESSIONAL',
      subscriptionStatus: 'ACTIVE',
      maxBranches: 5,
      maxProducts: 10000,
      currency: 'USD',
      taxRate: 0.1
    }
  });
  console.log('✅ Created demo store');

  const branch1 = await prisma.branch.create({
    data: {
      name: 'Main Branch - Downtown',
      code: 'MAIN-001',
      address: '123 Main Street',
      city: 'New York',
      state: 'NY',
      zipCode: '10001',
      country: 'USA',
      phone: '+1234567890',
      email: 'downtown@demoretail.com',
      storeId: demoStore.id
    }
  });

  const branch2 = await prisma.branch.create({
    data: {
      name: 'Westside Branch',
      code: 'WEST-002',
      address: '456 West Avenue',
      city: 'New York',
      state: 'NY',
      zipCode: '10002',
      country: 'USA',
      phone: '+1234567891',
      email: 'westside@demoretail.com',
      storeId: demoStore.id
    }
  });
  console.log('✅ Created branches');

  const hashedPassword = await bcrypt.hash('password123', 12);

  await prisma.user.create({
    data: {
      email: 'admin@system.com',
      password: hashedPassword,
      firstName: 'Super',
      lastName: 'Admin',
      role: 'SUPER_ADMIN'
    }
  });

  await prisma.user.create({
    data: {
      email: 'owner@demoretail.com',
      password: hashedPassword,
      firstName: 'John',
      lastName: 'Owner',
      phone: '+1234567890',
      role: 'STORE_OWNER',
      storeId: demoStore.id
    }
  });

  await prisma.user.create({
    data: {
      email: 'manager@demoretail.com',
      password: hashedPassword,
      firstName: 'Sarah',
      lastName: 'Manager',
      phone: '+1234567891',
      role: 'BRANCH_MANAGER',
      storeId: demoStore.id,
      branchId: branch1.id
    }
  });

  await prisma.user.create({
    data: {
      email: 'cashier@demoretail.com',
      password: hashedPassword,
      firstName: 'Mike',
      lastName: 'Cashier',
      phone: '+1234567892',
      role: 'CASHIER',
      storeId: demoStore.id,
      branchId: branch1.id
    }
  });
  console.log('✅ Created users');

  const electronics = await prisma.category.create({
    data: {
      name: 'Electronics',
      description: 'Electronic devices and accessories',
      storeId: demoStore.id
    }
  });

  const clothing = await prisma.category.create({
    data: {
      name: 'Clothing',
      description: 'Apparel and fashion items',
      storeId: demoStore.id
    }
  });

  const food = await prisma.category.create({
    data: {
      name: 'Food & Beverages',
      description: 'Food items and drinks',
      storeId: demoStore.id
    }
  });
  console.log('✅ Created categories');

  await prisma.product.createMany({
    data: [
      {
        name: 'Wireless Mouse',
        sku: 'ELEC-001',
        barcode: '1234567890123',
        costPrice: 15.00,
        sellingPrice: 29.99,
        unit: 'piece',
        categoryId: electronics.id,
        storeId: demoStore.id
      },
      {
        name: 'USB Cable',
        sku: 'ELEC-002',
        barcode: '1234567890124',
        costPrice: 3.00,
        sellingPrice: 9.99,
        unit: 'piece',
        categoryId: electronics.id,
        storeId: demoStore.id
      },
      {
        name: 'Cotton T-Shirt',
        sku: 'CLOTH-001',
        barcode: '1234567890125',
        costPrice: 8.00,
        sellingPrice: 24.99,
        unit: 'piece',
        categoryId: clothing.id,
        storeId: demoStore.id
      },
      {
        name: 'Coffee Beans 500g',
        sku: 'FOOD-001',
        barcode: '1234567890126',
        costPrice: 6.00,
        sellingPrice: 14.99,
        unit: 'pack',
        categoryId: food.id,
        storeId: demoStore.id
      },
      {
        name: 'Mineral Water 1.5L',
        sku: 'FOOD-002',
        barcode: '1234567890127',
        costPrice: 0.50,
        sellingPrice: 1.99,
        unit: 'bottle',
        categoryId: food.id,
        storeId: demoStore.id
      }
    ]
  });
  console.log('✅ Created products');

  const allProducts = await prisma.product.findMany({
    where: { storeId: demoStore.id }
  });

  const inventoryData = [];
  allProducts.forEach(product => {
    inventoryData.push({
      productId: product.id,
      branchId: branch1.id,
      quantity: Math.floor(Math.random() * 100) + 50,
      minStockLevel: 10
    });
    inventoryData.push({
      productId: product.id,
      branchId: branch2.id,
      quantity: Math.floor(Math.random() * 100) + 50,
      minStockLevel: 10
    });
  });

  await prisma.inventory.createMany({
    data: inventoryData
  });
  console.log('✅ Created inventory');

  await prisma.customer.createMany({
    data: [
      {
        name: 'John Doe',
        email: 'john@example.com',
        phone: '+1234567893',
        storeId: demoStore.id,
        loyaltyPoints: 150
      },
      {
        name: 'Jane Smith',
        phone: '+1234567894',
        storeId: demoStore.id,
        loyaltyPoints: 200
      }
    ]
  });
  console.log('✅ Created customers');

  console.log('\n🎉 Seed completed successfully!\n');
  console.log('📝 Demo Login Credentials:');
  console.log('----------------------------');
  console.log('Super Admin:');
  console.log('  Email: admin@system.com');
  console.log('  Password: password123\n');
  console.log('Store Owner:');
  console.log('  Email: owner@demoretail.com');
  console.log('  Password: password123\n');
  console.log('Branch Manager:');
  console.log('  Email: manager@demoretail.com');
  console.log('  Password: password123\n');
  console.log('Cashier:');
  console.log('  Email: cashier@demoretail.com');
  console.log('  Password: password123');
  console.log('----------------------------\n');
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });