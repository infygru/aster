const BASE = 'https://api.asterhomecare.co.uk';
const EMAIL = 'admin@infygru.com';
const PASSWORD = 'Admin@123!';

// Minimal valid 1x1 red PNG in hex
const PNG_HEX = '89504e470d0a1a0a0000000d494844520000000100000001080200000090wc3d680000000c4944415408d7636068f8ff00000200017d70c0000000049454e44ae426082';
// Actually let's use a known working minimal PNG
const PNG_BYTES = Buffer.from(
  '89504e470d0a1a0a' + // PNG signature
  '0000000d49484452' + // IHDR chunk length=13, type
  '00000001' +         // width=1
  '00000001' +         // height=1
  '08' +               // bit depth=8
  '02' +               // color type=2 (RGB)
  '000000' +           // compression, filter, interlace
  '90wc3d68' +         // IHDR CRC (will fix)
  '0000000c49444154' + // IDAT chunk
  '08d763f8cfc00000' +
  '00020001' +
  'e221bc33' +         // CRC
  '0000000049454e44' + // IEND
  'ae426082',          // IEND CRC
  'hex'
);

// Use a real minimal PNG - 1x1 pixel red PNG
function getMinimalPNG() {
  // This is a known-valid 1x1 red PNG, base64 encoded
  const b64 = 'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAIAAACQd1PeAAAADklEQVQI12P4z8BQDwADhQGAWjR9awAAAABJRU5ErkJggg==';
  return Buffer.from(b64, 'base64');
}

let jwt = '';

async function login() {
  const res = await fetch(`${BASE}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: EMAIL, password: PASSWORD })
  });
  const data = await res.json();
  if (data.data?.access_token) {
    jwt = data.data.access_token;
    console.log('✓ Login successful');
    return true;
  }
  console.error('✗ Login failed:', JSON.stringify(data));
  return false;
}

async function get(path) {
  const res = await fetch(`${BASE}${path}`, {
    headers: { 'Authorization': `Bearer ${jwt}` }
  });
  return res.json();
}

async function post(path, body, isForm = false) {
  const opts = {
    method: 'POST',
    headers: { 'Authorization': `Bearer ${jwt}` }
  };
  if (isForm) {
    opts.body = body;
  } else {
    opts.headers['Content-Type'] = 'application/json';
    opts.body = JSON.stringify(body);
  }
  const res = await fetch(`${BASE}${path}`, opts);
  return res.json();
}

async function patch(path, body) {
  const res = await fetch(`${BASE}${path}`, {
    method: 'PATCH',
    headers: {
      'Authorization': `Bearer ${jwt}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(body)
  });
  return res.json();
}

async function del(path) {
  const res = await fetch(`${BASE}${path}`, {
    method: 'DELETE',
    headers: { 'Authorization': `Bearer ${jwt}` }
  });
  return res.status;
}

async function uploadTestPNG(filename = 'test-image.png') {
  const pngBytes = getMinimalPNG();
  const form = new FormData();
  const blob = new Blob([pngBytes], { type: 'image/png' });
  form.append('file', blob, filename);
  const res = await fetch(`${BASE}/files`, {
    method: 'POST',
    headers: { 'Authorization': `Bearer ${jwt}` },
    body: form
  });
  return res.json();
}

