import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Loader, Mail, User, Bell, Tag, RefreshCw } from 'lucide-react';
import PageMeta from '../components/PageMeta';
import { fetchInterestSignups } from '../services/interestSignupService';

function formatDate(iso) {
  if (!iso) return '—';
  try {
    return new Date(iso).toLocaleString('pt-BR', {
      dateStyle: 'short',
      timeStyle: 'short',
    });
  } catch {
    return String(iso);
  }
}

export default function AdminInterestSignups() {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const load = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchInterestSignups();
      setRows(data);
    } catch (e) {
      console.error(e);
      setError(
        e?.response?.status === 401 || e?.response?.status === 403
          ? 'Sem permissão ou sessão expirada. Faça login novamente.'
          : 'Não foi possível carregar a lista. Tente novamente.'
      );
      setRows([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  return (
    <>
      <PageMeta
        title="Pré-cadastros de interesse | Admin ReMakeup"
        description="Lista de interesse em cursos e novidades."
        noIndex
      />
      <div className="min-h-screen bg-gray-50 p-6 md:p-8">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
            <div className="flex items-center gap-4">
              <Link
                to="/admin"
                className="p-2 bg-white rounded-full shadow hover:bg-gray-100 text-gray-600"
              >
                <ArrowLeft size={20} />
              </Link>
              <div>
                <h1 className="text-2xl md:text-3xl font-bold text-gray-800">
                  Pré-cadastros de interesse
                </h1>
                <p className="text-sm text-gray-500 mt-1">
                  Quem se inscreveu para receber novidades (cursos, lançamentos).
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={load}
              disabled={loading}
              className="inline-flex items-center justify-center gap-2 px-4 py-2 rounded-lg border border-gray-200 bg-white text-gray-700 text-sm font-semibold hover:bg-gray-50 disabled:opacity-50"
            >
              <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
              Atualizar
            </button>
          </div>

          <div className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">
            {loading && rows.length === 0 ? (
              <div className="flex justify-center py-20">
                <Loader className="h-10 w-10 animate-spin text-pink-600" />
              </div>
            ) : error ? (
              <div className="p-8 text-center text-red-600 text-sm">{error}</div>
            ) : rows.length === 0 ? (
              <div className="p-12 text-center text-gray-500 text-sm">
                Nenhum pré-cadastro ainda.
              </div>
            ) : (
              <>
                {/* Desktop: tabela */}
                <div className="hidden md:block overflow-x-auto">
                  <table className="w-full text-left text-sm">
                    <thead>
                      <tr className="bg-pink-50/80 border-b border-pink-100 text-gray-600">
                        <th className="py-3 px-4 font-semibold">Nome</th>
                        <th className="py-3 px-4 font-semibold">E-mail</th>
                        <th className="py-3 px-4 font-semibold">WhatsApp</th>
                        <th className="py-3 px-4 font-semibold">Tipo</th>
                        <th className="py-3 px-4 font-semibold">Referência</th>
                        <th className="py-3 px-4 font-semibold">Data</th>
                      </tr>
                    </thead>
                    <tbody>
                      {rows.map((r) => (
                        <tr
                          key={r.id}
                          className="border-b border-gray-100 hover:bg-gray-50/80"
                        >
                          <td className="py-3 px-4 text-gray-900 font-medium">
                            {r.name}
                          </td>
                          <td className="py-3 px-4 text-gray-700">{r.email}</td>
                          <td className="py-3 px-4 text-gray-600">
                            {r.whatsapp || '—'}
                          </td>
                          <td className="py-3 px-4">
                            <span className="inline-block px-2 py-0.5 rounded-md bg-purple-50 text-purple-800 text-xs font-semibold">
                              {r.interestType ?? '—'}
                            </span>
                          </td>
                          <td className="py-3 px-4 text-gray-600 max-w-[180px] truncate" title={r.interestReference}>
                            {r.interestReference || '—'}
                          </td>
                          <td className="py-3 px-4 text-gray-500 whitespace-nowrap">
                            {formatDate(r.createdAt)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Mobile: cards */}
                <div className="md:hidden divide-y divide-gray-100">
                  {rows.map((r) => (
                    <div key={r.id} className="p-4 space-y-3">
                      <div className="flex items-start justify-between gap-2">
                        <p className="font-bold text-gray-900 flex items-center gap-2">
                          <User className="h-4 w-4 text-pink-600 shrink-0" />
                          {r.name}
                        </p>
                        <span className="text-[10px] text-gray-400 whitespace-nowrap">
                          {formatDate(r.createdAt)}
                        </span>
                      </div>
                      <p className="text-sm text-gray-700 flex items-center gap-2">
                        <Mail className="h-4 w-4 text-gray-400 shrink-0" />
                        {r.email}
                      </p>
                      {r.whatsapp && (
                        <p className="text-sm text-gray-600 flex items-center gap-2">
                          <Bell className="h-4 w-4 text-gray-400 shrink-0" />
                          {r.whatsapp}
                        </p>
                      )}
                      <div className="flex flex-wrap gap-2 pt-1">
                        <span className="inline-flex items-center gap-1 px-2 py-1 rounded-lg bg-purple-50 text-purple-800 text-xs font-semibold">
                          <Tag className="h-3 w-3" />
                          {r.interestType ?? '—'}
                        </span>
                        {r.interestReference && (
                          <span className="text-xs text-gray-500 bg-gray-50 px-2 py-1 rounded-lg">
                            {r.interestReference}
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>

          <p className="text-center text-xs text-gray-400 mt-6">
            {rows.length > 0 && `${rows.length} registro(s). `}
            Ordenação: mais recentes primeiro.
          </p>
        </div>
      </div>
    </>
  );
}
