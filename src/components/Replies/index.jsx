import styles from './replies.module.css'
import { Comment } from '../Comment'
import { ReplyModal } from '../ModalReply'

export const Replies = ({ comment }) => {
    const replies = comment.children || []

    if (replies.length === 0) {
        return null
    }

    return (
        <div className={styles.container}>
            <div className={styles.replies}>
                <span className={styles.label}>
                    {replies.length} {replies.length === 1 ? 'resposta' : 'respostas'}
                </span>
                <ul>
                    {replies.map(reply => (
                        <li key={reply.id}>
                            <Comment comment={reply}/>
                            <ReplyModal comment={reply}/>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    )
}