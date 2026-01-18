'use client'

import { useRef } from "react";
import { Modal } from "../Modal";

import styles from './replymodal.module.css'
import { Textarea } from "../Textarea";
import { SubmitButton } from "../SubmitButton";
import { Comment } from "../Comment";
import { postReply } from "@/actions";

export const ReplyModal = ({ comment, post }) => {
    const modalRef = useRef(null);
    const formRef = useRef(null);

    const openModal = () => {
        modalRef.current.openModal();
    };

    const handleSubmit = async (formData) => {
        await postReply(comment, formData);
        formRef.current?.reset();
        modalRef.current?.closeModal();
    };

    return (<>
        <Modal ref={modalRef}>
            <form ref={formRef} action={handleSubmit}>
                <div className={styles.body}>
                    <Comment comment={comment}/>
                </div>
                <div className={styles.divider}></div>
                <Textarea required rows={8} name="text" placeholder="Digite aqui..." />
                <div className={styles.footer}>
                    <SubmitButton>
                        Responder
                    </SubmitButton>
                </div>
            </form>
        </Modal>
        <button className={styles.btn} onClick={openModal}>
            Responder
        </button>
    </>)
}