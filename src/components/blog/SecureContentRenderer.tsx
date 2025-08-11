import React from "react";
import parse, {
  HTMLReactParserOptions,
  Element,
  domToReact,
  DOMNode,
} from "html-react-parser";
import Image from "next/image";

interface SecureContentRendererProps {
  content: string;
  className?: string;
}

const SecureContentRenderer: React.FC<SecureContentRendererProps> = ({
  content,
  className = "",
}) => {
  const options: HTMLReactParserOptions = {
    replace: (domNode) => {
      if (domNode instanceof Element && domNode.name) {
        const { name, attribs, children } = domNode;

        // Type guard to ensure children are DOMNodes
        const validChildren = children.filter((child): child is DOMNode => {
          return child && typeof child === "object" && "type" in child;
        });

        if (name === "h1") {
          return (
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 leading-tight mb-8 mt-12">
              {domToReact(validChildren, options)}
            </h1>
          );
        }

        if (name === "h2") {
          return (
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 leading-tight mb-6 mt-10">
              {domToReact(validChildren, options)}
            </h2>
          );
        }

        if (name === "h3") {
          return (
            <h3 className="text-2xl md:text-3xl font-semibold text-gray-900 leading-tight mb-5 mt-8">
              {domToReact(validChildren, options)}
            </h3>
          );
        }

        if (name === "h4") {
          return (
            <h4 className="text-xl md:text-2xl font-semibold text-gray-900 leading-tight mb-4 mt-6">
              {domToReact(validChildren, options)}
            </h4>
          );
        }

        if (name === "h5") {
          return (
            <h5 className="text-lg md:text-xl font-semibold text-gray-900 leading-tight mb-3 mt-5">
              {domToReact(validChildren, options)}
            </h5>
          );
        }

        if (name === "h6") {
          return (
            <h6 className="text-base md:text-lg font-semibold text-gray-900 leading-tight mb-3 mt-4">
              {domToReact(validChildren, options)}
            </h6>
          );
        }

        if (name === "p") {
          return (
            <p className="text-lg md:text-xl text-gray-800 leading-relaxed mb-6 font-normal">
              {domToReact(validChildren, options)}
            </p>
          );
        }

        if (name === "img") {
          const isBase64 = attribs.src?.startsWith("data:image");
          const imageWidth = attribs.width ? parseInt(attribs.width) : 400;
          const imageHeight = attribs.height ? parseInt(attribs.height) : 200;

          return (
            <figure className="my-12 text-center">
              {isBase64 ? (
                // For base64 images, use regular img tag
                <img
                  src={attribs.src}
                  alt={attribs.alt || ""}
                  className="max-w-full h-auto mx-auto rounded-lg shadow-lg"
                  loading="lazy"
                />
              ) : (
                // For regular URLs, use Next.js Image
                <Image
                  src={attribs.src || "/placeholder-image.jpg"}
                  alt={attribs.alt || ""}
                  width={imageWidth}
                  height={imageHeight}
                  className="max-w-full h-auto mx-auto rounded-lg shadow-lg"
                  loading="lazy"
                  unoptimized={true}
                />
              )}
              {attribs.alt && (
                <figcaption className="text-sm text-gray-600 mt-4 italic">
                  {attribs.alt}
                </figcaption>
              )}
            </figure>
          );
        }

        if (name === "blockquote") {
          return (
            <blockquote className="border-l-4 border-gray-900 pl-8 py-4 my-8 italic text-xl md:text-2xl text-gray-700 font-light">
              {domToReact(validChildren, options)}
            </blockquote>
          );
        }

        if (name === "ul") {
          return (
            <ul className="space-y-2 mb-6 pl-6 list-disc">
              {domToReact(validChildren, options)}
            </ul>
          );
        }

        if (name === "ol") {
          return (
            <ol className="space-y-2 mb-6 pl-6 list-decimal">
              {domToReact(validChildren, options)}
            </ol>
          );
        }

        if (name === "li") {
          return (
            <li className="text-lg md:text-xl text-gray-800 leading-relaxed">
              {domToReact(validChildren, options)}
            </li>
          );
        }

        if (name === "strong" || name === "b") {
          return (
            <strong className="font-semibold text-gray-900">
              {domToReact(validChildren, options)}
            </strong>
          );
        }

        if (name === "em" || name === "i") {
          return (
            <em className="italic">{domToReact(validChildren, options)}</em>
          );
        }

        if (name === "a") {
          return (
            <a
              href={attribs.href}
              className="text-green-600 underline hover:text-green-800 transition-colors"
              target={attribs.target || "_self"}
              rel={
                attribs.target === "_blank" ? "noopener noreferrer" : undefined
              }
            >
              {domToReact(validChildren, options)}
            </a>
          );
        }

        if (name === "pre") {
          return (
            <pre className="bg-gray-100 p-6 rounded-lg overflow-x-auto my-8 text-sm border">
              {domToReact(validChildren, options)}
            </pre>
          );
        }

        if (name === "code") {
          return (
            <code className="bg-gray-100 px-2 py-1 rounded text-sm font-mono text-red-600">
              {domToReact(validChildren, options)}
            </code>
          );
        }

        if (name === "hr") {
          return <hr className="border-gray-300 my-12" />;
        }

        if (name === "table") {
          return (
            <div className="overflow-x-auto my-8">
              <table className="min-w-full border-collapse border border-gray-300">
                {domToReact(validChildren, options)}
              </table>
            </div>
          );
        }

        if (name === "thead") {
          return (
            <thead className="bg-gray-50">
              {domToReact(validChildren, options)}
            </thead>
          );
        }

        if (name === "tbody") {
          return <tbody>{domToReact(validChildren, options)}</tbody>;
        }

        if (name === "tr") {
          return (
            <tr className="border-b border-gray-200">
              {domToReact(validChildren, options)}
            </tr>
          );
        }

        if (name === "th") {
          return (
            <th className="border border-gray-300 px-4 py-3 text-left font-semibold text-gray-900 bg-gray-50">
              {domToReact(validChildren, options)}
            </th>
          );
        }

        if (name === "td") {
          return (
            <td className="border border-gray-300 px-4 py-3 text-gray-800">
              {domToReact(validChildren, options)}
            </td>
          );
        }

        if (name === "div") {
          return (
            <div className="mb-4">{domToReact(validChildren, options)}</div>
          );
        }

        if (name === "span") {
          return <span>{domToReact(validChildren, options)}</span>;
        }
      }

      return undefined;
    },
  };

  return (
    <div className={`prose-custom ${className}`}>{parse(content, options)}</div>
  );
};

export default SecureContentRenderer;
