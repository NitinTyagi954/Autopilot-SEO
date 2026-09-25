from django.test import TestCase
from apps.sites.models import Site
from apps.posts.models import Post
from apps.seo.models import PostSEO
from apps.taxonomy.models import Category, Tag

class CoreModelTestCase(TestCase):
    def setUp(self):
        self.site = Site.objects.create(
            name="Tech Blog",
            slug="tech-blog",
            domain="techblog.example.com",
            description="A cutting-edge tech publication"
        )
        self.category = Category.objects.create(
            site=self.site,
            name="Artificial Intelligence",
            slug="ai"
        )
        self.tag = Tag.objects.create(
            site=self.site,
            name="SEO",
            slug="seo"
        )

    def test_post_creation_and_seo(self):
        post = Post.objects.create(
            site=self.site,
            title="Building Agentic SEO Workflows",
            slug="building-agentic-seo-workflows",
            content={"type": "doc", "content": [{"type": "paragraph", "text": "Hello world"}]},
            category=self.category,
            status=Post.Status.DRAFT
        )
        post.tags.add(self.tag)

        # Create 1:1 SEO
        seo = PostSEO.objects.create(
            post=post,
            focus_keyword="agentic seo",
            seo_title="Agentic SEO Workflows Guide",
            meta_description="Learn how to build autonomous agentic SEO workflows."
        )

        self.assertEqual(post.site.name, "Tech Blog")
        self.assertEqual(post.category.name, "Artificial Intelligence")
        self.assertEqual(post.tags.count(), 1)
        self.assertEqual(post.seo.focus_keyword, "agentic seo")
        self.assertEqual(str(post), "Building Agentic SEO Workflows [draft]")

    def test_unique_slug_within_site(self):
        Post.objects.create(
            site=self.site,
            title="First Post",
            slug="first-post"
        )
        with self.assertRaises(Exception):
            Post.objects.create(
                site=self.site,
                title="Duplicate Slug Post",
                slug="first-post"
            )
