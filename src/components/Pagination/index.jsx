import Link from 'next/link'
import styles from './pagination.module.css'
import { ArrowBack } from '../icons/ArrowBack'
import { ArrowFoward } from '../icons/ArrowFoward'

export const Pagination = ({ currentPage, totalPages, prev, next, searchTerm }) => {
    const baseQuery = searchTerm ? { q: searchTerm } : {}

    // Gera array de páginas para exibir
    const getPageNumbers = () => {
        const pages = []
        const maxVisible = 5
        
        let start = Math.max(1, currentPage - Math.floor(maxVisible / 2))
        let end = Math.min(totalPages, start + maxVisible - 1)
        
        // Ajusta o início se estiver perto do final
        if (end - start + 1 < maxVisible) {
            start = Math.max(1, end - maxVisible + 1)
        }
        
        for (let i = start; i <= end; i++) {
            pages.push(i)
        }
        
        return pages
    }

    const pageNumbers = getPageNumbers()

    if (totalPages <= 1) {
        return null
    }

    return (
        <nav className={styles.pagination} aria-label="Paginação">
            <div className={styles.container}>
                {/* Botão Anterior */}
                {prev ? (
                    <Link 
                        href={{ pathname: '/', query: { ...baseQuery, page: prev } }}
                        className={styles.navButton}
                        aria-label="Página anterior"
                    >
                        <ArrowBack />
                        <span className={styles.navText}>Anterior</span>
                    </Link>
                ) : (
                    <span className={`${styles.navButton} ${styles.disabled}`} aria-disabled="true">
                        <ArrowBack />
                        <span className={styles.navText}>Anterior</span>
                    </span>
                )}

                {/* Números das páginas */}
                <div className={styles.pages}>
                    {/* Primeira página + reticências */}
                    {pageNumbers[0] > 1 && (
                        <>
                            <Link
                                href={{ pathname: '/', query: { ...baseQuery, page: 1 } }}
                                className={styles.pageNumber}
                            >
                                1
                            </Link>
                            {pageNumbers[0] > 2 && (
                                <span className={styles.ellipsis}>...</span>
                            )}
                        </>
                    )}

                    {/* Páginas visíveis */}
                    {pageNumbers.map(page => (
                        page === currentPage ? (
                            <span 
                                key={page} 
                                className={`${styles.pageNumber} ${styles.active}`}
                                aria-current="page"
                            >
                                {page}
                            </span>
                        ) : (
                            <Link
                                key={page}
                                href={{ pathname: '/', query: { ...baseQuery, page } }}
                                className={styles.pageNumber}
                            >
                                {page}
                            </Link>
                        )
                    ))}

                    {/* Última página + reticências */}
                    {pageNumbers[pageNumbers.length - 1] < totalPages && (
                        <>
                            {pageNumbers[pageNumbers.length - 1] < totalPages - 1 && (
                                <span className={styles.ellipsis}>...</span>
                            )}
                            <Link
                                href={{ pathname: '/', query: { ...baseQuery, page: totalPages } }}
                                className={styles.pageNumber}
                            >
                                {totalPages}
                            </Link>
                        </>
                    )}
                </div>

                {/* Botão Próxima */}
                {next ? (
                    <Link 
                        href={{ pathname: '/', query: { ...baseQuery, page: next } }}
                        className={styles.navButton}
                        aria-label="Próxima página"
                    >
                        <span className={styles.navText}>Próxima</span>
                        <ArrowFoward />
                    </Link>
                ) : (
                    <span className={`${styles.navButton} ${styles.disabled}`} aria-disabled="true">
                        <span className={styles.navText}>Próxima</span>
                        <ArrowFoward />
                    </span>
                )}
            </div>

            {/* Info de página */}
            <div className={styles.info}>
                Página {currentPage} de {totalPages}
            </div>
        </nav>
    )
}

