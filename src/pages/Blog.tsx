import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Calendar, Clock, User, Search, ArrowRight } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { supabase } from '@/integrations/supabase/client';

interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  image_url?: string;
  slug: string;
  published_at?: string;
  created_at: string;
  author_id: string;
}

const Blog = () => {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const loadBlogPosts = async () => {
      setIsLoading(true);
      try {
        const { data, error } = await supabase
          .from('blog_posts')
          .select('*')
          .eq('is_published', true)
          .order('published_at', { ascending: false });

        if (error) throw error;
        // Map the data to match our interface, using created_at as published_at
        const mappedPosts = data.map(post => ({
          ...post,
          published_at: post.created_at
        }));
        setPosts(mappedPosts);
      } catch (error) {
        console.error('Error loading blog posts:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadBlogPosts();
  }, []);

  const filteredPosts = posts.filter(post =>
    post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    post.excerpt?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="container mx-auto px-4 py-16">
          <div className="text-center">
            <div className="text-lg">Loading blog posts...</div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        {/* Page Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-serif font-bold text-foreground mb-4">
            Skincare Blog
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-8">
            Discover natural skincare tips, ingredient spotlights, and self-care rituals 
            to enhance your daily beauty routine.
          </p>
          
          {/* Search */}
          <div className="max-w-md mx-auto relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search blog posts..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        {/* Featured Post */}
        {filteredPosts.length > 0 && (
          <div className="mb-16">
            <Card className="overflow-hidden">
              <div className="grid lg:grid-cols-2">
                <div className="aspect-video lg:aspect-square bg-muted">
                  {filteredPosts[0].image_url ? (
                    <img
                      src={filteredPosts[0].image_url}
                      alt={filteredPosts[0].title}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-sage flex items-center justify-center text-primary-foreground">
                      <div className="text-center">
                        <h3 className="text-2xl font-serif font-bold mb-2">Featured Post</h3>
                        <p>Natural Skincare Tips</p>
                      </div>
                    </div>
                  )}
                </div>
                <CardContent className="p-8 flex flex-col justify-center">
                  <Badge className="w-fit mb-4">Featured</Badge>
                  <h2 className="text-3xl font-serif font-bold mb-4">
                    {filteredPosts[0].title}
                  </h2>
                  <p className="text-muted-foreground mb-6 leading-relaxed">
                    {filteredPosts[0].excerpt}
                  </p>
                  <div className="flex items-center gap-4 text-sm text-muted-foreground mb-6">
                    <div className="flex items-center gap-1">
                      <Calendar className="h-4 w-4" />
                      {formatDate(filteredPosts[0].published_at)}
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="h-4 w-4" />
                      5 min read
                    </div>
                  </div>
                  <Link to={`/blog/${filteredPosts[0].slug}`}>
                    <Button>
                      Read More
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </Link>
                </CardContent>
              </div>
            </Card>
          </div>
        )}

        {/* Blog Posts Grid */}
        {filteredPosts.length > 1 ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredPosts.slice(1).map((post) => (
              <Card key={post.id} className="overflow-hidden hover:shadow-natural transition-shadow duration-300">
                <div className="aspect-video bg-muted">
                  {post.image_url ? (
                    <img
                      src={post.image_url}
                      alt={post.title}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-earth flex items-center justify-center text-foreground">
                      <div className="text-center">
                        <h4 className="font-serif font-bold">Skincare</h4>
                        <p className="text-sm">Tips & Guides</p>
                      </div>
                    </div>
                  )}
                </div>
                <CardContent className="p-6">
                  <h3 className="text-xl font-serif font-semibold mb-3 line-clamp-2">
                    {post.title}
                  </h3>
                  <p className="text-muted-foreground mb-4 line-clamp-3">
                    {post.excerpt}
                  </p>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        {formatDate(post.published_at)}
                      </div>
                    </div>
                    <Link to={`/blog/${post.slug}`}>
                      <Button variant="ghost" size="sm">
                        Read More
                        <ArrowRight className="ml-1 h-3 w-3" />
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : filteredPosts.length === 0 ? (
          <div className="text-center py-16">
            <div className="mb-4">
              <Search className="mx-auto h-16 w-16 text-muted-foreground" />
            </div>
            <h3 className="text-xl font-semibold mb-2">No blog posts found</h3>
            <p className="text-muted-foreground mb-4">
              {searchTerm ? 'Try adjusting your search terms.' : 'No blog posts are available at the moment.'}
            </p>
            {searchTerm && (
              <Button variant="outline" onClick={() => setSearchTerm('')}>
                Clear Search
              </Button>
            )}
          </div>
        ) : null}
      </main>
      
      <Footer />
    </div>
  );
};

export default Blog;