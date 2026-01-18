import { CardPost } from "@/components/CardPost"
import { Pagination } from "@/components/Pagination"
import logger from "@/logger"

import styles from './page.module.css'
import db from "../../../prisma/db"

async function getAllPosts (page, searchTerm) {
  try {

    const where = {}

    if (searchTerm) {
      where.title = {
        contains: searchTerm,
        mode: 'insensitive'
      }
    }

    const perPage = 6;
    const skip = (page - 1) * perPage;
    const totalItems = await db.post.count({ where })
    const totalPages = Math.ceil(totalItems / perPage)
    const prev = page > 1 ? page - 1 : null 
    const next = page < totalPages ? page + 1 : null

    const posts = await db.post.findMany({
      take: perPage,
      skip,
      where,
      orderBy: { id: 'desc' },
      include: {
        author: true,
        comments: true
      }
    })

    return { data: posts, prev, next, totalPages, currentPage: page }
    
  } catch (error) {
    logger.error('Falha ao obter posts', { error })
    return { data: [], prev: null, next: null, totalPages: 0, currentPage: 1 }
  }
}

export default async function Home({ searchParams }) {
  const currentPage = parseInt(searchParams?.page || 1)
  const searchTerm = searchParams?.q
  const { data: posts, prev, next, totalPages } = await getAllPosts(currentPage, searchTerm)
  
  return (
    <main className={styles.grid}>
      {posts.map(post => <CardPost key={post.id} post={post} />)}
      <Pagination 
        currentPage={currentPage}
        totalPages={totalPages}
        prev={prev}
        next={next}
        searchTerm={searchTerm}
      />
    </main>
  )
}
