# GitHub Contributors API

A robust Node.js API that tracks new contributors to any GitHub repository with year/month filtering and pagination support.

## 🚀 What I Built

This API efficiently identifies and tracks **new contributors** (first-time contributors) to GitHub repositories by analyzing commit history and caching results for optimal performance.

### ✨ Key Features

- 🎯 **Year-specific contributor tracking** - Find who contributed for the first time in any given year
- 📅 **Monthly granularity** - Drill down to specific months
- 📄 **Pagination support** - Handle large contributor lists with customizable page sizes
- ⚡ **Smart caching** - Year-specific database caching for lightning-fast subsequent requests
- 🛡️ **Rate limit handling** - Built-in GitHub API rate limit management
- 🔍 **Input validation** - Comprehensive parameter validation and error handling
- 🤖 **Bot filtering** - Automatically excludes common bots from contributor counts
- 📊 **Rich metadata** - Returns pagination info, contributor details, and commit dates

## 🏗️ Architecture & Tech Stack

- **Backend**: Node.js + Express.js + TypeScript
- **Database**: PostgreSQL with Prisma ORM (v6.11)
- **External API**: GitHub REST API v3
- **Architecture**: Layered architecture with clear separation of concerns

```
src/
├── index.ts                     # Server setup & middleware
├── routes/contributors.route.ts # API endpoint definitions
├── controllers/contributors.ts  # Request handling & response formatting
├── middleware/validation.ts     # Parameter validation & sanitization
├── services/
│   ├── github.service.ts       # GitHub API integration & rate limiting
│   ├── database.service.ts     # Database operations & caching logic
│   └── contributor.service.ts  # Core business logic & data processing
└── prisma/schema.prisma        # Database schema definition
```

## 🔧 Setup Instructions

### Prerequisites

- Node.js 18+
- PostgreSQL database
- GitHub Personal Access Token (recommended for higher rate limits)

### How To Run

1. **install Packages:**

```bash
npm install
```

2. **Environment configuration:**

```bash
# Create .env file with:
DATABASE_URL="postgresql://user:password@localhost:5432/contributors_db"
GITHUB_TOKEN="your_github_personal_access_token"
PORT=3000
NODE_ENV="development"
```

3. **Database setup:**

```bash
npx prisma generate  # Generate Prisma client
npx prisma db push   # Create database tables
```

4. **Start development server:**

```bash
npm run dev
```

Server will start at `http://localhost:3000`

## 📡 API Endpoints

### Base Endpoint

```
GET /
```

Returns API information and available endpoints.

### Get Yearly Contributors

```
GET /:org/:repo/:year?page=1&limit=10
```

**Example:** `/facebook/react/2020?page=1&limit=5`

**Response:**

```json
{
  "org": "facebook",
  "repository": "react",
  "year": "2020",
  "newContributors": 118,
  "contributors": [
    {
      "username": "gaearon",
      "firstCommit": "2020-01-15T10:30:00.000Z"
    },
    {
      "username": "sebmarkbage",
      "firstCommit": "2020-02-03T14:22:00.000Z"
    }
  ],
  "pagination": {
    "currentPage": 1,
    "totalPages": 24,
    "totalContributors": 118,
    "limit": 5,
    "hasNext": true,
    "hasPrev": false
  }
}
```

### Get Monthly Contributors

```
GET /:org/:repo/:year/:month?page=1&limit=10
```

**Example:** `/facebook/react/2020/03?page=1&limit=10`

### Query Parameters

- `page` (optional): Page number, defaults to 1
- `limit` (optional): Items per page, defaults to 10

### Validation Rules

- **Organization**: Required, non-empty string
- **Repository**: Required, non-empty string
- **Year**: Integer between 2008 and current year
- **Month**: Integer between 1-12 (if provided)

## 🔍 How It Works

### Smart Caching Strategy

1. **First Request**: API fetches year-specific commits from GitHub, processes contributors, and caches results
2. **Subsequent Requests**: Data served instantly from PostgreSQL cache
3. **Year Isolation**: Each year's data is cached independently (2019, 2020, 2021 requests are separate)

### Data Processing Pipeline

1. **Fetch commits** for specified year using GitHub's `since`/`until` parameters
2. **Extract unique contributors** and their earliest commit dates within that year
3. **Verify first-time status** by checking if it's truly their first commit to the repository
4. **Store with deduplication** using smart upsert logic to handle edge cases
5. **Serve with pagination** and rich metadata

### Performance Optimizations

- Year-specific API calls (not all repository history)
- Automatic rate limit detection and backoff
- Database indexing on composite keys
- Efficient pagination with total count optimization

## 📊 Expected Results

### Performance Characteristics

- **First request** for a year: 2-5 seconds (GitHub API fetch)
- **Cached requests**: ~100ms (database lookup)
- **Large repositories**: Handles repositories with 1000+ contributors efficiently
- **Rate limits**: Automatically managed, ~5000 requests/hour with token

### Sample Data Points

- `facebook/react/2020`: ~118 new contributors
- `microsoft/vscode/2021`: ~200+ new contributors
- `torvalds/linux/2019`: ~1500+ new contributors

### Error Handling

- Invalid repository/organization names
- Non-existent repositories
- Years outside valid range
- GitHub API rate limit exceeded
- Large repository timeouts

## 🧪 Testing Examples

```bash
# Basic yearly stats
curl "http://localhost:3000/facebook/react/2020"

# Monthly breakdown
curl "http://localhost:3000/microsoft/vscode/2021/06"

# Pagination
curl "http://localhost:3000/facebook/react/2020?page=2&limit=5"

# Different years for comparison
curl "http://localhost:3000/facebook/react/2019"
curl "http://localhost:3000/facebook/react/2020"
curl "http://localhost:3000/facebook/react/2021"
```

## 🛠️ Available Scripts

```bash
npm run dev         # Start development server with nodemon
npm run build       # Compile TypeScript to JavaScript
npm start           # Start production server
npm run db:generate # Regenerate Prisma client
npm run db:push     # Push schema changes to database
npm run db:studio   # Open Prisma Studio (database GUI)
npm test            # Run test suite
```

## 🎯 Key Implementation Decisions

1. **Year-specific caching** instead of full repository processing for performance
2. **Prisma 6.11** for better PostgreSQL integration and type safety
3. **Layered architecture** for maintainability and testability
4. **Smart upsert logic** to handle duplicate contributors across different years
5. **Comprehensive validation** to prevent invalid API usage
6. **Pagination by default** to handle large result sets efficiently

---
