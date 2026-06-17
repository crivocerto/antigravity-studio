import { Search } from "lucide-react";

export function Header() {
  return (
    <header className="bg-white shadow-sm sticky top-[48px] z-40">
      <div className="max-w-5xl mx-auto px-4 py-3 flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-black text-orange-500 tracking-tight">OFERTAS<span className="text-slate-800">VIP</span></h1>
        </div>
        <div className="relative">
          <input 
            type="text" 
            placeholder="Buscar ofertas (ex: fone, air fryer)..." 
            className="w-full bg-slate-100 rounded-full py-2 pl-10 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 transition-all"
          />
          <Search className="absolute left-3 top-2.5 text-slate-400" size={16} />
        </div>
        <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide text-sm">
          <button className="whitespace-nowrap px-4 py-1.5 bg-orange-100 text-orange-600 font-semibold rounded-full">🔥 Tudo</button>
          <button className="whitespace-nowrap px-4 py-1.5 bg-slate-100 text-slate-600 font-medium rounded-full hover:bg-slate-200 transition-colors">📱 Eletrônicos</button>
          <button className="whitespace-nowrap px-4 py-1.5 bg-slate-100 text-slate-600 font-medium rounded-full hover:bg-slate-200 transition-colors">🏠 Casa</button>
          <button className="whitespace-nowrap px-4 py-1.5 bg-slate-100 text-slate-600 font-medium rounded-full hover:bg-slate-200 transition-colors">💅 Beleza</button>
        </div>
      </div>
    </header>
  );
}
