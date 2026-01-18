import { options } from '@/app/api/auth/[...nextauth]/options'
import { NewPostForm } from '@/components/NewPostForm'
import { getServerSession } from 'next-auth'
import { redirect } from 'next/navigation'

import styles from './new-post.module.css'

export const metadata = {
    title: 'Criar Post | Code Connect',
    description: 'Crie um novo post no Code Connect'
}

export default async function NewPost() {
    const session = await getServerSession(options)
    
    if (!session || !session.user) {
        redirect('/api/auth/signin?callbackUrl=/posts/new')
    }

    return (
        <section className={styles.container}>
            <header className={styles.header}>
                <h1 className={styles.heading}>Criar novo post</h1>
                <p className={styles.subheading}>
                    Compartilhe seu conhecimento com a comunidade
                </p>
            </header>

            <div className={styles.content}>
                <NewPostForm />
            </div>
        </section>
    )
}

