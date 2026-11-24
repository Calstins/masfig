"use client";

import { useEffect, useRef, useState } from "react";
import { X } from "lucide-react";
import { naira, type CampaignProduct } from "./campaign-data";
import { useCampaign } from "./campaign-provider";

interface Item {
  text: string;
  place?: string;
  demo: boolean;
}

interface SampleBuyer {
  name: string;
  company?: string;
  place: string;
  quantity: number;
}

// Illustrative buyers only. Mix of individuals and small businesses with varied quantities.
const SAMPLE_BUYERS: SampleBuyer[] = [
  { name: "Chinedu O.", place: "Ikeja, Lagos", quantity: 12 },
  {
    name: "Aisha M.",
    company: "Arewa Fresh Mart",
    place: "Kano",
    quantity: 24,
  },
  { name: "Oluwaseun A.", place: "Ibadan, Oyo", quantity: 10 },
  {
    name: "Ngozi E.",
    company: "Eze & Sons Ventures",
    place: "Enugu",
    quantity: 12,
  },
  { name: "Ibrahim S.", place: "Wuse 2, Abuja", quantity: 30 },
  {
    name: "Funke B.",
    company: "Bello Stores",
    place: "Lekki, Lagos",
    quantity: 16,
  },
  { name: "Emeka N.", place: "Port Harcourt, Rivers", quantity: 12 },
  {
    name: "Hauwa K.",
    company: "Kaduna Home Supplies",
    place: "Kaduna",
    quantity: 18,
  },
  { name: "Tunde F.", place: "Abeokuta, Ogun", quantity: 14 },
  {
    name: "Blessing I.",
    company: "Benin Bulk Traders",
    place: "Benin City, Edo",
    quantity: 10,
  },
  { name: "Sadiq A.", place: "Zaria, Kaduna", quantity: 20 },
  {
    name: "Rita O.",
    company: "Owerri Market Hub",
    place: "Owerri, Imo",
    quantity: 22,
  },
];

const FIRST_DELAY = 9_000;
const VISIBLE_MS = 6_000;
const GAP_MS = 30_000;
const MAX_PER_SESSION = 4;
const KEY = "bf_activity";

function build(p: CampaignProduct): Item[] {
  if (p.verifiedActivity.length)
    return p.verifiedActivity.map((v) => ({
      text: v.text,
      place: v.place,
      demo: false,
    }));
  return SAMPLE_BUYERS.map((b) => ({
    text: `${b.name} ordered ${b.quantity} ${b.quantity === 1 ? p.name : p.plural} — ${naira(b.quantity * p.promoPrice)}`,
    place: b.company ? `${b.company} · ${b.place}` : b.place,
    demo: true,
  }));
}

/**
 * Slide-in "recent activity" card. Entries come from the campaign config; unless they are marked verified they are labelled
 * "Sample activity" so no demonstration order is ever presented as a real one. Appears at most MAX_PER_SESSION times per
 * visit, never repeats an entry until all have been shown, and stops for the visit once dismissed.
 */
export function PurchaseActivityToast() {
  const { product, status } = useCampaign();
  const items = useRef<Item[]>(build(product));
  const [current, setCurrent] = useState<Item | null>(null);
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (status !== "active" || !items.current.length) return;
    let state = { shown: 0, closed: false, order: [] as number[] };
    try {
      state = {
        ...state,
        ...JSON.parse(sessionStorage.getItem(KEY + product.key) || "{}"),
      };
    } catch {
      /* storage unavailable */
    }
    if (state.closed || state.shown >= MAX_PER_SESSION) return;
    let t2: ReturnType<typeof setTimeout> | undefined,
      t3: ReturnType<typeof setTimeout> | undefined;
    let dead = false;

    const save = () => {
      try {
        sessionStorage.setItem(KEY + product.key, JSON.stringify(state));
      } catch {
        /* ignore */
      }
    };
    const next = () => {
      if (dead || state.shown >= MAX_PER_SESSION) return;
      if (!state.order.length) state.order = items.current.map((_, i) => i);
      const idx = state.order.shift() as number;
      state.shown += 1;
      save();
      setCurrent(items.current[idx]);
      setShow(true);
      t2 = setTimeout(() => {
        setShow(false);
        t3 = setTimeout(next, GAP_MS);
      }, VISIBLE_MS);
    };
    const t1 = setTimeout(next, FIRST_DELAY);
    return () => {
      dead = true;
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
    };
  }, [product.key, status]);

  function close() {
    setShow(false);
    try {
      const s = JSON.parse(sessionStorage.getItem(KEY + product.key) || "{}");
      sessionStorage.setItem(
        KEY + product.key,
        JSON.stringify({ ...s, closed: true }),
      );
    } catch {
      /* ignore */
    }
  }

  if (!current) return null;
  return (
    <div
      role="status"
      aria-live="polite"
      className={`pointer-events-none fixed bottom-24 left-3 z-30 w-[min(20rem,calc(100vw-1.5rem))] transition-all duration-500 motion-reduce:transition-none md:bottom-6 md:left-6 ${show ? "translate-x-0 opacity-100" : "-translate-x-6 opacity-0 motion-reduce:translate-x-0"}`}
    >
      <div
        className={`pointer-events-auto rounded-2xl border border-black/10 bg-white p-4 pr-10 shadow-2xl ${show ? "" : "invisible"}`}
      >
        <button
          type="button"
          onClick={close}
          aria-label="Dismiss activity notification"
          className="absolute right-2 top-2 rounded-full p-1.5 text-ink-soft hover:bg-surface"
        >
          <X aria-hidden className="h-4 w-4" />
        </button>
        <p className="text-[11px] font-bold uppercase tracking-widest text-primary">
          {current.demo
            ? "Sample activity · illustrative only"
            : "Recent order activity"}
        </p>
        <p className="mt-1 text-sm font-bold text-ink">{current.text}</p>
        {current.place && (
          <p className="text-xs text-ink-soft">{current.place}</p>
        )}
        {current.demo && (
          <p className="mt-1 text-[11px] text-ink-soft">Order!</p>
        )}
      </div>
    </div>
  );
}
