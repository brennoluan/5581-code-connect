'use client'

import Image from "next/image"
import { Button } from "../Button"
import { useState } from "react"
import { toast } from 'react-toastify'
import { Spinner } from "../Spinner"

import avatarDefault from './empty-avatar.png'
import styles from './profile-uploader.module.css'

export const ProfileImageUploader = ({ user }) => {

    const [imgSrc, setImgSrc] = useState(user.avatar ?? user.image ?? avatarDefault)
    const [newAvatar, setNewAvatar] = useState(null)
    const [isUploading, setIsUploading] = useState(false)

    function handleFileChange(event) {
        const file = event.target.files[0]
        if (file) {
            setNewAvatar(file)
            const reader = new FileReader()
            reader.onloadend = () => {
                setImgSrc(reader.result)
            }
            reader.readAsDataURL(file)
        }
    }

    async function uploadAvatar(event) {
        event.preventDefault()
        
        if (!newAvatar) {
            toast.error('Selecione uma imagem primeiro')
            return
        }

        setIsUploading(true)
        
        try {
            const response = await fetch('/api/profile', {
                method: 'POST',
                body: newAvatar
            })

            if (response.ok) {
                toast.success('Avatar atualizado com sucesso!')
                setNewAvatar(null)
            } else {
                toast.error('Erro ao atualizar avatar')
            }
        } catch (error) {
            toast.error('Erro ao atualizar avatar')
            console.error(error)
        } finally {
            setIsUploading(false)
        }
    }

    if (!user) {
        return null
    }

    return (
        <div className={styles.container}>
            <div className={styles.avatarWrapper}>
                <Image
                    src={imgSrc}
                    width={254}
                    height={254}
                    alt={`Avatar do ${user.name}`}
                    className={styles.avatar}
                />
                {isUploading && (
                    <div className={styles.overlay}>
                        <Spinner />
                    </div>
                )}
            </div>
            <form onSubmit={uploadAvatar} className={styles.form}>
                <input
                    type="file"
                    onChange={handleFileChange}
                    accept="image/*"
                    disabled={isUploading}
                    className={styles.fileInput}
                />
                <Button disabled={isUploading || !newAvatar}>
                    {isUploading ? <Spinner /> : 'Upload'}
                </Button>
            </form>
        </div>
    )
}
