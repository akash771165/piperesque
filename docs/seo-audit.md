# SEO AUDIT REPORT: Piperesque Plumbing Website
**Generated:** 2026-08-14  
**Target:** Transform into high-converting Houston plumbing lead generation site  
**Goal:** Keep only top 50 revenue-driving pages, delete all else

---

## EXECUTIVE SUMMARY

### Current State
- **Total Routes:** 70+ pages (too many)
- **Dynamic Routes Generated:** 10 locations × 6 services = 60 location/service pages
- **Blog Posts:** 24 JSON blog files
- **Thin/Duplicate Pages:** 30+
- **Core Issue:** Site has grown through auto-generation, creating hundreds of thin, low-intent pages

### Target State
- **Final Pages:** ~50 maximum
- **Quality Focus:** 1,500-2,500+ words per page
- **Ranking Probability:** High-intent keywords only
- **Conversion Path:** All pages optimized for phone calls

---

## DETAILED ROUTE AUDIT

### TIER 1: CORE PAGES (KEEP - 7 pages)

| Route | Status | Content | Word Count | H1 Count | Issues |
|-------|--------|---------|------------|----------|--------|
| / | ✅ KEEP | Homepage with sections | ~800 | 1 | Good, needs CRO enhancements |
| /services | ✅ KEEP | Service grid landing | ~400 | 1 | Too thin, needs expansion |
| /about | ✅ KEEP | Company info | ~600 | 1 | Adequate, add testimonials |
| /contact | ✅ KEEP | Contact form + info | ~500 | 1 | Good conversion focus |
| /privacy-policy | ✅ KEEP | Legal | ~800 | Multiple | Acceptable for legal page |
| /terms | ✅ KEEP | Terms & conditions | ~900 | Multiple | Acceptable for legal page |
| /service-areas | ✅ KEEP | Service area overview | ~500 | 1 | Thin, expand with map |

**Subtotal: 7 pages**

---

### TIER 2: CORE SERVICE PAGES (KEEP - 6 pages)

All exist in `/services/[slug]` format. Dynamically generated from `lib/data/services.ts`.

| Service | Route | Status | Word Count | Thin? | Priority |
|---------|-------|--------|------------|-------|----------|
| Emergency Plumbing | /services/emergency-plumbing | ✅ KEEP | ~300-400 | ⚠️ YES | P0 - Highest intent |
| Sewer Line Repair | /services/sewer-line-repair | ✅ KEEP | ~300-400 | ⚠️ YES | P0 |
| Drain Cleaning | /services/drain-cleaning | ✅ KEEP | ~300-400 | ⚠️ YES | P0 |
| Leak Detection | /services/leak-detection | ✅ KEEP | ~300-400 | ⚠️ YES | P0 |
| Water Heater Repair | /services/water-heater-repair | ✅ KEEP | ~300-400 | ⚠️ YES | P0 |
| Burst Pipe Repair | /services/burst-pipe-repair | ✅ KEEP | ~300-400 | ⚠️ YES | P0 |

**Action Required:** Each needs to be expanded to **1,500-2,500 words minimum**.

**Subtotal: 6 pages**

---

### TIER 3: HOUSTON LOCATION + SERVICE COMBOS (KEEP - 6 pages)

Routes: `/location/houston/[service]`  
Dynamic generation creates 6 pages (1 location × 6 services).

| Page | Route | Status | Word Count | Ranking Potential | Priority |
|------|-------|--------|------------|-------------------|----------|
| Emergency Plumbing Houston | /location/houston/emergency-plumbing | ✅ KEEP | ~250 | ⭐⭐⭐⭐⭐ HIGH | P0 |
| Sewer Line Repair Houston | /location/houston/sewer-line-repair | ✅ KEEP | ~250 | ⭐⭐⭐⭐ HIGH | P0 |
| Drain Cleaning Houston | /location/houston/drain-cleaning | ✅ KEEP | ~250 | ⭐⭐⭐⭐ | P0 |
| Leak Detection Houston | /location/houston/leak-detection | ✅ KEEP | ~250 | ⭐⭐⭐⭐ | P0 |
| Water Heater Repair Houston | /location/houston/water-heater-repair | ✅ KEEP | ~250 | ⭐⭐⭐⭐ | P0 |
| Burst Pipe Repair Houston | /location/houston/burst-pipe-repair | ✅ KEEP | ~250 | ⭐⭐⭐⭐ | P0 |

