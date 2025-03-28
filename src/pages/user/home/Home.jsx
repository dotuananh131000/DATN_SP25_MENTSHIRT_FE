import { Button } from "@/components/ui/button";
import {motion} from "framer-motion"
import { useEffect, useState } from "react";
const images = [
  "/public/banner1.png",
  "/public/banner4.webp",
  "/public/banner3.png",
]
function Home() {
  const [activeIndex, setActiveIndex] = useState(0);
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % images.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);
    return <>
      <div className="relative w-full min-h-96 overflow-hidden rounded-2xl shadow-lg">
      <motion.div
        className="flex w-full h-full"
        initial={{ x: "100%" }}
        animate={{ x: `-${activeIndex * 100}%` }}
        transition={{ duration: 1, ease: "easeInOut" }}
      >
        {images.map((src, index) => (
          <div key={index} className="w-full h-full flex-shrink-0">
            <motion.img
              src={src}
              alt={`Slide ${index + 1}`}
              className="w-full h-[600px] object-cover rounded-2xl"
            />
          </div>
        ))}
      </motion.div>
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
        {images.map((_, index) => (
          <Button
            key={index}
            variant={activeIndex === index ? "default" : "outline"}
            size="sm"
            onClick={() => setActiveIndex(index)}
            className="w-3 h-3 rounded-full p-0"
          />
        ))}
      </div>
    </div>
    <div>
      
    </div>
    </>
  }
  export default Home;