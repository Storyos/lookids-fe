import bcrypt from 'bcrypt';
import { NextResponse } from 'next/server';
import { mysqlPrisma } from '../../../lib/prisma';

// 이건 Create User API
export async function POST(request: Request) {
  console.log('Request', request);
  try {
    const body = await request.json();
    const { name, email, password } = body;

    if (!name || !email || !password) {
      NextResponse.json(
        { error: 'Name and email are required' },
        { status: 400 }
      );
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await mysqlPrisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
      },
    });

    return NextResponse.json(newUser, { status: 201 });
  } catch (error) {
    console.error('Error Createing User', error);
    return NextResponse.json({ error: 'Error creating user' }, { status: 500 });
  }
}
