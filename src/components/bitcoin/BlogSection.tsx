import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Newspaper, RefreshCw, Sparkles, TrendingUp, Globe } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";

interface BlogPost {
  id: string;
  title: string;
  summary: string;
  source_urls: string[];
  published_at: string;
  created_at: string;
  category: string;
}

const fetchBlogPosts = async (category: string): Promise<BlogPost[]> => {
  const { data, error } = await supabase
    .from("blog_posts")
    .select("*")
    .eq("category", category)
    .order("published_at", { ascending: false })
    .limit(5);
  if (error) throw error;
  return (data as BlogPost[]) ?? [];
};

const PostList = ({ category }: { category: string }) => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: posts, isLoading } = useQuery({
    queryKey: ["blog-posts", category],
    queryFn: () => fetchBlogPosts(category),
    staleTime: 1000 * 60 * 5,
  });

  const generateMutation = useMutation({
    mutationFn: async () => {
      const { data, error } = await supabase.functions.invoke("generate-blog-post", { body: { type: category } });
      if (error) throw error;
      if (data?.error) throw new Error(data.error);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["blog-posts", category] });
      toast({ title: category === "news" ? "News briefing generated" : "Market report generated", description: "AI has analyzed the latest Bitcoin data." });
    },
    onError: (err: Error) => {
      toast({ title: "Generation failed", description: err.message, variant: "destructive" });
    },
  });

  const EmptyIcon = category === "news" ? Globe : TrendingUp;

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <Button
          variant="outline"
          size="sm"
          onClick={() => generateMutation.mutate()}
          disabled={generateMutation.isPending}
          className="stpk-btn font-['Special_Elite'] text-xs tracking-wide"
        >
          {generateMutation.isPending ? (
            <RefreshCw className="w-3.5 h-3.5 mr-1.5 animate-spin" />
          ) : (
            <Sparkles className="w-3.5 h-3.5 mr-1.5" />
          )}
          {generateMutation.isPending ? "Generating..." : category === "news" ? "Generate News" : "Generate Report"}
        </Button>
      </div>

      {isLoading ? (
        Array.from({ length: 2 }).map((_, i) => (
          <div key={i} className="stpk-article rounded-md p-4">
            <Skeleton className="h-5 w-3/4 mb-3 stpk-skeleton" />
            <Skeleton className="h-3 w-full mb-2 stpk-skeleton-sm" />
            <Skeleton className="h-3 w-5/6 mb-2 stpk-skeleton-sm" />
            <Skeleton className="h-3 w-2/3 stpk-skeleton-sm" />
          </div>
        ))
      ) : !posts?.length ? (
        <div className="text-center py-10 stpk-empty rounded-md">
          <EmptyIcon className="w-8 h-8 stpk-empty-icon mx-auto mb-3" />
          <p className="font-['Special_Elite'] text-sm stpk-label tracking-wide">
            {category === "news" ? "No news briefings yet" : "No market reports yet"}
          </p>
          <p className="font-['Special_Elite'] text-xs stpk-sublabel mt-1">
            Click "Generate" to create an AI-powered {category === "news" ? "news summary" : "market analysis"}
          </p>
        </div>
      ) : (
        posts.map((post) => (
          <article key={post.id} className="stpk-article rounded-md p-4 md:p-5 transition-colors">
            <div className="flex items-start justify-between gap-3 mb-2">
              <h3 className="font-['Nixie_One'] text-sm md:text-base stpk-nixie leading-tight">
                {post.title}
              </h3>
              <time className="font-['Special_Elite'] text-[10px] stpk-sublabel whitespace-nowrap mt-0.5">
                {format(new Date(post.published_at), "MMM d, yyyy")}
              </time>
            </div>
            <div className="font-['Special_Elite'] text-xs md:text-sm stpk-label leading-relaxed whitespace-pre-line">
              {post.summary}
            </div>
          </article>
        ))
      )}
    </div>
  );
};

export const BlogSection = () => {
  return (
    <section className="relative">
      <div className="relative stpk-section rounded-lg overflow-hidden">
        <div className="h-1 stpk-trim" />

        <div className="p-5 md:p-8">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-8 h-8 rounded-full stpk-display flex items-center justify-center">
              <Newspaper className="w-4 h-4 stpk-nixie" />
            </div>
            <div>
              <h2 className="font-['Nixie_One'] text-lg md:text-xl stpk-heading tracking-wide">
                AI INTELLIGENCE
              </h2>
              <p className="font-['Special_Elite'] text-[10px] md:text-xs stpk-sublabel tracking-wider mt-0.5">
                News & Market Analysis
              </p>
            </div>
          </div>

          <Tabs defaultValue="news" className="w-full">
            <TabsList className="stpk-tabs-list mb-5 w-full justify-start">
              <TabsTrigger value="news" className="font-['Special_Elite'] text-xs tracking-wide data-[state=active]:bg-primary/20 data-[state=active]:text-primary stpk-label">
                <Globe className="w-3.5 h-3.5 mr-1.5" />
                News & Regulatory
              </TabsTrigger>
              <TabsTrigger value="market" className="font-['Special_Elite'] text-xs tracking-wide data-[state=active]:bg-primary/20 data-[state=active]:text-primary stpk-label">
                <TrendingUp className="w-3.5 h-3.5 mr-1.5" />
                Market & Network
              </TabsTrigger>
            </TabsList>
            <TabsContent value="news"><PostList category="news" /></TabsContent>
            <TabsContent value="market"><PostList category="market" /></TabsContent>
          </Tabs>
        </div>
      </div>
    </section>
  );
};