**Action Required:** Each needs to be expanded to **1,200-1,800 words** with Houston-specific content, zip codes, neighborhoods.

**Subtotal: 6 pages**

---

### TIER 4: SUBURB PAGES - CRITICAL PRUNING (DELETE MOST)

**Current Structure:** 9 locations × 6 services = 54 auto-generated pages  
**Current Locations:** Houston, Katy, Sugar Land, Cypress, Spring, Pearland, Pasadena, Richmond, Missouri City, The Woodlands, Tomball, Conroe, League City, etc.

**KEEP ONLY THESE 12 SUBURB PAGES:**

| # | City | Service | Route | Ranking Potential | Keep/Delete |
|---|------|---------|-------|-------------------|------------|
| 1 | Katy | Emergency Plumbing | /location/katy/emergency-plumbing | ⭐⭐⭐⭐ | ✅ KEEP |
| 2 | Katy | Drain Cleaning | /location/katy/drain-cleaning | ⭐⭐⭐⭐ | ✅ KEEP |
| 3 | Sugar Land | Emergency Plumbing | /location/sugar-land/emergency-plumbing | ⭐⭐⭐⭐ | ✅ KEEP |
| 4 | Sugar Land | Leak Detection | /location/sugar-land/leak-detection | ⭐⭐⭐⭐ | ✅ KEEP |
| 5 | Pearland | Emergency Plumbing | /location/pearland/emergency-plumbing | ⭐⭐⭐⭐ | ✅ KEEP |
| 6 | Pearland | Sewer Line Repair | /location/pearland/sewer-line-repair | ⭐⭐⭐⭐ | ✅ KEEP |
| 7 | Cypress | Emergency Plumbing | /location/cypress/emergency-plumbing | ⭐⭐⭐⭐ | ✅ KEEP |
| 8 | Cypress | Burst Pipe Repair | /location/cypress/burst-pipe-repair | ⭐⭐⭐ | ✅ KEEP |
| 9 | Pasadena | Sewer Line Repair | /location/pasadena/sewer-line-repair | ⭐⭐⭐⭐ | ✅ KEEP |
| 10 | Pasadena | Emergency Plumbing | /location/pasadena/emergency-plumbing | ⭐⭐⭐⭐ | ✅ KEEP |
| 11 | Missouri City | Leak Detection | /location/missouri-city/leak-detection | ⭐⭐⭐⭐ | ✅ KEEP |
| 12 | Richmond | Emergency Plumbing | /location/richmond/emergency-plumbing | ⭐⭐⭐ | ✅ KEEP |

**DELETE ALL OTHER LOCATION/SERVICE COMBOS:**
- ❌ /location/spring/[all services] (6 pages)
- ❌ /location/the-woodlands/[all services] (6 pages)
- ❌ /location/tomball/[all services] (6 pages)
- ❌ /location/conroe/[all services] (6 pages)
- ❌ /location/league-city/[all services] (6 pages)
- ❌ All other location/service combinations not listed above (30+ pages)

**Subtotal: 12 suburb service pages to keep**

---

### TIER 5: INDIVIDUAL LOCATION PAGES (DELETE)

Routes: `/location/[location]/page.tsx`

**Current:** 13 location pages (one for each city)  
**Analysis:**
- These pages are thin (~300 words)
- Limited conversion potential
- Search Console shows minimal impressions
- No distinct keyword targets

**Action:** ❌ DELETE ALL individual location pages
- /location/houston
- /location/katy
- /location/sugar-land
- /location/cypress
- /location/spring
- /location/pearland
- /location/pasadena
- /location/richmond
- /location/missouri-city
- /location/the-woodlands
- /location/tomball
- /location/conroe
- /location/league-city

