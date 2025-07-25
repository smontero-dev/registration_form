"use client";

import "react-pdf/dist/Page/TextLayer.css";
import "react-pdf/dist/Page/AnnotationLayer.css";
import { Document, Page, pdfjs } from "react-pdf";
import { useState, useRef } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useResizeObserver } from "usehooks-ts";

type PdfViewerProps = {
  file: string;
};

pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

export default function PdfViewer({ file }: PdfViewerProps) {
  const [numPages, setNumPages] = useState<number | null>(null);
  const [pageNumber, setPageNumber] = useState(1);
  const containerRef = useRef<HTMLDivElement>(null);

  const { width } = useResizeObserver({
    ref: containerRef as React.RefObject<HTMLElement>,
  });

  function onDocumentLoadSuccess({ numPages }: { numPages: number }) {
    setNumPages(numPages);
    setPageNumber(1);
  }

  function changePage(offset: number) {
    setPageNumber((prevPageNumber) => prevPageNumber + offset);
  }

  function previousPage() {
    changePage(-1);
  }

  function nextPage() {
    changePage(1);
  }

  return (
    <div
      ref={containerRef}
      className="flex flex-col items-center w-full max-w-full"
    >
      <div className="relative w-full bg-white rounded-lg shadow-md overflow-hidden mb-2">
        <Document
          file={file}
          onLoadSuccess={onDocumentLoadSuccess}
          loading={
            <div className="flex justify-center items-center h-[50vh] text-gray-500">
              Loading PDF...
            </div>
          }
          error={
            <div className="flex justify-center items-center h-[50vh] text-red-500">
              Failed to load PDF
            </div>
          }
        >
          {/* Navigation buttons overlaid on PDF */}
          {numPages && numPages > 1 && (
            <>
              <button
                type="button"
                disabled={pageNumber <= 1}
                onClick={previousPage}
                className="absolute left-0 top-1/2 -translate-y-1/2 z-10 p-2 bg-white/70 hover:bg-white/90 rounded-r-md text-gray-600 disabled:opacity-30 disabled:cursor-not-allowed transition-all shadow-sm"
                aria-label="Previous page"
              >
                <ChevronLeft size={24} />
              </button>

              <button
                type="button"
                disabled={pageNumber >= (numPages ?? 0)}
                onClick={nextPage}
                className="absolute right-0 top-1/2 -translate-y-1/2 z-10 p-2 bg-white/70 hover:bg-white/90 rounded-l-md text-gray-600 disabled:opacity-30 disabled:cursor-not-allowed transition-all shadow-sm"
                aria-label="Next page"
              >
                <ChevronRight size={24} />
              </button>
            </>
          )}

          <div className="flex justify-center p-4">
            <Page
              pageNumber={pageNumber}
              width={width ? Math.min(width - 32, 800) : undefined}
              className="max-w-full"
              renderTextLayer={false}
            />
          </div>
        </Document>
      </div>

      {/* Page counter below the PDF */}
      {numPages && numPages > 1 && (
        <div className="text-center text-sm text-gray-600 mb-4">
          Página {pageNumber} de {numPages}
        </div>
      )}
    </div>
  );
}
