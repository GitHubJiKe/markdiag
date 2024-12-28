import { marked } from "marked";

export async function markdownToSimpleJson(markdownText: string) {
  const html = await marked.parse(markdownText);
  const parser = new DOMParser();
  console.log(html, parser);
  const doc = parser.parseFromString(html, "text/html");

  const jsonOutput = {
    content: [],
  };

  const children = Array.from(doc.body.children);
  children.forEach((element) => {
    console.log(element.tagName);
    if (element.tagName.startsWith("H") && !element.tagName.endsWith("R")) {
      // @ts-ignore
      jsonOutput.content.push({
        type: "heading",
        level: parseInt(element.tagName.slice(1)),
        text: element.textContent,
      });
    } else if (element.tagName === "P") {
      // @ts-ignore
      jsonOutput.content.push({ type: "paragraph", text: element.textContent });
    } else if (element.tagName === "UL") {
      const listItems = Array.from(element.children).map(
        (li) => li.textContent
      );
      // @ts-ignore
      jsonOutput.content.push({ type: "list", items: listItems });
    } else if (element.tagName === "OL") {
      const listItems = Array.from(element.children).map(
        (li) => li.textContent
      );
      // @ts-ignore
      jsonOutput.content.push({ type: "orderList", items: listItems });
    } else if (element.tagName === "BLOCKQUOTE") {
      //   @ts-ignore
      jsonOutput.content.push({
        type: "blockquote",
        text: element.textContent?.trim(),
      });
    } else if (element.tagName === "HR") {
      //   @ts-ignore
      jsonOutput.content.push({
        type: "hr",
        text: element.textContent,
      });
    }
  });
  return jsonOutput;
}

export interface IToken {
  type: string;
  level: number;
  text: string;
}

// const jsonResult = markdownToSimpleJson(markdownExample);

export function buildNestedTree(tokens: IToken[]) {
  const root = { children: [] }; // 根节点
  const stack = [root]; // 维护一个节点栈

  for (const token of tokens) {
    if (token.type === "heading") {
      const currentDepth = token.level;
      const newNode = {
        type: "heading",
        level: currentDepth,
        text: token.text,
        children: [],
      };

      // 调整栈，找到当前节点应该插入的父节点
      while (
        stack.length > 1 &&
        //   @ts-ignore
        stack[stack.length - 1].level >= currentDepth
      ) {
        stack.pop();
      }

      // 将新节点添加到当前栈顶节点的children
      //   @ts-ignore
      stack[stack.length - 1].children.push(newNode);
      stack.push(newNode); // 将新节点入栈
    } else {
      // 其他类型的节点
      if (stack.length > 0) {
        const lastNode = stack[stack.length - 1];
        if (!lastNode.children) {
          lastNode.children = [];
        }
        console.log(lastNode, token, "token");
        // @ts-ignore
        lastNode.children.push({ ...token, level: lastNode.level + 1 });
      }
    }
  }

  return root.children; // 返回根节点的 children，即顶层节点数组
}
