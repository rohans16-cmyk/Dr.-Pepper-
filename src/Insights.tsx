import { FLAVOR_SHARE, HIGHLIGHTS, REGION_STATS } from './data';

/**
 * Simple Insights section — CSS bar charts + sample survey stats.
 * Easy to read; no chart libraries required.
 */
export default function Insights() {
  return (
    <section id="insights" className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-6">
        <div className="mb-14 max-w-2xl">
          <span className="text-[#711F25] font-black uppercase tracking-[0.4em] text-xs mb-4 block">
            Insights
          </span>
          <h2 className="text-5xl md:text-6xl font-black text-[#711F25] italic uppercase leading-none mb-4">
            By The <span className="text-black/20">Numbers.</span>
          </h2>
          <p className="text-[#711F25]/60 font-medium">
            Demo survey results for this portfolio site. Sample size n = 1,200 (made-up data for learning
            stats + UI).
          </p>
        </div>

        {/* Highlight metrics */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 mb-16 border-y border-[#711F25]/10 py-10">
          {HIGHLIGHTS.map((item) => (
            <div key={item.label}>
              <p className="text-4xl md:text-5xl font-black italic text-[#711F25]">{item.value}</p>
              <p className="mt-2 text-xs font-bold uppercase tracking-widest text-[#711F25]/50">
                {item.label}
              </p>
            </div>
          ))}
        </div>

        <div className="grid md:grid-cols-2 gap-16">
          {/* Bar chart */}
          <div>
            <h3 className="text-xl font-black italic uppercase text-[#711F25] mb-2">
              Flavor share
            </h3>
            <p className="text-sm text-[#711F25]/50 font-medium mb-8">
              % of survey picks for “favorite Dr Pepper”
            </p>
            <div className="space-y-5">
              {FLAVOR_SHARE.map((flavor) => (
                <div key={flavor.id}>
                  <div className="flex justify-between text-sm font-bold uppercase tracking-wide mb-2">
                    <span style={{ color: flavor.color }}>{flavor.name}</span>
                    <span className="text-[#711F25]">{flavor.percent}%</span>
                  </div>
                  <div className="h-3 bg-[#711F25]/10 overflow-hidden">
                    <div
                      className="h-full transition-all duration-700"
                      style={{ width: `${flavor.percent}%`, backgroundColor: flavor.color }}
                      role="img"
                      aria-label={`${flavor.name}: ${flavor.percent} percent`}
                    />
                  </div>
                </div>
              ))}
            </div>
            <p className="mt-6 text-xs text-[#711F25]/40 font-medium">
              Tip: bars add up to 100% — a simple way to show categorical proportions.
            </p>
          </div>

          {/* Regional table */}
          <div>
            <h3 className="text-xl font-black italic uppercase text-[#711F25] mb-2">
              Regional favorites
            </h3>
            <p className="text-sm text-[#711F25]/50 font-medium mb-8">
              Preference score out of 100 (demo)
            </p>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="border-b-2 border-[#711F25]/20 text-xs font-black uppercase tracking-widest text-[#711F25]/50">
                    <th className="pb-3 pr-4">Region</th>
                    <th className="pb-3 pr-4">Top pick</th>
                    <th className="pb-3 text-right">Score</th>
                  </tr>
                </thead>
                <tbody>
                  {REGION_STATS.map((row) => (
                    <tr key={row.region} className="border-b border-[#711F25]/10">
                      <td className="py-4 pr-4 font-bold text-[#711F25]">{row.region}</td>
                      <td className="py-4 pr-4 text-[#711F25]/70 font-medium">{row.favorite}</td>
                      <td className="py-4 text-right font-black italic text-[#711F25]">{row.score}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
