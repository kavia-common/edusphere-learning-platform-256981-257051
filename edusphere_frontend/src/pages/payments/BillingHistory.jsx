import React from "react";
import { getSupabase } from "../../lib/supabaseClient";
import { GlassCard, DataTable } from "../../components/common";

/* PUBLIC_INTERFACE */
const BillingHistory = function BillingHistory() {
  /** Reads payments table and lists history */
  const [rows, setRows] = React.useState([]);

  React.useEffect(() => {
    (async () => {
      try {
        const { data } = await getSupabase()
          .from("payments")
          .select("*")
          .order("created_at", { ascending: false })
          .limit(25);
        setRows(data || []);
      } catch {
        setRows([]);
      }
    })();
  }, []);

  const cols = [
    { key: "id", header: "ID" },
    { key: "amount", header: "Amount", render: (v) => `$${(v || 0) / 100}` },
    { key: "status", header: "Status" },
    { key: "created_at", header: "Date" },
  ];

  return (
    <div style={{ display: "grid", gap: 16 }}>
      <GlassCard>
        <h2>Billing history</h2>
      </GlassCard>
      <DataTable columns={cols} rows={rows} />
    </div>
  );
};
export default BillingHistory;
