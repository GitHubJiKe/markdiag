import React, { Children } from "react";
import cn from "classnames";
import "./Block.scss";

interface IProps {
  title: string;
  children: React.ReactNode;
  level: number;
}

export default function Block({ children, title, level }: IProps) {
  console.log(children);
  return (
    <div className="block">
      <div className={cn("block-title", `level-${level}`)}>{title} </div>
      <div className="block-children">
        {Children.map(children, (child) => {
          console.log(111, child);
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-ignore
          if (typeof child.props["children"] === "string") {
            return <div className="block-content">{child}</div>;
          } else {
            return child;
          }
        })}
      </div>
    </div>
  );
}
