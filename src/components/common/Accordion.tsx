import { useState } from "react";
import { MdExpandMore, MdExpandLess } from "react-icons/md";

interface AccordionItem {
  question: string;
  answer: string;
}

interface AccordionProps {
  items: AccordionItem[];
}

const Accordion: React.FC<AccordionProps> = ({ items }) => {
  const [isOpen, setIsOpen] = useState<number | null>(null);

  const toggleAccordion = (index: number) => {
    setIsOpen(isOpen === index ? null : index);
  };

  return (
    <div className="bg-[] p-5 rounded-[calc(1rem+4px)] w-full">
      {items.map((item, index) => (
        <div key={index} className="border-b-2 py-4 mb-4">
          <div
            className="flex justify-between w-full items-center cursor-pointer"
            onClick={() => toggleAccordion(index)}
          >
            <h2 className="faq-accordion">{item.question}</h2>
            {isOpen === index ? (
              <MdExpandLess size={20} />
            ) : (
              <MdExpandMore size={20} />
            )}
          </div>
          {isOpen === index && <p className="answer mt-3">{item.answer}</p>}
        </div>
      ))}
    </div>
  );
};

export default Accordion;