// ==================== TASK 1: Collection Inventory ====================
async function inventoryCollections() {
  console.log('\n========== TASK 1: COLLECTION INVENTORY ==========');
  const data = await get('/collections');
  const allCollections = data.data || [];
  const custom = allCollections.filter(c => !c.collection.startsWith('directus_'));
  console.log(`\nCustom collections (${custom.length}):`);

  const collectionInfo = {};
  for (const col of custom) {
    const colName = col.collection;
    const fieldsData = await get(`/fields/${colName}`);
    const fields = fieldsData.data || [];
    const fileFields = fields.filter(f =>
      f.type === 'uuid' && (
        f.meta?.interface === 'file-image' ||
        f.meta?.interface === 'file' ||
        f.meta?.special?.includes('file')
      )
    );
    const allFileFields = fields.filter(f =>
      f.meta?.special?.includes('file') ||
      f.meta?.interface === 'file-image' ||
      f.meta?.interface === 'file'
    );

    console.log(`\n  ${colName}:`);
    console.log(`    Fields: ${fields.length}`);
    console.log(`    Singleton: ${col.meta?.singleton || false}`);

    if (allFileFields.length > 0) {
      console.log(`    FILE FIELDS:`);
      for (const ff of allFileFields) {
        console.log(`      - ${ff.field} (type=${ff.type}, interface=${ff.meta?.interface}, special=${JSON.stringify(ff.meta?.special)})`);
      }
    }

    collectionInfo[colName] = {
      singleton: col.meta?.singleton || false,
      fields: fields.map(f => ({
        field: f.field,
        type: f.type,
        interface: f.meta?.interface,
        special: f.meta?.special,
        required: f.meta?.required
      })),
      fileFields: allFileFields.map(f => f.field)
    };
  }
  return collectionInfo;
}

// ==================== TASK 2: Test Image Upload ====================
async function testImageUpload(collectionInfo) {
  console.log('\n========== TASK 2: IMAGE UPLOAD TESTS ==========');

  // Upload a test image
  console.log('\nUploading test PNG...');
  const uploadResult = await uploadTestPNG('audit-test.png');

  if (!uploadResult.data?.id) {
    console.error('✗ Failed to upload PNG:', JSON.stringify(uploadResult));
    return null;
  }
  const fileId = uploadResult.data.id;
  console.log(`✓ Uploaded PNG, file ID: ${fileId}`);

  // Test each collection's file fields
  const results = {};
  for (const [colName, info] of Object.entries(collectionInfo)) {
    if (info.fileFields.length === 0) continue;

    console.log(`\n  Testing file fields in ${colName}...`);
    results[colName] = {};

    for (const field of info.fileFields) {
      // Try creating/patching with file ID
      if (info.singleton) {
        const r = await patch(`/items/${colName}`, { [field]: fileId });
        const ok = !r.errors && r.data;
        console.log(`    ${ok ? '✓' : '✗'} ${field}: ${ok ? 'OK' : JSON.stringify(r.errors)}`);
        results[colName][field] = { success: ok, error: r.errors };
      } else {
        // Create a minimal item with the file field
        const testBody = { [field]: fileId, status: 'published' };
        // Add required text fields
        const textFields = info.fields.filter(f =>
          (f.type === 'string' || f.type === 'text') &&
          f.required &&
          f.field !== 'status' &&
          !f.field.startsWith('directus_')
        );
        for (const tf of textFields) {
          testBody[tf.field] = `Test ${tf.field}`;
        }
        const r = await post(`/items/${colName}`, testBody);
        const ok = !r.errors && r.data;
        console.log(`    ${ok ? '✓' : '✗'} ${field}: ${ok ? 'OK (item id=' + r.data?.id + ')' : JSON.stringify(r.errors)}`);
        results[colName][field] = { success: ok, error: r.errors, itemId: r.data?.id };
        // Delete test item
        if (r.data?.id) {
          await del(`/items/${colName}/${r.data.id}`);
        }
      }
    }
  }

  return { fileId, results };
}

// ==================== TASK 3: Check Relations ====================
async function checkRelations() {
  console.log('\n========== TASK 3: RELATIONS AUDIT ==========');
  const data = await get('/relations');
  const relations = (data.data || []).filter(r =>
    !r.collection?.startsWith('directus_') && !r.related_collection?.startsWith('directus_')
  );

  console.log(`\nCustom relations (${relations.length}):`);
  for (const r of relations) {
    console.log(`  ${r.collection}.${r.field} -> ${r.related_collection} (${r.meta?.one_collection_field ? 'M2M' : 'M2O'})`);
  }

  // Check blog-specific relations
  const blogRelations = relations.filter(r =>
    r.collection?.includes('blog') || r.related_collection?.includes('blog')
  );
  console.log(`\nBlog relations (${blogRelations.length}):`);
  for (const r of blogRelations) {
    console.log(`  ${r.collection}.${r.field} -> ${r.related_collection}`);
  }

  return relations;
}

