import React, { useEffect, useRef, useState } from "react";
import { pdfjs, Document, Page } from "react-pdf";
import "react-pdf/dist/esm/Page/AnnotationLayer.css";
import "react-pdf/dist/esm/Page/TextLayer.css";

import "./sample.css";

import type { PDFDocumentProxy } from "pdfjs-dist";
import {
  AreaHighlight,
  Highlight,
  PdfHighlighter,
  PdfLoader,
  Popup,
  Tip,
} from "react-pdf-highlighter";
//@ts-ignore
import type { IHighlight, NewHighlight } from "./react-pdf-highlighter";
import { testHighlights as _testHighlights } from "./test-highlights";
import { Spinner } from "@react-pdf-viewer/core";
import { Sidebar } from "./Sidebar";
const testHighlights: Record<string, Array<IHighlight>> = _testHighlights;
interface State {
  url: string;
  highlights: Array<IHighlight>;
}

const getNextId = () => String(Math.random()).slice(2);

const parseIdFromHash = () =>
  document.location.hash.slice("#highlight-".length);

const resetHash = () => {
  document.location.hash = "";
};

const HighlightPopup = ({
  comment,
}: {
  comment: { text: string; emoji: string };
}) =>
  comment.text ? (
    <div className="Highlight__popup">
      {comment.emoji} {comment.text}
    </div>
  ) : null;

const PRIMARY_PDF_URL = "https://arxiv.org/pdf/1708.08021.pdf";
const SECONDARY_PDF_URL = "https://arxiv.org/pdf/1604.02480.pdf";

const searchParams = new URLSearchParams(document.location.search);

const initialUrl = searchParams.get("url") || PRIMARY_PDF_URL;

type PDFFile = string | File | null;

export default function Sample({}: any, State: any) {
  const [state, setState] = useState({
    url: initialUrl,
    highlights: testHighlights[initialUrl]
      ? [...testHighlights[initialUrl]]
      : [],
  });
  const scrollViewerToRef = useRef<(highlight: any) => void>(() => {});


  const resetHighlights = () => {
    //@ts-ignore
    setState({
      highlights: [],
    });
  };

  const toggleDocument = () => {
    const newUrl =
      state.url === PRIMARY_PDF_URL ? PRIMARY_PDF_URL : PRIMARY_PDF_URL;

    setState({
      url: newUrl,
      highlights: testHighlights[newUrl] ? [...testHighlights[newUrl]] : [],
    });
  };
  const scrollViewerTo = (highlight: any) => {
    if (typeof scrollViewerToRef.current === "function") {
      scrollViewerToRef.current(highlight);
    }
  };
  const scrollToHighlightFromHash = () => {
    const highlight = getHighlightById(parseIdFromHash());

    if (highlight) {
      scrollViewerTo(highlight);
    }
  };
  console.log(state.highlights)
  const getHighlightById =(id: string) => {
    const { highlights } = state;

    return highlights.find((highlight) => highlight.id === id);
  }
  const addHighlight = (highlight: NewHighlight) => {
    const { highlights } = state;
    console.log(state.highlights)
    console.log("Saving highlight", highlight);
    //@ts-ignore
    setState({
      highlights: [{ ...highlight, id: getNextId() }, ...highlights],
    });
  }
  useEffect(() => {
    window.addEventListener(
      "hashchange",
      scrollToHighlightFromHash,
      false
    );
  },[])

  const updateHighlight = (highlightId: string, position: Object, content: Object) => {
    console.log("Updating highlight", highlightId, position, content);
    console.log(state.highlights)
    //@ts-ignore
    setState({
      highlights: state.highlights.map((h) => {
        const {
          id,
          position: originalPosition,
          content: originalContent,
          ...rest
        } = h;
        return id === highlightId
          ? {
              id,
              position: { ...originalPosition, ...position },
              content: { ...originalContent, ...content },
              ...rest,
            }
          : h;
      }),
    });
  }
  const { url, highlights } = state;
  return (
    <div className="App" style={{ display: "flex", height: "100vh" }}>
      <Sidebar
          highlights={highlights}
          resetHighlights={resetHighlights}
          // toggleDocument={toggleDocument}
        />
      <div
        style={{
          height: "100vh",
          width: "75vw",
          position: "relative",
        }}
      >
        {/* @ts-ignore */}
        <PdfLoader url={url} beforeLoad={<Spinner />}>
          {(pdfDocument) => (
            //@ts-ignore
            <PdfHighlighter
              pdfDocument={pdfDocument}
              enableAreaSelection={(event) => event.altKey}
              onScrollChange={resetHash}
              pdfScaleValue="page-width"
              scrollRef={(scrollTo) => {
                scrollViewerToRef.current = scrollTo;
                scrollToHighlightFromHash();
              }}
              onSelectionFinished={(
                position,
                content,
                hideTipAndSelection,
                transformSelection
              ) => (
                //@ts-ignore
                <Tip
                  onOpen={transformSelection}
                  onConfirm={(comment) => {
                    //@ts-ignore
                    addHighlight({ content, position, comment });

                    hideTipAndSelection();
                  }}
                />
              )}
              highlightTransform={(
                highlight,
                index,
                setTip,
                hideTip,
                viewportToScaled,
                screenshot,
                isScrolledTo
              ) => {
                const isTextHighlight = !Boolean(
                  highlight.content && highlight.content.image
                );

                const component = isTextHighlight ? (
                  //@ts-ignore
                  <Highlight
                    isScrolledTo={isScrolledTo}
                    position={highlight.position}
                    comment={highlight.comment}
                  />
                ) : (
                  //@ts-ignore
                  <AreaHighlight
                    isScrolledTo={isScrolledTo}
                    highlight={highlight}
                    onChange={(boundingRect) => {
                      //@ts-ignore
                      updateHighlight(
                        highlight.id,
                        { boundingRect: viewportToScaled(boundingRect) },
                        { image: screenshot(boundingRect) }
                      );
                    }}
                  />
                );

                return (
                  //@ts-ignore
                  <Popup
                    popupContent={<HighlightPopup {...highlight} />}
                    onMouseOver={(popupContent) =>
                      setTip(highlight, (highlight) => popupContent)
                    }
                    onMouseOut={hideTip}
                    key={index}
                    children={component}
                  />
                );
              }}
              highlights={highlights}
            />
          )}
        </PdfLoader>
      </div>
    </div>
  );
}
