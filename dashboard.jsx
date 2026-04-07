import { useState } from "react";
import { AreaChart, Area, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";

const COLORS = {
  bg: "#0a0a0f",
  card: "#12121a",
  cardHover: "#1a1a26",
  border: "#1e1e2e",
  accent: "#f59e0b",
  accentDim: "rgba(245,158,11,0.15)",
  green: "#22c55e",
  red: "#ef4444",
  text: "#e2e2e8",
  muted: "#6b6b80",
  blue: "#3b82f6",
  purple: "#a855f7",
  cyan: "#06b6d4",
};

const dailyData = [
  { day: "Mar 1", players: 12400, volume: 84000, txns: 31200 },
  { day: "Mar 5", players: 13100, volume: 91000, txns: 33800 },
  { day: "Mar 10", players: 14800, volume: 102000, txns: 37400 },
  { day: "Mar 15", players: 13900, volume: 96000, txns: 35100 },
  { day: "Mar 20", players: 16200, volume: 118000, txns: 41300 },
  { day: "Mar 25", players: 18500, volume: 134000, txns: 46800 },
  { day: "Mar 30", players: 21300, volume: 156000, txns: 52100 },
  { day: "Apr 1", players: 22800, volume: 168000, txns: 55400 },
  { day: "Apr 5", players: 24100, volume: 179000, txns: 58200 },
];

const games = [
  { name: "Trials of Tyr", players: 8420, change: 12.4, volume: "$62.1K", nfts: 1840, color: COLORS.accent },
  { name: "Forest Knight", players: 5230, change: -3.2, volume: "$38.4K", nfts: 920, color: COLORS.blue },
  { name: "Age of Zalmoxis", players: 4180, change: 8.7, volume: "$31.2K", nfts: 760, color: COLORS.purple },
  { name: "Megaweapon", players: 3100, change: 22.1, volume: "$24.8K", nfts: 540, color: COLORS.cyan },
  { name: "Hash Rush", players: 2640, change: -1.8, volume: "$18.3K", nfts: 410, color: COLORS.green },
];

const pieData = [
  { name: "Gaming", value: 58, color: COLORS.accent },
  { name: "NFT Trades", value: 24, color: COLORS.purple },
  { name: "DeFi", value: 12, color: COLORS.blue },
  { name: "Other", value: 6, color: COLORS.muted },
];

const StatCard = ({ label, value, sub, icon }) => (
  <div style={{
    background: COLORS.card,
    border: `1px solid ${COLORS.border}`,
    borderRadius: 12,
    padding: "20px 24px",
    flex: 1,
    minWidth: 180,
  }}>
    <div style={{ color: COLORS.muted, fontSize: 12, fontFamily: "'JetBrains Mono', monospace", textTransform: "uppercase", letterSpacing: 1.5, marginBottom: 8 }}>
      {icon} {label}
    </div>
    <div style={{ color: COLORS.text, fontSize: 28, fontWeight: 700, fontFamily: "'Space Grotesk', sans-serif", lineHeight: 1.1 }}>
      {value}
    </div>
    <div style={{ color: COLORS.green, fontSize: 13, marginTop: 6, fontFamily: "'JetBrains Mono', monospace" }}>
      {sub}
    </div>
  </div>
);

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div style={{
      background: "#1a1a26",
      border: `1px solid ${COLORS.border}`,
      borderRadius: 8,
      padding: "10px 14px",
      fontSize: 12,
      fontFamily: "'JetBrains Mono', monospace",
    }}>
      <div style={{ color: COLORS.muted, marginBottom: 4 }}>{label}</div>
      {payload.map((p, i) => (
        <div key={i} style={{ color: p.color, marginTop: 2 }}>
          {p.name}: {typeof p.value === "number" ? p.value.toLocaleString() : p.value}
        </div>
      ))}
    </div>
  );
};

