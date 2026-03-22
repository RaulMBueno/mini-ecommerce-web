import React from 'react';
import { Link, useParams, Navigate } from 'react-router-dom';
import { ArrowLeft, Bell, Sparkles } from 'lucide-react';
import PageMeta from '../components/PageMeta';
import { getCourseBySlug } from '../data/upcomingCourses';

export default function CourseComingSoon() {
  const { slug } = useParams();
  const course = getCourseBySlug(slug);

  if (!course) {
    return <Navigate to="/cursos" replace />;
  }

  const pageTitle = `${course.title} — Em breve | ReMakeup`;

  return (
    <>
      <PageMeta
        title={pageTitle}
        description="Curso em pré-lançamento na ReMakeup. Conteúdos exclusivos de maquiagem em breve."
      />
      <div className="min-h-screen bg-gradient-to-b from-gray-50 via-white to-pink-50/40">
        <header className="border-b border-pink-100/80 bg-white/90 backdrop-blur-sm">
          <div className="max-w-3xl mx-auto px-4 py-4 flex items-center justify-between gap-3">
            <Link
              to="/cursos"
              className="inline-flex items-center gap-2 text-sm font-semibold text-pink-600 hover:text-pink-700 transition"
            >
              <ArrowLeft className="h-4 w-4" />
              Voltar para cursos
            </Link>
            <div className="flex items-center gap-2 shrink-0">
              <div className="w-8 h-8 rounded-lg bg-pink-600 text-white font-extrabold flex items-center justify-center text-sm shadow-sm">
                R
              </div>
              <span className="font-extrabold text-gray-900 hidden sm:inline">
                ReMakeup.
              </span>
            </div>
          </div>
        </header>

        <main className="max-w-3xl mx-auto px-4 py-10 md:py-14">
          <div className="rounded-3xl overflow-hidden shadow-2xl border border-pink-100/80 bg-white">
            <div className="relative h-52 sm:h-64 md:h-72">
              <img
                src={course.image}
                alt={course.title}
                className="w-full h-full object-cover object-center"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/25 to-transparent" />
              <div className="absolute bottom-4 left-4 right-4">
                <span className="inline-flex items-center gap-1 text-[11px] font-bold uppercase tracking-wider text-white/95 bg-white/20 backdrop-blur px-2.5 py-1 rounded-md border border-white/30">
                  <Sparkles className="h-3 w-3" />
                  Pré-lançamento
                </span>
                <h1 className="mt-2 text-2xl sm:text-3xl font-extrabold text-white drop-shadow-sm">
                  {course.title}
                </h1>
              </div>
            </div>

            <div className="p-6 sm:p-8 md:p-10">
              <p className="text-xs font-bold uppercase tracking-widest text-pink-600 mb-2">
                Curso em breve
              </p>
              <h2 className="text-xl sm:text-2xl font-extrabold text-gray-900 mb-4">
                Estamos preparando algo especial para você
              </h2>
              <p className="text-gray-600 leading-relaxed text-sm sm:text-base mb-6">
                Estamos desenvolvendo conteúdos exclusivos para você aprender
                maquiagem do básico ao profissional, com técnicas reais e
                aplicação prática — no jeito ReMakeup: claro, elegante e
                acessível.
              </p>
              <p className="text-gray-500 text-sm leading-relaxed mb-8 border-l-4 border-pink-200 pl-4 italic">
                {course.shortDescription}
              </p>

              <div className="flex flex-col sm:flex-row gap-3">
                <button
                  type="button"
                  className="flex-1 inline-flex items-center justify-center gap-2 py-3.5 px-4 rounded-2xl bg-pink-600 text-white font-bold text-sm shadow-lg hover:bg-pink-700 transition ring-2 ring-pink-200/50"
                  onClick={() =>
                    alert(
                      'Em breve você poderá se cadastrar aqui para receber avisos sobre este curso e novidades ReMakeup!'
                    )
                  }
                >
                  <Bell className="h-4 w-4" />
                  Quero ser avisada
                </button>
                <Link
                  to="/"
                  className="flex-1 inline-flex items-center justify-center py-3.5 px-4 rounded-2xl border-2 border-pink-200 text-pink-700 font-bold text-sm hover:bg-pink-50 transition text-center"
                >
                  Ver mais novidades
                </Link>
              </div>
              <p className="text-[11px] text-gray-400 text-center mt-4">
                Em breve abriremos lista de interesse e novidades por aqui e nas
                redes da ReMakeup.
              </p>
            </div>
          </div>

          <div className="mt-8 text-center">
            <Link
              to="/cursos"
              className="text-sm font-semibold text-pink-600 hover:text-pink-700 underline"
            >
              Voltar para cursos
            </Link>
          </div>
        </main>
      </div>
    </>
  );
}
