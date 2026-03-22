import React, { useEffect, useState, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { X, Bell, Loader2, CheckCircle2 } from 'lucide-react';
import api from '../api';

/**
 * Modal de pré-cadastro de interesse (cursos, lançamentos, VIP, etc.)
 *
 * @param {boolean} isOpen
 * @param {() => void} onClose
 * @param {string} [interestType='COURSE'] — ex.: COURSE, PRODUCT, VIP
 * @param {string} interestReference — slug ou identificador (ex.: 'courses', 'automaquiagem-basica')
 * @param {string} [formTitle] — título opcional do formulário
 */
export default function InterestSignupModal({
  isOpen,
  onClose,
  interestType = 'COURSE',
  interestReference = 'courses',
  formTitle = 'Quero receber novidades',
}) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [whatsapp, setWhatsapp] = useState('');
  const [status, setStatus] = useState('idle'); // idle | loading | success | error
  const [errorMessage, setErrorMessage] = useState('');

  const resetForm = useCallback(() => {
    setName('');
    setEmail('');
    setWhatsapp('');
    setStatus('idle');
    setErrorMessage('');
  }, []);

  useEffect(() => {
    if (!isOpen) {
      const t = setTimeout(() => {
        resetForm();
      }, 300);
      return () => clearTimeout(t);
    }
    return undefined;
  }, [isOpen, resetForm]);

  useEffect(() => {
    if (!isOpen) return undefined;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = prev;
    };
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return undefined;
    const onKey = (e) => {
      if (e.key === 'Escape' && status !== 'loading') onClose();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [isOpen, onClose, status]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const n = name.trim();
    const em = email.trim();
    if (!n || !em) {
      setErrorMessage('Preencha nome e e-mail.');
      setStatus('error');
      return;
    }
    setStatus('loading');
    setErrorMessage('');
    try {
      await api.post('/interest-signups', {
        name: n,
        email: em,
        whatsapp: whatsapp.trim() || '',
        interestType,
        interestReference,
      });
      setStatus('success');
      setName('');
      setEmail('');
      setWhatsapp('');
    } catch (err) {
      const msg =
        err?.response?.data?.message ||
        err?.response?.data?.error ||
        (typeof err?.response?.data === 'string' ? err.response.data : null) ||
        'Não foi possível enviar agora. Tente de novo em instantes.';
      setErrorMessage(Array.isArray(msg) ? msg.join(' ') : String(msg));
      setStatus('error');
    }
  };

  const handleClose = () => {
    if (status === 'loading') return;
    onClose();
  };

  if (!isOpen) return null;

  const modal = (
    <div
      className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center p-0 sm:p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="interest-signup-title"
    >
      <button
        type="button"
        className="absolute inset-0 bg-black/45 backdrop-blur-[2px]"
        onClick={handleClose}
        aria-label="Fechar"
      />
      <div
        className="relative w-full sm:max-w-md max-h-[92vh] sm:max-h-[90vh] overflow-y-auto rounded-t-3xl sm:rounded-3xl bg-white shadow-2xl border border-pink-100/80 transition-opacity duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="sticky top-0 z-10 flex items-center justify-between px-5 pt-4 pb-2 bg-gradient-to-b from-white to-white/95 border-b border-pink-50">
          <div className="flex items-center gap-2 text-pink-600">
            <Bell className="h-5 w-5 shrink-0" />
            <h2
              id="interest-signup-title"
              className="text-lg font-extrabold text-gray-900 pr-2"
            >
              {formTitle}
            </h2>
          </div>
          <button
            type="button"
            onClick={handleClose}
            disabled={status === 'loading'}
            className="p-2 rounded-full text-gray-400 hover:text-pink-600 hover:bg-pink-50 transition disabled:opacity-50"
            aria-label="Fechar"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="px-5 pb-6 pt-4">
          {status === 'success' ? (
            <div className="text-center py-4">
              <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-pink-50 text-pink-600 mb-4">
                <CheckCircle2 className="h-8 w-8" />
              </div>
              <p className="text-gray-800 font-semibold leading-relaxed">
                Perfeito! Você entrou na lista e será avisada quando tivermos
                novidades.
              </p>
              <button
                type="button"
                onClick={handleClose}
                className="mt-6 w-full py-3 rounded-xl bg-pink-600 text-white font-bold text-sm hover:bg-pink-700 transition shadow-md"
              >
                Fechar
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <p className="text-sm text-gray-500 leading-relaxed">
                Deixe seus dados — avisaremos quando houver novidades sobre este
                interesse.
              </p>

              <div>
                <label
                  htmlFor="interest-name"
                  className="block text-xs font-bold text-gray-600 mb-1.5"
                >
                  Nome <span className="text-pink-600">*</span>
                </label>
                <input
                  id="interest-name"
                  type="text"
                  autoComplete="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-pink-300 focus:border-pink-300 outline-none text-gray-900 text-sm"
                  placeholder="Seu nome"
                  required
                  disabled={status === 'loading'}
                />
              </div>

              <div>
                <label
                  htmlFor="interest-email"
                  className="block text-xs font-bold text-gray-600 mb-1.5"
                >
                  E-mail <span className="text-pink-600">*</span>
                </label>
                <input
                  id="interest-email"
                  type="email"
                  autoComplete="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-pink-300 focus:border-pink-300 outline-none text-gray-900 text-sm"
                  placeholder="seu@email.com"
                  required
                  disabled={status === 'loading'}
                />
              </div>

              <div>
                <label
                  htmlFor="interest-whatsapp"
                  className="block text-xs font-bold text-gray-600 mb-1.5"
                >
                  WhatsApp <span className="text-gray-400 font-normal">(opcional)</span>
                </label>
                <input
                  id="interest-whatsapp"
                  type="tel"
                  autoComplete="tel"
                  value={whatsapp}
                  onChange={(e) => setWhatsapp(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-pink-300 focus:border-pink-300 outline-none text-gray-900 text-sm"
                  placeholder="(00) 00000-0000"
                  disabled={status === 'loading'}
                />
              </div>

              {status === 'error' && errorMessage && (
                <p
                  className="text-sm text-red-600 bg-red-50 border border-red-100 rounded-xl px-3 py-2"
                  role="alert"
                >
                  {errorMessage}
                </p>
              )}

              <button
                type="submit"
                disabled={status === 'loading'}
                className="w-full flex items-center justify-center gap-2 py-3.5 rounded-2xl bg-pink-600 text-white font-bold text-sm shadow-lg hover:bg-pink-700 transition ring-2 ring-pink-200/50 disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {status === 'loading' ? (
                  <>
                    <Loader2 className="h-5 w-5 animate-spin" />
                    Enviando...
                  </>
                ) : (
                  <>
                    <Bell className="h-4 w-4" />
                    Quero ser avisada
                  </>
                )}
              </button>

              <p className="text-[11px] text-center text-gray-400">
                Seus dados são usados apenas para avisos sobre este interesse,
                conforme nossa política de privacidade.
              </p>
            </form>
          )}
        </div>
      </div>
    </div>
  );

  return createPortal(modal, document.body);
}