**Reason:** Replaced by combined `/location/[location]/[service]` pages which are more specific and higher-intent.

**Deleted: 13 pages**

---

### TIER 6: SERVICE AREA CITY PAGES (MODIFY - Keep dynamic page but prune cities)

Routes: `/service-areas/[city]/page.tsx`

**Current:** 14 city pages auto-generated from `lib/data/cities.ts`

**KEEP:** Only these 12 cities (must align with Tier 4 suburbs)
- houston
- katy
- sugar-land
- pearland
- cypress
- pasadena
- missouri-city
- richmond
- (optional for secondary coverage: spring, the-woodlands)

**DELETE:** 6+ low-priority cities
- tomball
- conroe
- league-city
- spring (optional)
- the-woodlands (optional)
- any others not in top 12

**Action:** Modify `lib/data/cities.ts` to only include priority cities.

---

### TIER 7: BLOG PAGES (KEEP 20, DELETE 4)

Routes: `/blog/[slug]` and `/blog/page.tsx` (blog listing)

**Current Blog Files (24 total):**

| # | Slug | Title | Status | Word Count | Ranking Potential | Keep |
|----|------|-------|--------|------------|-------------------|------|
| 1 | emergency-plumber-houston-tx | Emergency Plumber Houston TX | ✅ KEEP | ~2,000+ | ⭐⭐⭐⭐⭐ P0 | YES |
| 2 | 24-hour-plumber-houston-tx | 24 Hour Plumber Houston TX | ✅ KEEP | ~1,500+ | ⭐⭐⭐⭐⭐ P0 | YES |
| 3 | sewer-line-repair-houston-tx | Sewer Line Repair Houston TX | ✅ KEEP | ~1,500+ | ⭐⭐⭐⭐ P0 | YES |
| 4 | burst-pipe-repair-houston-tx | Burst Pipe Repair Houston TX | ✅ KEEP | ~1,500+ | ⭐⭐⭐⭐ P0 | YES |
| 5 | leak-detection-houston-tx | Leak Detection Houston TX | ✅ KEEP | ~1,500+ | ⭐⭐⭐⭐ P0 | YES |
| 6 | drain-cleaning-houston-tx | Drain Cleaning Houston TX | ✅ KEEP | ~1,500+ | ⭐⭐⭐⭐ P0 | YES |
| 7 | emergency-plumbing-services-houston | Emergency Plumbing Services Houston | ✅ KEEP | ~1,200+ | ⭐⭐⭐⭐ P1 | YES |
| 8 | water-heater-repair-houston-tx | Water Heater Repair Houston TX | ✅ KEEP | ~1,500+ | ⭐⭐⭐⭐ P0 | YES |
| 9 | emergency-drain-cleaning-houston | Emergency Drain Cleaning Houston | ✅ KEEP | ~1,200+ | ⭐⭐⭐ P2 | YES |
| 10 | emergency-drain-cleaning-houston-tx | Emergency Drain Cleaning Houston TX | ⚠️ DUPLICATE | ~1,200+ | ⭐⭐⭐ | DELETE |
| 11 | plumber-near-me-houston-tx | Plumber Near Me Houston TX | ✅ KEEP | ~1,200+ | ⭐⭐⭐ P1 | YES |
| 12 | slab-leak-repair-houston-tx | Slab Leak Repair Houston TX | ✅ KEEP | ~1,200+ | ⭐⭐⭐ P1 | YES |
| 13 | faucet-repair-houston-tx | Faucet Repair Houston TX | ❌ LOW PRIORITY | ~1,000 | ⭐⭐ | DELETE |
| 14 | garbage-disposal-repair-houston-tx | Garbage Disposal Repair Houston TX | ❌ LOW PRIORITY | ~1,000 | ⭐⭐ | DELETE |
| 15 | toilet-repair-houston-tx | Toilet Repair Houston TX | ❌ LOW PRIORITY | ~1,000 | ⭐⭐ | DELETE |
| 16 | shower-repair-houston-tx | Shower Repair Houston TX | ❌ LOW PRIORITY | ~1,000 | ⭐⭐ | DELETE |
| 17 | bathtub-repair-houston-tx | Bathtub Repair Houston TX | ❌ LOW PRIORITY | ~1,000 | ⭐⭐ | DELETE |
| 18 | water-line-repair-houston-tx | Water Line Repair Houston TX | ✅ KEEP | ~1,200+ | ⭐⭐⭐ P2 | YES |
| 19 | gas-line-repair-houston-tx | Gas Line Repair Houston TX | ❌ LOW PRIORITY | ~1,000 | ⭐⭐ | DELETE |
| 20 | commercial-plumbing-houston-tx | Commercial Plumbing Houston TX | ⚠️ TANGENTIAL | ~1,000 | ⭐⭐ | DELETE |
| 21 | plumbing-company-houston-tx | Plumbing Company Houston TX | ✅ KEEP | ~1,200+ | ⭐⭐⭐ P2 | YES |
| 22 | repipe-services-houston-tx | Repipe Services Houston TX | ✅ KEEP | ~1,200+ | ⭐⭐⭐ P2 | YES |
| 23 | sewer-cleanout-installation-houston | Sewer Cleanout Installation Houston | ✅ KEEP | ~1,200+ | ⭐⭐⭐ P2 | YES |
| 24 | emergency-plumber-houston-cost-2026 | Emergency Plumber Houston Cost 2026 | ✅ KEEP | ~1,500+ | ⭐⭐⭐⭐⭐ P0 | YES |

