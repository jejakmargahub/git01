"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { TbFileDescription, TbHierarchy, TbTrees, TbCompass } from "react-icons/tb";

const BatikPattern = () => (
  <svg 
    width="100%" 
    height="100%" 
    xmlns="http://www.w3.org/2000/svg" 
    className="absolute inset-0 opacity-[0.06] pointer-events-none mix-blend-screen"
  >
    <defs>
      <pattern id="mega-mendung" patternUnits="userSpaceOnUse" width="160" height="100">
        <path d="M40 80 Q 20 80 10 60 Q 0 40 20 20 Q 40 0 70 20 Q 100 40 80 60 Q 60 80 40 80 Z" fill="none" stroke="white" strokeWidth="2" />
        <path d="M50 70 Q 35 70 25 55 Q 15 40 30 25 Q 45 10 70 30 Q 95 50 75 65 Q 55 75 50 70 Z" fill="none" stroke="white" strokeWidth="1" opacity="0.6" />
        
        <path d="M120 40 Q 100 40 90 20 Q 80 0 100 -20 Q 120 -40 150 -20 Q 180 0 160 20 Q 140 40 120 40 Z" fill="none" stroke="white" strokeWidth="2" />
        <path d="M130 30 Q 115 30 105 15 Q 95 0 110 -15 Q 125 -30 150 -10 Q 175 10 155 25 Q 135 35 130 30 Z" fill="none" stroke="white" strokeWidth="1" opacity="0.6" />
      </pattern>
    </defs>
    <rect width="100%" height="100%" fill="url(#mega-mendung)" />
  </svg>
);

const WaveDivider = () => (
  <div className="absolute bottom-0 left-0 w-full overflow-hidden leading-[0] z-20">
    <svg 
      viewBox="0 0 1200 120" 
      preserveAspectRatio="none" 
      className="block w-full h-[60px] md:h-[100px] text-[#F8FAFC] fill-current"
    >
      <path d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V120H0V0C50,22,100,50,150,60,200,70,250,70,321.39,56.44Z"></path>
    </svg>
  </div>
);

export default function AboutPage() {
  const missions = [
    {
      title: "Melestarikan Kenangan Keluarga",
      description: "Menjadi arsip digital abadi yang menyimpan nama, wajah, dan cerita tak ada lagi tenggelam oleh waktu.",
      icon: <TbFileDescription className="w-14 h-14 md:w-16 md:h-16 stroke-[1.2]" />,
    },
    {
      title: "Memperkuat Ikatan Lintas Generasi",
      description: "Menjembatani komunikasi antara kakek-nenek di kampung dengan cucu-cucu di rantau melintasi jarak dan waktu.",
      icon: <TbHierarchy className="w-14 h-14 md:w-16 md:h-16 stroke-[1.2]" />,
    },
    {
      title: "Menghidupkan Narasi Sejarah Bangsa",
      description: "Ribuan pohon keluarga yang terhubung akan membentuk sejarah masyarakat Indonesia.",
      icon: <TbTrees className="w-14 h-14 md:w-16 md:h-16 stroke-[1.2]" />,
    },
    {
      title: "Menginspirasi Masa Depan",
      description: "Silsilah bukan hanya catatan masa lalu, tapi inspirasi bagi setiap keluarga untuk menorehkan tinta emas mereka sendiri.",
      icon: <TbCompass className="w-14 h-14 md:w-16 md:h-16 stroke-[1.2]" />,
    },
  ];

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      {/* Hero Section */}
      <section className="relative pt-32 pb-56 md:pt-48 md:pb-72 bg-[#1B4B82] overflow-hidden">
        <BatikPattern />
        
        <div className="relative z-30 container mx-auto px-6 md:px-12 max-w-5xl">
          <motion.h1 
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            className="text-5xl md:text-8xl font-black text-white mb-8 leading-[0.9] tracking-tighter"
          >
            Jejak <br /> 
            <span className="opacity-95">Keluarga</span>
          </motion.h1>
          
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-lg md:text-xl text-blue-50/80 mb-10 max-w-xl leading-relaxed font-light"
          >
            Menelusuri jejak keluarga di Nusantara Indonesia. Sebuah rumah digital bagi setiap keluarga Indonesia untuk merawat cerita leluhur dan orang orang terkasih.
          </motion.p>
          
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.4 }}
          >
            <Link 
              href="/register" 
              className="inline-block px-8 py-4 bg-[#2563EB] text-white text-base md:text-lg font-bold rounded-xl hover:bg-blue-600 transition-all shadow-lg hover:shadow-blue-500/20 active:scale-95"
            >
              Mulai Pohon Keluargamu
            </Link>
          </motion.div>
        </div>
        
        <WaveDivider />
      </section>

      {/* Quote & Content Section */}
      <section className="relative bg-[#F8FAFC] pb-32">
        <div className="container mx-auto px-6 max-w-3xl">
          
          {/* Main Quote Card */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center pt-16 pb-16 md:pt-20 md:pb-24 px-4"
          >
            <h2 className="text-xl md:text-2xl text-slate-800 leading-relaxed font-semibold italic text-balance">
              "Menelusuri jejak keluarga yang terhubung akan membentuk sejarah masyarakat Indonesia."
            </h2>
          </motion.div>

          <div className="text-center mb-12">
            <h3 className="text-3xl md:text-4xl font-black text-slate-900 tracking-tight">Misi Kami</h3>
          </div>
          
          <div className="flex flex-col gap-6">
            {missions.map((misi, idx) => (
              <motion.div 
                key={idx}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                className="group bg-white p-8 md:p-10 rounded-[32px] shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100 flex flex-col md:flex-row items-center md:items-center text-center md:text-left gap-8 hover:shadow-[0_20px_50px_rgba(0,0,0,0.08)] hover:border-blue-100 transition-all duration-500"
              >
                <div className="flex-shrink-0 text-[#1B4B82] group-hover:scale-110 transition-transform duration-500">
                  {misi.icon}
                </div>
                <div>
                  <h4 className="text-xl md:text-2xl font-bold text-slate-900 mb-3">{misi.title}</h4>
                  <p className="text-slate-500 leading-relaxed text-base md:text-lg font-light">
                    {misi.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
