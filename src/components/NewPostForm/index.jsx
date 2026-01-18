'use client'

import { useState, useMemo } from 'react'
import { useRouter } from 'next/navigation'
import { toast } from 'react-toastify'
import dynamic from 'next/dynamic'
import { Input } from '../Input'
import { Button } from '../Button'
import { CoverUploader } from '../CoverUploader'
import { Spinner } from '../Spinner'
import styles from './new-post-form.module.css'

// Carregar o PostEditor apenas no cliente
const PostEditor = dynamic(
    () => import('../PostEditor'),
    { 
        ssr: false,
        loading: () => (
            <div className={styles.editorLoading}>
                <Spinner />
                <span>Carregando editor...</span>
            </div>
        )
    }
)

function generateSlug(title) {
    return title
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '')
}

export const NewPostForm = () => {
    const router = useRouter()
    const [title, setTitle] = useState('')
    const [coverFile, setCoverFile] = useState(null)
    const [body, setBody] = useState('')
    const [code, setCode] = useState('')
    const [isSubmitting, setIsSubmitting] = useState(false)

    const slugPreview = useMemo(() => generateSlug(title), [title])

    async function handleSubmit(event) {
        event.preventDefault()

        if (!title.trim()) {
            toast.error('Digite o título do post')
            return
        }

        if (!coverFile) {
            toast.error('Selecione uma imagem de capa')
            return
        }

        if (!body.trim()) {
            toast.error('Escreva o conteúdo do post')
            return
        }

        setIsSubmitting(true)

        try {
            const formData = new FormData()
            formData.append('title', title.trim())
            formData.append('cover', coverFile)
            formData.append('body', body)
            if (code.trim()) {
                formData.append('markdown', code.trim())
            }

            const response = await fetch('/api/posts', {
                method: 'POST',
                body: formData
            })

            const data = await response.json()

            if (response.ok) {
                toast.success('Post criado com sucesso!')
                router.push(`/posts/${data.slug}`)
            } else {
                toast.error(data.error || 'Erro ao criar post')
            }
        } catch (error) {
            console.error('Erro ao criar post:', error)
            toast.error('Erro ao criar post')
        } finally {
            setIsSubmitting(false)
        }
    }

    return (
        <form onSubmit={handleSubmit} className={styles.form}>
            <div className={styles.field}>
                <label className={styles.label}>Título</label>
                <Input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Digite o título do post"
                    disabled={isSubmitting}
                />
                {title && (
                    <div className={styles.slugPreview}>
                        <span className={styles.slugLabel}>URL:</span>
                        <code className={styles.slugValue}>/posts/{slugPreview}</code>
                    </div>
                )}
            </div>

            <div className={styles.field}>
                <label className={styles.label}>Imagem de Capa</label>
                <CoverUploader
                    onFileSelected={setCoverFile}
                    disabled={isSubmitting}
                />
                {coverFile && (
                    <div className={styles.coverSuccess}>
                        ✓ Imagem selecionada: {coverFile.name}
                    </div>
                )}
            </div>

            <div className={styles.field}>
                <label className={styles.label}>Conteúdo do Post</label>
                <PostEditor
                    value={body}
                    onChange={setBody}
                />
            </div>

            <div className={styles.field}>
                <label className={styles.label}>
                    Código <span className={styles.optional}>(opcional)</span>
                </label>
                <p className={styles.fieldHint}>
                    Adicione um trecho de código relacionado ao post. Será exibido em destaque.
                </p>
                <PostEditor
                    value={code}
                    onChange={setCode}
                />
            </div>

            <div className={styles.actions}>
                <Button type="submit" disabled={isSubmitting}>
                    {isSubmitting ? (
                        <>
                            <Spinner />
                            <span>Publicando...</span>
                        </>
                    ) : (
                        'Publicar Post'
                    )}
                </Button>
            </div>
        </form>
    )
}

export default NewPostForm