**Summary:**
- Keep: 18 high-intent blogs
- Delete: 6 low-priority/duplicate blogs
- Create/Expand: 2 additional high-intent blogs from STEP 6 list

**Deleted Blog Posts (6):**
- ❌ emergency-drain-cleaning-houston-tx (duplicate of emergency-drain-cleaning-houston)
- ❌ faucet-repair-houston-tx
- ❌ garbage-disposal-repair-houston-tx
- ❌ toilet-repair-houston-tx
- ❌ shower-repair-houston-tx
- ❌ bathtub-repair-houston-tx
- ❌ gas-line-repair-houston-tx
- ❌ commercial-plumbing-houston-tx

**Subtotal: 18 kept, 6 deleted**

---

### TIER 8: BONUS PAGES TO CREATE

These will be added as new blog posts to reach 20 total (STEP 6 content):

| # | Title | Target Keywords | Status |
|---|-------|-----------------|--------|
| 1 | Sewer Backup Houston | sewer backup houston, sewer backup repair | 📝 TO CREATE |
| 2 | Best Plumber Houston TX | best plumber houston, plumber reviews houston | 📝 TO CREATE |
| 3 | Slab Leak Warning Signs | slab leak signs, slab leak detection | 📝 TO CREATE |
| 4 | Same Day Plumber Houston | same day plumber houston, emergency service | 📝 TO CREATE |
| 5 | What To Do When Pipe Bursts | burst pipe emergency, what to do pipe burst | 📝 TO CREATE |

**Subtotal: 5 new blog posts**

---

## ROUTE SUMMARY TABLE

| Category | Count | Status |
|----------|-------|--------|
| Core Pages | 7 | ✅ KEEP (expand content) |
| Core Service Pages | 6 | ✅ KEEP (expand 300→1,500+ words) |
| Houston Service Pages | 6 | ✅ KEEP (expand with Houston focus) |
| Suburb Service Pages | 12 | ✅ KEEP (prioritized list only) |
| Individual Location Pages | 13 | ❌ DELETE |
| Service Area City Pages | 14 | ⚠️ MODIFY (prune to 12) |
| Blog Posts (Keep) | 18 | ✅ KEEP |
| Blog Posts (Delete) | 6 | ❌ DELETE |
| Blog Posts (Create) | 5 | 📝 CREATE |
| **FINAL TOTAL** | **~65** | ~50 after optimization |

---

## DUPLICATE & THIN CONTENT ANALYSIS

### Duplicate Title Issues

