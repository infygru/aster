#!/usr/bin/env node
/**
 * Create enterprise blog collections in Directus 11:
 *   blog_authors, blog_categories, blog_tags,
 *   blog_posts, blog_posts_tags (M2M junction)
 * + Relations, permissions, and seed data.
 */

const BASE_URL = 'https://api.asterhomecare.co.uk';
const EMAIL = 'admin@infygru.com';
const PASSWORD = 'Admin@123!';

async function getToken() {
  const r = await fetch(`${BASE_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: EMAIL, password: PASSWORD }),
  });
  const d = await r.json();
  if (!d?.data?.access_token) throw new Error('Login failed: ' + JSON.stringify(d));
  return d.data.access_token;
}

async function api(path, method = 'GET', body = null, token) {
  const headers = { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` };
  const r = await fetch(`${BASE_URL}${path}`, {
    method, headers, body: body ? JSON.stringify(body) : undefined,
  });
  const text = await r.text();
  try { return { ok: r.ok, status: r.status, data: JSON.parse(text) }; }
  catch { return { ok: r.ok, status: r.status, data: text }; }
}

async function createCollection(token, def) {
  console.log(`\n📦 Creating "${def.collection}"...`);
  const existing = await api(`/collections/${def.collection}`, 'GET', null, token);
  if (existing.ok) {
    console.log(`  ⚠ Already exists — deleting first`);
    await api(`/collections/${def.collection}`, 'DELETE', null, token);
  }
  const r = await api('/collections', 'POST', def, token);
  if (!r.ok) console.error(`  ✗`, JSON.stringify(r.data).substring(0, 300));
  else console.log(`  ✓ Created with embedded fields`);
}

async function createRelation(token, def) {
  const r = await api('/relations', 'POST', def, token);
  if (!r.ok) {
    const msg = JSON.stringify(r.data);
    if (msg.includes('already')) console.log(`  ⚠ Relation already exists`);
    else console.error(`  ✗ Relation failed:`, msg.substring(0, 200));
  } else {
    console.log(`  ✓ Relation: ${def.collection}.${def.field} → ${def.related_collection}`);
  }
}

async function createField(token, collection, fieldDef) {
  const r = await api(`/fields/${collection}`, 'POST', fieldDef, token);
  if (!r.ok) {
    const msg = JSON.stringify(r.data);
    if (msg.includes('already')) console.log(`  ⚠ Field "${fieldDef.field}" exists`);
    else console.error(`  ✗ Field "${fieldDef.field}":`, msg.substring(0, 200));
  } else {
    console.log(`  ✓ Field "${fieldDef.field}" created`);
  }
}

// ── COLLECTION DEFINITIONS ─────────────────────────────────────────────────

const BLOG_AUTHORS = {
  collection: 'blog_authors',
  meta: {
    icon: 'person', note: 'Blog post authors',
    display_template: '{{name}}', hidden: false, singleton: false,
    accountability: 'all', color: '#2A9D8F', sort: 6, collapse: 'open',
  },
  schema: {},
  fields: [
    { field: 'status', type: 'string', schema: { data_type: 'character varying', default_value: 'published', is_nullable: false }, meta: { interface: 'select-dropdown', display: 'labels', display_options: { choices: [{ text: 'Published', value: 'published', foreground: '#FFFFFF', background: '#2A9D8F' }, { text: 'Draft', value: 'draft', foreground: '#FFFFFF', background: '#8B9EB7' }] }, options: { choices: [{ text: 'Published', value: 'published' }, { text: 'Draft', value: 'draft' }] }, width: 'half', sort: 2 } },
    { field: 'name', type: 'string', schema: { data_type: 'character varying', is_nullable: false }, meta: { interface: 'input', required: true, width: 'half', sort: 3 } },
    { field: 'slug', type: 'string', schema: { data_type: 'character varying', is_nullable: false, is_unique: true }, meta: { interface: 'input', required: true, note: 'URL-friendly unique identifier', width: 'half', sort: 4 } },
    { field: 'job_title', type: 'string', schema: { data_type: 'character varying', is_nullable: true }, meta: { interface: 'input', width: 'half', sort: 5 } },
    { field: 'bio', type: 'text', schema: { data_type: 'text', is_nullable: true }, meta: { interface: 'input-multiline', width: 'full', sort: 6 } },
    { field: 'photo', type: 'uuid', schema: { data_type: 'uuid', is_nullable: true, foreign_key_table: 'directus_files', foreign_key_column: 'id' }, meta: { interface: 'file-image', special: ['file'], width: 'half', sort: 7 } },
    { field: 'email', type: 'string', schema: { data_type: 'character varying', is_nullable: true }, meta: { interface: 'input', width: 'half', sort: 8 } },
    { field: 'twitter_url', type: 'string', schema: { data_type: 'character varying', is_nullable: true }, meta: { interface: 'input', width: 'half', sort: 9 } },
    { field: 'linkedin_url', type: 'string', schema: { data_type: 'character varying', is_nullable: true }, meta: { interface: 'input', width: 'half', sort: 10 } },
    { field: 'website_url', type: 'string', schema: { data_type: 'character varying', is_nullable: true }, meta: { interface: 'input', width: 'half', sort: 11 } },
  ],
};

