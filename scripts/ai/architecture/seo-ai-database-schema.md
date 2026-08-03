
# SEO AI Database Schema Architecture


## 1. Overview

The SEO AI Database Schema defines the data structure required to store, manage, and process information across the complete SEO AI Operating System.

The database supports:

- Multi-tenant SaaS architecture
- SEO projects
- Website intelligence
- AI agents
- Workflows
- SEO analytics
- AI memory
- Reports
- Historical optimization data


The database acts as the central knowledge repository for the SEO AI platform.


Architecture:


```
                    SEO AI Platform


                          |

                          |

                  Database Layer


                          |

 ------------------------------------------------

 |            |             |             |

Users      Projects     SEO Data     AI Data


 |            |             |             |

 ------------------------------------------------


              Analytics + Intelligence
```


---

# 2. Database Design Goals


The database should provide:


## Scalability

Support:

- Multiple organizations
- Thousands of websites
- Millions of SEO records
- Large AI memory datasets


## Performance

Optimize:

- Fast SEO queries
- Ranking retrieval
- Report generation
- AI context retrieval


## Data Relationships

Maintain connections between:

- Users
- Projects
- Websites
- Keywords
- Pages
- Rankings
- Agents


## AI Intelligence Storage

Store:

- Agent outputs
- Recommendations
- Learning data
- Vector embeddings


---

# 3. Database Architecture


Recommended:


```
Database Layer


├── PostgreSQL

├── Redis Cache

├── Vector Database

├── Object Storage

└── Analytics Database
```


---

# 4. Core Database Modules


```
database/


├── identity

├── organizations

├── projects

├── websites

├── seo-analysis

├── keywords

├── rankings

├── content

├── backlinks

├── competitors

├── ai-agents

├── workflows

├── reports

├── memory

└── analytics
```


---

# 5. Identity Database Schema


## Users Table


Purpose:

Store platform users.


Schema:


```
users


id

uuid


name

varchar


email

varchar


password_hash

varchar


role_id

uuid


organization_id

uuid


status

enum


created_at

timestamp


updated_at

timestamp
```


Relationships:


```
User

 |

belongs to

 |

Organization
```


---

# 6. Organizations Table


Purpose:

Support multi-tenant SaaS architecture.


Schema:


```
organizations


id

uuid


name

varchar


industry

varchar


plan_type

enum


subscription_status

enum


created_at

timestamp
```


Example:


```
Organization:

ABC Marketing Agency


Plan:

Enterprise


Projects:

50 SEO campaigns
```


---

# 7. Roles & Permissions Schema


## Roles Table


```
roles


id

uuid


name

varchar


permissions

jsonb


created_at

timestamp
```


Roles:


```
Admin

SEO Manager

Client

Viewer
```


---

# 8. SEO Project Schema


## SEO Projects Table


Purpose:

Store SEO campaigns.


Schema:


```
seo_projects


id

uuid


organization_id

uuid


project_name

varchar


website_id

uuid


industry

varchar


target_country

varchar


seo_goals

jsonb


status

enum


created_at

timestamp
```


Example:


```
Project:

Pipe Rescue SEO Growth


Goal:

Increase local leads
```

# 9. Website Intelligence Schema


## Websites Table


Purpose:

Store analyzed website information.


Schema:


```
websites


id

uuid


project_id

uuid


domain

varchar


website_name

varchar


platform

varchar


technology_stack

jsonb


industry

varchar


country

varchar


seo_score

integer


crawl_status

enum


last_crawled_at

timestamp


created_at

timestamp
```


Relationships:


```
SEO Project

      |

      |

  has many

      |

  Websites
```


---

# 10. Website Pages Schema


## Pages Table


Purpose:

Store individual webpage SEO intelligence.


Schema:


```
pages


id

uuid


website_id

uuid


url

text


page_type

varchar


title

text


meta_description

text


canonical_url

text


word_count

integer


content_score

integer


technical_score

integer


index_status

enum


created_at

timestamp
```


