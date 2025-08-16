require('dotenv').config({ path: require('path').resolve(__dirname, '../.env') });
const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  const usuario = 'superuser';
  const senha = process.env.SUPERUSER_PASSWORD;
  if (!senha) {
    throw new Error('SUPERUSER_PASSWORD não definida no .env');
  }
  const senhaHash = await bcrypt.hash(senha, 10);

  await prisma.admin.upsert({
    where: { usuario },
    update: {},
    create: {
      usuario,
      senhaHash,
      nome: 'Super Usuário',
    },
  });

  console.log('Superuser criado!');
  console.log('Usuário:', usuario);
  console.log('Senha:', senha);
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());