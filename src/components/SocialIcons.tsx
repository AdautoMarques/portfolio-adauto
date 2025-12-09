"use client";

import { motion } from "framer-motion";
import { FaInstagram, FaLinkedin, FaGithub, FaWhatsapp } from "react-icons/fa";

export default function SocialIcons() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 1, duration: 1 }}
      className="flex gap-6 mt-10 z-10 items-center justify-center md:justify-start"
    >
      {/* Instagram */}
      <a href="#" target="_blank" rel="noopener noreferrer">
        <FaInstagram className="text-3xl text-pink-400 hover:text-pink-300 drop-shadow-md transition-colors" />
      </a>

      {/* LinkedIn */}
      <a href="#" target="_blank" rel="noopener noreferrer">
        <FaLinkedin className="text-3xl text-blue-400 hover:text-blue-300 drop-shadow-md transition-colors" />
      </a>

      {/* GitHub */}
      <a href="#" target="_blank" rel="noopener noreferrer">
        <FaGithub className="text-3xl text-gray-300 hover:text-white drop-shadow-md transition-colors" />
      </a>

      {/* WhatsApp flutuante */}
      <a
        href="https://wa.me/5514997996598?text=Olá!%20Vim%20pelo%20seu%20portfólio"
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-6 right-6 bg-green-500 text-white p-4 rounded-full shadow-lg hover:scale-110 hover:shadow-[0_0_15px_#0fa32c] transition-all"
      >
        <FaWhatsapp size={24} />
      </a>
    </motion.div>
  );
}