const BLOG_CATEGORIES = {
  collection: 'blog_categories',
  meta: {
    icon: 'folder', note: 'Blog post categories — supports parent/child hierarchy',
    display_template: '{{name}}', hidden: false, singleton: false,
    sort_field: 'sort', accountability: 'all', color: '#E9C46A', sort: 7, collapse: 'open',
  },
  schema: {},
  fields: [
    { field: 'status', type: 'string', schema: { data_type: 'character varying', default_value: 'published', is_nullable: false }, meta: { interface: 'select-dropdown', display: 'labels', display_options: { choices: [{ text: 'Published', value: 'published', foreground: '#FFFFFF', background: '#2A9D8F' }, { text: 'Draft', value: 'draft', foreground: '#FFFFFF', background: '#8B9EB7' }] }, options: { choices: [{ text: 'Published', value: 'published' }, { text: 'Draft', value: 'draft' }] }, width: 'half', sort: 2 } },
    { field: 'sort', type: 'integer', schema: { data_type: 'integer', is_nullable: true }, meta: { interface: 'input', hidden: true, sort: 3 } },
    { field: 'name', type: 'string', schema: { data_type: 'character varying', is_nullable: false }, meta: { interface: 'input', required: true, width: 'half', sort: 4 } },
    { field: 'slug', type: 'string', schema: { data_type: 'character varying', is_nullable: false, is_unique: true }, meta: { interface: 'input', required: true, width: 'half', sort: 5 } },
    { field: 'description', type: 'text', schema: { data_type: 'text', is_nullable: true }, meta: { interface: 'input-multiline', width: 'full', sort: 6 } },
    { field: 'color', type: 'string', schema: { data_type: 'character varying', default_value: '#2A9D8F', is_nullable: true }, meta: { interface: 'color', width: 'half', sort: 7 } },
    { field: 'featured_image', type: 'uuid', schema: { data_type: 'uuid', is_nullable: true, foreign_key_table: 'directus_files', foreign_key_column: 'id' }, meta: { interface: 'file-image', special: ['file'], width: 'half', sort: 8 } },
    // parent_category is added as a relation after collection creation
    { field: 'seo_title', type: 'string', schema: { data_type: 'character varying', is_nullable: true }, meta: { interface: 'input', note: 'Override SEO title (60 chars)', width: 'full', sort: 10 } },
    { field: 'seo_description', type: 'text', schema: { data_type: 'text', is_nullable: true }, meta: { interface: 'input-multiline', note: 'Override meta description (160 chars)', width: 'full', sort: 11 } },
  ],
};

const BLOG_TAGS = {
  collection: 'blog_tags',
  meta: {
    icon: 'label', note: 'Blog post tags',
    display_template: '{{name}}', hidden: false, singleton: false,
    accountability: 'all', color: '#1E3A5F', sort: 8, collapse: 'open',
  },
  schema: {},
  fields: [
    { field: 'name', type: 'string', schema: { data_type: 'character varying', is_nullable: false }, meta: { interface: 'input', required: true, width: 'half', sort: 2 } },
    { field: 'slug', type: 'string', schema: { data_type: 'character varying', is_nullable: false, is_unique: true }, meta: { interface: 'input', required: true, width: 'half', sort: 3 } },
    { field: 'description', type: 'text', schema: { data_type: 'text', is_nullable: true }, meta: { interface: 'input-multiline', width: 'full', sort: 4 } },
  ],
};

