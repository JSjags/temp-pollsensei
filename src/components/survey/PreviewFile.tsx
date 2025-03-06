import { pdf_svgrepo_com } from "@/assets/images";
import Image from "next/image";
import Link from "next/link";
import React, { useState, useEffect } from "react";
import { FaFilePdf } from "react-icons/fa6";
import { motion, AnimatePresence } from "framer-motion";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Eye, Download, ZoomIn, ZoomOut } from "lucide-react";

interface PreviewFileProps {
  data: Array<string | { src: string }>;
}

const PreviewFile: React.FC<PreviewFileProps> = ({ data }) => {
  const [activeImage, setActiveImage] = useState<
    string | { src: string } | null
  >(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showFullPreview, setShowFullPreview] = useState(false);
  const [zoomLevel, setZoomLevel] = useState(1);
  const [isDragging, setIsDragging] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    if (data?.length) {
      setActiveImage(data[0]);
      setIsLoading(false);
    }
  }, [data]);

  const handleThumbnailClick = (file: string | { src: string }) => {
    setIsLoading(true);
    setActiveImage(file);
    setZoomLevel(1);
    setPosition({ x: 0, y: 0 });
    setTimeout(() => setIsLoading(false), 300);
  };

  const handleZoom = (direction: "in" | "out") => {
    setZoomLevel((prev) => {
      const newZoom = direction === "in" ? prev + 0.25 : prev - 0.25;
      return Math.min(Math.max(newZoom, 0.5), 3);
    });
  };

  const handleDragStart = () => setIsDragging(true);
  const handleDragEnd = () => setIsDragging(false);
  const handleDrag = (event: any, info: any) => {
    if (zoomLevel > 1) {
      setPosition({
        x: position.x + info.delta.x,
        y: position.y + info.delta.y,
      });
    }
  };

  const handleDownload = () => {
    const imageUrl =
      typeof activeImage === "string" ? activeImage : activeImage?.src;
    if (imageUrl) {
      const link = document.createElement("a");
      link.href = imageUrl;
      link.download = "preview-image";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  if (!data?.length) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="flex items-center justify-center w-full h-[50vh] bg-gradient-to-br from-purple-50 to-gray-50 rounded-lg"
      >
        <p className="text-xl font-medium text-gray-600">
          No files available for preview
        </p>
      </motion.div>
    );
  }

  const isPDF = (file: any): boolean =>
    typeof file === "string" && file.includes("pdf");

  const imageVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: { opacity: 1, scale: 1, transition: { duration: 0.5 } },
    exit: { opacity: 0, scale: 0.8, transition: { duration: 0.3 } },
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col items-center w-full mt-5 space-y-6 px-4"
    >
      <AnimatePresence mode="wait">
        <motion.div
          key={typeof activeImage === "string" ? activeImage : activeImage?.src}
          variants={imageVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
          className="w-full"
        >
          {isPDF(activeImage) ? (
            <div className="relative border-2 border-purple-400 rounded-lg overflow-hidden flex items-center justify-center text-center p-4 mb-4 w-full h-[320px] group transition-all duration-300 hover:shadow-xl bg-gradient-to-br from-purple-50 to-white">
              <Image
                src={pdf_svgrepo_com}
                alt="PDF preview"
                className="w-full h-auto transition-transform duration-300 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-black opacity-0 group-hover:opacity-50 transition-opacity duration-300" />
              <Link
                href={activeImage as string}
                target="_blank"
                rel="noopener noreferrer"
                className="absolute inset-0 flex items-center justify-center text-white text-2xl font-semibold opacity-0 group-hover:opacity-100 transition-opacity duration-300"
              >
                View PDF Document
              </Link>
            </div>
          ) : (
            <div className="relative border-2 border-purple-400 rounded-lg overflow-hidden p-2 mb-4 w-full h-[320px] group transition-all duration-300 hover:shadow-xl bg-gradient-to-br from-purple-50 to-white">
              <motion.div
                drag={zoomLevel > 1}
                dragMomentum={false}
                onDragStart={handleDragStart}
                onDragEnd={handleDragEnd}
                onDrag={handleDrag}
                style={{
                  scale: zoomLevel,
                  x: position.x,
                  y: position.y,
                  cursor: zoomLevel > 1 ? "grab" : "default",
                }}
                className="w-full h-full"
              >
                <Image
                  src={
                    typeof activeImage === "string"
                      ? activeImage
                      : activeImage?.src || ""
                  }
                  alt="Preview"
                  className="w-full h-full object-contain transition-all duration-300"
                  width={800}
                  height={600}
                  priority
                  quality={100}
                />
              </motion.div>

              <div className="absolute bottom-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => handleZoom("out")}
                  className="p-2 bg-white/90 rounded-full shadow-lg hover:bg-white"
                  disabled={zoomLevel <= 0.5}
                >
                  <ZoomOut className="w-5 h-5 text-gray-700" />
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => handleZoom("in")}
                  className="p-2 bg-white/90 rounded-full shadow-lg hover:bg-white"
                  disabled={zoomLevel >= 3}
                >
                  <ZoomIn className="w-5 h-5 text-gray-700" />
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={handleDownload}
                  className="p-2 bg-white/90 rounded-full shadow-lg hover:bg-white"
                >
                  <Download className="w-5 h-5 text-gray-700" />
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => setShowFullPreview(true)}
                  className="p-2 bg-white/90 rounded-full shadow-lg hover:bg-white"
                >
                  <Eye className="w-5 h-5 text-gray-700" />
                </motion.button>
              </div>
            </div>
          )}
        </motion.div>
      </AnimatePresence>

      <Dialog open={showFullPreview} onOpenChange={setShowFullPreview}>
        <DialogContent className="max-w-[90vw] max-h-[90vh] p-0 z-[100000] overflow-hidden bg-black/95">
          <motion.div
            className="relative w-full h-full"
            drag
            dragConstraints={{ left: 0, right: 0, top: 0, bottom: 0 }}
          >
            <Image
              src={
                typeof activeImage === "string"
                  ? activeImage
                  : activeImage?.src || ""
              }
              alt="Full Preview"
              className="w-full h-auto"
              width={1200}
              height={800}
              quality={100}
            />
          </motion.div>
        </DialogContent>
      </Dialog>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="flex flex-wrap gap-4 justify-center p-4 bg-white/50 rounded-xl backdrop-blur-sm"
      >
        {data.map((file, index) => {
          if (isPDF(file)) {
            return (
              <motion.div
                key={index}
                whileHover={{ scale: 1.05, rotate: 2 }}
                whileTap={{ scale: 0.95 }}
              >
                <Link
                  href={file as string}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block p-3 bg-gradient-to-br from-purple-100 to-purple-50 rounded-lg hover:shadow-lg transition-all duration-300"
                >
                  <FaFilePdf size={32} className="text-purple-600" />
                </Link>
              </motion.div>
            );
          }

          return (
            <motion.button
              key={index}
              whileHover={{ scale: 1.05, rotate: 2 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => handleThumbnailClick(file)}
              className={`relative overflow-hidden rounded-lg ${
                activeImage === file
                  ? "ring-2 ring-purple-600 ring-offset-2"
                  : "hover:ring-2 hover:ring-purple-400 hover:ring-offset-2"
              } transition-all duration-300 shadow-sm hover:shadow-lg`}
            >
              <Image
                src={typeof file === "string" ? file : file.src}
                alt="Thumbnail"
                className="w-20 h-20 object-cover"
                width={80}
                height={80}
                quality={80}
              />
              {isLoading && activeImage === file && (
                <div className="absolute inset-0 bg-white/80 backdrop-blur-sm flex items-center justify-center">
                  <div className="w-6 h-6 border-2 border-purple-600 border-t-transparent rounded-full animate-spin" />
                </div>
              )}
            </motion.button>
          );
        })}
      </motion.div>
    </motion.div>
  );
};

export default PreviewFile;
