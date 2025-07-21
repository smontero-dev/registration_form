"use client";

import "react-pdf/dist/Page/TextLayer.css";
import "react-pdf/dist/Page/AnnotationLayer.css";
import { Document, Page, pdfjs } from "react-pdf";
import { useMemo, useState } from "react";
import { throttle } from "throttle-ts";
import Measure from "react-measure";

type PdfViewerProps = {
  file: string;
};

pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

// export default function PdfViewer({ file }: PdfViewerProps) {
//   const [pageWidth, setPageWidth] = useState<number>(0);
//   const [pageHeight, setPageHeight] = useState<number>(0);

//   const ref = useRef<HTMLDivElement>(null);

//   const { width: wrapperWidth, height: wrapperHeight } = useResizeObserver({
//     ref,
//     box: "border-box",
//   });

//   const fitHorizontal = useMemo(() => {
//     if (!wrapperWidth || !wrapperHeight || !pageWidth || !pageHeight)
//       return true;

//     const wRatio = pageWidth / wrapperWidth;
//     const hRatio = pageHeight / wrapperHeight;
//     return wRatio >= hRatio;
//   }, [pageWidth, pageHeight, wrapperWidth, wrapperHeight]);

//   return (
//     <div ref={ref} className="container">
//       <Document file={file}>
//         <Page
//           key="page"
//           pageNumber={1}
//           onLoadSuccess={(page) => {
//             setPageWidth(page.width);
//             setPageHeight(page.height);
//           }}
//           width={fitHorizontal ? wrapperWidth : undefined}
//           height={!fitHorizontal ? wrapperHeight : undefined}
//           scale={1}
//         />
//       </Document>
//     </div>
//   );
// }

export default function PdfViewer({ file }: PdfViewerProps) {
  const [wrapperWidth, setWrapperWidth] = useState(0);
  const [wrapperHeight, setWrapperHeight] = useState(0);
  const [pageWidth, setPageWidth] = useState(0);
  const [pageHeight, setPageHeight] = useState(0);

  const fitHorizontal = useMemo(() => {
    const wRatio = pageWidth / wrapperWidth;
    const hRatio = pageHeight / wrapperHeight;
    return wRatio >= hRatio;
  }, [pageWidth, pageHeight, wrapperWidth, wrapperHeight]);

  const setWrapperDimensions = useMemo(
    () =>
      throttle(
        (contentRect: { bounds?: { width: number; height: number } }) => {
          setWrapperWidth(contentRect.bounds?.width ?? 0);
          setWrapperHeight(contentRect.bounds?.height ?? 0);
        },
        500
      )[0],
    []
  );

  return (
    <div className="flex flex-col h-full">
      <Measure bounds onResize={setWrapperDimensions}>
        {({ measureRef }) => (
          <div
            ref={measureRef}
            className="relative flex-1 flex justify-center items-center h-full w-full overflow-auto"
          >
            <Document file={file}>
              <Page
                key="page"
                pageNumber={1}
                onLoadSuccess={(page) => {
                  setPageWidth(page.width);
                  setPageHeight(page.height);
                }}
                width={fitHorizontal ? wrapperWidth : undefined}
                height={!fitHorizontal ? wrapperHeight : undefined}
                scale={30}
              />
            </Document>
          </div>
        )}
      </Measure>
    </div>
  );
}