const BLOG_POSTS = {
  collection: 'blog_posts',
  meta: {
    icon: 'article', note: 'Blog posts — enterprise SEO-ready',
    display_template: '{{title}}', hidden: false, singleton: false,
    sort_field: 'sort', archive_field: 'status', archive_value: 'archived', unarchive_value: 'draft',
    accountability: 'all', color: '#2B5188', sort: 9, collapse: 'open',
  },
  schema: {},
  fields: [
    // Core
    { field: 'status', type: 'string', schema: { data_type: 'character varying', default_value: 'draft', is_nullable: false }, meta: { interface: 'select-dropdown', display: 'labels', display_options: { choices: [{ text: 'Published', value: 'published', foreground: '#FFFFFF', background: '#2A9D8F' }, { text: 'Draft', value: 'draft', foreground: '#FFFFFF', background: '#8B9EB7' }, { text: 'Scheduled', value: 'scheduled', foreground: '#FFFFFF', background: '#F4A261' }, { text: 'Archived', value: 'archived', foreground: '#FFFFFF', background: '#6B7280' }] }, options: { choices: [{ text: 'Published', value: 'published' }, { text: 'Draft', value: 'draft' }, { text: 'Scheduled', value: 'scheduled' }, { text: 'Archived', value: 'archived' }] }, width: 'half', sort: 2 } },
    { field: 'sort', type: 'integer', schema: { data_type: 'integer', is_nullable: true }, meta: { interface: 'input', hidden: true, sort: 3 } },
    { field: 'is_featured', type: 'boolean', schema: { data_type: 'boolean', default_value: false, is_nullable: false }, meta: { interface: 'boolean', note: 'Pin to top of blog listing as featured post', width: 'half', sort: 4 } },
    // Content
    { field: 'title', type: 'string', schema: { data_type: 'character varying', is_nullable: false }, meta: { interface: 'input', required: true, width: 'full', sort: 5 } },
    { field: 'slug', type: 'string', schema: { data_type: 'character varying', is_nullable: false, is_unique: true }, meta: { interface: 'input', required: true, note: 'URL-friendly identifier — auto-generate from title', width: 'half', sort: 6 } },
    { field: 'excerpt', type: 'text', schema: { data_type: 'text', is_nullable: true }, meta: { interface: 'input-multiline', required: true, note: 'Short summary shown on post cards and used as default meta description (160 chars)', width: 'full', sort: 7 } },
    { field: 'content', type: 'text', schema: { data_type: 'text', is_nullable: true }, meta: { interface: 'input-rich-text-html', note: 'Full post body (rich text)', width: 'full', sort: 8 } },
    { field: 'featured_image', type: 'uuid', schema: { data_type: 'uuid', is_nullable: true, foreign_key_table: 'directus_files', foreign_key_column: 'id' }, meta: { interface: 'file-image', special: ['file'], note: 'Hero image (1200×630 recommended for OG)', width: 'half', sort: 9 } },
    { field: 'featured_image_alt', type: 'string', schema: { data_type: 'character varying', is_nullable: true }, meta: { interface: 'input', note: 'Descriptive alt text for the featured image (required for accessibility)', width: 'half', sort: 10 } },
    // Taxonomy — author & category are M2O, added as FK fields + relation
    { field: 'author', type: 'uuid', schema: { data_type: 'uuid', is_nullable: true, foreign_key_table: 'blog_authors', foreign_key_column: 'id' }, meta: { interface: 'select-dropdown-m2o', special: ['m2o'], display: 'related-values', display_options: { template: '{{name}}' }, width: 'half', sort: 11 } },
    { field: 'category', type: 'uuid', schema: { data_type: 'uuid', is_nullable: true, foreign_key_table: 'blog_categories', foreign_key_column: 'id' }, meta: { interface: 'select-dropdown-m2o', special: ['m2o'], display: 'related-values', display_options: { template: '{{name}}' }, width: 'half', sort: 12 } },
    // Publishing
    { field: 'published_at', type: 'dateTime', schema: { data_type: 'timestamp with time zone', is_nullable: true }, meta: { interface: 'datetime', note: 'When the post goes live (schedule future dates)', width: 'half', sort: 13 } },
    { field: 'read_time', type: 'integer', schema: { data_type: 'integer', is_nullable: true }, meta: { interface: 'input', note: 'Estimated reading time in minutes (auto-calculate or set manually)', width: 'half', sort: 14 } },
    // SEO overrides
    { field: 'seo_title', type: 'string', schema: { data_type: 'character varying', is_nullable: true }, meta: { interface: 'input', note: 'Override browser tab title (60 chars max). Defaults to post title.', width: 'full', sort: 15 } },
    { field: 'seo_description', type: 'text', schema: { data_type: 'text', is_nullable: true }, meta: { interface: 'input-multiline', note: 'Override meta description (160 chars max). Defaults to excerpt.', width: 'full', sort: 16 } },
    { field: 'og_image', type: 'uuid', schema: { data_type: 'uuid', is_nullable: true, foreign_key_table: 'directus_files', foreign_key_column: 'id' }, meta: { interface: 'file-image', special: ['file'], note: 'Override Open Graph image. Defaults to featured image.', width: 'half', sort: 17 } },
    { field: 'canonical_url', type: 'string', schema: { data_type: 'character varying', is_nullable: true }, meta: { interface: 'input', note: 'Canonical URL (only set if this post is a copy/syndication)', width: 'half', sort: 18 } },
    { field: 'no_index', type: 'boolean', schema: { data_type: 'boolean', default_value: false, is_nullable: false }, meta: { interface: 'boolean', note: 'Prevent search engines from indexing this post', width: 'half', sort: 19 } },
    // Structured data
    { field: 'schema_type', type: 'string', schema: { data_type: 'character varying', default_value: 'BlogPosting', is_nullable: true }, meta: { interface: 'select-dropdown', note: 'JSON-LD schema type for structured data', options: { choices: [{ text: 'BlogPosting', value: 'BlogPosting' }, { text: 'Article', value: 'Article' }, { text: 'NewsArticle', value: 'NewsArticle' }] }, width: 'half', sort: 20 } },
    // Social / engagement
    { field: 'allow_comments', type: 'boolean', schema: { data_type: 'boolean', default_value: true, is_nullable: false }, meta: { interface: 'boolean', width: 'half', sort: 21 } },
  ],
};

