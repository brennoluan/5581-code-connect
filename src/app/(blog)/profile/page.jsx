import { options } from "@/app/api/auth/[...nextauth]/options"
import { ProfileImageUploader } from "@/components/ProfileImageUploader"
import { ProfileEditForm } from "@/components/ProfileEditForm"
import { getServerSession } from "next-auth"
import db from "../../../../prisma/db"
import { redirect } from "next/navigation"

import styles from './profile.module.css'

export default async function Profile() {

    const session = await getServerSession(options)
    if (!session || !session.user) {
        redirect('/api/auth/signin?callbackUrl=/profile')
    }
    const user = await db.user.findUnique({
        where: {
            email: session.user.email
        }
    })

    return (
        <section className={styles.container}>
            <h1 className={styles.heading}>
                Profile
            </h1>

            <div className={styles.content}>
                <div className={styles.section}>
                    <h2 className={styles.sectionTitle}>Avatar</h2>
                    <ProfileImageUploader user={user} />
                </div>

                <div className={styles.divider} />

                <div className={styles.section}>
                    <h2 className={styles.sectionTitle}>Dados do Perfil</h2>
                    <ProfileEditForm user={user} />
                </div>
            </div>
        </section>
    )
}