// ==================== TASK 4: Check Existing Data ====================
async function checkExistingData(collectionInfo) {
  console.log('\n========== TASK 4: EXISTING DATA COUNTS ==========');
  const counts = {};
  for (const colName of Object.keys(collectionInfo)) {
    try {
      let data;
      if (collectionInfo[colName].singleton) {
        data = await get(`/items/${colName}`);
        counts[colName] = { type: 'singleton', hasData: !!data.data, data: data.data };
        console.log(`  ${colName}: singleton, ${data.data ? 'has data' : 'empty'}`);
      } else {
        data = await get(`/items/${colName}?aggregate[count]=*&limit=0`);
        const count = data.data?.[0]?.count?.['*'] || 0;
        counts[colName] = { count: parseInt(count) };
        // Also get a sample
        const sample = await get(`/items/${colName}?limit=2`);
        counts[colName].sample = sample.data;
        console.log(`  ${colName}: ${count} records`);
      }
    } catch (e) {
      console.log(`  ${colName}: ERROR - ${e.message}`);
    }
  }
  return counts;
}

// ==================== TASK 5: Check Permissions ====================
async function checkPermissions() {
  console.log('\n========== TASK 5: PUBLIC PERMISSIONS ==========');
  const data = await get('/permissions?filter[role][_null]=true&limit=100');
  const perms = data.data || [];
  console.log(`\nPublic role permissions (${perms.length}):`);

  const publicCollections = ['services', 'team', 'testimonials', 'job_openings', 'site_settings',
    'blog_posts', 'blog_authors', 'blog_categories', 'blog_tags', 'blog_posts_tags'];

  const permMap = {};
  for (const p of perms) {
    if (!permMap[p.collection]) permMap[p.collection] = [];
    permMap[p.collection].push(p.action);
  }

  console.log('\nTarget collections public access:');
  const missing = [];
  for (const col of publicCollections) {
    const actions = permMap[col] || [];
    const hasRead = actions.includes('read');
    console.log(`  ${col}: ${actions.length ? actions.join(', ') : 'NO PERMISSIONS'} ${!hasRead ? '⚠ MISSING READ' : '✓'}`);
    if (!hasRead) missing.push(col);
  }

  return { perms, permMap, missing };
}

// ==================== TASK 6: Fix Issues ====================
async function fixPermissions(missing, existingCollections) {
  console.log('\n========== TASK 6: FIXING MISSING PERMISSIONS ==========');
  const existingColNames = Object.keys(existingCollections);
  const toFix = missing.filter(c => existingColNames.includes(c));

  for (const col of toFix) {
    console.log(`  Adding public read permission for ${col}...`);
    const r = await post('/permissions', {
      role: null,
      collection: col,
      action: 'read',
      fields: ['*'],
      permissions: {},
      validation: {}
    });
    if (r.data?.id) {
      console.log(`    ✓ Created permission ID ${r.data.id}`);
    } else {
      console.log(`    ✗ Failed: ${JSON.stringify(r.errors)}`);
    }
  }
}