const BLOG_POSTS_TAGS = {
  collection: 'blog_posts_tags',
  meta: {
    icon: 'import_export', note: 'Junction table — blog posts ↔ tags',
    hidden: true, singleton: false, accountability: 'all', sort: 10,
  },
  schema: {},
  fields: [
    { field: 'blog_posts_id', type: 'uuid', schema: { data_type: 'uuid', is_nullable: true, foreign_key_table: 'blog_posts', foreign_key_column: 'id' }, meta: { interface: 'select-dropdown-m2o', hidden: true, sort: 2 } },
    { field: 'blog_tags_id', type: 'uuid', schema: { data_type: 'uuid', is_nullable: true, foreign_key_table: 'blog_tags', foreign_key_column: 'id' }, meta: { interface: 'select-dropdown-m2o', hidden: true, sort: 3 } },
  ],
};

// ── SEED DATA ─────────────────────────────────────────────────────────────

const SEED_AUTHOR = {
  status: 'published',
  name: 'Sanjeev Srichandan',
  slug: 'sanjeev-srichandan',
  job_title: 'Registered Manager & Nominated Individual',
  bio: 'Sanjeev Srichandan is the Registered Manager and Nominated Individual at Aster Homecare UK Ltd. With extensive experience in domiciliary care management, Sanjeev is passionate about raising standards in home care and keeping families informed.',
};

const SEED_CATEGORIES = [
  { status: 'published', sort: 1, name: 'Care Tips', slug: 'care-tips', description: 'Practical advice for families and carers on delivering compassionate home care.', color: '#2A9D8F' },
  { status: 'published', sort: 2, name: 'Health & Wellbeing', slug: 'health-wellbeing', description: 'Articles on physical and mental health for elderly adults and their families.', color: '#1E3A5F' },
  { status: 'published', sort: 3, name: 'Company News', slug: 'company-news', description: 'Updates, milestones, and news from Aster Homecare UK.', color: '#E9C46A' },
  { status: 'published', sort: 4, name: 'Regulatory & CQC', slug: 'regulatory-cqc', description: 'Guidance on CQC standards, regulations, and compliance in UK home care.', color: '#2B5188' },
];

const SEED_TAGS = [
  { name: 'Personal Care', slug: 'personal-care' },
  { name: 'Dementia', slug: 'dementia' },
  { name: 'Medication', slug: 'medication' },
  { name: 'Loneliness', slug: 'loneliness' },
  { name: 'CQC', slug: 'cqc' },
  { name: 'Elderly Care', slug: 'elderly-care' },
  { name: 'Mental Health', slug: 'mental-health' },
  { name: 'Family Carers', slug: 'family-carers' },
  { name: 'Slough', slug: 'slough' },
  { name: 'Berkshire', slug: 'berkshire' },
];

function calcReadTime(html) {
  const text = html.replace(/<[^>]*>/g, '');
  return Math.max(1, Math.ceil(text.split(/\s+/).length / 200));
}

