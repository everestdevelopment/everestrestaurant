import React from 'react';
import { 
  Pagination, 
  PaginationContent, 
  PaginationItem, 
  PaginationLink, 
  PaginationNext, 
  PaginationPrevious, 
  PaginationEllipsis 
} from '@/components/ui/pagination';

interface MenuPaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

const MenuPagination: React.FC<MenuPaginationProps> = ({
  currentPage,
  totalPages,
  onPageChange,
}) => {
  if (totalPages <= 1) return null;

  return (
    <div className="mt-8 sm:mt-12 flex flex-col items-center gap-4">
      <div className="text-center">
        <p className="text-sm text-slate-500 dark:text-gray-400">
          Sahifa {currentPage} dan {totalPages} gacha
        </p>
      </div>
      <Pagination>
        <PaginationContent className="glass-card p-1 sm:p-2">
          <PaginationItem>
            <PaginationPrevious 
              onClick={() => onPageChange(Math.max(1, currentPage - 1))}
              className={currentPage === 1 ? "pointer-events-none opacity-50" : "cursor-pointer hover:bg-cyan-400/10 text-xs sm:text-sm"}
            />
          </PaginationItem>
          
          {/* First page */}
          {currentPage > 3 && (
            <>
              <PaginationItem>
                <PaginationLink 
                  onClick={() => onPageChange(1)}
                  className="cursor-pointer hover:bg-cyan-400/10"
                >
                  1
                </PaginationLink>
              </PaginationItem>
              {currentPage > 4 && (
                <PaginationItem>
                  <PaginationEllipsis />
                </PaginationItem>
              )}
            </>
          )}

          {/* Current page and surrounding pages */}
          {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
            const pageNum = Math.max(1, Math.min(totalPages - 4, currentPage - 2)) + i;
            if (pageNum > totalPages) return null;
            
            return (
              <PaginationItem key={pageNum}>
                <PaginationLink 
                  onClick={() => onPageChange(pageNum)}
                  isActive={currentPage === pageNum}
                  className="cursor-pointer hover:bg-cyan-400/10"
                >
                  {pageNum}
                </PaginationLink>
              </PaginationItem>
            );
          })}

          {/* Last page */}
          {currentPage < totalPages - 2 && (
            <>
              {currentPage < totalPages - 3 && (
                <PaginationItem>
                  <PaginationEllipsis />
                </PaginationItem>
              )}
              <PaginationItem>
                <PaginationLink 
                  onClick={() => onPageChange(totalPages)}
                  className="cursor-pointer hover:bg-cyan-400/10"
                >
                  {totalPages}
                </PaginationLink>
              </PaginationItem>
            </>
          )}

          <PaginationItem>
            <PaginationNext 
              onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
              className={currentPage === totalPages ? "pointer-events-none opacity-50" : "cursor-pointer hover:bg-cyan-400/10 text-xs sm:text-sm"}
            />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    </div>
  );
};

export default MenuPagination;
