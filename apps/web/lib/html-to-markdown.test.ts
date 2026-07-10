import { describe, expect, it } from "vitest";
import { convertHtmlToMarkdown } from "@/lib/html-to-markdown";
import {
  collapseWhitespace,
  detectCodeLanguage,
  escapeLineStartMarkers,
  escapeMarkdownText,
} from "@/lib/html-to-markdown-format";

describe("convertHtmlToMarkdown", () => {
  it("空字符串返回空字符串", () => {
    expect(convertHtmlToMarkdown("")).toBe("");
  });

  it("纯空白字符串返回空字符串", () => {
    expect(convertHtmlToMarkdown("   \n\t  ")).toBe("");
  });

  describe("标题与段落", () => {
    it("h1-h6 转成对应数量的 #", () => {
      expect(convertHtmlToMarkdown("<h1>Title</h1>")).toBe("# Title");
      expect(convertHtmlToMarkdown("<h3>Title</h3>")).toBe("### Title");
      expect(convertHtmlToMarkdown("<h6>Title</h6>")).toBe("###### Title");
    });

    it("标题内的行内格式正常渲染", () => {
      expect(
        convertHtmlToMarkdown("<h2>Bold <strong>heading</strong></h2>"),
      ).toBe("## Bold **heading**");
    });

    it("兄弟段落之间用空行分隔", () => {
      expect(convertHtmlToMarkdown("<p>First</p><p>Second</p>")).toBe(
        "First\n\nSecond",
      );
    });

    it("br 在段落内转成硬换行", () => {
      expect(convertHtmlToMarkdown("<p>Hello<br>World</p>")).toBe(
        "Hello\\\nWorld",
      );
    });
  });

  describe("分隔线与强调", () => {
    it("hr 转成 ---", () => {
      expect(convertHtmlToMarkdown("<hr>")).toBe("---");
    });

    it("strong/em/del 转成对应定界符", () => {
      expect(convertHtmlToMarkdown("<p><strong>bold</strong></p>")).toBe(
        "**bold**",
      );
      expect(convertHtmlToMarkdown("<p><em>italic</em></p>")).toBe("_italic_");
      expect(convertHtmlToMarkdown("<p><del>strike</del></p>")).toBe(
        "~~strike~~",
      );
    });

    it("标签内文字首尾带空格时，空格被挪到定界符外面", () => {
      expect(
        convertHtmlToMarkdown("<p>Say <strong> hello </strong> now</p>"),
      ).toBe("Say **hello** now");
    });

    it("空/纯空白的强调标签不输出裸定界符", () => {
      expect(convertHtmlToMarkdown("<p><strong>   </strong></p>")).toBe("");
    });
  });

  describe("行内代码与围栏代码块", () => {
    it("行内 code 用单反引号包裹", () => {
      expect(
        convertHtmlToMarkdown("<p>Use <code>const x = 1</code> here</p>"),
      ).toBe("Use `const x = 1` here");
    });

    it("行内代码内容含反引号时自动加宽围栏", () => {
      expect(convertHtmlToMarkdown("<p><code>a `b` c</code></p>")).toBe(
        "``a `b` c``",
      );
    });

    it("<pre><code> 转成带语言标注的围栏代码块", () => {
      expect(
        convertHtmlToMarkdown(
          '<pre><code class="language-js">const a = 1;</code></pre>',
        ),
      ).toBe("```js\nconst a = 1;\n```");
    });

    it("从 lang-xxx class 识别语言", () => {
      expect(
        convertHtmlToMarkdown(
          '<pre><code class="lang-python">x = 1</code></pre>',
        ),
      ).toBe("```python\nx = 1\n```");
    });

    it("class 在多个空格分隔的 class 中间也能识别", () => {
      expect(
        convertHtmlToMarkdown(
          '<pre><code class="hljs language-typescript">let x = 1;</code></pre>',
        ),
      ).toBe("```typescript\nlet x = 1;\n```");
    });

    it("没有语言 class 时输出无标注围栏", () => {
      expect(convertHtmlToMarkdown("<pre><code>plain text</code></pre>")).toBe(
        "```\nplain text\n```",
      );
    });

    it("代码块内部空白/缩进原样保留、不折叠", () => {
      expect(
        convertHtmlToMarkdown("<pre><code>\n  line1\n  line2\n\n</code></pre>"),
      ).toBe("```\n  line1\n  line2\n```");
    });

    it("代码块内容里的 HTML 实体被解码", () => {
      expect(convertHtmlToMarkdown("<pre><code>&lt;div&gt;</code></pre>")).toBe(
        "```\n<div>\n```",
      );
    });

    it("代码内容含连续三个以上反引号时改用波浪线围栏", () => {
      expect(
        convertHtmlToMarkdown("<pre><code>has ``` triple</code></pre>"),
      ).toBe("~~~\nhas ``` triple\n~~~");
    });
  });

  describe("链接与图片", () => {
    it("a href 转成 [text](href)", () => {
      expect(
        convertHtmlToMarkdown('<a href="https://example.com">Example</a>'),
      ).toBe("[Example](https://example.com)");
    });

    it("img 转成 ![alt](src)", () => {
      expect(convertHtmlToMarkdown('<img src="a.png" alt="An image">')).toBe(
        "![An image](a.png)",
      );
    });

    it("href 含圆括号时用尖括号包裹", () => {
      expect(convertHtmlToMarkdown('<a href="/wiki/Foo_(bar)">Foo</a>')).toBe(
        "[Foo](</wiki/Foo_(bar)>)",
      );
    });

    it("href 含空格时用尖括号包裹", () => {
      expect(convertHtmlToMarkdown('<a href="/path with space">Link</a>')).toBe(
        "[Link](</path with space>)",
      );
    });

    it("无 href 的 a 只保留文字", () => {
      expect(convertHtmlToMarkdown("<a>Just text</a>")).toBe("Just text");
    });

    it("无 src 的 img 只保留 alt 或不输出", () => {
      expect(convertHtmlToMarkdown('<img alt="desc">')).toBe("desc");
      expect(convertHtmlToMarkdown("<img>")).toBe("");
    });
  });

  describe("列表", () => {
    it("无序列表转成 - 开头的行", () => {
      expect(convertHtmlToMarkdown("<ul><li>A</li><li>B</li></ul>")).toBe(
        "- A\n- B",
      );
    });

    it("有序列表按真实序号递增", () => {
      expect(
        convertHtmlToMarkdown("<ol><li>First</li><li>Second</li></ol>"),
      ).toBe("1. First\n2. Second");
    });

    it("嵌套列表按父级 marker 宽度对齐缩进", () => {
      expect(
        convertHtmlToMarkdown(
          "<ul><li>Parent<ul><li>Child</li></ul></li></ul>",
        ),
      ).toBe("- Parent\n\n  - Child");
    });

    it("单个 li 内包含多个段落时正确处理", () => {
      expect(
        convertHtmlToMarkdown("<ul><li><p>First</p><p>Second</p></li></ul>"),
      ).toBe("- First\n\n  Second");
    });
  });

  describe("引用", () => {
    it("每一行加 > 前缀", () => {
      expect(
        convertHtmlToMarkdown("<blockquote><p>Quoted text</p></blockquote>"),
      ).toBe("> Quoted text");
    });

    it("嵌套 blockquote 产生两层 >", () => {
      expect(
        convertHtmlToMarkdown(
          "<blockquote>Outer<blockquote>Inner</blockquote></blockquote>",
        ),
      ).toBe("> Outer\n>\n> > Inner");
    });
  });

  describe("表格", () => {
    it("有 thead/tbody 的表格转成 GFM pipe table", () => {
      expect(
        convertHtmlToMarkdown(
          "<table><thead><tr><th>Name</th><th>Age</th></tr></thead>" +
            "<tbody><tr><td>Alice</td><td>30</td></tr></tbody></table>",
        ),
      ).toBe("| Name | Age |\n| --- | --- |\n| Alice | 30 |");
    });

    it("没有 thead 时把第一行提升为表头", () => {
      expect(
        convertHtmlToMarkdown(
          "<table><tr><td>A</td><td>B</td></tr><tr><td>1</td><td>2</td></tr></table>",
        ),
      ).toBe("| A | B |\n| --- | --- |\n| 1 | 2 |");
    });

    it("行长度不一致时按最大列数补齐空单元格", () => {
      expect(
        convertHtmlToMarkdown(
          "<table><tr><th>A</th><th>B</th><th>C</th></tr><tr><td>1</td></tr></table>",
        ),
      ).toBe("| A | B | C |\n| --- | --- | --- |\n| 1 |  |  |");
    });

    it("单元格内字面 | 被转义", () => {
      expect(
        convertHtmlToMarkdown(
          "<table><tr><th>Col</th></tr><tr><td>a|b</td></tr></table>",
        ),
      ).toBe("| Col |\n| --- |\n| a\\|b |");
    });

    it("单元格内的 br 渲染成字面 <br> 而不是真换行", () => {
      expect(
        convertHtmlToMarkdown(
          "<table><tr><th>Col</th></tr><tr><td>line1<br>line2</td></tr></table>",
        ),
      ).toBe("| Col |\n| --- |\n| line1<br>line2 |");
    });
  });

  describe("跳过的元素", () => {
    it("script 内容完全跳过", () => {
      expect(
        convertHtmlToMarkdown("<script>alert(1)</script><p>Text</p>"),
      ).toBe("Text");
    });

    it("style 内容完全跳过", () => {
      expect(
        convertHtmlToMarkdown("<style>.a{color:red}</style><p>Text</p>"),
      ).toBe("Text");
    });

    it("svg 内容完全跳过", () => {
      expect(
        convertHtmlToMarkdown("<svg><title>icon</title></svg><p>Text</p>"),
      ).toBe("Text");
    });

    it("HTML 注释被忽略", () => {
      expect(convertHtmlToMarkdown("<!-- comment --><p>Text</p>")).toBe("Text");
    });
  });

  describe("通用包裹标签", () => {
    it("div/section 等递归但不产出任何语法", () => {
      expect(convertHtmlToMarkdown("<div><p>Inside</p></div>")).toBe("Inside");
    });

    it("span 等内联包裹标签同样透传、不产出语法", () => {
      expect(convertHtmlToMarkdown("<span>Hello <b>World</b></span>")).toBe(
        "Hello **World**",
      );
    });
  });

  describe("空白折叠", () => {
    it("正文里连续的空白/换行折叠成单个空格", () => {
      expect(convertHtmlToMarkdown("<p>Hello   \n\n  World</p>")).toBe(
        "Hello World",
      );
    });

    it("块级兄弟节点之间的纯空白文本节点被丢弃", () => {
      expect(
        convertHtmlToMarkdown("<div>\n  <p>A</p>\n  <p>B</p>\n</div>"),
      ).toBe("A\n\nB");
    });
  });

  describe("完整文档 vs 片段", () => {
    it("粘贴完整文档时只转换 body 内容，忽略 head", () => {
      expect(
        convertHtmlToMarkdown(
          "<html><head><title>Page Title</title></head>" +
            "<body><h1>Heading</h1><p>Body text</p></body></html>",
        ),
      ).toBe("# Heading\n\nBody text");
    });

    it("不带 html/body 包裹的片段也能正常转换", () => {
      expect(convertHtmlToMarkdown("<h1>Heading</h1><p>Body text</p>")).toBe(
        "# Heading\n\nBody text",
      );
    });
  });

  describe("畸形/未闭合标签的容错", () => {
    it("ul 里 li 未闭合也能正确解析", () => {
      expect(convertHtmlToMarkdown("<ul><li>A<li>B</ul>")).toBe("- A\n- B");
    });

    it("表格里 td 未闭合也能正确解析", () => {
      expect(
        convertHtmlToMarkdown(
          "<table><tr><td>A<td>B</tr><tr><td>1<td>2</tr></table>",
        ),
      ).toBe("| A | B |\n| --- | --- |\n| 1 | 2 |");
    });
  });

  describe("正文转义", () => {
    it("行首字面标记被转义，不被读成标题/列表/引用", () => {
      expect(convertHtmlToMarkdown("<p># Not a heading</p>")).toBe(
        "\\# Not a heading",
      );
      expect(convertHtmlToMarkdown("<p>- Not a bullet</p>")).toBe(
        "\\- Not a bullet",
      );
      expect(convertHtmlToMarkdown("<p>&gt; Not a quote</p>")).toBe(
        "\\> Not a quote",
      );
      expect(convertHtmlToMarkdown("<p>1. Not a list</p>")).toBe(
        "1\\. Not a list",
      );
    });

    it("标题/正文中间出现的 # 不被转义", () => {
      expect(convertHtmlToMarkdown("<p>C# 语言</p>")).toBe("C# 语言");
    });

    it("正文中出现字面特殊字符时被转义", () => {
      expect(convertHtmlToMarkdown("<p>Use * and _ here</p>")).toBe(
        "Use \\* and \\_ here",
      );
    });

    it("我们自己生成的列表语法不会被反过来转义掉", () => {
      expect(convertHtmlToMarkdown("<ul><li>A</li></ul>")).toBe("- A");
    });
  });
});

