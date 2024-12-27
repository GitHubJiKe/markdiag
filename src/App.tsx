/* eslint-disable @typescript-eslint/ban-ts-comment */
import "./App.css";
import Block from "./components/Block";
import { toPng } from "html-to-image";
// @ts-ignore
import download from "downloadjs";
const data: BlockProps[] = [
  {
    title: "Introduce",
    level: 1,
    children: [
      {
        title: "From",
        children: ["Beijing China"],
        level: 2,
      },
      {
        title: "Education",
        children: ["Peking University"],
        level: 2,
      },
      {
        title: "Interest",
        children: ["Backetball 🏀", "足球 ⚽️"],
        level: 2,
      },
      {
        title: "Contact",
        children: [
          {
            title: "Email",
            children: ["yupengfei@pku.edu.cn"],
            level: 3,
          },
          {
            title: "Phone",
            children: ["1234567890"],
            level: 3,
          },
        ],
        level: 2,
      },
    ],
  },
];

interface BlockProps {
  title: string;
  level: number;
  children: string | string[] | BlockProps[];
}
function App() {
  const renderBlock = (block: BlockProps) => {
    return (
      <Block title={block.title} key={block.title} level={block.level}>
        {(block.children as BlockProps[]).map((child: BlockProps) => {
          if (typeof child === "string") {
            return <>{child}</>;
          } else {
            return renderBlock(child);
          }
        })}
      </Block>
    );
  };
  return (
    <main style={{ display: "flex", flexDirection: "column", gap: 24 }}>
      <section id="box" style={{ flex: 3 }}>
        {data.map(renderBlock)}
      </section>
      <button
        onClick={() => {
          toPng(document.querySelector("#box") as HTMLElement, {
            cacheBust: true,
          }).then((dataUrl) => {
            download(dataUrl, "res.png");
          });
        }}
      >
        download
      </button>
      <code style={{ flex: 1, overflowY: "scroll", maxHeight: "80vh" }}>
        <pre>{JSON.stringify(data, null, 4)}</pre>
      </code>
    </main>
  );
}

export default App;
