'use client'

import React, { useState, useEffect, useRef } from 'react'
import { Spinner } from '../Spinner'
import styles from './post-editor.module.css'
import 'ckeditor5/ckeditor5.css'

export const PostEditor = ({ value, onChange }) => {
    const editorRef = useRef(null)
    const [editorLoaded, setEditorLoaded] = useState(false)
    const [Editor, setEditor] = useState(null)

    useEffect(() => {
        let isMounted = true

        const loadEditor = async () => {
            try {
                const ckeditor5 = await import('ckeditor5')
                const CKEditorReact = await import('@ckeditor/ckeditor5-react')

                if (isMounted) {
                    setEditor({
                        CKEditor: CKEditorReact.CKEditor,
                        ClassicEditor: ckeditor5.ClassicEditor,
                        Essentials: ckeditor5.Essentials,
                        Paragraph: ckeditor5.Paragraph,
                        Bold: ckeditor5.Bold,
                        Italic: ckeditor5.Italic,
                        Underline: ckeditor5.Underline,
                        Strikethrough: ckeditor5.Strikethrough,
                        Heading: ckeditor5.Heading,
                        Link: ckeditor5.Link,
                        List: ckeditor5.List,
                        BlockQuote: ckeditor5.BlockQuote,
                        Code: ckeditor5.Code,
                        CodeBlock: ckeditor5.CodeBlock,
                        Image: ckeditor5.Image,
                        ImageCaption: ckeditor5.ImageCaption,
                        ImageStyle: ckeditor5.ImageStyle,
                        ImageToolbar: ckeditor5.ImageToolbar,
                        ImageUpload: ckeditor5.ImageUpload,
                        Base64UploadAdapter: ckeditor5.Base64UploadAdapter,
                        Table: ckeditor5.Table,
                        TableToolbar: ckeditor5.TableToolbar,
                        MediaEmbed: ckeditor5.MediaEmbed,
                        HorizontalLine: ckeditor5.HorizontalLine,
                        Indent: ckeditor5.Indent,
                        IndentBlock: ckeditor5.IndentBlock
                    })
                    setEditorLoaded(true)
                }
            } catch (error) {
                console.error('Erro ao carregar o editor:', error)
            }
        }

        loadEditor()

        return () => {
            isMounted = false
        }
    }, [])

    if (!editorLoaded || !Editor) {
        return (
            <div className={styles.loading}>
                <Spinner />
                <span>Carregando editor...</span>
            </div>
        )
    }

    const {
        CKEditor,
        ClassicEditor,
        Essentials,
        Paragraph,
        Bold,
        Italic,
        Underline,
        Strikethrough,
        Heading,
        Link,
        List,
        BlockQuote,
        Code,
        CodeBlock,
        Image,
        ImageCaption,
        ImageStyle,
        ImageToolbar,
        ImageUpload,
        Base64UploadAdapter,
        Table,
        TableToolbar,
        MediaEmbed,
        HorizontalLine,
        Indent,
        IndentBlock
    } = Editor

    return (
        <div className={styles.editorWrapper}>
            <CKEditor
                editor={ClassicEditor}
                data={value}
                ref={editorRef}
                onChange={(event, editor) => {
                    const data = editor.getData()
                    onChange(data)
                }}
                config={{
                    licenseKey: 'GPL',
                    plugins: [
                        Essentials,
                        Paragraph,
                        Bold,
                        Italic,
                        Underline,
                        Strikethrough,
                        Heading,
                        Link,
                        List,
                        BlockQuote,
                        Code,
                        CodeBlock,
                        Image,
                        ImageCaption,
                        ImageStyle,
                        ImageToolbar,
                        ImageUpload,
                        Base64UploadAdapter,
                        Table,
                        TableToolbar,
                        MediaEmbed,
                        HorizontalLine,
                        Indent,
                        IndentBlock
                    ],
                    toolbar: {
                        items: [
                            'heading',
                            '|',
                            'bold',
                            'italic',
                            'underline',
                            'strikethrough',
                            '|',
                            'link',
                            'blockQuote',
                            'code',
                            'codeBlock',
                            '|',
                            'bulletedList',
                            'numberedList',
                            '|',
                            'outdent',
                            'indent',
                            '|',
                            'uploadImage',
                            'insertTable',
                            'mediaEmbed',
                            'horizontalLine',
                            '|',
                            'undo',
                            'redo'
                        ]
                    },
                    heading: {
                        options: [
                            { model: 'paragraph', title: 'Parágrafo', class: 'ck-heading_paragraph' },
                            { model: 'heading1', view: 'h1', title: 'Título 1', class: 'ck-heading_heading1' },
                            { model: 'heading2', view: 'h2', title: 'Título 2', class: 'ck-heading_heading2' },
                            { model: 'heading3', view: 'h3', title: 'Título 3', class: 'ck-heading_heading3' }
                        ]
                    },
                    image: {
                        toolbar: [
                            'imageStyle:inline',
                            'imageStyle:block',
                            'imageStyle:side',
                            '|',
                            'imageTextAlternative'
                        ]
                    },
                    table: {
                        contentToolbar: ['tableColumn', 'tableRow', 'mergeTableCells']
                    },
                    placeholder: 'Escreva o conteúdo do seu post aqui...'
                }}
            />
        </div>
    )
}

export default PostEditor
