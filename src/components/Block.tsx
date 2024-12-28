import React, { Children } from "react";
import cn from "classnames";
import "./Block.scss";

interface IProps {
  text: string;
  children: React.ReactNode;
  level: number;
  items?: string[];
  direction?: string;
}

export default function Block({
  children,
  text,
  level,
  items,
  direction,
}: IProps) {
  const isHor = direction === "horizontal";
  if (items && items.length) {
    return (
      <>
        {items.map((item, index) => {
          return (
            <div className={cn("box", `level-${level}-bg`)}>
              <div className="block-content" key={index}>
                {item}
              </div>
            </div>
          );
        })}
      </>
    );
  }

  return (
    <div
      className={cn("block box", `level-${level}-bg`)}
      style={{
        width: `${isHor ? "fit-content" : "auto"}`,
      }}
    >
      {text && (
        <div
          className={cn("block-title", `level-${level}`)}
          style={{ textAlign: `${isHor ? "left" : "center"}` }}
        >
          {text}{" "}
        </div>
      )}
      {/* @ts-ignore */}
      {children && children.length > 0 && (
        <div
          className="block-children"
          style={{
            flexDirection: `${isHor ? "row" : "column"}`,
          }}
        >
          {Children.map(children, (child) => {
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            if (typeof child.props["children"] === "string") {
              return <div className="block-content">{child}</div>;
            } else {
              return child;
            }
          })}
        </div>
      )}
    </div>
  );
}