Page Types:


```
Homepage

Service Page

Product Page

Blog Page

Landing Page

Category Page
```


---

# 11. SEO Crawl Data Schema


## Crawl Results Table


Purpose:

Store website crawling information.


Schema:


```
crawl_results


id

uuid


website_id

uuid


url

text


status_code

integer


response_time

integer


page_size

integer


robots_allowed

boolean


canonical_status

varchar


issues

jsonb


created_at

timestamp
```


Stores:


- Broken links
- Redirects
- Missing metadata
- Technical errors


---

# 12. Keyword Intelligence Schema


## Keywords Table


Purpose:

Store keyword research and intelligence.


Schema:


```
keywords


id

uuid


project_id

uuid


keyword

text


search_volume

integer


difficulty_score

integer


search_intent

enum


keyword_type

varchar


opportunity_score

integer


created_at

timestamp
```


Keyword Types:


```
Primary

Secondary

Long Tail

Question

Commercial

Local
```


---

# 13. Keyword Ranking Schema


## Keyword Rankings Table


Purpose:

Track keyword positions over time.


Schema:


```
keyword_rankings


id

uuid


keyword_id

uuid


position

integer


previous_position

integer


search_engine

varchar


location

varchar


device

varchar


traffic_estimate

integer


checked_at

timestamp
```


Example:


```
Keyword:

plumber houston


Position:

5 → 3


Growth:

Positive
```


---

# 14. Content Intelligence Schema


## Content Analysis Table


Purpose:

Store AI content analysis results.


Schema:


```
content_analysis


id

uuid


page_id

uuid


content_quality_score

integer


eeat_score

integer


semantic_score

integer


readability_score

integer


content_gaps

jsonb


recommendations

jsonb


created_at

timestamp
```


---

# 15. Backlink Intelligence Schema


## Backlinks Table


Purpose:

Store backlink information.


Schema:


```
backlinks


id

uuid


website_id

uuid


source_domain

varchar


source_url

text


target_url

text


anchor_text

varchar


domain_authority

integer


link_quality

integer


risk_score

integer


link_status

enum


created_at

timestamp
```


Link Status:


```
Active

Lost

Toxic

Removed
```


---

# 16. Competitor Intelligence Schema


## Competitors Table


Purpose:

Store competitor SEO intelligence.


Schema:


```
competitors


id

uuid


project_id

uuid


domain

varchar


industry

varchar


authority_score

integer


organic_visibility

integer


keyword_overlap

jsonb


backlink_strength

integer


created_at

timestamp
```


---

# 17. Competitor Analysis History


## Competitor Reports Table


Schema:


```
competitor_reports


id

uuid


competitor_id

uuid


report_type

varchar


analysis_data

jsonb


recommendations

jsonb


created_at

timestamp
```

# 18. AI Agent Database Schema


Purpose:

Store AI agent configurations, executions, outputs, and intelligence history.


## AI Agents Table


Schema:


```
ai_agents


id

uuid


name

varchar


agent_type

varchar


description

text


capabilities

jsonb


prompt_reference

varchar


status

enum


created_at

timestamp
```


Example:


```
Agent:

keyword_intelligence_agent


Capabilities:

- keyword research
- intent analysis
- clustering
```


---

# 19. Agent Execution Logs Table


Purpose:

Track every AI agent execution.


Schema:


```
agent_execution_logs


id

uuid


agent_id

uuid


project_id

uuid


task_id

uuid


input_data

jsonb


output_data

jsonb


execution_time

integer


token_usage

integer


status

enum


created_at

timestamp
```


Stores:


- Agent requests
- AI responses
- Performance metrics
- Errors


---

# 20. Workflow Database Schema


## Workflows Table


Purpose:

Store SEO automation workflows.


Schema:


```
workflows


id

uuid


project_id

uuid


workflow_name

varchar


workflow_type

varchar


trigger_type

varchar


configuration

jsonb


status

enum


created_at

timestamp
```


Workflow Types:


```
SEO Audit

Content Optimization

Rank Tracking

Backlink Monitoring

Competitor Analysis
```


---

# 21. Workflow Tasks Table


Purpose:

Store individual workflow execution tasks.


Schema:


```
workflow_tasks


id

uuid


workflow_id

uuid


agent_id

uuid


task_name

varchar


priority

enum


status

enum


input_data

jsonb


output_data

jsonb


started_at

timestamp


completed_at

timestamp
```


Task Status:


```
Pending

Running

Completed

Failed

Retry
```


---

# 22. AI Reports Database Schema


Purpose:

Store generated SEO intelligence reports.


## AI Reports Table


Schema:


```
ai_reports


id

uuid


project_id

uuid


report_type

varchar


generated_by_agent

uuid


report_data

jsonb


seo_score

integer


recommendations

jsonb


created_at

timestamp
```


Report Types:


```
Technical SEO Report

Keyword Report

Content Report

Backlink Report

Complete SEO Audit
```


---

# 23. AI Memory Database Schema


Purpose:

Store AI learning data and long-term intelligence.


## Memory Records Table


Schema:


```
ai_memory


id

uuid


project_id

uuid


memory_type

varchar


content

text


embedding

vector


confidence_score

integer


importance_score

integer


created_at

timestamp
```


Memory Types:


```
Short Term

Long Term

Semantic

Episodic

Project Knowledge
```


---

# 24. Vector Knowledge Storage Schema


Purpose:

Enable semantic AI search.


Schema:


```
knowledge_vectors


id

uuid


source_type

varchar


source_id

uuid


content

text


embedding

vector


metadata

jsonb


created_at

timestamp
```


Used For:


- Similar SEO issue detection
- Previous solution retrieval
- AI context generation


---

# 25. Analytics Database Schema


Purpose:

Store SEO performance measurements.


## SEO Metrics Table


Schema:


```
seo_metrics


id

uuid


project_id

uuid


metric_name

varchar


metric_value

numeric


metric_date

date


metadata

jsonb
```


Metrics:


```
Organic Traffic

Keyword Growth

Ranking Changes

SEO Score

Conversions

Backlink Growth
```


---

# 26. Database Indexing Strategy


Optimize frequently accessed data.


## Keyword Indexes


Create indexes on:


```
keyword

search_intent

difficulty_score

opportunity_score
```


---

## Ranking Indexes


Optimize:


```
keyword_id

position

checked_at
```


---

## Project Indexes


Optimize:


```
organization_id

website_id

status
```


---

## Memory Indexes


Optimize:


```
embedding

project_id

importance_score
```


---

# 27. Multi-Tenant Database Architecture


The platform supports multiple organizations.


Architecture:


```
Organization A

    |

 SEO Projects


Organization B

    |

 SEO Projects


Organization C

    |

 SEO Projects
```


Isolation:


- Organization-based access
- Project-level permissions
- Secure data separation


---

# 28. Final SEO AI Database Blueprint


Complete database structure:


```
                 USERS


                   |

            ORGANIZATIONS


                   |

              PROJECTS


                   |

              WEBSITES


                   |

 ------------------------------------------------

 |          |          |          |             |

Keywords  Content   Rankings  Backlinks  Competitors


                   |

                   |

              AI ENGINE DATA


                   |

 ------------------------------------------------

 |              |              |

Agents       Workflows      Memory


                   |

                   |

              Reports + Analytics
```


# Final Objective


The SEO AI Database System should provide:


- Scalable SEO data storage
- Multi-tenant SaaS support
- AI memory persistence
- Fast intelligence retrieval
- Complete SEO history tracking
- Reliable analytics foundation


The database becomes the core knowledge storage layer of the SEO AI operating system.