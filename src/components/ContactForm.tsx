"use client";

export default function ContactForm() {
  return (
    <section className="max-w-2xl w-full py-20 px-6 text-center">
      <h2 className="text-4xl font-bold mb-10 text-cyan-400">
        Entre em contato
      </h2>
      <form className="flex flex-col gap-4 text-gray-900">
        <input type="text" placeholder="Seu nome" className="p-3 rounded-lg" />
        <input
          type="email"
          placeholder="Seu e-mail"
          className="p-3 rounded-lg"
        />
        <textarea
          placeholder="Sua mensagem"
          rows={4}
          className="p-3 rounded-lg"
        ></textarea>
        <button
          type="submit"
          className="bg-gradient-to-r from-cyan-500 to-blue-500 text-white p-3 rounded-lg hover:opacity-90 transition"
        >
          Enviar
        </button>
      </form>
    </section>
  );
}