const POST_1_CONTENT = `<h2>What Does a CQC Rating Mean?</h2>
<p>The Care Quality Commission (CQC) is the independent regulator of health and adult social care in England. Every registered home care provider — including Aster Homecare UK — is inspected against five key questions:</p>
<ul>
  <li><strong>Is it Safe?</strong> — Are you protected from abuse and harm?</li>
  <li><strong>Is it Effective?</strong> — Does care, treatment and support achieve good outcomes?</li>
  <li><strong>Is it Caring?</strong> — Are staff compassionate and respectful?</li>
  <li><strong>Is it Responsive?</strong> — Is care organised to meet your individual needs?</li>
  <li><strong>Is it Well-led?</strong> — Is leadership focused on quality?</li>
</ul>
<h2>The Four CQC Ratings</h2>
<p>After an inspection, the CQC awards one of four ratings:</p>
<ol>
  <li><strong>Outstanding</strong> — Exceptional performance that others can learn from.</li>
  <li><strong>Good</strong> — Meeting expectations; people receive good care.</li>
  <li><strong>Requires Improvement</strong> — The provider isn't performing as well as it should.</li>
  <li><strong>Inadequate</strong> — There are serious problems, and action is being taken.</li>
</ol>
<h2>What to Look for When Choosing a Home Care Provider</h2>
<p>Before choosing a home care agency, we recommend checking the CQC's online directory at <a href="https://www.cqc.org.uk" target="_blank" rel="noopener noreferrer">cqc.org.uk</a>. Look for:</p>
<ul>
  <li>An up-to-date registration (providers must be registered to operate legally)</li>
  <li>The latest inspection report — read the full narrative, not just the rating</li>
  <li>How the provider responded to any concerns raised</li>
</ul>
<h2>Our Commitment at Aster Homecare</h2>
<p>Aster Homecare UK Ltd is a CQC-registered provider (Provider ID: 1-20633610286). We welcome transparency and inspection as vital tools for maintaining high standards. Our Nominated Individual and Registered Manager, Sanjeev Srichandan, is responsible for ensuring every aspect of our service meets and exceeds regulatory requirements.</p>
<p>If you have any questions about our CQC registration or would like to discuss your care needs, please <a href="/contact">contact our team</a>.</p>`;

const POST_2_CONTENT = `<h2>How Do You Know When It's Time?</h2>
<p>One of the most difficult decisions a family can face is recognising when a loved one needs more support than they — or the family — can provide alone. There is no single defining moment, but there are clear signs that home care may be the right next step.</p>
<h2>5 Signs to Watch For</h2>
<h3>1. Struggles With Personal Hygiene</h3>
<p>If you notice your parent wearing the same clothes repeatedly, bathing less frequently, or appearing unkempt — this may not be laziness or preference. It often signals that tasks like bathing, dressing, and grooming have become physically or cognitively difficult. A professional carer can support these routines with dignity and compassion.</p>
<h3>2. Missed Medications or Unsafe Medication Management</h3>
<p>Managing multiple medications is complex. Missed doses, double doses, or confusion about which tablets to take can have serious health consequences. If you find unused blister packs, out-of-date prescriptions, or your parent is unsure what medication they're taking, a medication support carer can help ensure safety.</p>
<h3>3. Unexplained Weight Loss or Poor Nutrition</h3>
<p>Check the fridge and cupboards. Spoiled food, very little variety, or evidence that your parent isn't cooking regularly are warning signs. Preparing nutritious meals can be challenging when mobility, energy, or cognitive function decline.</p>
<h3>4. Increasing Social Isolation</h3>
<p>Loneliness is a significant health risk for older adults — linked to depression, cognitive decline, and even early mortality. If your parent has stopped attending activities they used to enjoy, rarely leaves the house, or mentions feeling lonely, a companionship carer can provide vital human connection.</p>
<h3>5. Falls or Near-Misses at Home</h3>
<p>A fall is often the event that prompts urgent action — but it shouldn't have to be. If your parent is moving cautiously, holding onto walls, or has had near-misses, a home care assessment can identify risks and ensure someone is present to support safe movement.</p>
<h2>Taking the Next Step</h2>
<p>If any of these signs resonate, we'd encourage you to arrange a free, no-obligation care assessment. Our team will visit your parent at home, discuss their needs and preferences, and create a personalised care plan. There is no commitment required.</p>
<p><a href="/contact">Contact Aster Homecare today</a> to arrange your assessment.</p>`;

