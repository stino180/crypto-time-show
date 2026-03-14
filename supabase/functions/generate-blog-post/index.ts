import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

async function fetchNewsData(): Promise<string> {
  const apis = [
    {
      url: "https://cryptocurrency.cv/api/news?limit=20",
      parse: (data: any) => {
        const items = Array.isArray(data) ? data : data?.data ?? data?.articles ?? data?.results ?? [];
        if (!Array.isArray(items) || items.length === 0) return null;
        return items.slice(0, 15).map(
          (a: any, i: number) =>
            `${i + 1}. "${a.title || "Untitled"}" — ${a.description || a.summary || a.body?.slice(0, 200) || "No description"} (Source: ${a.source?.name || a.source || a.feed || "Unknown"})`
        ).join("\n");
      },
    },
    {
      url: "https://api.freecryptoapi.com/v1/getNews",
      parse: (data: any) => {
        const items = Array.isArray(data) ? data : data?.data ?? data?.articles ?? data?.news ?? [];
        if (!Array.isArray(items) || items.length === 0) return null;
        return items.slice(0, 15).map(
          (a: any, i: number) =>
            `${i + 1}. "${a.title || "Untitled"}" — ${a.description || a.summary || "No description"} (Source: ${a.source?.name || a.source || "Unknown"})`
        ).join("\n");
      },
    },
  ];

  for (const api of apis) {
    try {
      console.log("Trying news API:", api.url);
      const res = await fetch(api.url);
      if (!res.ok) {
        console.error(`News API ${api.url} returned ${res.status}`);
        continue;
      }
      const data = await res.json();
      console.log("News API response keys:", Object.keys(data));
      const result = api.parse(data);
      if (result) return result;
      console.error("No articles parsed from", api.url);
    } catch (e) {
      console.error(`News API ${api.url} error:`, e);
    }
  }

  throw new Error("Could not fetch Bitcoin news from any source");
}

