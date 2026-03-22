"use client";

import Link from "next/link";
import { motion } from "framer-motion";

export default function AboutPage() {
  const missions = [
    {
      title: "Melestarikan Memori Keluarga",
      description: "Menjadi arsip digital abadi yang menyimpan nama, wajah, dan cerita agar tak ada lagi kisah yang tenggelam oleh waktu.",
      icon: "👨‍👩‍👧‍👦",
    },
    {
      title: "Memperkuat Ikatan Lintas Generasi",
      description: "Menjembatani komunikasi antara kakek-nenek di kampung dengan cucu-cucu di rantau melintasi jarak dan waktu.",
      icon: "🤝",
    },
    {
      title: "Menghidupkan Narasi Sejarah Bangsa",
      description: "Ribuan pohon keluarga yang terhubung akan membentuk sejarah Indonesia yang hidup, ditulis oleh rakyatnya sendiri.",
      icon: "📜",
    },
    {
      title: "Merayakan Keberagaman Budaya",
      description: "Menyediakan ruang bagi kekayaan panggilan keluarga dalam berbagai bahasa daerah yang mewarnai perjalanan bangsa.",
      icon: "🌏",
    },
    {
      title: "Menginspirasi Masa Depan",
      description: "Silsilah bukan hanya catatan masa lalu, tapi inspirasi bagi setiap keluarga untuk menorehkan tinta emas mereka sendiri.",
      icon: "🧭",
    },
  ];

  const culturalTerms = [
    { term: "Kakek / Nenek", variants: ["Eyang", "Opa/Oma", "Akung/Uti", "Abah/Ambu", "Opung", "Datuk"] },
    { term: "Ayah / Ibu", variants: ["Bapak/Emak", "Papa/Mama", "Romo/Simbah", "Papi/Mami", "Ama/Ina"] },
    { term: "Paman / Bibi", variants: ["Pakde/Bude", "Om/Tante", "Amang/Inang", "Tulang/Bou", "Cing/Nyak"] },
  ];

  return (
    <div className="min-h-screen bg-[var(--background)]">
      {/* Hero Section */}
      <section className="relative h-[80vh] flex items-center justify-center overflow-hidden bg-[#0f172a]">
        <div 
          className="absolute inset-0 opacity-30 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: "url('https://images.unsplash.com/photo-1529156069894-4d830b5634e1?q=80&w=2070&auto=format&fit=crop')" }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-[#0f172a]/90" />
        
        <div className="relative z-10 container mx-auto px-6 text-center">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-6xl font-extrabold text-white mb-6 leading-tight"
          >
            Merajut Nusantara dalam <br />
            <span className="text-[var(--primary)]">Satu Tali Silsilah</span>
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-lg md:text-xl text-slate-300 mb-10 max-w-2xl mx-auto"
          >
            Menelusuri jejak, Merajut Nusantara. Sebuah rumah digital bagi setiap keluarga Indonesia untuk merawat cerita leluhur.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <Link 
              href="/register" 
              className="px-8 py-4 bg-[var(--primary)] text-white font-bold rounded-full hover:bg-[var(--primary-dark)] transition-all shadow-lg hover:shadow-[var(--primary-rgb)]/50"
            >
              Mulai Pohon Keluargamu
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Visi Section */}
      <section className="py-24 bg-white dark:bg-[#1a1a1a]">
        <div className="container mx-auto px-6 max-w-4xl text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
          >
            <span className="text-5xl text-[var(--primary)] opacity-20 font-serif mb-4 block">"</span>
            <h2 className="text-3xl md:text-4xl font-serif italic text-slate-800 dark:text-slate-100 leading-relaxed mb-6">
              Menjadi jembatan ingatan nusantara yang menghubungkan masa lalu, masa kini, dan masa depan—sebuah rumah digital bagi setiap keluarga Indonesia untuk menyimpan, merawat, dan mewariskan cerita leluhur.
            </h2>
            <div className="w-24 h-1 bg-[var(--primary)] mx-auto mb-6" />
            <p className="text-slate-600 dark:text-slate-400 text-lg">
              Dari silsilah lahir jati diri. Dari jati diri lahir rasa hormat. Dan dari rasa hormat lahir generasi yang kokoh berakar.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Misi Section */}
      <section className="py-24 bg-slate-50 dark:bg-[#121212]">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">Misi Kami</h2>
            <p className="text-slate-500 max-w-2xl mx-auto">
              Langkah-langkah strategis kami untuk mewujudkan visi melestarikan sejarah rakyat Indonesia.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {missions.map((misi, idx) => (
              <motion.div 
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                className="bg-white dark:bg-[#1e1e1e] p-8 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800 hover:shadow-md transition-shadow"
              >
                <div className="text-4xl mb-6">{misi.icon}</div>
                <h3 className="text-xl font-bold mb-4">{misi.title}</h3>
                <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                  {misi.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Cultural Terms Section */}
      <section className="py-24 bg-white dark:bg-[#1a1a1a] overflow-hidden">
        <div className="container mx-auto px-6">
          <div className="flex flex-col lg:flex-row items-center gap-16">
            <div className="lg:w-1/2">
              <h2 className="text-3xl font-bold mb-6 italic">Merayakan Keberagaman <br />Bahasa & Budaya</h2>
              <p className="text-slate-600 dark:text-slate-400 text-lg leading-relaxed mb-8">
                Setiap suku punya panggilannya sendiri untuk "kakek", "nenek", "buyut". Kami menyediakan ruang bagi kekayaan itu—dalam bahasa Jawa, Batak, Sansekerta, Belanda, Jepang, Inggris, dan bahasa-bahasa lain yang mewarnai perjalanan bangsa.
              </p>
              <div className="flex flex-wrap gap-3">
                {["Jawa", "Batak", "Melayu", "Bugis", "Minang", "Sunda", "Siauw"].map(suku => (
                  <span key={suku} className="px-4 py-1.5 bg-slate-100 dark:bg-slate-800 rounded-full text-sm font-medium">#{suku}</span>
                ))}
              </div>
            </div>
            
            <div className="lg:w-1/2 grid grid-cols-1 gap-4">
              {culturalTerms.map((item, idx) => (
                <motion.div 
                  key={idx}
                  whileHover={{ x: 10 }}
                  className="p-6 bg-[var(--primary)]/5 rounded-2xl border border-[var(--primary)]/10"
                >
                  <h4 className="font-bold text-[var(--primary)] mb-3">{item.term}</h4>
                  <div className="flex flex-wrap gap-2">
                    {item.variants.map(v => (
                      <span key={v} className="px-3 py-1 bg-white dark:bg-slate-900 shadow-sm rounded-lg text-sm">{v}</span>
                    ))}
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Nusantara Quote */}
      <section className="py-24 bg-[#0f172a] text-white text-center">
        <div className="container mx-auto px-6 max-w-4xl">
          <h2 className="text-3xl md:text-4xl font-bold mb-8 italic">
            "Satu pohon keluarga mungkin menceritakan satu garis darah. Namun ribuan pohon keluarga yang terhubung akan membentuk kanopi raksasa—sejarah Indonesia yang hidup."
          </h2>
          <p className="text-slate-400 text-lg mb-12">
            Di balik setiap nama ada cerita. Di balik setiap cerita ada Indonesia.
          </p>
          <Link 
            href="/register" 
            className="px-8 py-4 border-2 border-[var(--primary)] text-[var(--primary)] hover:bg-[var(--primary)] hover:text-white font-bold rounded-full transition-all"
          >
            Gabung Sekarang
          </Link>
        </div>
      </section>
    </div>
  );
}