// ==================== TASK 7: Populate Test Data ====================
async function populateTestData(collectionInfo) {
  console.log('\n========== TASK 7: POPULATE TEST DATA ==========');

  // Upload 2 images
  console.log('\nUploading images...');
  const img1 = await uploadTestPNG('service-hero.png');
  const img2 = await uploadTestPNG('team-photo.png');
  const img3 = await uploadTestPNG('blog-featured.png');
  const img4 = await uploadTestPNG('blog-category.png');

  const fileIds = [];
  for (const [i, img] of [[1, img1], [2, img2], [3, img3], [4, img4]]) {
    if (img.data?.id) {
      fileIds.push(img.data.id);
      console.log(`  ✓ Image ${i}: ${img.data.id}`);
    } else {
      console.log(`  ✗ Image ${i} failed:`, JSON.stringify(img.errors));
      fileIds.push(null);
    }
  }

  const [svcImgId, teamImgId, blogImgId, catImgId] = fileIds;

  // Helper to create and optionally patch with file
  async function createWithFile(colName, textBody, fileField, fileId) {
    console.log(`\n  Creating ${colName} item...`);
    const createBody = { ...textBody, status: 'published' };
    const r = await post(`/items/${colName}`, createBody);
    if (!r.data?.id) {
      console.log(`    ✗ Create failed: ${JSON.stringify(r.errors)}`);
      return null;
    }
    const id = r.data.id;
    console.log(`    ✓ Created, id=${id}`);

    if (fileField && fileId) {
      const pr = await patch(`/items/${colName}/${id}`, { [fileField]: fileId });
      const ok = !pr.errors && pr.data;
      console.log(`    ${ok ? '✓' : '✗'} File field ${fileField}: ${ok ? 'assigned' : JSON.stringify(pr.errors)}`);
    }
    return id;
  }

  const created = {};

  // Services
  if (collectionInfo['services']) {
    const svc1 = await createWithFile('services', {
      title: 'Home Nursing Care',
      slug: 'home-nursing-care',
      description: 'Professional nursing care delivered to your home by qualified nurses.',
      short_description: 'Expert nursing at home',
      sort: 1
    }, 'image', svcImgId);

    const svc2 = await createWithFile('services', {
      title: 'Personal Care & Support',
      slug: 'personal-care-support',
      description: 'Compassionate personal care support for daily living activities.',
      short_description: 'Daily living support',
      sort: 2
    }, 'image', svcImgId);

    created.services = [svc1, svc2].filter(Boolean);
  }

  // Team members
  if (collectionInfo['team']) {
    const t1 = await createWithFile('team', {
      name: 'Sarah Johnson',
      role: 'Head Nurse',
      bio: 'Sarah has 15 years of experience in home healthcare.',
      email: 'sarah@asterhomecare.co.uk',
      sort: 1
    }, 'photo', teamImgId);

    const t2 = await createWithFile('team', {
      name: 'Dr. James Wilson',
      role: 'Medical Director',
      bio: 'Dr. Wilson oversees all clinical operations at Aster Homecare.',
      email: 'james@asterhomecare.co.uk',
      sort: 2
    }, 'photo', teamImgId);

    created.team = [t1, t2].filter(Boolean);
  }

  // Site settings (singleton)
  if (collectionInfo['site_settings']) {
    console.log('\n  Updating site_settings...');
    const r = await patch('/items/site_settings', {
      site_name: 'Aster Homecare',
      tagline: 'Professional Home Healthcare Services',
      contact_email: 'info@asterhomecare.co.uk',
      contact_phone: '+44 20 1234 5678',
      address: '123 Care Lane, London, UK',
      logo: svcImgId,
      hero_image: blogImgId
    });
    console.log(`    ${!r.errors ? '✓ Updated' : '✗ Failed: ' + JSON.stringify(r.errors)}`);
    created.site_settings = !r.errors;
  }

  // Blog author
  if (collectionInfo['blog_authors']) {
    const author1 = await createWithFile('blog_authors', {
      name: 'Emma Thompson',
      bio: 'Emma is a healthcare writer with a passion for making medical information accessible.',
      email: 'emma@asterhomecare.co.uk'
    }, 'photo', teamImgId);
    created.blog_authors = [author1].filter(Boolean);
  }

  // Blog categories
  if (collectionInfo['blog_categories']) {
    const cat1 = await createWithFile('blog_categories', {
      name: 'Home Care Tips',
      slug: 'home-care-tips',
      description: 'Practical tips for home care and daily living.'
    }, 'featured_image', catImgId);

    const cat2 = await createWithFile('blog_categories', {
      name: 'Health & Wellbeing',
      slug: 'health-wellbeing',
      description: 'Articles on maintaining health and wellbeing at home.'
    }, 'featured_image', catImgId);

    created.blog_categories = [cat1, cat2].filter(Boolean);
  }

  // Blog tags
  if (collectionInfo['blog_tags']) {
    console.log('\n  Creating blog_tags...');
    const tags = ['elderly care', 'nursing', 'wellness', 'home health', 'caregiving'];
    created.blog_tags = [];
    for (const tag of tags) {
      const r = await post('/items/blog_tags', { name: tag, slug: tag.replace(/ /g, '-') });
      if (r.data?.id) {
        created.blog_tags.push(r.data.id);
        console.log(`    ✓ Tag "${tag}" id=${r.data.id}`);
      } else {
        console.log(`    ✗ Tag "${tag}" failed: ${JSON.stringify(r.errors)}`);
      }
    }
  }

  // Blog posts
  if (collectionInfo['blog_posts']) {
    const authorId = created.blog_authors?.[0];
    const cat1Id = created.blog_categories?.[0];
    const cat2Id = created.blog_categories?.[1];

    const post1 = await createWithFile('blog_posts', {
      title: '10 Essential Home Care Tips for Elderly Loved Ones',
      slug: 'essential-home-care-tips-elderly',
      content: '<p>Caring for an elderly loved one at home can be deeply rewarding...</p><p>Here are 10 essential tips to make the experience better for everyone.</p>',
      excerpt: 'Discover 10 essential tips for caring for elderly loved ones at home.',
      author: authorId,
      category: cat1Id,
      published_date: new Date().toISOString().split('T')[0]
    }, 'featured_image', blogImgId);

    const post2 = await createWithFile('blog_posts', {
      title: 'Understanding the Benefits of Home Healthcare',
      slug: 'benefits-home-healthcare',
      content: '<p>Home healthcare offers numerous benefits over traditional care settings...</p>',
      excerpt: 'Learn about the key benefits of receiving healthcare at home.',
      author: authorId,
      category: cat2Id,
      published_date: new Date().toISOString().split('T')[0]
    }, 'featured_image', blogImgId);

    const post3 = await createWithFile('blog_posts', {
      title: 'How to Choose the Right Home Care Provider',
      slug: 'choose-right-home-care-provider',
      content: '<p>Choosing the right home care provider is one of the most important decisions...</p>',
      excerpt: 'A guide to selecting the best home care provider for your needs.',
      author: authorId,
      category: cat1Id,
      published_date: new Date().toISOString().split('T')[0]
    }, 'featured_image', blogImgId);

    created.blog_posts = [post1, post2, post3].filter(Boolean);

    // Add tags to blog posts via junction table
    if (created.blog_tags?.length > 0 && created.blog_posts?.length > 0 && collectionInfo['blog_posts_tags']) {
      console.log('\n  Adding tags to blog posts via junction table...');
      for (const postId of created.blog_posts) {
        for (const tagId of created.blog_tags.slice(0, 2)) {
          const r = await post('/items/blog_posts_tags', {
            blog_posts_id: postId,
            blog_tags_id: tagId
          });
          if (r.data?.id) {
            console.log(`    ✓ Linked post ${postId} -> tag ${tagId}`);
          } else {
            console.log(`    ✗ Link failed: ${JSON.stringify(r.errors)}`);
          }
        }
      }
    }
  }

  // Testimonials
  if (collectionInfo['testimonials']) {
    console.log('\n  Creating testimonials...');
    for (const t of [
      { author_name: 'Margaret H.', content: 'Aster Homecare has been absolutely wonderful for my mother. The nurses are kind, professional, and always on time.', rating: 5, role: 'Family Caregiver' },
      { author_name: 'Robert K.', content: 'I cannot recommend Aster Homecare highly enough. After my surgery, they made my recovery so much easier.', rating: 5, role: 'Patient' }
    ]) {
      const r = await post('/items/testimonials', { ...t, status: 'published' });
      console.log(`    ${r.data?.id ? '✓ Created id=' + r.data.id : '✗ Failed: ' + JSON.stringify(r.errors)}`);
    }
  }

  // Job openings
  if (collectionInfo['job_openings']) {
    console.log('\n  Creating job_openings...');
    for (const j of [
      { title: 'Registered Nurse - Home Healthcare', location: 'London, UK', type: 'Full-time', description: 'We are seeking a compassionate RN to provide exceptional home healthcare services.', requirements: 'Valid NMC registration, 2+ years experience in community nursing.' },
      { title: 'Care Assistant', location: 'London, UK', type: 'Part-time', description: 'Join our team as a Care Assistant providing personal care and support to clients.', requirements: 'NVQ Level 2 in Health & Social Care preferred.' }
    ]) {
      const r = await post('/items/job_openings', { ...j, status: 'published' });
      console.log(`    ${r.data?.id ? '✓ Created id=' + r.data.id : '✗ Failed: ' + JSON.stringify(r.errors)}`);
    }
  }

  return created;
}

