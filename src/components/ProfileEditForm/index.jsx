'use client'

import { useState } from 'react'
import { toast } from 'react-toastify'
import { Label } from '../Label'
import { Input } from '../Input'
import { Button } from '../Button'
import { Spinner } from '../Spinner'

import styles from './profile-edit-form.module.css'

export const ProfileEditForm = ({ user }) => {
    const [name, setName] = useState(user.name || '')
    const [username, setUsername] = useState(user.username || '')
    const [isSaving, setIsSaving] = useState(false)

    async function handleSubmit(event) {
        event.preventDefault()

        if (!name.trim() && !username.trim()) {
            toast.error('Preencha pelo menos um campo')
            return
        }

        setIsSaving(true)

        try {
            const response = await fetch('/api/profile/data', {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ name, username })
            })

            const data = await response.json()

            if (response.ok) {
                toast.success('Perfil atualizado com sucesso!')
            } else {
                toast.error(data.error || 'Erro ao atualizar perfil')
            }
        } catch (error) {
            toast.error('Erro ao atualizar perfil')
            console.error(error)
        } finally {
            setIsSaving(false)
        }
    }

    return (
        <form onSubmit={handleSubmit} className={styles.form}>
            <div className={styles.field}>
                <Label htmlFor="name">Nome</Label>
                <Input
                    id="name"
                    name="name"
                    type="text"
                    placeholder="Seu nome"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    disabled={isSaving}
                />
            </div>
            <div className={styles.field}>
                <Label htmlFor="username">Username</Label>
                <Input
                    id="username"
                    name="username"
                    type="text"
                    placeholder="Seu username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    disabled={isSaving}
                />
            </div>
            <div className={styles.action}>
                <Button type="submit" disabled={isSaving}>
                    {isSaving ? <Spinner /> : 'Salvar'}
                </Button>
            </div>
        </form>
    )
}