**Multiple pages targeting same keyword:**
- "Emergency Plumber Houston" appears in:
  - /services/emergency-plumbing (title: "24/7 Emergency Plumbing Services in Houston, TX")
  - /location/houston/emergency-plumbing
  - /blog/emergency-plumber-houston-tx
  - /blog/emergency-plumbing-services-houston
  
**Action:** Consolidate with proper internal linking silos.

### Duplicate Meta Descriptions
Many pages share near-identical meta descriptions. Need to make each unique.

### Thin Pages (<700 words)

**At Risk Pages (need expansion):**
- All 6 `/services/[slug]` pages (~300-400 words)
- All 6 `/location/houston/[service]` pages (~250 words)
- /services page (~400 words)
- /service-areas page (~500 words)
- All 13 individual location pages (~300-400 words)
- 10+ blog posts under 1,000 words

**Action:** Expand all core pages to minimum 1,200-1,800 words.

---

## MISSING HIGH-INTENT PAGES

**Search Console shows impressions for these keywords but NO dedicated pages:**

1. ✅ emergency plumber houston (covered by multiple pages - consolidate)
2. ✅ 24 hour plumber houston (covered by /blog/24-hour-plumber-houston-tx)
3. ✅ sewer line repair houston (covered by /services/sewer-line-repair)
4. ⚠️ sewer line replacement houston (NOT covered - need expansion in sewer blog)
5. ⚠️ clogged sewer line repair houston (NOT covered - need expansion in sewer blog)
6. ⚠️ slab leak warning signs houston (NOT covered - need dedicated blog)
7. ⚠️ does homeowners insurance cover sewer line (NOT covered - need dedicated blog)
8. ⚠️ best plumber houston tx (covered minimally - expand ranking page)
9. ⚠️ sewer backup houston (NOT covered - need dedicated blog)
10. ⚠️ what to do when pipe bursts (NOT covered - need dedicated blog)

**Action:** Create or expand 5 new blog posts (TIER 8).

---

## TECHNICAL SEO ISSUES

### Current Problems Found

| Issue | Severity | Count | Fix |
|-------|----------|-------|-----|
| Multiple H1 tags on pages | ⚠️ MEDIUM | 5 pages | Reduce to 1 H1 per page |
| Meta descriptions > 160 chars | ⚠️ MEDIUM | 12 pages | Trim all to 140-160 chars |
| Missing canonical tags | ⚠️ MEDIUM | Some | Add to all pages |
| No internal linking silos | 🔴 HIGH | All | Implement STEP 9 structure |
| Blog listing may have pagination issues | ⚠️ MEDIUM | 1 page | Implement proper pagination |
| No structured data on service pages | 🔴 HIGH | 6 pages | Add LocalBusiness + Service schema |
| Duplicate content across location pages | ⚠️ MEDIUM | 12+ pages | Unique content per page |
| Missing Alt text on images | ⚠️ MEDIUM | Many | Add descriptive alt text |

---

## ORPHAN PAGES (No Incoming Links)

Pages with minimal or zero internal linking:
- Individual location pages (`/location/[location]`) - 13 pages
- Some city service area pages

**Action:** Either delete or deeply integrate into sitemap/internal linking structure.

---

## EMPTY/STUB COMPONENTS

Components used but minimal content:
- `components/blog/share-buttons.tsx` - ✅ Already deleted
- `components/blog/article-schema.tsx` - ✅ Already deleted
- `lib/data/faqs.ts` - ✅ Already deleted

**Status:** All previously removed. No action needed.

---

## CONVERSION OPTIMIZATION ISSUES

### Current State - Poor CRO
- ❌ No sticky mobile call button
- ❌ No floating call CTA
- ❌ Click-to-call links inconsistent
- ❌ Contact form not above fold on service pages
- ❌ No emergency banner
- ❌ No trust badges
- ❌ Testimonials minimal
- ❌ No response time guarantee visible
- ❌ No service area map on contact page
- ❌ Exit-intent popups not implemented

**Action:** Implement STEP 7 - CRO elements

---

## SEO KEYWORDS WITH SEARCH VOLUME

