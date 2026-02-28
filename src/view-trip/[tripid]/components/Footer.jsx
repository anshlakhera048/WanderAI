import React from 'react'
import { motion } from 'framer-motion'
import { FaGithub, FaLinkedin, FaInstagram, FaHeart } from 'react-icons/fa'
import { IoSparkles } from 'react-icons/io5'

function Footer() {
  return (
    <footer className="w-full mt-20 relative overflow-hidden">
      {/* Gradient Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-secondary/5 to-accent/5 dark:from-primary/10 dark:via-secondary/10 dark:to-accent/10" />
      
      {/* Decorative Top Border */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary to-transparent dark:via-accent" />
      
      <div className="relative max-w-screen-xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-center">
          {/* Brand Section */}
          <motion.div
            className="flex flex-col items-center md:items-start gap-3"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <div className="flex items-center gap-2">
              <img src="/new.svg" alt="WanderAI Logo" className="h-8 w-auto" />
              <span className="font-bold text-lg gradient-text"></span>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400 text-center md:text-left">
              AI-powered travel planning for unforgettable journeys
            </p>
          </motion.div>

          {/* Creator Section */}
          <motion.div
            className="flex flex-col items-center gap-3"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <div className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
              <span className="text-sm font-medium">Created with</span>
              <motion.div
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 1, repeat: Infinity, repeatDelay: 2 }}
              >
                <FaHeart className="text-red-500 text-lg" />
              </motion.div>
              <span className="text-sm font-medium">by</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-primary to-accent rounded-full blur-md opacity-50" />
                <span className="relative font-bold text-lg bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                  Ansh Lakhera
                </span>
              </div>
            </div>
          </motion.div>

          {/* Social Links */}
          <motion.div
            className="flex items-center justify-center md:justify-end gap-3"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <motion.a
              href="https://github.com/anshlakhera048"
              target="_blank"
              rel="noopener noreferrer"
              className="p-3 rounded-full glass hover:bg-primary/10 dark:hover:bg-accent/20 transition-all group"
              whileHover={{ scale: 1.1, rotate: 5 }}
              whileTap={{ scale: 0.9 }}
            >
              <FaGithub className="text-gray-700 dark:text-gray-300 text-lg group-hover:text-primary dark:group-hover:text-accent transition-colors" />
            </motion.a>
            <motion.a
              href="https://www.linkedin.com/in/ansh-lakhera/"
              target="_blank"
              rel="noopener noreferrer"
              className="p-3 rounded-full glass hover:bg-primary/10 dark:hover:bg-accent/20 transition-all group"
              whileHover={{ scale: 1.1, rotate: 5 }}
              whileTap={{ scale: 0.9 }}
            >
              <FaLinkedin className="text-gray-700 dark:text-gray-300 text-lg group-hover:text-primary dark:group-hover:text-accent transition-colors" />
            </motion.a>
            <motion.a
              href="https://www.instagram.com/me.ansh048/"
              target="_blank"
              rel="noopener noreferrer"
              className="p-3 rounded-full glass hover:bg-primary/10 dark:hover:bg-accent/20 transition-all group"
              whileHover={{ scale: 1.1, rotate: 5 }}
              whileTap={{ scale: 0.9 }}
            >
              <FaInstagram className="text-gray-700 dark:text-gray-300 text-lg group-hover:text-primary dark:group-hover:text-accent transition-colors" />
            </motion.a>
          </motion.div>
        </div>

        {/* Bottom Section */}
        <motion.div
          className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700 flex flex-col sm:flex-row items-center justify-between gap-4"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <p className="text-xs text-gray-500 dark:text-gray-400">
            © {new Date().getFullYear()} WanderAI. All rights reserved.
          </p>
          <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
            <IoSparkles className="text-accent" />
            <span>Powered by AI</span>
          </div>
        </motion.div>
      </div>
    </footer>
  );
}

export default Footer;
