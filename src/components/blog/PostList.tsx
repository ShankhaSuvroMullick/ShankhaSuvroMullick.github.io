import { motion } from 'framer-motion';
import type { BlogPost } from '../../types/blog';

export function PostList({ posts }: { posts: BlogPost[] }) {
  if (posts.length === 0) {
    return (
      <div className="py-24 text-center border border-dashed border-border rounded-lg">
        <p className="font-mono text-sm text-muted-foreground">// No posts yet — coming soon</p>
        <p className="text-xs text-muted-foreground mt-2">Technical deep-dives on market making, LOB systems, and AI engineering</p>
      </div>
    );
  }
  return (
    <div className="space-y-12">
      {posts.map((post, i) => (
        <motion.article key={post.slug}
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: i * 0.05 }}
          className="group space-y-3">
          <div className="flex items-center gap-3 text-xs font-mono text-muted-foreground">
            <time>{new Date(post.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</time>
            <span>·</span>
            <span>{post.readingTime} min read</span>
          </div>
          <h2 className="text-2xl font-display font-bold group-hover:text-muted-foreground transition-colors">
            <a href={`/blog/${post.slug}`}>{post.title}</a>
          </h2>
          <p className="text-muted-foreground leading-relaxed">{post.description}</p>
          <div className="flex flex-wrap gap-2">
            {post.tags.map(tag => (
              <span key={tag} className="text-xs font-mono px-2 py-0.5 rounded border border-border bg-secondary text-secondary-foreground">{tag}</span>
            ))}
          </div>
          <a href={`/blog/${post.slug}`} className="inline-flex items-center gap-1 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
            Read more →
          </a>
        </motion.article>
      ))}
    </div>
  );
}
