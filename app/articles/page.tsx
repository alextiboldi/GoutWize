import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Clock, Calendar } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { ArticlesHeader } from "@/components/articles/articles-header";

export const metadata = {
  title: "Articles | GoutWize",
  description:
    "Expert articles on gout management, nutrition, medication, and lifestyle tips from the GoutWize community.",
};

interface ArticlesPageProps {
  searchParams: Promise<{ category?: string }>;
}

export default async function ArticlesPage({ searchParams }: ArticlesPageProps) {
  const { category } = await searchParams;
  const supabase = await createClient();

  let query = supabase
    .from("articles")
    .select("id, slug, title, excerpt, category, image_url, tags, read_time, published_at")
    .order("published_at", { ascending: false });

  if (category) {
    query = query.eq("category", category);
  }

  const { data: articles } = await query;

  // Get unique categories for filter chips
  const { data: allArticles } = await supabase
    .from("articles")
    .select("category");
  const categories = [...new Set(allArticles?.map((a) => a.category) ?? [])].sort();

  return (
    <div className="min-h-screen bg-gw-bg-light">
      <ArticlesHeader />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          <h1 className="font-heading text-3xl sm:text-4xl lg:text-5xl font-bold text-gw-navy mb-4">
            Articles
          </h1>
          <p className="text-lg text-gw-text-gray max-w-2xl mx-auto">
            Expert insights on gout management, nutrition, and living well.
          </p>
        </div>

        {/* Category filter chips */}
        {categories.length > 0 && (
          <div className="flex flex-wrap gap-2 justify-center mb-10">
            <Link
              href="/articles"
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                !category
                  ? "bg-gw-blue text-white"
                  : "bg-white text-gw-navy hover:bg-gw-bg-mid"
              }`}
            >
              All
            </Link>
            {categories.map((cat) => (
              <Link
                key={cat}
                href={`/articles?category=${encodeURIComponent(cat)}`}
                className={`px-4 py-2 rounded-full text-sm font-medium capitalize transition-all ${
                  category === cat
                    ? "bg-gw-blue text-white"
                    : "bg-white text-gw-navy hover:bg-gw-bg-mid"
                }`}
              >
                {cat}
              </Link>
            ))}
          </div>
        )}

        {/* Article cards grid */}
        {articles && articles.length > 0 ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {articles.map((article) => (
              <Link
                key={article.id}
                href={`/articles/${article.slug}`}
                className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-shadow duration-300 group"
              >
                {article.image_url && (
                  <div className="relative h-48 overflow-hidden">
                    <Image
                      src={article.image_url}
                      alt={article.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                )}
                <div className="p-6">
                  <span className="inline-block bg-gw-blue/10 text-gw-blue px-3 py-1 rounded-full text-xs font-semibold capitalize mb-3">
                    {article.category}
                  </span>
                  <h2 className="font-heading text-lg font-bold text-gw-navy mb-2 group-hover:text-gw-blue transition-colors">
                    {article.title}
                  </h2>
                  <p className="text-sm text-gw-text-gray line-clamp-3 mb-4">
                    {article.excerpt}
                  </p>
                  <div className="flex items-center gap-4 text-xs text-gw-text-gray">
                    <span className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5" />
                      {article.read_time} min read
                    </span>
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5" />
                      {new Date(article.published_at).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <p className="text-3xl mb-3">📝</p>
            <p className="font-semibold text-gw-navy text-lg">No articles yet</p>
            <p className="mt-2 text-gw-text-gray">Check back soon for expert gout management insights.</p>
          </div>
        )}
      </main>

      {/* CTA Banner */}
      <section className="bg-gradient-to-r from-gw-blue to-gw-blue-dark py-16">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="font-heading text-2xl sm:text-3xl font-bold text-white mb-4">
            Join the GoutWize Community
          </h2>
          <p className="text-white/90 mb-6 max-w-xl mx-auto">
            Connect with others, track your symptoms, and discover what works for you.
          </p>
          <Link
            href="/login"
            className="inline-flex items-center gap-2 bg-white text-gw-blue px-8 py-4 rounded-lg font-semibold text-lg hover:bg-gray-100 transition-all transform hover:scale-105 shadow-lg"
          >
            Get Started Free
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </section>
    </div>
  );
}
