import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, ArrowRight, Clock, Calendar } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { MarkdownContent } from "@/components/app/markdown-content";
import { ArticlesHeader } from "@/components/articles/articles-header";
import type { Metadata } from "next";

interface ArticlePageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: ArticlePageProps): Promise<Metadata> {
  const { slug } = await params;
  const supabase = await createClient();
  const { data: article } = await supabase
    .from("articles")
    .select("title, meta_description, image_url")
    .eq("slug", slug)
    .single();

  if (!article) return { title: "Article Not Found | GoutWize" };

  return {
    title: `${article.title} | GoutWize`,
    description: article.meta_description,
    openGraph: {
      title: article.title,
      description: article.meta_description,
      ...(article.image_url && { images: [{ url: article.image_url }] }),
      type: "article",
    },
    twitter: {
      card: article.image_url ? "summary_large_image" : "summary",
      title: article.title,
      description: article.meta_description,
      ...(article.image_url && { images: [article.image_url] }),
    },
  };
}

export default async function ArticlePage({ params }: ArticlePageProps) {
  const { slug } = await params;
  const supabase = await createClient();
  const { data: article } = await supabase
    .from("articles")
    .select("*")
    .eq("slug", slug)
    .single();

  if (!article) notFound();

  return (
    <div className="min-h-screen bg-gw-bg-light">
      <ArticlesHeader />

      <main className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <Link
          href="/articles"
          className="inline-flex items-center gap-1 text-sm text-gw-text-gray hover:text-gw-blue transition-colors mb-8"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Articles
        </Link>

        <article>
          {/* Category + meta */}
          <div className="flex flex-wrap items-center gap-3 mb-4">
            <span className="bg-gw-blue/10 text-gw-blue px-3 py-1 rounded-full text-xs font-semibold capitalize">
              {article.category}
            </span>
            <span className="flex items-center gap-1 text-xs text-gw-text-gray">
              <Clock className="w-3.5 h-3.5" />
              {article.read_time} min read
            </span>
            <span className="flex items-center gap-1 text-xs text-gw-text-gray">
              <Calendar className="w-3.5 h-3.5" />
              {new Date(article.published_at).toLocaleDateString("en-US", {
                month: "long",
                day: "numeric",
                year: "numeric",
              })}
            </span>
          </div>

          {/* Title */}
          <h1 className="font-heading text-3xl sm:text-4xl font-bold text-gw-navy mb-6">
            {article.title}
          </h1>

          {/* Hero image */}
          {article.image_url && (
            <div className="relative w-full h-64 sm:h-80 rounded-2xl overflow-hidden mb-8">
              <Image
                src={article.image_url}
                alt={article.title}
                fill
                className="object-cover"
                priority
              />
            </div>
          )}

          {/* Tags */}
          {article.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-8">
              {article.tags.map((tag: string) => (
                <span
                  key={tag}
                  className="bg-gw-bg-mid text-gw-text-gray px-3 py-1 rounded-full text-xs"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}

          {/* Body */}
          <div className="bg-white rounded-2xl p-6 sm:p-8 shadow-sm">
            <MarkdownContent content={article.body} variant="full" />
          </div>
        </article>
      </main>

      {/* CTA Banner */}
      <section className="bg-gradient-to-r from-gw-blue to-gw-blue-dark py-16 mt-12">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="font-heading text-2xl sm:text-3xl font-bold text-white mb-4">
            Want personalized gout insights?
          </h2>
          <p className="text-white/90 mb-6 max-w-xl mx-auto">
            Join GoutWize to track your symptoms, connect with others, and discover what works for you.
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
