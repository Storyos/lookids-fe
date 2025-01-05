import { PrismaClient as MongoPrismaClient } from '../../generated/mongo-client';
import { PrismaClient as MySQLPrismaClient } from '../../generated/mysql-client';

// 글로벌 타입 정의 (Next.js 환경 등에서 `global` 객체를 사용)
const globalForPrisma = global as unknown as {
  mysqlPrisma?: MySQLPrismaClient;
  mongoPrisma?: MongoPrismaClient;
};

// MySQL Prisma Client 싱글톤
const mysqlPrisma =
  globalForPrisma.mysqlPrisma ||
  new MySQLPrismaClient({
    log:
      process.env.NODE_ENV === 'development' ? ['query', 'info', 'warn'] : [], // 개발 환경에서 로깅 활성화
  });

// MongoDB Prisma Client 싱글톤
const mongoPrisma =
  globalForPrisma.mongoPrisma ||
  new MongoPrismaClient({
    log:
      process.env.NODE_ENV === 'development' ? ['query', 'info', 'warn'] : [], // 개발 환경에서 로깅 활성화
  });

// 개발 환경에서는 글로벌 객체에 Prisma Client 저장
if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.mysqlPrisma = mysqlPrisma;
  globalForPrisma.mongoPrisma = mongoPrisma;
}

// 각 Prisma Client 내보내기
export { mongoPrisma, mysqlPrisma };