const POST_3_CONTENT = `<h2>Understanding Your Options</h2>
<p>When a parent or loved one begins to need more support, families are often faced with a fundamental choice: home care or a care home. Both are valid options depending on individual needs, preferences, and circumstances — but they are very different in approach and impact.</p>
<h2>The Case for Staying at Home</h2>
<p>Research consistently shows that most older adults strongly prefer to remain in their own home for as long as possible. The reasons are deeply personal:</p>
<ul>
  <li>Familiar surroundings reduce anxiety, particularly for those with dementia</li>
  <li>Independence and routine are maintained</li>
  <li>Pets, garden, and treasured possessions remain accessible</li>
  <li>Family can visit freely without visiting hours</li>
  <li>Care is one-to-one and personalised</li>
</ul>
<p>Home care — particularly domiciliary care — allows a trained carer to visit your home at agreed times to provide exactly the level of support needed. This could be a 30-minute morning call to help with washing and dressing, or full daily visits covering all personal care needs.</p>
<h2>When a Care Home May Be Right</h2>
<p>There are circumstances where 24-hour residential care is the safer or more appropriate choice:</p>
<ul>
  <li>Advanced dementia requiring constant supervision</li>
  <li>Complex medical needs that require nursing care around the clock</li>
  <li>When the individual can no longer safely be left alone for any period</li>
  <li>When the family carer is at risk of carer burnout without full-time support</li>
</ul>
<h2>Cost Considerations</h2>
<p>Home care is often significantly more cost-effective than a care home, particularly when only a few hours of support are needed each week. Care home fees in Berkshire currently average £900–£1,400 per week, while home care is charged per hour and scales with actual need.</p>
<p>Local authority funding may be available following a social care assessment carried out by your local council.</p>
<h2>Making the Right Decision</h2>
<p>There is no universally correct answer. The most important factor is the individual's own wishes. A frank conversation — ideally before a crisis arises — can help families understand what their loved one wants and plan accordingly.</p>
<p>At Aster Homecare, we offer a free, no-obligation home care assessment. We will honestly advise you if home care is — or isn't — the right option for your situation.</p>
<p><a href="/contact">Book a free assessment</a> or call us to discuss your needs.</p>`;

async function seedItems(token, collection, items, label) {
  console.log(`\n🌱 Seeding "${collection}" (${items.length} items)...`);
  const ids = [];
  for (const item of items) {
    const r = await api(`/items/${collection}`, 'POST', item, token);
    const name = item.name || item.title || item.slug;
    if (!r.ok) {
      const msg = JSON.stringify(r.data);
      if (msg.includes('unique') || msg.includes('duplicate')) {
        console.log(`  ⚠ Exists: ${name}`);
        // Fetch existing id
        const existing = await api(`/items/${collection}?filter[slug][_eq]=${item.slug}&limit=1`, 'GET', null, token);
        if (existing.ok && existing.data?.data?.[0]) ids.push(existing.data.data[0].id);
      } else {
        console.error(`  ✗ ${name}: ${msg.substring(0, 200)}`);
      }
    } else {
      console.log(`  ✓ ${name}`);
      ids.push(r.data?.data?.id);
    }
  }
  return ids;
}

async function setupPermissions(token) {
  console.log('\n🌐 Setting public read permissions...');
  const pr = await api('/policies?limit=50', 'GET', null, token);
  const pub = pr.data?.data?.find(p => p.name === '$t:public_label' || p.name === 'Public');
  if (!pub) { console.log('  ⚠ No public policy found'); return; }

  const cols = ['blog_posts', 'blog_categories', 'blog_tags', 'blog_authors', 'blog_posts_tags'];
  for (const col of cols) {
    const r = await api('/permissions', 'POST', {
      policy: pub.id, collection: col, action: 'read',
      fields: ['*'], permissions: {}, validation: {},
    }, token);
    if (r.ok) console.log(`  ✓ Public read: "${col}"`);
    else {
      const msg = JSON.stringify(r.data);
      if (msg.includes('unique')) console.log(`  ⚠ Already exists: "${col}"`);
      else console.log(`  ⚠ "${col}": ${msg.substring(0, 80)}`);
    }
  }
}