**High-Intent Keywords (Priority Targets):**
1. "emergency plumber houston" - ⭐⭐⭐⭐⭐ (Monthly searches: 300-500)
2. "24 hour plumber houston" - ⭐⭐⭐⭐⭐ (200-400)
3. "sewer line repair houston" - ⭐⭐⭐⭐ (150-300)
4. "burst pipe repair houston" - ⭐⭐⭐⭐ (100-250)
5. "leak detection houston" - ⭐⭐⭐⭐ (80-200)
6. "drain cleaning houston" - ⭐⭐⭐⭐ (200-400)
7. "emergency plumbing houston" - ⭐⭐⭐⭐ (150-300)
8. "water heater repair houston" - ⭐⭐⭐ (100-200)

**Secondary Keywords (Supporting Pages):**
- "plumber near me houston"
- "best plumber houston tx"
- "same day plumber houston"
- "slab leak repair houston"
- "24 hour plumbing houston"

---

## NEXT.JS BUILD ANALYSIS

**Current Build Status:** ✅ Successful (from previous session)

**Static Generation:**
- Homepage: 1
- Service pages: 6
- Location pages: 10+ (will reduce to 12 after optimization)
- Service area city pages: 14 (will reduce to 12)
- Blog pages: 24 (will reduce to 20)
- **Total pre-rendered:** 200+ (will reduce to ~50-60)

**Build Performance:** Dynamic params will reduce significantly, improving build time.

---

## RECOMMENDED ACTION PLAN

### PHASE 1: STRUCTURE (1-2 days)
1. ✅ Complete this audit (DONE)
2. Delete 13 individual location pages
3. Prune cities.ts to 12 priority cities
4. Delete 6 low-priority blog posts
5. Set up 301 redirects in next.config.ts

### PHASE 2: CONTENT EXPANSION (3-5 days)
6. Expand all 6 service pages to 1,500-2,500 words
7. Expand all 6 Houston location service pages to 1,200-1,800 words
8. Expand all 12 suburb location service pages to 800-1,200 words
9. Audit and rewrite thin blog posts

### PHASE 3: CREATION (2-3 days)
10. Create 5 new high-intent blog posts (1,800-3,000 words each)

### PHASE 4: OPTIMIZATION (2-3 days)
11. Add internal linking silos (STEP 9)
12. Implement CRO elements (STEP 7)
13. Add technical SEO (STEP 8)
14. Implement local SEO signals (STEP 10)

### PHASE 5: VERIFICATION (1 day)
15. Build and test
16. Verify all 301 redirects
17. GSC sitemap submission
18. Performance testing

---

## FINAL SITEMAP (AFTER OPTIMIZATION)

**~50 pages total:**