export default function BeamScope() {
  const [activeTab, setActiveTab] = useState("overview");
  const [hoveredGame, setHoveredGame] = useState(null);

  return (
    <div style={{
      background: COLORS.bg,
      minHeight: "100vh",
      color: COLORS.text,
      fontFamily: "'Space Grotesk', sans-serif",
      padding: 0,
    }}>
      <link href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap" rel="stylesheet" />

      {/* Header */}
      <div style={{
        borderBottom: `1px solid ${COLORS.border}`,
        padding: "16px 32px",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        background: "rgba(10,10,15,0.9)",
        backdropFilter: "blur(12px)",
        position: "sticky",
        top: 0,
        zIndex: 10,
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <div style={{
            width: 32, height: 32, borderRadius: "50%",
            background: `linear-gradient(135deg, ${COLORS.accent}, #f97316)`,
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: 16, fontWeight: 700,
          }}>B</div>
          <span style={{ fontSize: 20, fontWeight: 700, letterSpacing: -0.5 }}>
            Beam<span style={{ color: COLORS.accent }}>Scope</span>
          </span>
          <span style={{
            fontSize: 10, background: COLORS.accentDim, color: COLORS.accent,
            padding: "2px 8px", borderRadius: 20, fontFamily: "'JetBrains Mono', monospace",
            marginLeft: 4,
          }}>BETA</span>
        </div>

        <div style={{ display: "flex", gap: 4 }}>
          {["overview", "games", "nfts"].map(tab => (
            <button key={tab} onClick={() => setActiveTab(tab)} style={{
              background: activeTab === tab ? COLORS.accentDim : "transparent",
              color: activeTab === tab ? COLORS.accent : COLORS.muted,
              border: "none",
              padding: "6px 16px",
              borderRadius: 8,
              fontSize: 13,
              fontWeight: 500,
              cursor: "pointer",
              fontFamily: "'Space Grotesk', sans-serif",
              textTransform: "capitalize",
              transition: "all 0.2s",
            }}>{tab}</button>
          ))}
        </div>
      </div>

      <div style={{ padding: "28px 32px", maxWidth: 1100, margin: "0 auto" }}>

        {/* Live indicator */}
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 24 }}>
          <div style={{
            width: 8, height: 8, borderRadius: "50%", background: COLORS.green,
            boxShadow: `0 0 8px ${COLORS.green}`,
            animation: "pulse 2s infinite",
          }} />
          <span style={{ color: COLORS.muted, fontSize: 12, fontFamily: "'JetBrains Mono', monospace" }}>
            Live · Updated 2 min ago · Beam Mainnet
          </span>
          <style>{`@keyframes pulse { 0%, 100% { opacity:1 } 50% { opacity:0.4 } }`}</style>
        </div>

        {/* Stat Cards */}
        <div style={{ display: "flex", gap: 16, marginBottom: 28, flexWrap: "wrap" }}>
          <StatCard icon="◈" label="Daily Active Wallets" value="24,100" sub="↑ 14.2% vs last week" />
          <StatCard icon="⬡" label="$BEAM Volume (24h)" value="$179K" sub="↑ 6.5% vs yesterday" />
          <StatCard icon="◇" label="NFT Trades (24h)" value="3,240" sub="↑ 21.8% vs last week" />
          <StatCard icon="△" label="Active Games" value="23" sub="+2 new this month" />
        </div>

        {/* Main Chart */}
        <div style={{
          background: COLORS.card,
          border: `1px solid ${COLORS.border}`,
          borderRadius: 12,
          padding: 24,
          marginBottom: 28,
        }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
            <div>
              <div style={{ fontSize: 16, fontWeight: 600 }}>Ecosystem Growth</div>
              <div style={{ color: COLORS.muted, fontSize: 12, fontFamily: "'JetBrains Mono', monospace", marginTop: 4 }}>
                Daily active players across all Beam games
              </div>
            </div>
            <div style={{
              fontSize: 11, color: COLORS.muted, fontFamily: "'JetBrains Mono', monospace",
              display: "flex", gap: 16,
            }}>
              <span><span style={{ color: COLORS.accent }}>●</span> Players</span>
              <span><span style={{ color: COLORS.blue }}>●</span> Transactions</span>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={240}>
            <AreaChart data={dailyData}>
              <defs>
                <linearGradient id="gPlayers" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor={COLORS.accent} stopOpacity={0.3} />
                  <stop offset="100%" stopColor={COLORS.accent} stopOpacity={0} />
                </linearGradient>
                <linearGradient id="gTxns" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor={COLORS.blue} stopOpacity={0.2} />
                  <stop offset="100%" stopColor={COLORS.blue} stopOpacity={0} />
                </linearGradient>
              </defs>
              <XAxis dataKey="day" tick={{ fill: COLORS.muted, fontSize: 11, fontFamily: "'JetBrains Mono'" }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: COLORS.muted, fontSize: 11, fontFamily: "'JetBrains Mono'" }} axisLine={false} tickLine={false} tickFormatter={v => `${(v/1000).toFixed(0)}K`} />
              <Tooltip content={<CustomTooltip />} />
              <Area type="monotone" dataKey="players" stroke={COLORS.accent} fill="url(#gPlayers)" strokeWidth={2} name="Players" />
              <Area type="monotone" dataKey="txns" stroke={COLORS.blue} fill="url(#gTxns)" strokeWidth={2} name="Transactions" />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Two Column: Games + Pie */}
        <div style={{ display: "flex", gap: 16, marginBottom: 28, flexWrap: "wrap" }}>

          {/* Trending Games */}
          <div style={{
            background: COLORS.card,
            border: `1px solid ${COLORS.border}`,
            borderRadius: 12,
            padding: 24,
            flex: 2,
            minWidth: 340,
          }}>
            <div style={{ fontSize: 16, fontWeight: 600, marginBottom: 4 }}>Trending Games</div>
            <div style={{ color: COLORS.muted, fontSize: 12, fontFamily: "'JetBrains Mono', monospace", marginBottom: 16 }}>
              Ranked by daily active players
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {games.map((g, i) => (
                <div key={g.name}
                  onMouseEnter={() => setHoveredGame(i)}
                  onMouseLeave={() => setHoveredGame(null)}
                  style={{
                    display: "flex", alignItems: "center", gap: 12,
                    padding: "12px 14px",
                    borderRadius: 10,
                    background: hoveredGame === i ? COLORS.cardHover : "transparent",
                    border: `1px solid ${hoveredGame === i ? COLORS.border : "transparent"}`,
                    transition: "all 0.15s",
                    cursor: "pointer",
                  }}>
                  <div style={{
                    width: 28, height: 28, borderRadius: 8,
                    background: `${g.color}22`,
                    display: "flex", alignItems: "center", justifyContent: "center",
                    fontSize: 13, fontWeight: 700, color: g.color,
                    fontFamily: "'JetBrains Mono', monospace",
                  }}>{i + 1}</div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 600, fontSize: 14 }}>{g.name}</div>
                    <div style={{ color: COLORS.muted, fontSize: 11, fontFamily: "'JetBrains Mono', monospace", marginTop: 2 }}>
                      {g.players.toLocaleString()} players · {g.volume} vol · {g.nfts} NFTs
                    </div>
                  </div>
                  <div style={{
                    color: g.change >= 0 ? COLORS.green : COLORS.red,
                    fontSize: 13, fontWeight: 600,
                    fontFamily: "'JetBrains Mono', monospace",
                  }}>
                    {g.change >= 0 ? "+" : ""}{g.change}%
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Pie: Transaction Breakdown */}
          <div style={{
            background: COLORS.card,
            border: `1px solid ${COLORS.border}`,
            borderRadius: 12,
            padding: 24,
            flex: 1,
            minWidth: 240,
          }}>
            <div style={{ fontSize: 16, fontWeight: 600, marginBottom: 4 }}>$BEAM Flow</div>
            <div style={{ color: COLORS.muted, fontSize: 12, fontFamily: "'JetBrains Mono', monospace", marginBottom: 12 }}>
              Transaction breakdown by type
            </div>
            <ResponsiveContainer width="100%" height={180}>
              <PieChart>
                <Pie data={pieData} dataKey="value" cx="50%" cy="50%" innerRadius={50} outerRadius={75} paddingAngle={3} strokeWidth={0}>
                  {pieData.map((d, i) => <Cell key={i} fill={d.color} />)}
                </Pie>
                <Tooltip content={({ active, payload }) => {
                  if (!active || !payload?.length) return null;
                  return (
                    <div style={{
                      background: "#1a1a26", border: `1px solid ${COLORS.border}`,
                      borderRadius: 8, padding: "8px 12px", fontSize: 12,
                      fontFamily: "'JetBrains Mono', monospace",
                    }}>
                      <span style={{ color: payload[0].payload.color }}>{payload[0].name}</span>: {payload[0].value}%
                    </div>
                  );
                }} />
              </PieChart>
            </ResponsiveContainer>
            <div style={{ display: "flex", flexDirection: "column", gap: 6, marginTop: 4 }}>
              {pieData.map(d => (
                <div key={d.name} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", fontSize: 12 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <div style={{ width: 8, height: 8, borderRadius: 2, background: d.color }} />
                    <span style={{ color: COLORS.muted }}>{d.name}</span>
                  </div>
                  <span style={{ fontFamily: "'JetBrains Mono', monospace", color: COLORS.text }}>{d.value}%</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div style={{
          textAlign: "center",
          padding: "24px 0",
          borderTop: `1px solid ${COLORS.border}`,
          color: COLORS.muted,
          fontSize: 12,
          fontFamily: "'JetBrains Mono', monospace",
        }}>
          BeamScope v0.1 · Built for the Beam Ecosystem · Open Source
        </div>
      </div>
    </div>
  );
}
