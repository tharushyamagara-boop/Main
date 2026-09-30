'use client';

import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface AdminPaginationProps {
  currentPage: number;
  totalItems: number;
  pageSize: number;
  onPageChange: (page: number) => void;
  onPageSizeChange?: (pageSize: number) => void;
}

export function AdminPagination({
  currentPage,
  totalItems,
  pageSize,
  onPageChange,
  onPageSizeChange
}: AdminPaginationProps) {
  const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));
  const startItem = totalItems === 0 ? 0 : (currentPage - 1) * pageSize + 1;
  const endItem = Math.min(totalItems, currentPage * pageSize);

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 py-4 px-2 text-xs text-slate-600">
      
      {/* Items range display */}
      <div className="flex items-center gap-2">
        <span>
          Showing <strong className="text-slate-900">{startItem}</strong> to <strong className="text-slate-900">{endItem}</strong> of <strong className="text-slate-900">{totalItems}</strong> entries
        </span>
        
        {onPageSizeChange && (
          <div className="flex items-center gap-1.5 ml-4">
            <span className="text-slate-500">Per page:</span>
            <Select 
              value={String(pageSize)} 
              onValueChange={(val) => onPageSizeChange(Number(val))}
            >
              <SelectTrigger className="h-7 w-16 text-xs bg-white border-slate-200 text-slate-800 focus:border-[#3b66b0]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-white border-slate-200 text-slate-800">
                <SelectItem value="10">10</SelectItem>
                <SelectItem value="25">25</SelectItem>
                <SelectItem value="50">50</SelectItem>
                <SelectItem value="100">100</SelectItem>
              </SelectContent>
            </Select>
          </div>
        )}
      </div>

      {/* Page navigation controls */}
      <div className="flex items-center gap-1">
        <Button
          variant="outline"
          size="sm"
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage <= 1}
          className="h-8 px-2.5 bg-white border-slate-200 text-slate-700 hover:text-slate-900 hover:bg-slate-100 disabled:opacity-40 text-xs"
        >
          <ChevronLeft className="w-3.5 h-3.5 mr-1 text-slate-500" />
          <span>Previous</span>
        </Button>

        <div className="flex items-center gap-1 px-1">
          {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
            let pageNum = i + 1;
            if (totalPages > 5 && currentPage > 3) {
              pageNum = currentPage - 2 + i;
              if (pageNum > totalPages) pageNum = totalPages - (4 - i);
            }

            return (
              <Button
                key={pageNum}
                variant={currentPage === pageNum ? "default" : "outline"}
                size="sm"
                onClick={() => onPageChange(pageNum)}
                className={`h-8 w-8 p-0 text-xs transition-colors ${
                  currentPage === pageNum
                    ? "bg-[#3b66b0] hover:bg-[#2b4c85] text-white border-[#3b66b0]"
                    : "bg-white border-slate-200 text-slate-700 hover:text-slate-900 hover:bg-slate-100"
                }`}
              >
                {pageNum}
              </Button>
            );
          })}
        </div>

        <Button
          variant="outline"
          size="sm"
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage >= totalPages}
          className="h-8 px-2.5 bg-white border-slate-200 text-slate-700 hover:text-slate-900 hover:bg-slate-100 disabled:opacity-40 text-xs"
        >
          <span>Next</span>
          <ChevronRight className="w-3.5 h-3.5 ml-1 text-slate-500" />
        </Button>
      </div>

    </div>
  );
}
