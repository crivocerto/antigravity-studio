const fs = require('fs');

let content = fs.readFileSync('src/routes/admin/index.tsx', 'utf8');

const regex = /\{\/\*\s*Shopee Clicks\s*\*\/\}[\s\S]*?\{\s*totalClicks > 0 \? Math\.round\(\(shopeeClicks \/ totalClicks\) \* 100\) : 0\s*\}% de market share\s*<\/span>\s*<\/div>/g;

const newPostsCard = `            {/* Posts Count */}
            <div className="bg-zinc-900 border border-zinc-800 p-6 rounded-3xl relative overflow-hidden shadow-lg shadow-black/30">
              <div className="absolute right-4 top-4 text-emerald-500/10 select-none">
                <CheckCircle2 size={48} strokeWidth={1} />
              </div>
              <span className="block text-[10px] font-black uppercase tracking-wider text-emerald-500">Reviews Ativos</span>
              <h2 className="text-4xl font-extrabold text-white mt-2 leading-none">{postsCache.length}</h2>
              <span className="text-xs text-zinc-500 block mt-3">
                Posts indexados no portal
              </span>
            </div>`;

content = content.replace(regex, newPostsCard);

fs.writeFileSync('src/routes/admin/index.tsx', content);
console.log('Update index.tsx complete!');
