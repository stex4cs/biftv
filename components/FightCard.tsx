import type { Fight } from "@/lib/types";

export function FightCard({ fight }: { fight: Fight }) {
  const accentColor =
    fight.matchType === "main"
      ? "border-bif-gold"
      : fight.matchType === "co-main"
        ? "border-yellow-600"
        : fight.isHandicap
          ? "border-orange-500"
          : "border-bif-red";

  return (
    <div
      className={`relative bg-gradient-to-br from-[#1a1a1a] to-[#0a0a0a] border-l-4 ${accentColor} rounded-r-lg p-4 flex items-center gap-4`}
    >
      {fight.startTimeHint && (
        <div className="text-bif-gold font-oswald font-bold text-sm w-12 shrink-0">
          {fight.startTimeHint}
        </div>
      )}

      <div className="flex-1 min-w-0">
        <div className="font-oswald font-bold uppercase tracking-wide text-white">
          {fight.fighter1}
          {fight.isHandicap ? " " : " vs "}
          {fight.fighter2}
        </div>
        <div className="flex items-center gap-2 mt-1 text-xs text-white/50">
          {fight.matchType === "main" && (
            <span className="bg-bif-red text-white px-2 py-0.5 rounded font-oswald font-bold tracking-wider">
              MAIN
            </span>
          )}
          {fight.matchType === "co-main" && (
            <span className="bg-yellow-700 text-white px-2 py-0.5 rounded font-oswald font-bold tracking-wider">
              CO-MAIN
            </span>
          )}
          {fight.isHandicap && (
            <span className="bg-orange-600 text-white px-2 py-0.5 rounded font-oswald font-bold tracking-wider">
              3v1
            </span>
          )}
          <span>
            {fight.rounds} × {fight.roundDuration}
          </span>
        </div>
      </div>

      {fight.result && (
        <div className="text-right shrink-0">
          <div className="text-green-400 font-bold text-sm">
            🏆 {fight.result.winner}
          </div>
          <div className="text-[10px] text-white/50 font-oswald uppercase tracking-wider mt-1">
            {fight.result.method}
          </div>
        </div>
      )}
    </div>
  );
}
