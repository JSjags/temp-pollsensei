"use client";

import React, { useState } from "react";
import { HiDotsVertical } from "react-icons/hi";
import { FiChevronDown, FiChevronRight } from "react-icons/fi";
import { Modal } from "./Modal";

interface AccordionItemProps {
  question: string;
  answer: string;
}

const AccordionItem: React.FC<AccordionItemProps> = ({ question, answer }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [showMenu, setShowMenu] = useState(false);

  const toggleAccordion = () => setIsOpen(!isOpen);

  return (
    <div className="border border-gray-300 rounded-lg mb-4 shadow-sm w-full">
      <div className="flex justify-between items-center p-4 cursor-pointer" onClick={toggleAccordion}>
        <div className="flex items-center gap-4">
          <button
            className="p-2 text-gray-600 rounded-full hover:bg-gray-100"
            onClick={(e) => {
              e.stopPropagation();
              setShowMenu(true);
            }}
          >
            <HiDotsVertical size={18} />
          </button>
          {showMenu && (
            <Modal onClose={() => setShowMenu(false)}>
              <div className="p-4 flex flex-col gap-3">
                <button className="text-gray-600 hover:text-gray-900 flex items-center gap-2">
                  <span>Edit</span>
                </button>
                <button className="text-gray-600 hover:text-gray-900 flex items-center gap-2">
                  <span>{isOpen ? "Unpublish" : "Publish"}</span>
                </button>
                <button className="text-red-600 hover:text-red-900 flex items-center gap-2">
                  <span>Delete</span>
                </button>
              </div>
            </Modal>
          )}
        </div>
        <div className="flex-1 text-gray-800 font-semibold text-sm">{question}</div>
        <button className="p-2 text-gray-600 rounded-full hover:bg-gray-100">
          {isOpen ? <FiChevronDown size={18} /> : <FiChevronRight size={18} />}
        </button>
      </div>
      {isOpen && (
        <div className="p-4 bg-gray-50 text-gray-600 text-sm">
          {answer}
        </div>
      )}
    </div>
  );
};

interface AccordionProps {
  items: AccordionItemProps[];
}

const FaqAccordion: React.FC<AccordionProps> = ({ items }) => {
  return (
    <div className="w-full">
      {items?.map((item, index) => (
        <AccordionItem key={index} {...item} />
      ))}
    </div>
  );
};

export default FaqAccordion;
