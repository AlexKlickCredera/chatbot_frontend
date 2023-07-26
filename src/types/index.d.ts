declare module "react-pdf-highlighter" {
    import * as React from "react";
  
    export interface Highlight {
      // fill out the properties based on what you expect
      // for example:
      color: string;
      // ... other properties
    }
  
    export interface PdfHighlighterProps {
      // fill out the properties based on what you expect
      // for example:
      highlights: Highlight[];
      // ... other properties
    }
  
    export class PdfHighlighter extends React.Component<PdfHighlighterProps, any> {}
  
    // declare other exports in a similar manner
  }
  