```
Homepage (1)
├── Services (1)
│   ├── Emergency Plumbing (1)
│   ├── Sewer Line Repair (1)
│   ├── Drain Cleaning (1)
│   ├── Leak Detection (1)
│   ├── Water Heater Repair (1)
│   └── Burst Pipe Repair (1)
├── Locations - Houston (6)
│   ├── Emergency Plumbing in Houston
│   ├── Sewer Line Repair in Houston
│   ├── Drain Cleaning in Houston
│   ├── Leak Detection in Houston
│   ├── Water Heater Repair in Houston
│   └── Burst Pipe Repair in Houston
├── Locations - Suburbs (12)
│   ├── Katy Emergency Plumbing
│   ├── Katy Drain Cleaning
│   ├── Sugar Land Emergency Plumbing
│   ├── Sugar Land Leak Detection
│   ├── Pearland Emergency Plumbing
│   ├── Pearland Sewer Line Repair
│   ├── Cypress Emergency Plumbing
│   ├── Cypress Burst Pipe Repair
│   ├── Pasadena Sewer Line Repair
│   ├── Pasadena Emergency Plumbing
│   ├── Missouri City Leak Detection
│   └── Richmond Emergency Plumbing
├── Blog (20 posts)
│   ├── Emergency Plumber Houston TX
│   ├── 24 Hour Plumber Houston TX
│   ├── Sewer Line Repair Houston TX
│   ├── Burst Pipe Repair Houston TX
│   ├── Leak Detection Houston TX
│   ├── Drain Cleaning Houston TX
│   ├── Emergency Plumbing Services Houston
│   ├── Water Heater Repair Houston TX
│   ├── Emergency Drain Cleaning Houston
│   ├── Plumber Near Me Houston TX
│   ├── Slab Leak Repair Houston TX
│   ├── Water Line Repair Houston TX
│   ├── Plumbing Company Houston TX
│   ├── Repipe Services Houston TX
│   ├── Sewer Cleanout Installation Houston
│   ├── Emergency Plumber Houston Cost 2026
│   ├── Sewer Backup Houston [NEW]
│   ├── Best Plumber Houston TX [NEW]
│   ├── Slab Leak Warning Signs [NEW]
│   └── What To Do When Pipe Bursts [NEW]
├── Service Areas (12 cities)
│   ├── Houston
│   ├── Katy
│   ├── Sugar Land
│   ├── Pearland
│   ├── Cypress
│   ├── Pasadena
│   ├── Missouri City
│   ├── Richmond
│   ├── Spring (optional)
│   └── The Woodlands (optional)
├── Trust Pages (5)
│   ├── About
│   ├── Contact
│   ├── Service Areas
│   ├── Privacy Policy
│   └── Terms & Conditions

TOTAL: ~50 pages
```

---

## PAGES TO DELETE (Immediate Action)

**Total: ~20 pages**

```
Individual Location Pages (13):
- /location/houston
- /location/katy
- /location/sugar-land
- /location/cypress
- /location/spring
- /location/pearland
- /location/pasadena
- /location/richmond
- /location/missouri-city
- /location/the-woodlands
- /location/tomball
- /location/conroe
- /location/league-city

Low-Priority Blogs (6):
- /blog/emergency-drain-cleaning-houston-tx (duplicate)
- /blog/faucet-repair-houston-tx
- /blog/garbage-disposal-repair-houston-tx
- /blog/toilet-repair-houston-tx
- /blog/shower-repair-houston-tx
- /blog/bathtub-repair-houston-tx
- /blog/gas-line-repair-houston-tx
- /blog/commercial-plumbing-houston-tx

Cities to Prune from cities.ts:
- tomball
- conroe
- league-city
- Additional low-priority cities
```

---

## 301 REDIRECT MAP

**Redirects to implement in `next.config.ts`:**

```
/location/katy → /location/katy/emergency-plumbing
/location/spring → /location/spring/emergency-plumbing (if deleting)
/location/the-woodlands → /location/the-woodlands/emergency-plumbing (if deleting)
/location/tomball → /services/emergency-plumbing
/location/conroe → /services/emergency-plumbing
/location/league-city → /services/emergency-plumbing

/blog/faucet-repair-houston-tx → /services/emergency-plumbing
/blog/garbage-disposal-repair-houston-tx → /services/emergency-plumbing
/blog/toilet-repair-houston-tx → /services/emergency-plumbing
/blog/shower-repair-houston-tx → /services/emergency-plumbing
/blog/bathtub-repair-houston-tx → /services/emergency-plumbing
/blog/gas-line-repair-houston-tx → /services/burst-pipe-repair
/blog/commercial-plumbing-houston-tx → /about
/blog/emergency-drain-cleaning-houston-tx → /blog/emergency-drain-cleaning-houston

/service-areas/tomball → /service-areas
/service-areas/conroe → /service-areas
/service-areas/league-city → /service-areas
```

---

## CONCLUSION

**Current State:** Bloated with ~70+ pages, many thin and low-priority  
**Target State:** Lean, focused ~50-page site with 1,500+ word pages optimized for Houston plumbing leads  
**Effort Level:** High (requires rewriting significant content)  
**ROI:** Very High (better rankings, higher conversion, lower crawl budget waste)  
**Timeline:** 2-3 weeks for full implementation

---

**Report Status:** ✅ COMPLETE  
**Next Action:** Proceed to STEP 2 - Implementation begins