async function main() {
  console.log('🔐 Authenticating...');
  let token = await getToken();
  console.log('✓ Ready\n');

  // Create collections with embedded fields
  await createCollection(token, BLOG_AUTHORS);
  await createCollection(token, BLOG_CATEGORIES);
  await createCollection(token, BLOG_TAGS);
  await createCollection(token, BLOG_POSTS);
  await createCollection(token, BLOG_POSTS_TAGS);

  // Re-auth after collection creation
  token = await getToken();

  // ── M2O RELATIONS ──────────────────────────────────────────────────────────
  console.log('\n🔗 Creating M2O relations...');
  await createRelation(token, {
    collection: 'blog_posts', field: 'author', related_collection: 'blog_authors',
    schema: { on_delete: 'SET NULL' },
    meta: { many_collection: 'blog_posts', many_field: 'author', one_collection: 'blog_authors', one_field: null },
  });
  await createRelation(token, {
    collection: 'blog_posts', field: 'category', related_collection: 'blog_categories',
    schema: { on_delete: 'SET NULL' },
    meta: { many_collection: 'blog_posts', many_field: 'category', one_collection: 'blog_categories', one_field: null },
  });

  // ── M2M RELATIONS (posts ↔ tags via junction) ──────────────────────────────
  console.log('\n🔗 Creating M2M relations (posts ↔ tags)...');
  await createRelation(token, {
    collection: 'blog_posts_tags', field: 'blog_posts_id', related_collection: 'blog_posts',
    schema: { on_delete: 'CASCADE' },
    meta: { many_collection: 'blog_posts_tags', many_field: 'blog_posts_id', one_collection: 'blog_posts', one_field: 'tags', junction_field: 'blog_tags_id' },
  });
  await createRelation(token, {
    collection: 'blog_posts_tags', field: 'blog_tags_id', related_collection: 'blog_tags',
    schema: { on_delete: 'CASCADE' },
    meta: { many_collection: 'blog_posts_tags', many_field: 'blog_tags_id', one_collection: 'blog_tags', one_field: null, junction_field: 'blog_posts_id' },
  });

  // Try to create M2M alias field on blog_posts
  console.log('\n🏷  Creating M2M tags alias field on blog_posts...');
  token = await getToken();
  await createField(token, 'blog_posts', {
    field: 'tags',
    type: 'alias',
    schema: null,
    meta: {
      interface: 'list-m2m',
      special: ['m2m'],
      options: { template: '{{blog_tags_id.name}}' },
      display: 'related-values',
      display_options: { template: '{{blog_tags_id.name}}' },
      width: 'full',
      sort: 22,
    },
  });

  // ── PARENT CATEGORY self-referential relation ──────────────────────────────
  console.log('\n🔗 Creating parent_category self-relation on blog_categories...');
  token = await getToken();
  await createField(token, 'blog_categories', {
    field: 'parent_category',
    type: 'uuid',
    schema: { data_type: 'uuid', is_nullable: true, foreign_key_table: 'blog_categories', foreign_key_column: 'id' },
    meta: { interface: 'select-dropdown-m2o', special: ['m2o'], note: 'Optional parent category', width: 'half', sort: 9 },
  });
  await createRelation(token, {
    collection: 'blog_categories', field: 'parent_category', related_collection: 'blog_categories',
    schema: { on_delete: 'SET NULL' },
    meta: { many_collection: 'blog_categories', many_field: 'parent_category', one_collection: 'blog_categories', one_field: null },
  });

  // ── SEED DATA ─────────────────────────────────────────────────────────────
  token = await getToken();
  const [authorId] = await seedItems(token, 'blog_authors', [SEED_AUTHOR]);
  token = await getToken();
  const catIds = await seedItems(token, 'blog_categories', SEED_CATEGORIES);
  const [cqcCatId, healthCatId, , careTipsCatId] = catIds;
  token = await getToken();
  const tagIds = await seedItems(token, 'blog_tags', SEED_TAGS);
  // tagIds index: 0=personal-care, 1=dementia, 2=medication, 3=loneliness, 4=cqc, 5=elderly-care, 6=mental-health, 7=family-carers, 8=slough, 9=berkshire

  token = await getToken();
  const posts = [
    {
      status: 'published', is_featured: true, sort: 1,
      title: 'Understanding CQC Ratings: What They Mean for Your Home Care Choice',
      slug: 'understanding-cqc-ratings',
      excerpt: 'Choosing a home care provider is one of the most important decisions a family can make. Here\'s exactly what CQC ratings mean, how inspections work, and what to look for.',
      content: POST_1_CONTENT,
      author: authorId || null, category: cqcCatId || null,
      published_at: '2025-11-01T09:00:00Z',
      read_time: calcReadTime(POST_1_CONTENT),
      seo_title: 'What Are CQC Ratings? A Guide for Families Choosing Home Care',
      seo_description: 'Learn what CQC Outstanding, Good, Requires Improvement and Inadequate ratings mean — and how to use them to choose the right home care provider in Slough and Berkshire.',
      schema_type: 'Article', allow_comments: true, no_index: false,
    },
    {
      status: 'published', is_featured: false, sort: 2,
      title: '5 Signs Your Elderly Parent May Need Home Care Support',
      slug: 'signs-elderly-parent-needs-home-care',
      excerpt: 'Recognising when a loved one needs help at home isn\'t always obvious. These five signs can help families act early — before a crisis point is reached.',
      content: POST_2_CONTENT,
      author: authorId || null, category: careTipsCatId || null,
      published_at: '2025-11-15T09:00:00Z',
      read_time: calcReadTime(POST_2_CONTENT),
      seo_title: '5 Signs Your Elderly Parent Needs Home Care — Aster Homecare UK',
      seo_description: 'Are you concerned about an elderly parent? These five early warning signs could indicate it\'s time to arrange professional home care support in Slough and Berkshire.',
      schema_type: 'BlogPosting', allow_comments: true, no_index: false,
    },
    {
      status: 'published', is_featured: false, sort: 3,
      title: 'Home Care vs. Care Homes: Making the Right Choice for Your Family',
      slug: 'home-care-vs-care-homes',
      excerpt: 'When a parent needs more support, families face a difficult decision. We break down the key differences between home care and residential care to help you choose wisely.',
      content: POST_3_CONTENT,
      author: authorId || null, category: healthCatId || null,
      published_at: '2025-12-01T09:00:00Z',
      read_time: calcReadTime(POST_3_CONTENT),
      seo_title: 'Home Care vs. Care Home: Which Is Right for Your Family? | Aster Homecare',
      seo_description: 'Comparing domiciliary home care with residential care homes in Berkshire? Our guide covers costs, quality of life, and what research says about staying at home.',
      schema_type: 'Article', allow_comments: true, no_index: false,
    },
  ];

  const postIds = await seedItems(token, 'blog_posts', posts);

  // ── TAG ASSIGNMENTS ──────────────────────────────────────────────────────────
  if (postIds.length && tagIds.length) {
    token = await getToken();
    console.log('\n🏷  Assigning tags to posts...');
    const tagAssignments = [
      // Post 1 (CQC): tags[4]=cqc, tags[8]=slough, tags[9]=berkshire
      ...(tagIds[4] ? [{ blog_posts_id: postIds[0], blog_tags_id: tagIds[4] }] : []),
      ...(tagIds[8] ? [{ blog_posts_id: postIds[0], blog_tags_id: tagIds[8] }] : []),
      ...(tagIds[9] ? [{ blog_posts_id: postIds[0], blog_tags_id: tagIds[9] }] : []),
      // Post 2 (5 signs): tags[5]=elderly-care, tags[7]=family-carers, tags[3]=loneliness
      ...(tagIds[5] ? [{ blog_posts_id: postIds[1], blog_tags_id: tagIds[5] }] : []),
      ...(tagIds[7] ? [{ blog_posts_id: postIds[1], blog_tags_id: tagIds[7] }] : []),
      ...(tagIds[3] ? [{ blog_posts_id: postIds[1], blog_tags_id: tagIds[3] }] : []),
      // Post 3 (home care vs care home): tags[5]=elderly-care, tags[7]=family-carers, tags[8]=slough
      ...(tagIds[5] ? [{ blog_posts_id: postIds[2], blog_tags_id: tagIds[5] }] : []),
      ...(tagIds[7] ? [{ blog_posts_id: postIds[2], blog_tags_id: tagIds[7] }] : []),
      ...(tagIds[8] ? [{ blog_posts_id: postIds[2], blog_tags_id: tagIds[8] }] : []),
    ].filter(a => a.blog_posts_id && a.blog_tags_id);

    for (const a of tagAssignments) {
      const r = await api('/items/blog_posts_tags', 'POST', a, token);
      if (r.ok) console.log(`  ✓ Tag assigned`);
      else console.log(`  ⚠ Tag assign: ${JSON.stringify(r.data).substring(0, 80)}`);
    }
  }

  // ── PERMISSIONS ────────────────────────────────────────────────────────────
  token = await getToken();
  await setupPermissions(token);

  console.log('\n✅ Blog module ready!');
  console.log('\nCollections: blog_authors, blog_categories, blog_tags, blog_posts, blog_posts_tags');
  console.log('Seed: 1 author · 4 categories · 10 tags · 3 published posts');
}

main().catch(err => {
  console.error('\n❌', err.message || err);
  process.exit(1);
});
