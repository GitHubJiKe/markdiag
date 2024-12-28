/* eslint-disable @typescript-eslint/ban-ts-comment */
import "./App.css";
import Block from "./components/Block";
import { toPng } from "html-to-image";
// @ts-ignore
import download from "downloadjs";
import {
  buildNestedTree,
  markdownToSimpleJson,
  type IToken,
} from "./utils/markd";
import { useState, useEffect } from "react";

interface BlockProps {
  text: string;
  level: number;
  children: string | string[] | BlockProps[];
  items?: string[];
}
function App() {
  const [markedStr, setmarkedStr] = useState("");
  const [markdownStr, setmarkdownStr] = useState(`# Welcome to MarkDiag
## Write Markdown
- Structure your notes with Markdown syntax
- Create a diagram with Markdown
## Display Diagram
- Convert Markdown to Diagram
- Colorful Diagram to PNG
`);
  const [direction, setDirection] = useState("horizontal");
  const [data, setData] = useState<BlockProps[]>([]);
  const renderBlock = (block: BlockProps) => {
    return (
      <Block
        items={block.items}
        text={block.text}
        key={block.text}
        level={block.level}
        direction={direction}
      >
        {((block.children || []) as BlockProps[]).map((child: BlockProps) => {
          if (typeof child === "string") {
            return <>{child}</>;
          } else {
            return renderBlock(child);
          }
        })}
      </Block>
    );
  };

  const handleChange = async () => {
    const res = await markdownToSimpleJson(markdownStr);
    setData(buildNestedTree(res.content as IToken[]));
    setmarkedStr(
      JSON.stringify(buildNestedTree(res.content as IToken[]), null, 2)
    );
  };

  useEffect(() => {
    handleChange();
  }, []);

  return (
    <>
      <main style={{ display: "flex", flexDirection: "row", gap: 12 }}>
        <textarea
          name="content"
          id="markdown"
          rows={30}
          style={{
            flex: 1,
            height: "400px",
            minHeight: "400px",
            minWidth: "400px",
            borderRadius: 12,
            padding: 12,
            lineHeight: 2,
          }}
          value={markdownStr}
          onChange={(e) => {
            setmarkdownStr(e.target.value);
          }}
          onBlur={handleChange}
        ></textarea>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            flex: 5,
            overflow: "auto",
            width: "auto",
          }}
        >
          <div
            style={{
              backgroundColor: "transparent",
              padding: 0,
              margin: 0,
              width: "auto",
            }}
          >
            {data.map(renderBlock)}
          </div>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              position: "fixed",
              bottom: 12,
              right: 12,
              width: 100,
              gap: 12,
            }}
          >
            <button
              onClick={() => {
                setDirection((direction) =>
                  direction === "horizontal" ? "vertical" : "horizontal"
                );
              }}
            >
              {direction}
            </button>
            <button
              onClick={() => {
                navigator.clipboard.writeText(markedStr);
                alert("copied to clipboard");
              }}
            >
              copy json
            </button>
            <button
              onClick={() => {
                toPng(document.querySelector(".block") as HTMLElement, {
                  cacheBust: true,
                }).then((dataUrl) => {
                  //  ask user filename
                  const filename = window.prompt(
                    "Enter filename",
                    "diagram.png"
                  );
                  if (filename) {
                    download(dataUrl, filename, "image/png");
                  }
                });
              }}
            >
              download diagram
            </button>
          </div>
        </div>
      </main>

      <footer
        style={{ position: "fixed", bottom: 10, left: "45%", color: "#bbb" }}
      >
        @power by{" "}
        <a target="_blank" href="https://github.com/GitHubJiKe/markdiag">
          markdiag
        </a>
      </footer>
    </>
  );
}

export default App;
