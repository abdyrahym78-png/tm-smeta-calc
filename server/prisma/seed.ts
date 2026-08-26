import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Запуск сидинга базы данных tm-smeta-calc...');

  // 1. Нормативные базы
  const gesn = await prisma.normativeBase.upsert({
    where: { code: 'GESN-2026' },
    update: {},
    create: {
      code: 'GESN-2026',
      name: 'Государственные элементные сметные нормы (ГЭСН)',
      description: 'Базовые сметные нормы для строительных работ'
    }
  });

  const eurocodes = await prisma.normativeBase.upsert({
    where: { code: 'EUROCODE-06' },
    update: {},
    create: {
      code: 'EUROCODE-06',
      name: 'Eurocode 6: Design of masonry structures',
      description: 'Европейские стандарты проектирования каменных конструкций'
    }
  });

  // 2. Расценки на строительные работы (TMT)
  const rateConcrete = await prisma.rate.upsert({
    where: { code: 'R-CONCRETE-01' },
    update: {},
    create: {
      code: 'R-CONCRETE-01',
      name: 'Устройство монолитного бетонного фундамента B25',
      basePrice: 450.00,
      currency: 'TMT',
      countryCode: 'TM',
      regionId: 'TM-AS',
      normativeBaseId: gesn.id
    }
  });

  const rateMasonry = await prisma.rate.upsert({
    where: { code: 'R-WALL-BRICK' },
    update: {},
    create: {
      code: 'R-WALL-BRICK',
      name: 'Кладка наружных стен из кирпича (за м3)',
      basePrice: 280.00,
      currency: 'TMT',
      countryCode: 'TM',
      regionId: 'TM-AS',
      normativeBaseId: eurocodes.id
    }
  });

  // 3. Сопоставление с BIM (UniClass 2015 & IFC)
  await prisma.classificationMapping.createMany({
    data: [
      { bimSystem: 'UniClass2015', bimCode: 'Pr_20_31_15', rateId: rateConcrete.id },
      { bimSystem: 'IFC', bimCode: 'IfcFooting', rateId: rateConcrete.id },
      { bimSystem: 'UniClass2015', bimCode: 'Pr_20_93_52', rateId: rateMasonry.id },
      { bimSystem: 'IFC', bimCode: 'IfcWallStandardCase', rateId: rateMasonry.id }
    ],
    skipDuplicates: true
  });

  // 4. Демо-проект и первая смета
  const sampleProject = await prisma.project.create({
    data: {
      name: 'Строительство ТЦ в Ашхабаде',
      client: 'Частный инвестор',
      regionId: 'TM-AS',
      estimates: {
        create: {
          title: 'Смета нулевого цикла (Фундамент и стены)',
          totalAmount: 7300.00,
          currency: 'TMT',
          items: {
            create: [
              {
                rateId: rateConcrete.id,
                quantity: 10,
                unitPrice: 450.00,
                locationCoeff: 1.0,
                overheadCoeff: 1.1,
                taxRate: 0.15,
                totalPrice: 5692.50
              },
              {
                rateId: rateMasonry.id,
                quantity: 5,
                unitPrice: 280.00,
                locationCoeff: 1.0,
                overheadCoeff: 1.05,
                taxRate: 0.15,
                totalPrice: 1607.50
              }
            ]
          }
        }
      }
    }
  });

  console.log('✅ База успешно заполнена!');
  console.log(`Проект создан: ${sampleProject.name} (ID: ${sampleProject.id})`);
}

main()
  .catch((e) => {
    console.error('❌ Ошибка сидинга:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