describe("escapeMarkdownText", () => {
  it("转义反斜杠、反引号、星号、下划线、方括号、尖括号", () => {
    expect(
      escapeMarkdownText("Use * and _ and ` and [ ] and < carefully"),
    ).toBe("Use \\* and \\_ and \\` and \\[ \\] and \\< carefully");
  });

  it("普通字母数字文本原样不变", () => {
    expect(escapeMarkdownText("plain text 123")).toBe("plain text 123");
  });
});

describe("escapeLineStartMarkers", () => {
  it("行首的标题/列表/引用标记被转义", () => {
    expect(escapeLineStartMarkers("# heading-like")).toBe("\\# heading-like");
    expect(escapeLineStartMarkers("- bullet-like")).toBe("\\- bullet-like");
    expect(escapeLineStartMarkers("1. ordered-like")).toBe("1\\. ordered-like");
    expect(escapeLineStartMarkers("10) ordered-like")).toBe(
      "10\\) ordered-like",
    );
    expect(escapeLineStartMarkers("> quote-like")).toBe("\\> quote-like");
  });

  it("同样的字符出现在行中间时不受影响", () => {
    expect(escapeLineStartMarkers("Regular text")).toBe("Regular text");
    expect(escapeLineStartMarkers("line one\n# line two")).toBe(
      "line one\n\\# line two",
    );
  });
});

describe("detectCodeLanguage", () => {
  it("从 language-xxx 提取语言", () => {
    expect(detectCodeLanguage("language-typescript")).toBe("typescript");
  });

  it("从 lang-xxx 提取语言", () => {
    expect(detectCodeLanguage("lang-python")).toBe("python");
  });

  it("多个 class 中间也能找到目标 token", () => {
    expect(detectCodeLanguage("hljs language-go extra")).toBe("go");
  });

  it("没有语言 class 时返回空字符串", () => {
    expect(detectCodeLanguage("hljs")).toBe("");
  });

  it("输入为 null/undefined/空字符串时返回空字符串", () => {
    expect(detectCodeLanguage(null)).toBe("");
    expect(detectCodeLanguage(undefined)).toBe("");
    expect(detectCodeLanguage("")).toBe("");
  });
});

describe("collapseWhitespace", () => {
  it("连续空格/tab/换行折叠成单个空格", () => {
    expect(collapseWhitespace("a   b\n\nc\td")).toBe("a b c d");
  });

  it("已经是单个空格时保持不变", () => {
    expect(collapseWhitespace("no extra space")).toBe("no extra space");
  });
});
