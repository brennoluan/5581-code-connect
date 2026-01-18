'use client'

import Image from 'next/image'
import { useState, useRef } from 'react'
import { toast } from 'react-toastify'
import styles from './cover-uploader.module.css'

const REQUIRED_WIDTH = 945
const REQUIRED_HEIGHT = 300

export const CoverUploader = ({ onFileSelected, disabled }) => {
    const [imgSrc, setImgSrc] = useState(null)
    const [dimensionError, setDimensionError] = useState(null)
    const fileInputRef = useRef(null)

    function handlePreviewClick() {
        if (!disabled && fileInputRef.current) {
            fileInputRef.current.click()
        }
    }

    function validateImageDimensions(file) {
        return new Promise((resolve) => {
            const img = document.createElement('img')
            img.onload = () => {
                URL.revokeObjectURL(img.src)
                if (img.width === REQUIRED_WIDTH && img.height === REQUIRED_HEIGHT) {
                    resolve({ valid: true })
                } else {
                    resolve({ 
                        valid: false, 
                        message: `Dimensões inválidas: ${img.width}x${img.height}. A imagem deve ter exatamente ${REQUIRED_WIDTH}x${REQUIRED_HEIGHT} pixels.`
                    })
                }
            }
            img.onerror = () => {
                resolve({ valid: false, message: 'Erro ao carregar a imagem.' })
            }
            img.src = URL.createObjectURL(file)
        })
    }

    async function handleFileChange(event) {
        const file = event.target.files[0]
        if (file) {
            setDimensionError(null)
            
            const validation = await validateImageDimensions(file)
            
            if (!validation.valid) {
                setDimensionError(validation.message)
                toast.error(validation.message)
                onFileSelected(null)
                setImgSrc(null)
                event.target.value = ''
                return
            }

            // Criar preview
            const reader = new FileReader()
            reader.onloadend = () => {
                setImgSrc(reader.result)
            }
            reader.readAsDataURL(file)
            
            // Passar o arquivo para o componente pai
            onFileSelected(file)
        }
    }

    return (
        <div className={styles.container}>
            <div 
                className={`${styles.preview} ${!disabled ? styles.clickable : ''}`}
                onClick={handlePreviewClick}
                role="button"
                tabIndex={disabled ? -1 : 0}
                onKeyDown={(e) => e.key === 'Enter' && handlePreviewClick()}
            >
                {imgSrc ? (
                    <div className={styles.imageWrapper}>
                        <Image
                            src={imgSrc}
                            width={REQUIRED_WIDTH}
                            height={REQUIRED_HEIGHT}
                            alt="Capa do post"
                            className={styles.coverImage}
                        />
                        <div className={styles.changeOverlay}>
                            <span>Clique para trocar</span>
                        </div>
                    </div>
                ) : (
                    <div className={styles.placeholder}>
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="48"
                            height="48"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="1.5"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        >
                            <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                            <circle cx="8.5" cy="8.5" r="1.5" />
                            <polyline points="21 15 16 10 5 21" />
                        </svg>
                        <span>Clique para selecionar uma imagem de capa</span>
                        <span className={styles.dimensions}>
                            Dimensões: {REQUIRED_WIDTH}x{REQUIRED_HEIGHT} pixels
                        </span>
                    </div>
                )}
            </div>

            {dimensionError && (
                <div className={styles.error}>
                    {dimensionError}
                </div>
            )}

            <div className={styles.form}>
                <label className={styles.fileLabel}>
                    <input
                        ref={fileInputRef}
                        type="file"
                        onChange={handleFileChange}
                        accept="image/*"
                        disabled={disabled}
                        className={styles.fileInput}
                    />
                    <span className={styles.fileLabelText}>
                        {imgSrc ? 'Trocar imagem' : 'Escolher imagem'}
                    </span>
                </label>
            </div>

            <p className={styles.hint}>
                A imagem deve ter exatamente {REQUIRED_WIDTH}x{REQUIRED_HEIGHT} pixels
            </p>
        </div>
    )
}

export default CoverUploader
