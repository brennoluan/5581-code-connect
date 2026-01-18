import { getServerSession } from 'next-auth';
import { NextResponse } from 'next/server';
import { options } from '../../auth/[...nextauth]/options';
import db from '../../../../../prisma/db';

export async function PATCH(request) {
    const session = await getServerSession(options);

    if (!session || !session.user) {
        return NextResponse.json(
            { error: 'Não autorizado' },
            { status: 401 }
        );
    }

    try {
        const body = await request.json();
        const { name, username } = body;

        // Verifica se o username já está em uso por outro usuário
        if (username) {
            const existingUser = await db.user.findUnique({
                where: { username }
            });

            if (existingUser && existingUser.email !== session.user.email) {
                return NextResponse.json(
                    { error: 'Username já está em uso' },
                    { status: 400 }
                );
            }
        }

        const updatedUser = await db.user.update({
            where: {
                email: session.user.email
            },
            data: {
                ...(name && { name }),
                ...(username && { username })
            }
        });

        return NextResponse.json({
            name: updatedUser.name,
            username: updatedUser.username
        });
    } catch (error) {
        console.error('Erro ao atualizar perfil:', error);
        return NextResponse.json(
            { error: 'Erro ao atualizar perfil' },
            { status: 500 }
        );
    }
}

