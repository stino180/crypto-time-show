import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Newspaper, RefreshCw, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";

interface BlogPost {
  id: string;
  title: string;
  summary: string;
  source_urls: string[];
  published_at: string;
  created_at: string;
}

const fetchBlogPosts = async (): Promise<BlogPost[]> => {
  const { data, error } = await supabase
    .from("blog_posts")
    .select("*")
    .order("published_at", { ascending: false })
    .limit(5);

  if (error) throw error;
  return (data as BlogPost[]) ?? [];
};

export const BlogSection = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: posts, isLoading } = useQuery({
    queryKey: ["blog-posts"],
    queryFn: fetchBlogPosts,
    staleTime: 1000 * 60 * 5,
  });

  const generateMutation = useMutation({
    mutationFn: async () => {
      const { data, error } = await supabase.functions.invoke(
        "generate-blog-post"
      );
      if (error) throw error;
      if (data?.error) throw new Error(data.error);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["blog-posts"] });
      toast({
        title: "New post generated",
        description: "AI has summarized the latest Bitcoin news.",
      });
    },
    onError: (err: Error) => {
      toast({
        title: "Generation failed",
        description: err.message,
        variant: "destructive",
      });
    },
  });

  return (
    <section className="relative">
      {/* Section panel */}
      <div className="relative border border-amber-900/30 rounded-lg bg-stone-950/80 overflow-hidden">
        {/* Brass accent top bar */}
        <div className="h-1 bg-gradient-to-r from-transparent via-amber-700/40 to-transparent" />

        <div className="p-5 md:p-8">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-amber-900/30 flex items-center justify-center">
                <Newspaper className="w-4 h-4 text-orange-400" />
              </div>
              <div>
                <h2 className="font-['Nixie_One'] text-lg md:text-xl text-orange-400 tracking-wide">
                  AI NEWS BRIEFING
                </h2>
                <p className="font-['Special_Elite'] text-[10px] md:text-xs text-amber-200/40 tracking-wider mt-0.5">
                  Daily Bitcoin Intelligence
                </p>
              </div>
            </div>

            <Button
              variant="outline"
              size="sm"
              onClick={() => generateMutation.mutate()}
              disabled={generateMutation.isPending}
              className="border-amber-900/40 bg-stone-900/50 text-orange-400/80 hover:bg-amber-900/20 hover:text-orange-400 font-['Special_Elite'] text-xs tracking-wide"
            >
              {generateMutation.isPending ? (
                <RefreshCw className="w-3.5 h-3.5 mr-1.5 animate-spin" />
              ) : (
                <Sparkles className="w-3.5 h-3.5 mr-1.5" />
              )}
              {generateMutation.isPending ? "Generating..." : "Generate"}
            </Button>
          </div>

          {/* Posts */}
          <div className="space-y-4">
            {isLoading ? (
              Array.from({ length: 2 }).map((_, i) => (
                <div
                  key={i}
                  className="border border-amber-900/20 rounded-md p-4 bg-stone-900/30"
                >
                  <Skeleton className="h-5 w-3/4 mb-3 bg-amber-900/20" />
                  <Skeleton className="h-3 w-full mb-2 bg-amber-900/10" />
                  <Skeleton className="h-3 w-5/6 mb-2 bg-amber-900/10" />
                  <Skeleton className="h-3 w-2/3 bg-amber-900/10" />
                </div>
              ))
            ) : !posts?.length ? (
              <div className="text-center py-10 border border-amber-900/20 rounded-md bg-stone-900/20">
                <Newspaper className="w-8 h-8 text-amber-700/40 mx-auto mb-3" />
                <p className="font-['Special_Elite'] text-sm text-amber-200/40 tracking-wide">
                  No briefings yet
                </p>
                <p className="font-['Special_Elite'] text-xs text-amber-200/25 mt-1">
                  Click "Generate" to create the first AI news summary
                </p>
              </div>
            ) : (
              posts.map((post) => (
                <article
                  key={post.id}
                  className="border border-amber-900/20 rounded-md p-4 md:p-5 bg-stone-900/30 hover:bg-stone-900/50 transition-colors"
                >
                  <div className="flex items-start justify-between gap-3 mb-2">
                    <h3 className="font-['Nixie_One'] text-sm md:text-base text-orange-300/90 leading-tight">
                      {post.title}
                    </h3>
                    <time className="font-['Special_Elite'] text-[10px] text-amber-200/30 whitespace-nowrap mt-0.5">
                      {format(new Date(post.published_at), "MMM d, yyyy")}
                    </time>
                  </div>
                  <div className="font-['Special_Elite'] text-xs md:text-sm text-amber-200/50 leading-relaxed whitespace-pre-line">
                    {post.summary}
                  </div>
                </article>
              ))
            )}
          </div>
        </div>
      </div>
    </section>
  );
};
