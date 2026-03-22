import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Sparkles } from 'lucide-react';
import PageMeta from '../components/PageMeta';
import { UPCOMING_COURSES } from '../data/upcomingCourses';

export default function Courses() {
  return (
    <>
      <PageMeta
        title="Cursos | ReMakeup Store"
        description="Cursos de maquiagem em pré-lançamento. Aprenda do básico ao profissional com a ReMakeup."
      />
      <div className="min-h-screen bg-gradient-to-b from-gray-50 via-white to-pink-50/30">
        <header className="border-b border-pink-100/80 bg-white/80 backdrop-blur-sm sticky top-0 z-10">
          <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between gap-4">
            <Link
              to="/"
              className="inline-flex items-center gap-2 text-sm font-semibold text-pink-600 hover:text-pink-700 transition"
            >
              <ArrowLeft className="h-4 w-4" />
              Voltar para a loja
            </Link>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-pink-600 text-white font-extrabold flex items-center justify-center text-sm shadow-sm">
                R
              </div>
              <span className="font-extrabold text-gray-900">ReMakeup.</span>
            </div>
          </div>
        </header>

        <main className="max-w-6xl mx-auto px-4 py-10 md:py-14">
          <div className="text-center max-w-2xl mx-auto mb-10 md:mb-14">
            <span className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-widest text-pink-600 bg-pink-50 px-3 py-1 rounded-full border border-pink-100">
              <Sparkles className="h-3.5 w-3.5" />
              Pré-lançamento
            </span>
            <h1 className="mt-4 text-3xl md:text-4xl font-extrabold text-gray-900 leading-tight">
              Cursos ReMakeup
            </h1>
            <p className="mt-3 text-gray-600 text-sm md:text-base leading-relaxed">
              Uma vitrine exclusiva do que vem por aí: conteúdos pensados para você
              evoluir na maquiagem com método, prática e identidade ReMakeup.
            </p>
          </div>

          <div className="grid gap-6 md:gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {UPCOMING_COURSES.map((course) => (
              <article
                key={course.slug}
                className="group bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden flex flex-col hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300"
              >
                <div className="relative h-44 sm:h-48 overflow-hidden">
                  <img
                    src={course.image}
                    alt={course.title}
                    className="w-full h-full object-cover object-center group-hover:scale-105 transition duration-700"
                  />
                  <div
                    className={`absolute inset-0 bg-gradient-to-t ${course.accent} opacity-90`}
                  />
                  <span className="absolute top-3 left-3 bg-white/95 text-pink-700 text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-md shadow-sm">
                    Em breve
                  </span>
                </div>
                <div className="p-5 flex flex-col flex-1">
                  <h2 className="text-lg font-extrabold text-gray-900 mb-2 leading-snug">
                    {course.title}
                  </h2>
                  <p className="text-sm text-gray-600 leading-relaxed flex-1 mb-5">
                    {course.shortDescription}
                  </p>
                  <Link
                    to={`/cursos/${course.slug}`}
                    className="w-full text-center py-3 rounded-xl bg-pink-600 text-white text-sm font-bold shadow-md hover:bg-pink-700 transition ring-2 ring-pink-200/60"
                  >
                    Quero conhecer
                  </Link>
                </div>
              </article>
            ))}
          </div>

          <p className="text-center text-xs text-gray-400 mt-10 max-w-md mx-auto">
            Conteúdos em produção. Em breve você poderá se cadastrar para ser
            avisada sobre abertura e condições especiais.
          </p>
        </main>
      </div>
    </>
  );
}
