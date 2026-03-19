#!/usr/bin/env node
/**
 * Fix blog_posts FK field types (uuid→integer) and create proper relations.
 * Deletes and recreates blog_posts + blog_posts_tags with correct integer FKs.
 */
const BASE_URL = 'https://api.asterhomecare.co.uk';
const EMAIL = 'admin@infygru.com';
const PASSWORD = 'Admin@123!';

async function getToken() {
  const r = await fetch(`${BASE_URL}/auth/login`, {
    method: 'POST', headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: EMAIL, password: PASSWORD }),
  });
  const d = await r.json();
  return d.data.access_token;
}

async function api(path, method = 'GET', body = null, token) {
  const h = { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` };
  const r = await fetch(`${BASE_URL}${path}`, { method, headers: h, body: body ? JSON.stringify(body) : undefined });
  const t = await r.text();
  try { return { ok: r.ok, status: r.status, data: JSON.parse(t) }; }
  catch { return { ok: r.ok, status: r.status, data: t }; }
}

async function ok(label, r) {
  if (!r.ok) console.error(`  ✗ ${label}:`, JSON.stringify(r.data).substring(0, 200));
  else console.log(`  ✓ ${label}`);
}

// blog_posts with PLAIN INTEGER fields for author/category/og_image (no foreign_key_table)
// featured_image and og_image stay as uuid since directus_files uses uuid PK
const BLOG_POSTS_FIXED = {
  collection: 'blog_posts',
  meta: {
    icon: 'article', note: 'Blog posts — enterprise SEO-ready',
    display_template: '{{title}}', hidden: false, singleton: false,
    sort_field: 'sort', archive_field: 'status', archive_value: 'archived', unarchive_value: 'draft',
    accountability: 'all', color: '#2B5188', sort: 9, collapse: 'open',
  },
  schema: {},
  fields: [
    { field: 'status', type: 'string', schema: { data_type: 'character varying', default_value: 'draft', is_nullable: false }, meta: { interface: 'select-dropdown', display: 'labels', display_options: { choices: [{ text: 'Published', value: 'published', foreground: '#FFFFFF', background: '#2A9D8F' }, { text: 'Draft', value: 'draft', foreground: '#FFFFFF', background: '#8B9EB7' }, { text: 'Scheduled', value: 'scheduled', foreground: '#FFFFFF', background: '#F4A261' }, { text: 'Archived', value: 'archived', foreground: '#FFFFFF', background: '#6B7280' }] }, options: { choices: [{ text: 'Published', value: 'published' }, { text: 'Draft', value: 'draft' }, { text: 'Scheduled', value: 'scheduled' }, { text: 'Archived', value: 'archived' }] }, width: 'half', sort: 2 } },
    { field: 'sort', type: 'integer', schema: { data_type: 'integer', is_nullable: true }, meta: { interface: 'input', hidden: true, sort: 3 } },
    { field: 'is_featured', type: 'boolean', schema: { data_type: 'boolean', default_value: false, is_nullable: false }, meta: { interface: 'boolean', note: 'Pin to top of blog listing as featured post', width: 'half', sort: 4 } },
    { field: 'title', type: 'string', schema: { data_type: 'character varying', is_nullable: false }, meta: { interface: 'input', required: true, width: 'full', sort: 5 } },
    { field: 'slug', type: 'string', schema: { data_type: 'character varying', is_nullable: false, is_unique: true }, meta: { interface: 'input', required: true, note: 'URL-friendly identifier', width: 'half', sort: 6 } },
    { field: 'excerpt', type: 'text', schema: { data_type: 'text', is_nullable: true }, meta: { interface: 'input-multiline', required: true, note: 'Short summary (160 chars) — shown on post cards and used as default meta description', width: 'full', sort: 7 } },
    { field: 'content', type: 'text', schema: { data_type: 'text', is_nullable: true }, meta: { interface: 'input-rich-text-html', width: 'full', sort: 8 } },
    { field: 'featured_image', type: 'uuid', schema: { data_type: 'uuid', is_nullable: true, foreign_key_table: 'directus_files', foreign_key_column: 'id' }, meta: { interface: 'file-image', special: ['file'], note: 'Hero image (1200×630 recommended)', width: 'half', sort: 9 } },
    { field: 'featured_image_alt', type: 'string', schema: { data_type: 'character varying', is_nullable: true }, meta: { interface: 'input', note: 'Alt text for featured image (accessibility)', width: 'half', sort: 10 } },
    // INTEGER FK fields — no foreign_key_table so /relations can add the FK cleanly
    { field: 'author', type: 'integer', schema: { data_type: 'integer', is_nullable: true }, meta: { interface: 'select-dropdown-m2o', special: ['m2o'], display: 'related-values', display_options: { template: '{{name}}' }, width: 'half', sort: 11 } },
    { field: 'category', type: 'integer', schema: { data_type: 'integer', is_nullable: true }, meta: { interface: 'select-dropdown-m2o', special: ['m2o'], display: 'related-values', display_options: { template: '{{name}}' }, width: 'half', sort: 12 } },
    { field: 'published_at', type: 'dateTime', schema: { data_type: 'timestamp with time zone', is_nullable: true }, meta: { interface: 'datetime', note: 'Publish date/time (future = scheduled)', width: 'half', sort: 13 } },
    { field: 'read_time', type: 'integer', schema: { data_type: 'integer', is_nullable: true }, meta: { interface: 'input', note: 'Reading time in minutes', width: 'half', sort: 14 } },
    { field: 'seo_title', type: 'string', schema: { data_type: 'character varying', is_nullable: true }, meta: { interface: 'input', note: 'Override SEO title (60 chars max)', width: 'full', sort: 15 } },
    { field: 'seo_description', type: 'text', schema: { data_type: 'text', is_nullable: true }, meta: { interface: 'input-multiline', note: 'Override meta description (160 chars max)', width: 'full', sort: 16 } },
    { field: 'og_image', type: 'uuid', schema: { data_type: 'uuid', is_nullable: true, foreign_key_table: 'directus_files', foreign_key_column: 'id' }, meta: { interface: 'file-image', special: ['file'], note: 'Override OG image. Defaults to featured image.', width: 'half', sort: 17 } },
    { field: 'canonical_url', type: 'string', schema: { data_type: 'character varying', is_nullable: true }, meta: { interface: 'input', note: 'Canonical URL (only set for syndicated content)', width: 'half', sort: 18 } },
    { field: 'no_index', type: 'boolean', schema: { data_type: 'boolean', default_value: false, is_nullable: false }, meta: { interface: 'boolean', note: 'Exclude from search engine indexing', width: 'half', sort: 19 } },
    { field: 'schema_type', type: 'string', schema: { data_type: 'character varying', default_value: 'BlogPosting', is_nullable: true }, meta: { interface: 'select-dropdown', note: 'JSON-LD schema type', options: { choices: [{ text: 'BlogPosting', value: 'BlogPosting' }, { text: 'Article', value: 'Article' }, { text: 'NewsArticle', value: 'NewsArticle' }] }, width: 'half', sort: 20 } },
    { field: 'allow_comments', type: 'boolean', schema: { data_type: 'boolean', default_value: true, is_nullable: false }, meta: { interface: 'boolean', width: 'half', sort: 21 } },
  ],
};

// Junction with plain integer fields (no foreign_key_table — let /relations add FKs)
const BLOG_POSTS_TAGS_FIXED = {
  collection: 'blog_posts_tags',
  meta: { icon: 'import_export', note: 'Junction: blog posts ↔ tags', hidden: true, singleton: false, accountability: 'all', sort: 10 },
  schema: {},
  fields: [
    { field: 'blog_posts_id', type: 'integer', schema: { data_type: 'integer', is_nullable: true }, meta: { interface: 'select-dropdown-m2o', hidden: true, sort: 2 } },
    { field: 'blog_tags_id', type: 'integer', schema: { data_type: 'integer', is_nullable: true }, meta: { interface: 'select-dropdown-m2o', hidden: true, sort: 3 } },
  ],
};

function calcReadTime(html) {
  return Math.max(1, Math.ceil(html.replace(/<[^>]*>/g, '').split(/\s+/).length / 200));
}

const POST_1_CONTENT = `<h2>What Does a CQC Rating Mean?</h2><p>The Care Quality Commission (CQC) is the independent regulator of health and adult social care in England. Every registered home care provider — including Aster Homecare UK — is inspected against five key questions:</p><ul><li><strong>Is it Safe?</strong> — Are you protected from abuse and harm?</li><li><strong>Is it Effective?</strong> — Does care, treatment and support achieve good outcomes?</li><li><strong>Is it Caring?</strong> — Are staff compassionate and respectful?</li><li><strong>Is it Responsive?</strong> — Is care organised to meet your individual needs?</li><li><strong>Is it Well-led?</strong> — Is leadership focused on quality?</li></ul><h2>The Four CQC Ratings</h2><p>After an inspection, the CQC awards one of four ratings:</p><ol><li><strong>Outstanding</strong> — Exceptional performance that others can learn from.</li><li><strong>Good</strong> — Meeting expectations; people receive good care.</li><li><strong>Requires Improvement</strong> — The provider isn't performing as well as it should.</li><li><strong>Inadequate</strong> — There are serious problems, and action is being taken.</li></ol><h2>What to Look for When Choosing a Provider</h2><p>Before choosing a home care agency, check the CQC's directory at <a href="https://www.cqc.org.uk" target="_blank" rel="noopener noreferrer">cqc.org.uk</a>. Look for an up-to-date registration, the latest inspection report, and how the provider responded to any concerns raised.</p><h2>Our Commitment at Aster Homecare</h2><p>Aster Homecare UK Ltd is a CQC-registered provider (Provider ID: 1-20633610286). Our Nominated Individual and Registered Manager, Sanjeev Srichandan, ensures every aspect of our service meets and exceeds regulatory requirements. <a href="/contact">Contact our team</a> to arrange a free assessment.</p>`;

const POST_2_CONTENT = `<h2>How Do You Know When It's Time?</h2><p>One of the most difficult decisions a family can face is recognising when a loved one needs more support than they — or the family — can provide alone. There is no single defining moment, but there are clear signs that home care may be the right next step.</p><h2>5 Signs to Watch For</h2><h3>1. Struggles With Personal Hygiene</h3><p>If you notice your parent wearing the same clothes repeatedly, bathing less frequently, or appearing unkempt — this often signals that tasks like bathing, dressing, and grooming have become physically or cognitively difficult. A professional carer can support these routines with dignity and compassion.</p><h3>2. Missed or Unsafe Medication Management</h3><p>Managing multiple medications is complex. Missed doses, double doses, or confusion about which tablets to take can have serious health consequences. If you find unused blister packs or out-of-date prescriptions, a medication support carer can help ensure safety.</p><h3>3. Poor Nutrition or Unexplained Weight Loss</h3><p>Check the fridge and cupboards. Spoiled food, very little variety, or evidence that your parent isn't cooking regularly are warning signs. Preparing nutritious meals can be challenging when mobility, energy, or cognitive function decline.</p><h3>4. Increasing Social Isolation</h3><p>Loneliness is a significant health risk for older adults — linked to depression, cognitive decline, and even early mortality. If your parent has stopped attending activities they used to enjoy or mentions feeling lonely, a companionship carer can provide vital human connection.</p><h3>5. Falls or Near-Misses at Home</h3><p>A fall is often the event that prompts urgent action — but it shouldn't have to be. If your parent is moving cautiously or has had near-misses, a home care assessment can identify risks and ensure someone is present to support safe movement.</p><h2>Taking the Next Step</h2><p>If any of these signs resonate, arrange a free, no-obligation care assessment. <a href="/contact">Contact Aster Homecare today</a>.</p>`;

const POST_3_CONTENT = `<h2>Understanding Your Options</h2><p>When a parent or loved one begins to need more support, families are often faced with a fundamental choice: home care or a care home. Both are valid options depending on individual needs — but they are very different in approach and impact.</p><h2>The Case for Staying at Home</h2><p>Research consistently shows that most older adults strongly prefer to remain in their own home for as long as possible:</p><ul><li>Familiar surroundings reduce anxiety, particularly for those with dementia</li><li>Independence and routine are maintained</li><li>Pets, garden, and treasured possessions remain accessible</li><li>Family can visit freely without visiting hours</li><li>Care is one-to-one and personalised</li></ul><p>Home care allows a trained carer to visit your home at agreed times to provide exactly the level of support needed — from a 30-minute morning call to full daily visits.</p><h2>When a Care Home May Be Right</h2><p>There are circumstances where 24-hour residential care is the safer choice:</p><ul><li>Advanced dementia requiring constant supervision</li><li>Complex medical needs requiring nursing care around the clock</li><li>When the individual cannot safely be left alone for any period</li><li>When the family carer risks burnout without full-time support</li></ul><h2>Cost Considerations</h2><p>Home care is often significantly more cost-effective than a care home, particularly when only a few hours of support are needed each week. Care home fees in Berkshire currently average £900–£1,400 per week, while home care is charged per hour and scales with actual need.</p><h2>Making the Right Decision</h2><p>The most important factor is the individual's own wishes. At Aster Homecare, we offer a free, no-obligation home care assessment and will honestly advise you on the right option for your situation. <a href="/contact">Book a free assessment</a>.</p>`;

async function main() {
  console.log('🔐 Auth...');
  let token = await getToken();

  // Delete and recreate blog_posts and blog_posts_tags
  for (const col of ['blog_posts_tags', 'blog_posts']) {
    console.log(`\n🗑  Deleting "${col}"...`);
    const r = await api(`/collections/${col}`, 'DELETE', null, token);
    console.log(r.ok ? `  ✓ Deleted` : `  ⚠ ${JSON.stringify(r.data).substring(0, 100)}`);
  }

  token = await getToken();

  console.log('\n📦 Creating blog_posts (integer FKs)...');
  await ok('blog_posts', await api('/collections', 'POST', BLOG_POSTS_FIXED, token));

  token = await getToken();
  console.log('\n📦 Creating blog_posts_tags (integer FKs)...');
  await ok('blog_posts_tags', await api('/collections', 'POST', BLOG_POSTS_TAGS_FIXED, token));

  token = await getToken();
  // Now create relations — these will create DB FK + Directus metadata
  console.log('\n🔗 Relations (blog_posts.author → blog_authors)...');
  await ok('author relation', await api('/relations', 'POST', {
    collection: 'blog_posts', field: 'author', related_collection: 'blog_authors',
    schema: { on_delete: 'SET NULL' },
    meta: { many_collection: 'blog_posts', many_field: 'author', one_collection: 'blog_authors', one_field: null },
  }, token));

  await ok('category relation', await api('/relations', 'POST', {
    collection: 'blog_posts', field: 'category', related_collection: 'blog_categories',
    schema: { on_delete: 'SET NULL' },
    meta: { many_collection: 'blog_posts', many_field: 'category', one_collection: 'blog_categories', one_field: null },
  }, token));

  console.log('\n🔗 M2M relations (blog_posts_tags)...');
  token = await getToken();
  await ok('posts_tags → posts', await api('/relations', 'POST', {
    collection: 'blog_posts_tags', field: 'blog_posts_id', related_collection: 'blog_posts',
    schema: { on_delete: 'CASCADE' },
    meta: { many_collection: 'blog_posts_tags', many_field: 'blog_posts_id', one_collection: 'blog_posts', one_field: 'tags', junction_field: 'blog_tags_id' },
  }, token));

  token = await getToken();
  await ok('posts_tags → tags', await api('/relations', 'POST', {
    collection: 'blog_posts_tags', field: 'blog_tags_id', related_collection: 'blog_tags',
    schema: { on_delete: 'CASCADE' },
    meta: { many_collection: 'blog_posts_tags', many_field: 'blog_tags_id', one_collection: 'blog_tags', one_field: null, junction_field: 'blog_posts_id' },
  }, token));

  // Add M2M alias field on blog_posts
  console.log('\n🏷  Tags alias field on blog_posts...');
  token = await getToken();
  await ok('tags alias', await api('/fields/blog_posts', 'POST', {
    field: 'tags', type: 'alias', schema: null,
    meta: { interface: 'list-m2m', special: ['m2m'], options: { template: '{{blog_tags_id.name}}' }, display: 'related-values', display_options: { template: '{{blog_tags_id.name}}' }, width: 'full', sort: 22 },
  }, token));

  // Re-add public permissions for recreated collections
  console.log('\n🌐 Public read permissions...');
  token = await getToken();
  const pr = await api('/policies?limit=50', 'GET', null, token);
  const pub = pr.data?.data?.find(p => p.name === '$t:public_label' || p.name === 'Public');
  if (pub) {
    for (const col of ['blog_posts', 'blog_posts_tags']) {
      await ok(`public read ${col}`, await api('/permissions', 'POST', {
        policy: pub.id, collection: col, action: 'read', fields: ['*'], permissions: {}, validation: {},
      }, token));
    }
  }

  // Seed posts with correct integer IDs
  console.log('\n🌱 Seeding 3 blog posts...');
  token = await getToken();
  const postIds = [];
  const postsData = [
    {
      status: 'published', is_featured: true, sort: 1,
      title: 'Understanding CQC Ratings: What They Mean for Your Home Care Choice',
      slug: 'understanding-cqc-ratings',
      excerpt: "Choosing a home care provider is one of the most important decisions a family can make. Here's exactly what CQC ratings mean, how inspections work, and what to look for.",
      content: POST_1_CONTENT,
      author: 1, category: 4, // Regulatory & CQC
      published_at: '2025-11-01T09:00:00+00:00',
      read_time: calcReadTime(POST_1_CONTENT),
      seo_title: 'What Are CQC Ratings? A Guide for Families Choosing Home Care',
      seo_description: 'Learn what CQC Outstanding, Good, Requires Improvement and Inadequate ratings mean — and how to use them to choose the right home care provider in Slough and Berkshire.',
      schema_type: 'Article', allow_comments: true, no_index: false,
    },
    {
      status: 'published', is_featured: false, sort: 2,
      title: '5 Signs Your Elderly Parent May Need Home Care Support',
      slug: 'signs-elderly-parent-needs-home-care',
      excerpt: "Recognising when a loved one needs help at home isn't always obvious. These five signs can help families act early — before a crisis point is reached.",
      content: POST_2_CONTENT,
      author: 1, category: 1, // Care Tips
      published_at: '2025-11-15T09:00:00+00:00',
      read_time: calcReadTime(POST_2_CONTENT),
      seo_title: '5 Signs Your Elderly Parent Needs Home Care — Aster Homecare UK',
      seo_description: 'Are you concerned about an elderly parent? These five early warning signs could indicate it\'s time to arrange professional home care support in Slough and Berkshire.',
      schema_type: 'BlogPosting', allow_comments: true, no_index: false,
    },
    {
      status: 'published', is_featured: false, sort: 3,
      title: 'Home Care vs. Care Homes: Making the Right Choice for Your Family',
      slug: 'home-care-vs-care-homes',
      excerpt: "When a parent needs more support, families face a difficult decision. We break down the key differences between home care and residential care to help you choose wisely.",
      content: POST_3_CONTENT,
      author: 1, category: 2, // Health & Wellbeing
      published_at: '2025-12-01T09:00:00+00:00',
      read_time: calcReadTime(POST_3_CONTENT),
      seo_title: 'Home Care vs. Care Home: Which Is Right for Your Family? | Aster Homecare',
      seo_description: 'Comparing domiciliary home care with residential care homes in Berkshire? Our guide covers costs, quality of life, and what research says about staying at home.',
      schema_type: 'Article', allow_comments: true, no_index: false,
    },
  ];

  for (const post of postsData) {
    const r = await api('/items/blog_posts', 'POST', post, token);
    if (r.ok) {
      console.log(`  ✓ "${post.title.substring(0, 50)}..."`);
      postIds.push(r.data.data.id);
    } else {
      console.error(`  ✗ "${post.slug}": ${JSON.stringify(r.data).substring(0, 200)}`);
    }
  }

  // Assign tags to posts
  if (postIds.length === 3) {
    token = await getToken();
    console.log('\n🏷  Assigning tags...');
    const assigns = [
      // Post 1 (CQC): tags 5=CQC, 9=Slough, 10=Berkshire
      { blog_posts_id: postIds[0], blog_tags_id: 5 },
      { blog_posts_id: postIds[0], blog_tags_id: 9 },
      { blog_posts_id: postIds[0], blog_tags_id: 10 },
      // Post 2 (5 signs): tags 6=Elderly Care, 8=Family Carers, 4=Loneliness
      { blog_posts_id: postIds[1], blog_tags_id: 6 },
      { blog_posts_id: postIds[1], blog_tags_id: 8 },
      { blog_posts_id: postIds[1], blog_tags_id: 4 },
      // Post 3 (vs care home): tags 6=Elderly Care, 8=Family Carers, 9=Slough
      { blog_posts_id: postIds[2], blog_tags_id: 6 },
      { blog_posts_id: postIds[2], blog_tags_id: 8 },
      { blog_posts_id: postIds[2], blog_tags_id: 9 },
    ];
    for (const a of assigns) {
      const r = await api('/items/blog_posts_tags', 'POST', a, token);
      if (!r.ok) console.log(`  ⚠ ${JSON.stringify(r.data).substring(0, 80)}`);
      else console.log(`  ✓ post ${a.blog_posts_id} ← tag ${a.blog_tags_id}`);
    }
  }

  console.log('\n✅ Blog relations and seed data complete!');
}

main().catch(e => { console.error('❌', e.message); process.exit(1); });
