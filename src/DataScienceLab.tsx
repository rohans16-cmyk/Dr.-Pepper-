/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

/**
 * The Data Science Lab — one CMO-ready workplan.
 * No fabricated Dr Pepper sales figures; credibility is in the method and readout.
 */
export default function DataScienceLab() {
  return (
    <section id="lab" className="py-24 bg-[#1A1A1A] text-[#F5F2ED]">
      <div className="max-w-7xl mx-auto px-6">
        <div className="mb-14 max-w-3xl">
          <span className="text-[#F5F2ED]/50 font-black uppercase tracking-[0.4em] text-xs mb-4 block">
            The Data Science Lab
          </span>
          <h2 className="text-5xl md:text-6xl font-black italic uppercase leading-none mb-6 text-white">
            One Project. <span className="text-[#F5F2ED]/35">One Decision.</span>
          </h2>
          <p className="text-[#F5F2ED]/65 font-medium text-lg leading-relaxed">
            If I had one analytics seat at the table with the CMO, this is the workplan I would
            pitch — not a dashboard wish list. No invented sales figures here. The credibility is
            in how we isolate cause from coincidence, then report a decision — not a chart dump.
          </p>
        </div>

        <div className="border-t border-[#F5F2ED]/15 pt-12 mb-16">
          <p className="text-xs font-black uppercase tracking-[0.3em] text-[#F5F2ED]/40 mb-3">
            Active brief
          </p>
          <h3 className="text-3xl md:text-4xl font-black italic uppercase text-white leading-tight max-w-4xl">
            Limited Drop Incremental Lift — Dark Berry (and the next seasonal SKU)
          </h3>
          <p className="mt-4 text-[#F5F2ED]/55 font-medium max-w-2xl">
            Before we scale the next scarcity drop nationally, we need to know whether it creates
            net new volume — or just rearranges the same drinkers across the lineup.
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-12 lg:gap-16">
          <div>
            <p className="text-[10px] font-black uppercase tracking-[0.35em] text-[#9E1B32] mb-4">
              01 — Business question
            </p>
            <h4 className="text-xl font-black italic uppercase text-white mb-4 leading-snug">
              What are we actually deciding?
            </h4>
            <p className="text-[#F5F2ED]/70 font-medium leading-relaxed mb-4">
              When a limited flavor hits shelves for eight weeks, does total Dr Pepper category
              volume in those markets rise — or do we merely shift buyers from Original / Cherry /
              Cream Soda / Zero Sugar into the drop?
            </p>
            <p className="text-[#F5F2ED]/50 font-medium leading-relaxed text-sm">
              That answer changes media spend, production commits, and whether “limited” stays a
              growth lever or becomes an expensive distraction. The CMO gets a go / iterate / kill
              call — not a vanity uplift slide.
            </p>
          </div>

          <div>
            <p className="text-[10px] font-black uppercase tracking-[0.35em] text-[#9E1B32] mb-4">
              02 — Method
            </p>
            <h4 className="text-xl font-black italic uppercase text-white mb-4 leading-snug">
              How we isolate the effect
            </h4>
            <ul className="space-y-4 text-[#F5F2ED]/70 font-medium leading-relaxed text-sm">
              <li className="border-l-2 border-[#F5F2ED]/20 pl-4">
                <span className="text-white font-bold">Matched-market holdout.</span> Pair launch
                DMAs with lookalike control markets on pre-period volume trajectory, distribution,
                and competitive intensity. Holdouts stay dark on the drop (or get delayed).
              </li>
              <li className="border-l-2 border-[#F5F2ED]/20 pl-4">
                <span className="text-white font-bold">Difference-in-differences.</span> Compare
                treated vs. control change in total brand volume and in core SKU volume during the
                drop window — so we can separate incremental cases from cannibalization.
              </li>
              <li className="border-l-2 border-[#F5F2ED]/20 pl-4">
                <span className="text-white font-bold">Guardrails, not vibes.</span> Pre-register
                primary KPI (brand volume), secondary (core-SKU cannibalization rate), and stop /
                scale thresholds before results land. No post-hoc metric shopping.
              </li>
            </ul>
          </div>

          <div>
            <p className="text-[10px] font-black uppercase tracking-[0.35em] text-[#9E1B32] mb-4">
              03 — What gets reported up
            </p>
            <h4 className="text-xl font-black italic uppercase text-white mb-4 leading-snug">
              The CMO readout
            </h4>
            <p className="text-[#F5F2ED]/70 font-medium leading-relaxed mb-6">
              One decision memo, one page of exhibits. Not a 40-slide deck.
            </p>
            <ol className="space-y-3 text-sm font-medium text-[#F5F2ED]/70">
              <li className="flex gap-3">
                <span className="text-white font-black italic shrink-0">1.</span>
                <span>
                  <span className="text-white font-bold">Incremental brand volume</span> in treated
                  markets vs. matched controls — with confidence interval, not a single point
                  estimate.
                </span>
              </li>
              <li className="flex gap-3">
                <span className="text-white font-black italic shrink-0">2.</span>
                <span>
                  <span className="text-white font-bold">Cannibalization share</span> — what % of
                  drop volume came from existing Dr Pepper SKUs vs. net-new to the brand.
                </span>
              </li>
              <li className="flex gap-3">
                <span className="text-white font-black italic shrink-0">3.</span>
                <span>
                  <span className="text-white font-bold">Recommendation</span> — scale nationally,
                  tighten the next drop (SKU, markets, creative), or retire the mechanic — tied to
                  the pre-agreed thresholds.
                </span>
              </li>
            </ol>
          </div>
        </div>

        <div className="mt-16 pt-10 border-t border-[#F5F2ED]/15 flex flex-col md:flex-row md:items-end md:justify-between gap-6">
          <p className="text-xs text-[#F5F2ED]/40 font-medium max-w-xl leading-relaxed">
            Numbers stay blank on purpose. Until holdout markets and scanner / wholesale feeds are
            in hand, publishing fake lift would be theater. The pitch is the design of the test —
            so when real data arrives, the decision is already framed.
          </p>
          <p className="text-[10px] font-black uppercase tracking-[0.3em] text-[#F5F2ED]/30 shrink-0">
            Workplan · Not a forecast
          </p>
        </div>
      </div>
    </section>
  );
}