// ==================== TASK 8: Verify Asset URLs ====================
async function verifyAssets(fileIds) {
  console.log('\n========== TASK 8: ASSET URL VERIFICATION ==========');
  const validIds = fileIds.filter(Boolean);
  for (const id of validIds.slice(0, 3)) {
    try {
      const res = await fetch(`${BASE}/assets/${id}`, {
        method: 'HEAD',
        redirect: 'manual'
      });
      console.log(`  /assets/${id}: HTTP ${res.status} ${res.statusText || ''}`);
    } catch (e) {
      console.log(`  /assets/${id}: ERROR - ${e.message}`);
    }
  }
}

// ==================== FINAL SUMMARY ====================
async function finalSummary(collectionInfo) {
  console.log('\n========== FINAL DATA COUNTS ==========');
  for (const [colName, info] of Object.entries(collectionInfo)) {
    try {
      if (info.singleton) {
        const d = await get(`/items/${colName}`);
        console.log(`  ${colName}: singleton, has ${d.data ? Object.keys(d.data || {}).filter(k => d.data[k]).length : 0} non-null fields`);
      } else {
        const d = await get(`/items/${colName}?aggregate[count]=*&limit=0`);
        const count = d.data?.[0]?.count?.['*'] || 0;
        console.log(`  ${colName}: ${count} records`);
      }
    } catch (e) {
      console.log(`  ${colName}: ERROR`);
    }
  }
}

// ==================== MAIN ====================
async function main() {
  console.log('=== ASTER HOMECARE DIRECTUS AUDIT ===');
  console.log(`Target: ${BASE}`);
  console.log(`Date: ${new Date().toISOString()}`);

  const ok = await login();
  if (!ok) return;

  const collectionInfo = await inventoryCollections();

  const uploadResults = await testImageUpload(collectionInfo);

  const relations = await checkRelations();

  const existingData = await checkExistingData(collectionInfo);

  const permResults = await checkPermissions();

  if (permResults.missing.length > 0) {
    await fixPermissions(permResults.missing, collectionInfo);
    console.log('\n  Re-checking permissions...');
    await checkPermissions();
  }

  const created = await populateTestData(collectionInfo);
  console.log('\nCreated IDs:', JSON.stringify(created, null, 2));

  // Collect all uploaded file IDs
  const allFileIds = [];
  if (uploadResults?.fileId) allFileIds.push(uploadResults.fileId);

  await verifyAssets(allFileIds);

  await finalSummary(collectionInfo);

  console.log('\n=== AUDIT COMPLETE ===');
}

main().catch(console.error);
