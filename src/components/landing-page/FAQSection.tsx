import React, { useState, useRef } from "react";
import { motion, AnimatePresence, Variants } from "framer-motion";
import { ChevronDown, Plus, Minus } from "lucide-react";

interface FAQItem {
  question: string;
  answer: string;
}

interface AccordionItemProps {
  item: FAQItem;
  isOpen: boolean;
  onToggle: () => void;
  index: number;
}

// Animation variants
const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.3,
    },
  },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

const titleVariants: Variants = {
  hidden: { opacity: 0, y: -20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: "easeOut",
    },
  },
};

const AccordionItem: React.FC<AccordionItemProps> = ({
  item,
  isOpen,
  onToggle,
  index,
}) => {
  const contentRef = useRef<HTMLDivElement>(null);
  const contentHeight = useRef(0);

  if (contentRef.current) {
    contentHeight.current = contentRef.current.scrollHeight;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      className="mb-4"
    >
      <motion.div
        className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-300"
        whileHover={{ scale: 1.01 }}
        transition={{ duration: 0.2 }}
      >
        <button
          onClick={onToggle}
          className="w-full px-6 py-4 flex justify-between items-center text-left focus:outline-none"
        >
          <span className="text-lg text-black font-medium">
            {item.question}
          </span>
          <motion.div
            initial={false}
            animate={{ rotate: isOpen ? 180 : 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="flex-shrink-0 ml-4"
          >
            {isOpen ? (
              <Minus className="w-5 h-5 text-purple-500" />
            ) : (
              <Plus className="w-5 h-5 text-purple-500" />
            )}
          </motion.div>
        </button>

        <AnimatePresence initial={false}>
          {isOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{
                height: "auto",
                opacity: 1,
                transition: {
                  height: {
                    duration: 0.3,
                    ease: "easeOut",
                  },
                  opacity: {
                    duration: 0.2,
                    delay: 0.1,
                  },
                },
              }}
              exit={{
                height: 0,
                opacity: 0,
                transition: {
                  height: {
                    duration: 0.3,
                    ease: "easeIn",
                  },
                  opacity: {
                    duration: 0.2,
                  },
                },
              }}
              className="overflow-hidden bg-purple-50"
            >
              <div
                ref={contentRef}
                className="px-6 py-4 text-gray-600 leading-relaxed"
                dangerouslySetInnerHTML={{ __html: item.answer }}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </motion.div>
  );
};

const FAQSection: React.FC<{ faqs: FAQItem[] }> = ({ faqs }) => {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const faqsRef = useRef<HTMLDivElement>(null);

  return (
    <section
      ref={faqsRef}
      className="py-16 sm:py-24 bg-gradient-to-b from-purple-50 to-white overflow-hidden"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={containerVariants}
          className="text-center mb-16"
        >
          <motion.div
            variants={itemVariants}
            initial="initial"
            animate="animate"
            className="border-purple-500 w-fit mx-auto border-2 rounded-full py-2 px-6 text-purple-500 font-semibold mb-6 hover:bg-purple-50 transition-colors duration-300"
          >
            FAQs
          </motion.div>

          <motion.h2
            variants={titleVariants}
            className="text-4xl md:text-5xl font-medium leading-tight mb-4 text-black"
          >
            Frequently Asked Questions
          </motion.h2>

          <motion.p
            variants={itemVariants}
            className="text-gray-600 max-w-2xl mx-auto"
          >
            Everything you need to know about the product and billing.
          </motion.p>
        </motion.div>

        <div className="max-w-3xl mx-auto">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="space-y-6"
          >
            {faqs.map((faq, index) => (
              <AccordionItem
                key={index}
                item={faq}
                isOpen={openIndex === index}
                onToggle={() =>
                  setOpenIndex(openIndex === index ? null : index)
                }
                index={index}
              />
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default FAQSection;