async function fetchMarketData(): Promise<string> {
  const results: string[] = [];

  try {
    const priceRes = await fetch(
      "https://api.coingecko.com/api/v3/simple/price?ids=bitcoin&vs_currencies=usd&include_24hr_change=true&include_market_cap=true&include_24hr_vol=true"
    );
    if (priceRes.ok) {
      const priceData = await priceRes.json();
      const btc = priceData.bitcoin;
      results.push(
        `Price: $${btc.usd?.toLocaleString() ?? "N/A"}`,
        `24h Change: ${btc.usd_24h_change?.toFixed(2) ?? "N/A"}%`,
        `Market Cap: $${btc.usd_market_cap?.toLocaleString() ?? "N/A"}`,
        `24h Volume: $${btc.usd_24h_vol?.toLocaleString() ?? "N/A"}`
      );
    }
  } catch (e) {
    console.error("CoinGecko error:", e);
    results.push("Price data: unavailable");
  }

  try {
    const [blockRes, feeRes, diffRes, mempoolRes] = await Promise.all([
      fetch("https://mempool.space/api/blocks/tip/height"),
      fetch("https://mempool.space/api/v1/fees/recommended"),
      fetch("https://mempool.space/api/v1/difficulty-adjustment"),
      fetch("https://mempool.space/api/mempool"),
    ]);

    if (blockRes.ok) {
      const height = await blockRes.text();
      results.push(`Block Height: ${height}`);
    }
    if (feeRes.ok) {
      const fees = await feeRes.json();
      results.push(
        `Fees (sat/vB): Fast ${fees.fastestFee}, Medium ${fees.halfHourFee}, Slow ${fees.economyFee}`
      );
    }
    if (diffRes.ok) {
      const diff = await diffRes.json();
      results.push(
        `Difficulty Adjustment: ${diff.difficultyChange?.toFixed(2) ?? "N/A"}% in ${diff.remainingBlocks ?? "N/A"} blocks`
      );
    }
    if (mempoolRes.ok) {
      const mempool = await mempoolRes.json();
      results.push(`Mempool: ${mempool.count ?? "N/A"} unconfirmed txs`);
    }
  } catch (e) {
    console.error("Mempool error:", e);
    results.push("Network data: partially unavailable");
  }

  // Try hashrate
  try {
    const hashRes = await fetch(
      "https://mempool.space/api/v1/mining/hashrate/3d"
    );
    if (hashRes.ok) {
      const hashData = await hashRes.json();
      const latest = hashData.hashrates?.[hashData.hashrates.length - 1];
      if (latest) {
        const ehps = (latest.avgHashrate / 1e18).toFixed(2);
        results.push(`Hashrate: ${ehps} EH/s`);
      }
      if (hashData.difficulty?.[0]) {
        const diffT = (hashData.difficulty[0].difficulty / 1e12).toFixed(2);
        results.push(`Difficulty: ${diffT}T`);
      }
    }
  } catch (e) {
    console.error("Hashrate error:", e);
  }

  return results.join("\n");
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY is not configured");

    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    const body = await req.json().catch(() => ({}));
    const type: "news" | "market" = body.type === "news" ? "news" : "market";
    const today = new Date().toISOString().split("T")[0];

    // Check if a post for this category already exists today
    const { data: existingPosts, error: checkError } = await supabase
      .from("blog_posts")
      .select("id")
      .eq("category", type)
      .gte("published_at", `${today}T00:00:00.000Z`)
      .lt("published_at", `${today}T23:59:59.999Z`)
      .limit(1);

    if (checkError) {
      console.error("Check error:", checkError);
      throw new Error(`Database check error: ${checkError.message}`);
    }

    if (existingPosts && existingPosts.length > 0) {
      return new Response(
        JSON.stringify({ error: `A ${type === "news" ? "news" : "market"} report has already been generated today. Check back tomorrow!` }),
        { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    let systemPrompt: string;
    let userPrompt: string;

    if (type === "news") {
      const newsData = await fetchNewsData();
      systemPrompt = `You are a Bitcoin news analyst. Today is ${today}. You will be given REAL news headlines fetched from cryptocurrency news sources. Your job is to summarize and analyze ONLY these provided stories. DO NOT invent any news events, regulatory announcements, or price predictions that are not in the provided data.`;
      userPrompt = `Here are today's real Bitcoin news headlines:\n\n${newsData}\n\nWrite a compelling daily news briefing summarizing the most important stories above. Include a title and a 2-3 paragraph summary using markdown. Only discuss stories from the list above.`;
    } else {
      const marketData = await fetchMarketData();
      systemPrompt = `You are a Bitcoin market and network analyst. Today is ${today}. You will be given REAL market and network data. Your job is to analyze ONLY this provided data. DO NOT invent prices, statistics, or events not present in the data. Provide insightful analysis of the numbers.`;
      userPrompt = `Here is today's real Bitcoin market and network data:\n\n${marketData}\n\nWrite a daily market & network analysis report. Include a title and a 2-3 paragraph analysis using markdown. Only reference the data provided above.`;
    }

    const aiResponse = await fetch(
      "https://ai.gateway.lovable.dev/v1/chat/completions",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${LOVABLE_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "google/gemini-3-flash-preview",
          messages: [
            { role: "system", content: systemPrompt },
            { role: "user", content: userPrompt },
          ],
          tools: [
            {
              type: "function",
              function: {
                name: "create_blog_post",
                description: "Create a Bitcoin blog post",
                parameters: {
                  type: "object",
                  properties: {
                    title: { type: "string", description: "Blog post title" },
                    summary: {
                      type: "string",
                      description: "Blog post summary in markdown, 2-3 paragraphs",
                    },
                  },
                  required: ["title", "summary"],
                  additionalProperties: false,
                },
              },
            },
          ],
          tool_choice: {
            type: "function",
            function: { name: "create_blog_post" },
          },
        }),
      }
    );

    if (!aiResponse.ok) {
      const status = aiResponse.status;
      if (status === 429) {
        return new Response(
          JSON.stringify({ error: "Rate limited, please try again later." }),
          { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      if (status === 402) {
        return new Response(
          JSON.stringify({ error: "Payment required for AI usage." }),
          { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      const errorText = await aiResponse.text();
      console.error("AI gateway error:", status, errorText);
      throw new Error(`AI gateway error: ${status}`);
    }

    const aiData = await aiResponse.json();
    const toolCall = aiData.choices?.[0]?.message?.tool_calls?.[0];

    if (!toolCall) {
      throw new Error("AI did not return structured output");
    }

    const { title, summary } = JSON.parse(toolCall.function.arguments);

    const { data, error } = await supabase
      .from("blog_posts")
      .insert({ title, summary, category: type })
      .select()
      .single();

    if (error) {
      console.error("Database error:", error);
      throw new Error(`Database error: ${error.message}`);
    }

    console.log("Blog post created:", data.id, "category:", type);

    return new Response(JSON.stringify({ success: true, post: data }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("generate-blog-post error:", e);
    return new Response(
      JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
