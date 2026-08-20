# API Specification - WeightGPT

**Version:** 1.0
**Created:** 2025-11-07
**Last Updated:** 2025-11-07
**Status:** Complete - Ready for Implementation
**Base URL:** `https://api.weightgpt.com` (production) | `http://localhost:3000` (development)

---

## Table of Contents

1. [Overview](#overview)
2. [Authentication](#authentication)
3. [API Versioning](#api-versioning)
4. [Request/Response Format](#requestresponse-format)
5. [Error Handling](#error-handling)
6. [Rate Limiting](#rate-limiting)
7. [Pagination](#pagination)
8. [Endpoint Reference](#endpoint-reference)
   - [Authentication](#authentication-endpoints)
   - [User Settings & Profile](#user-settings--profile-endpoints)
   - [Meal Planning](#meal-planning-endpoints)
   - [Workout Planning](#workout-planning-endpoints)
   - [Logging (AI-Powered)](#logging-endpoints-ai-powered)
   - [Swapping System](#swapping-system-endpoints)
   - [Weekly Planning & Grocery](#weekly-planning--grocery-endpoints)
   - [Progress & Analytics](#progress--analytics-endpoints)
   - [History & Saved Items](#history--saved-items-endpoints)
   - [Offline Sync](#offline-sync-endpoints)
   - [Support & Account](#support--account-endpoints)
9. [OpenAI Integration](#openai-integration)
10. [Caching Strategy](#caching-strategy)
11. [Performance Targets](#performance-targets)

---

## Overview

This document consolidates all API endpoints for the WeightGPT mobile application, extracted from planning specifications Q1-Q3.7. The API follows RESTful conventions with JSON request/response formats.

**Total Endpoints:** 72

**Endpoint Breakdown by Feature:**
- Authentication: 1 endpoint
- User Settings & Profile: 17 endpoints
- Meal Planning: 5 endpoints
- Workout Planning: 0 endpoints (included in swapping)
- Logging (AI-Powered): 9 endpoints
- Swapping System: 8 endpoints
- Weekly Planning & Grocery: 6 endpoints
- Progress & Analytics: 10 endpoints
- History & Saved Items: 9 endpoints
- Offline Sync: 1 endpoint
- Support & Account: 6 endpoints

---

## Authentication

**Authentication Method:** JWT (JSON Web Tokens)
**Token Provider:** Firebase Authentication
**Token Location:** Authorization header
**Token Format:** `Bearer {jwt_token}`

### Token Lifecycle

**Token Expiration:** 7 days
**Refresh Strategy:** Automatic via Firebase SDK
**Logout:** Server-side session invalidation

### Protected Endpoints

All endpoints except the following require authentication:
- None (all endpoints require auth after Firebase authentication)

### Authentication Flow

1. User authenticates with Firebase (email/password, Google, Apple)
2. Firebase returns JWT token
3. Mobile app includes token in `Authorization` header for all API requests
4. Backend validates token with Firebase Admin SDK
5. Backend extracts `user_id` from token for all operations

**Example Header:**
```
Authorization: Bearer eyJhbGciOiJSUzI1NiIsImtpZCI6IjE4MmFjY...
```

---

## API Versioning

**Current Version:** v1
**Versioning Strategy:** URL path versioning
**Format:** `/api/v1/{resource}`

### Version Migration

When breaking changes are introduced:
- New version endpoint created (e.g., `/api/v2/...`)
- Old version maintained for 6 months
- Deprecation warnings sent to clients
- Migration guide provided

---

## Request/Response Format

### Request Format

**Content-Type:** `application/json`
**Character Encoding:** UTF-8

**Standard Request Structure:**
```json
{
  "user_id": "string", // Extracted from JWT, included for validation
  "data": {
    // Request-specific fields
  }
}
```

### Response Format

**Content-Type:** `application/json`
**Character Encoding:** UTF-8

**Success Response (2xx):**
```json
{
  "success": true,
  "data": {
    // Response-specific fields
  },
  "meta": {
    "timestamp": "2024-11-07T12:00:00Z",
    "request_id": "req_abc123"
  }
}
```

**Error Response (4xx, 5xx):**
```json
{
  "success": false,
  "error": {
    "code": "ERROR_CODE",
    "message": "Human-readable error message",
    "details": {
      // Additional error context
    }
  },
  "meta": {
    "timestamp": "2024-11-07T12:00:00Z",
    "request_id": "req_abc123"
  }
}
```

---

## Error Handling

### Standard HTTP Status Codes

| Code | Meaning | When to Use |
|------|---------|-------------|
| 200 | OK | Successful GET, PUT, PATCH, DELETE |
| 201 | Created | Successful POST (resource created) |
| 400 | Bad Request | Invalid request data, validation failure |
| 401 | Unauthorized | Missing or invalid JWT token |
| 403 | Forbidden | User lacks permission for resource |
| 404 | Not Found | Resource doesn't exist |
| 409 | Conflict | Optimistic locking failure, duplicate entry |
| 422 | Unprocessable Entity | Request valid but semantically incorrect |
| 429 | Too Many Requests | Rate limit exceeded |
| 500 | Internal Server Error | Unexpected server error |
| 502 | Bad Gateway | Upstream service (OpenAI) failure |
| 503 | Service Unavailable | Server overloaded or maintenance |

### Error Codes

**Format:** `CATEGORY_SPECIFIC_ERROR`

**Examples:**
- `AUTH_TOKEN_EXPIRED` - JWT token expired
- `AUTH_TOKEN_INVALID` - JWT token malformed or tampered
- `VALIDATION_FIELD_REQUIRED` - Required field missing
- `VALIDATION_FIELD_INVALID` - Field value invalid
- `RESOURCE_NOT_FOUND` - Requested resource doesn't exist
- `RESOURCE_CONFLICT` - Optimistic locking version mismatch
- `RATE_LIMIT_EXCEEDED` - Too many requests
- `AI_SERVICE_UNAVAILABLE` - OpenAI API unavailable
- `AI_SERVICE_TIMEOUT` - OpenAI API timeout (>30s)
- `STORAGE_QUOTA_EXCEEDED` - User storage limit reached
- `SYNC_DEPENDENCY_CYCLE` - Circular dependency in sync queue

### Error Response Details

**Example - Validation Error:**
```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_FIELD_INVALID",
    "message": "Current weight must be between 80 and 400 lbs",
    "details": {
      "field": "current_weight_lbs",
      "value": 450,
      "constraint": "range",
      "min": 80,
      "max": 400
    }
  },
  "meta": {
    "timestamp": "2024-11-07T12:00:00Z",
    "request_id": "req_abc123"
  }
}
```

**Example - Conflict Error (Optimistic Locking):**
```json
{
  "success": false,
  "error": {
    "code": "RESOURCE_CONFLICT",
    "message": "Meal plan was updated. Please refresh and try again.",
    "details": {
      "resource": "meal_plan",
      "resource_id": "plan_456",
      "expected_version": 5,
      "actual_version": 6
    }
  },
  "meta": {
    "timestamp": "2024-11-07T12:00:00Z",
    "request_id": "req_abc123"
  }
}
```

---

## Rate Limiting

### Strategy

**Algorithm:** Token Bucket
**Tracking:** Per-user (by `user_id` from JWT)
**Storage:** Redis (in-memory, fast lookups)

### Limits

| Endpoint Category | Requests per Minute | Requests per Hour |
|-------------------|---------------------|-------------------|
| AI-powered (parsing, generation) | 10 | 200 |
| Read operations (GET) | 60 | 1,000 |
| Write operations (POST, PUT, PATCH, DELETE) | 30 | 500 |
| Sync batch | 5 | 50 |

### Rate Limit Headers

**Response Headers:**
```
X-RateLimit-Limit: 60
X-RateLimit-Remaining: 45
X-RateLimit-Reset: 1699372800 (Unix timestamp)
```

### Rate Limit Exceeded Response

**Status:** 429 Too Many Requests

```json
{
  "success": false,
  "error": {
    "code": "RATE_LIMIT_EXCEEDED",
    "message": "Too many requests. Please try again in 30 seconds.",
    "details": {
      "limit": 60,
      "window": "1 minute",
      "retry_after": 30
    }
  },
  "meta": {
    "timestamp": "2024-11-07T12:00:00Z",
    "request_id": "req_abc123"
  }
}
```

---

## Pagination

### Strategy

**Method:** Cursor-based pagination (for large datasets)
**Fallback:** Offset-based pagination (for smaller, stable datasets)

### Cursor-Based (Preferred)

**Use For:** History, logging feed, search results

**Request Parameters:**
```
GET /api/v1/history/week?cursor=eyJsYXN0X2lkIjoiZW50cnlfNDU2In0&limit=50
```

**Query Parameters:**
- `cursor`: Opaque cursor string (Base64-encoded JSON)
- `limit`: Items per page (default: 50, max: 100)

**Response:**
```json
{
  "data": [...],
  "pagination": {
    "next_cursor": "eyJsYXN0X2lkIjoiZW50cnlfNTA2In0",
    "has_more": true,
    "total_count": 234
  }
}
```

### Offset-Based (Fallback)

**Use For:** Workout library, saved items

**Request Parameters:**
```
GET /api/v1/workouts/library?page=2&limit=20
```

**Query Parameters:**
- `page`: Page number (1-indexed)
- `limit`: Items per page (default: 20, max: 100)

**Response:**
```json
{
  "data": [...],
  "pagination": {
    "page": 2,
    "limit": 20,
    "total_pages": 15,
    "total_count": 287,
    "has_previous": true,
    "has_next": true
  }
}
```

---

## Endpoint Reference

---

## Authentication Endpoints

### POST /api/v1/auth/logout

**Purpose:** Logout user and invalidate session

**Authentication:** Required

**Request:**
```json
{
  "user_id": "user_123"
}
```

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Logged out successfully"
}
```

**Notes:**
- Invalidates server-side session
- Client should clear local JWT token
- Redirects to login screen

---

## User Settings & Profile Endpoints

### GET /api/v1/settings

**Purpose:** Fetch all user settings

**Authentication:** Required

**Response (200 OK):**
```json
{
  "notifications": {
    "weekly_reset": true,
    "streak_reminder": true,
    "achievements": true,
    "marketing": false
  },
  "units": {
    "weight": "lbs",
    "distance": "miles",
    "length": "inches"
  },
  "theme": "dark",
  "weekly_schedule": {
    "week_start_day": "monday",
    "shopping_day": "sunday"
  }
}
```

---

### PATCH /api/v1/settings

**Purpose:** Update settings (partial update)

**Authentication:** Required

**Request:**
```json
{
  "user_id": "user_123",
  "updates": {
    "notifications": {
      "streak_reminder": false
    },
    "theme": "light"
  }
}
```

**Response (200 OK):**
```json
{
  "success": true,
  "settings": {
    // Full updated settings object
  }
}
```

---

### PATCH /api/v1/settings/notifications

**Purpose:** Update notification preferences

**Authentication:** Required

**Request:**
```json
{
  "user_id": "user_123",
  "weekly_reset": false,
  "streak_reminder": true,
  "achievements": true,
  "marketing": false
}
```

**Response (200 OK):**
```json
{
  "success": true,
  "notifications": {
    "weekly_reset": false,
    "streak_reminder": true,
    "achievements": true,
    "marketing": false
  }
}
```

---

### PATCH /api/v1/settings/units

**Purpose:** Update unit preferences

**Authentication:** Required

**Request:**
```json
{
  "user_id": "user_123",
  "weight": "kg",
  "distance": "km",
  "length": "cm"
}
```

**Response (200 OK):**
```json
{
  "success": true,
  "units": {
    "weight": "kg",
    "distance": "km",
    "length": "cm"
  }
}
```

**Notes:**
- Affects display only
- All stored values remain in imperial (lbs, miles, inches)
- Conversion happens at presentation layer

---

### PATCH /api/v1/settings/theme

**Purpose:** Update theme preference

**Authentication:** Required

**Request:**
```json
{
  "user_id": "user_123",
  "theme": "dark"
}
```

**Response (200 OK):**
```json
{
  "success": true,
  "theme": "dark"
}
```

**Valid Values:** `"light"`, `"dark"`, `"system"`

---

### PATCH /api/v1/settings/weekly-schedule

**Purpose:** Update week start day and shopping day

**Authentication:** Required

**Request:**
```json
{
  "user_id": "user_123",
  "week_start_day": "monday",
  "shopping_day": "sunday"
}
```

**Response (200 OK):**
```json
{
  "success": true,
  "weekly_schedule": {
    "week_start_day": "monday",
    "shopping_day": "sunday"
  }
}
```

**Validation:**
- `week_start_day`: monday-sunday
- `shopping_day`: monday-sunday

---

### GET /api/v1/profile

**Purpose:** Fetch user profile

**Authentication:** Required

**Response (200 OK):**
```json
{
  "user_id": "user_123",
  "name": "John Doe",
  "email": "john@example.com",
  "age": 30,
  "sex": "male",
  "height_inches": 70,
  "current_weight_lbs": 185.2,
  "goal_weight_lbs": 175.0,
  "goal_type": "lose_weight",
  "goal_date": "2025-02-01",
  "activity_level": "moderately_active",
  "dietary_restrictions": ["vegetarian"],
  "avoided_foods": ["mushrooms", "olives"],
  "eating_pattern": ["breakfast", "lunch", "dinner", "snack"],
  "cooking_skills": "intermediate",
  "fitness_level": "intermediate",
  "available_equipment": ["dumbbells", "resistance_bands", "bodyweight"],
  "workout_frequency": 4,
  "calculated_metrics": {
    "bmr": 1850,
    "tdee": 2550,
    "daily_calorie_target": 2050,
    "daily_macro_targets": {
      "protein_g": 180,
      "carbs_g": 230,
      "fat_g": 68
    }
  }
}
```

---

### PATCH /api/v1/profile

**Purpose:** Update user profile (partial update)

**Authentication:** Required

**Request:**
```json
{
  "user_id": "user_123",
  "updates": {
    "current_weight_lbs": 184.5,
    "eating_pattern": ["breakfast", "lunch", "dinner"]
  }
}
```

**Response (200 OK):**
```json
{
  "success": true,
  "profile": {
    // Full updated profile
  },
  "regeneration_required": false
}
```

**Validation:**
- Name: 1-50 characters
- Current Weight: 80-400 lbs
- Goal Weight: 80-400 lbs
- Dietary Restrictions: Max 5
- Avoided Foods: Max 20 items

---

### PATCH /api/v1/profile/goals

**Purpose:** Update weight goals (triggers plan regeneration if significant change)

**Authentication:** Required

**Request:**
```json
{
  "user_id": "user_123",
  "goal_type": "lose_weight",
  "goal_weight_lbs": 170.0,
  "goal_date": "2025-03-01"
}
```

**Response (200 OK):**
```json
{
  "success": true,
  "goals": {
    "goal_type": "lose_weight",
    "goal_weight_lbs": 170.0,
    "goal_date": "2025-03-01"
  },
  "regeneration_required": true,
  "regeneration_targets": ["meal_plan", "workout_plan"]
}
```

**Regeneration Triggers:**
- Goal type changed
- Goal weight changed by >10 lbs
- Goal date changed significantly

---

### PATCH /api/v1/profile/dietary-preferences

**Purpose:** Update dietary preferences (triggers meal plan regeneration)

**Authentication:** Required

**Request:**
```json
{
  "user_id": "user_123",
  "dietary_restrictions": ["vegetarian", "gluten_free"],
  "avoided_foods": ["mushrooms", "olives", "bell_peppers"],
  "eating_pattern": ["breakfast", "lunch", "dinner", "snack"]
}
```

**Response (200 OK):**
```json
{
  "success": true,
  "dietary_preferences": {
    // Updated preferences
  },
  "regeneration_required": true,
  "regeneration_targets": ["meal_plan"]
}
```

---

### PATCH /api/v1/profile/fitness-details

**Purpose:** Update fitness details (triggers workout plan regeneration)

**Authentication:** Required

**Request:**
```json
{
  "user_id": "user_123",
  "fitness_level": "advanced",
  "available_equipment": ["dumbbells", "barbell", "gym"],
  "workout_frequency": 5
}
```

**Response (200 OK):**
```json
{
  "success": true,
  "fitness_details": {
    // Updated details
  },
  "regeneration_required": true,
  "regeneration_targets": ["workout_plan"]
}
```

---

### GET /api/v1/account/subscription

**Purpose:** Fetch subscription status

**Authentication:** Required

**Response (200 OK):**
```json
{
  "status": "active",
  "plan": "monthly",
  "price": "$9.99/month",
  "renews_at": "2024-12-07T00:00:00Z",
  "payment_method": "Apple Pay",
  "managed_by": "app_store"
}
```

**Status Values:** `"active"`, `"canceled"`, `"expired"`, `"trial"`

---

### GET /api/v1/account/billing-history

**Purpose:** Fetch billing transactions

**Authentication:** Required

**Response (200 OK):**
```json
{
  "transactions": [
    {
      "id": "txn_789",
      "date": "2024-11-07",
      "description": "Monthly Subscription",
      "amount": "$9.99",
      "status": "paid",
      "receipt_url": "/api/v1/account/receipt/txn_789"
    }
  ]
}
```

---

### POST /api/v1/account/restore-purchases

**Purpose:** Restore purchases (iOS)

**Authentication:** Required

**Request:**
```json
{
  "user_id": "user_123",
  "platform": "ios",
  "receipt_data": "base64_encoded_receipt"
}
```

**Response (200 OK):**
```json
{
  "success": true,
  "restored": true,
  "subscription": {
    // Restored subscription details
  }
}
```

---

### GET /api/v1/account/receipt/:id

**Purpose:** Download receipt PDF

**Authentication:** Required

**Response (200 OK):**
- Content-Type: application/pdf
- Binary PDF file

---

## Support & Account Endpoints

### POST /api/v1/support/contact

**Purpose:** Send contact form

**Authentication:** Required

**Request:**
```json
{
  "user_id": "user_123",
  "name": "John Doe",
  "email": "john@example.com",
  "subject": "Account Issue",
  "message": "I'm having trouble with...",
  "screenshot": "base64_encoded_image" // Optional
}
```

**Response (201 Created):**
```json
{
  "success": true,
  "ticket_id": "ticket_456",
  "message": "We've received your message and will respond within 24 hours."
}
```

**Validation:**
- Name: 1-50 characters
- Email: Valid email format
- Message: 10-1000 characters
- Screenshot: Max 5 MB, JPG/PNG

---

### POST /api/v1/support/bug-report

**Purpose:** Submit bug report

**Authentication:** Required

**Request:**
```json
{
  "user_id": "user_123",
  "title": "App crashes on meal logging",
  "description": "Steps to reproduce...",
  "severity": "high",
  "device_info": {
    "platform": "iOS",
    "os_version": "17.1",
    "app_version": "1.0.0"
  },
  "screenshot": "base64_encoded_image"
}
```

**Response (201 Created):**
```json
{
  "success": true,
  "bug_report_id": "bug_789",
  "message": "Bug report submitted. Thank you for helping us improve!"
}
```

---

### POST /api/v1/support/feature-request

**Purpose:** Submit feature request

**Authentication:** Required

**Request:**
```json
{
  "user_id": "user_123",
  "title": "Add barcode scanning",
  "description": "It would be great if...",
  "category": "logging"
}
```

**Response (201 Created):**
```json
{
  "success": true,
  "feature_request_id": "feat_101",
  "message": "Feature request submitted. We'll consider it for future updates!"
}
```

---

### POST /api/v1/support/faq-feedback

**Purpose:** Record FAQ helpful/not helpful

**Authentication:** Required

**Request:**
```json
{
  "user_id": "user_123",
  "faq_id": "faq_5",
  "helpful": true
}
```

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Thank you for your feedback!"
}
```

---

### GET /api/v1/support/faq

**Purpose:** Fetch FAQ list

**Authentication:** Required

**Response (200 OK):**
```json
{
  "categories": [
    {
      "name": "Getting Started",
      "faqs": [
        {
          "id": "faq_1",
          "question": "How do I log a meal?",
          "answer": "To log a meal, tap the Log tab...",
          "helpful_count": 42,
          "not_helpful_count": 3
        }
      ]
    }
  ]
}
```

---

### POST /api/v1/privacy/export-data

**Purpose:** Request data export (GDPR)

**Authentication:** Required

**Request:**
```json
{
  "user_id": "user_123",
  "format": "json"
}
```

**Response (202 Accepted):**
```json
{
  "success": true,
  "export_id": "export_456",
  "message": "Your data export is being prepared. You'll receive an email when it's ready.",
  "estimated_time": "10-15 minutes"
}
```

**Notes:**
- Email sent when export ready
- Export includes all user data (profile, logs, meals, workouts)
- Export URL expires in 7 days

---

### POST /api/v1/account/delete

**Purpose:** Delete account (soft delete with 30-day grace period)

**Authentication:** Required

**Request:**
```json
{
  "user_id": "user_123",
  "confirmation_text": "DELETE",
  "reason": "No longer needed" // Optional
}
```

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Account deletion scheduled. You have 30 days to change your mind.",
  "deletion_date": "2024-12-07",
  "cancellation_token": "cancel_abc123"
}
```

**Validation:**
- `confirmation_text` must match "DELETE" exactly (case-sensitive)

**Grace Period:**
- Account marked as deleted
- Data retained for 30 days
- User can cancel deletion within 30 days
- After 30 days, data permanently deleted

---

## Meal Planning Endpoints

### POST /api/meal-plans/generate

**Purpose:** Generate weekly meal plan

**Authentication:** Required

**Request:**
```json
{
  "user_id": "user_123",
  "week_start_date": "2024-11-11",
  "user_profile": {
    // Full UserProfile object
  },
  "favorites": ["meal_id_1", "meal_id_2"],
  "regeneration": false,
  "regeneration_count": 0
}
```

**Response (201 Created):**
```json
{
  "meal_plan": {
    "id": "plan_456",
    "week_start_date": "2024-11-11",
    "week_end_date": "2024-11-17",
    "version": 1
  },
  "meals": [
    {
      "id": "meal_789",
      "name": "Greek Yogurt Bowl",
      "meal_type": "breakfast",
      "day_of_week": "monday",
      "calories": 340,
      "macros": {
        "protein_g": 25,
        "carbs_g": 38,
        "fat_g": 12
      },
      "ingredients": [...],
      "recipe_steps": [...]
    }
    // ... 13-27 more meals
  ],
  "generation_id": "gen_123",
  "token_usage": 4200,
  "estimated_cost": 0.008
}
```

**Performance:** <20 seconds (target 15s)
**Token Budget:** ~3,000-5,000 tokens (~$0.006-$0.01 per plan)

---

### GET /api/meals/week/{week_id}

**Purpose:** Fetch all meals from current week for Quick Swap

**Authentication:** Required

**Request Parameters:**
- `week_id`: Week identifier
- `exclude_meal_id`: (optional) Exclude the meal being swapped
- `meal_type_filter`: (optional) Filter by meal type

**Response (200 OK):**
```json
{
  "meals": [
    {
      "id": "meal_789",
      "name": "Greek Yogurt Bowl",
      "meal_type": "breakfast",
      "calories": 340,
      "macros": {...}
    }
  ],
  "week_start_date": "2024-11-11",
  "week_end_date": "2024-11-17"
}
```

**Performance:** <500ms

---

### POST /api/meals/swap/generate

**Purpose:** Generate AI meal alternatives

**Authentication:** Required

**Request:**
```json
{
  "user_id": "user_123",
  "original_meal": {
    "name": "Chicken Caesar Salad",
    "meal_type": "lunch",
    "calories": 520,
    "protein_g": 41,
    "carbs_g": 52,
    "fat_g": 18
  },
  "user_preferences": {
    "dietary_restrictions": ["vegetarian"],
    "avoided_foods": ["mushrooms"],
    "eating_pattern": ["breakfast", "lunch", "dinner", "snack"]
  },
  "constraints": {
    "calorie_range": [470, 570],
    "protein_range": [36, 46],
    "max_alternatives": 3
  },
  "generation_count": 1
}
```

**Response (200 OK):**
```json
{
  "alternatives": [
    {
      "id": "meal_alt_1",
      "name": "Quinoa Buddha Bowl",
      "meal_type": "lunch",
      "calories": 530,
      "macros": {...},
      "ingredients": [...],
      "recipe_steps": [...]
    }
    // ... 2 more alternatives
  ],
  "generation_id": "gen_456",
  "token_usage": 500
}
```

**Performance:** <5 seconds
**Token Budget:** ~500 tokens per request (~$0.001)

---

### PATCH /api/meals/{meal_id}/replace

**Purpose:** Execute swap (replace one meal with another)

**Authentication:** Required

**Request:**
```json
{
  "user_id": "user_123",
  "meal_plan_id": "plan_456",
  "meal_plan_version": 5,
  "original_meal_id": "meal_789",
  "replacement_meal": {
    // Full meal object (AI) or { meal_id: "meal_890" } (Quick Swap)
  },
  "swap_type": "quick",
  "swap_timestamp": "2024-11-07T12:00:00Z"
}
```

**Response (200 OK):**
```json
{
  "success": true,
  "updated_meal_plan": {
    "id": "plan_456",
    "version": 6
  },
  "daily_totals": {
    "calories": 2100,
    "protein_g": 180,
    "carbs_g": 230,
    "fat_g": 68
  },
  "swap_history_id": "swap_123"
}
```

**Optimistic Locking:**
- Request must include current `meal_plan_version`
- If version mismatch, returns `409 Conflict`
- Client must refetch and retry

**Performance:** <500ms

---

### GET /api/meal-plans/favorites

**Purpose:** Get favorited meals for regeneration prompt

**Authentication:** Required

**Response (200 OK):**
```json
{
  "favorites": [
    {
      "id": "meal_789",
      "name": "Greek Yogurt Bowl",
      "meal_type": "breakfast",
      "log_count": 12
    }
  ]
}
```

---

## Workout Planning Endpoints

### POST /api/workout-plans/generate

**Purpose:** Generate weekly workout plan

**Authentication:** Required

**Request:**
```json
{
  "user_id": "user_123",
  "week_start_date": "2024-11-11",
  "user_profile": {
    // Full UserProfile object
  },
  "workout_frequency": 4,
  "regeneration": false
}
```

**Response (201 Created):**
```json
{
  "workout_plan": {
    "id": "wplan_456",
    "week_start_date": "2024-11-11",
    "week_end_date": "2024-11-17",
    "version": 1
  },
  "workouts": [
    {
      "id": "workout_789",
      "name": "Upper Body Strength",
      "type": "strength",
      "workout_category": "upper_body",
      "day_of_week": "monday",
      "duration_min": 30,
      "estimated_calories": 180,
      "exercises": [...]
    }
    // ... 3 more workouts (based on frequency)
  ],
  "generation_id": "gen_789"
}
```

**Performance:** <10 seconds
**Token Budget:** ~1,000-2,000 tokens (~$0.002-$0.004 per plan)

---

## Logging Endpoints (AI-Powered)

### POST /api/v1/log/meal

**Purpose:** Log a meal

**Authentication:** Required

**Request:**
```json
{
  "user_id": "user_123",
  "date": "2024-11-07",
  "logged_at": "2024-11-07T12:30:00Z",
  "meal": {
    "name": "Grilled Chicken Bowl",
    "meal_type": "lunch",
    "calories": 520,
    "macros": {
      "protein_g": 41,
      "carbs_g": 52,
      "fat_g": 18
    },
    "ingredients": [...],
    "source": "ai_parsed"
  }
}
```

**Response (201 Created):**
```json
{
  "success": true,
  "logged_entry": {
    "id": "entry_456",
    "date": "2024-11-07",
    "logged_at": "2024-11-07T12:30:00Z",
    "type": "meal",
    "meal": {...}
  },
  "daily_summary_updated": true
}
```

---

### POST /api/v1/log/workout

**Purpose:** Log a workout

**Authentication:** Required

**Request:**
```json
{
  "user_id": "user_123",
  "date": "2024-11-07",
  "logged_at": "2024-11-07T18:15:00Z",
  "workout": {
    "name": "Upper Body Strength",
    "type": "strength",
    "duration_min": 30,
    "calories_burned": 180,
    "exercises": [...]
  }
}
```

**Response (201 Created):**
```json
{
  "success": true,
  "logged_entry": {
    "id": "entry_457",
    "date": "2024-11-07",
    "logged_at": "2024-11-07T18:15:00Z",
    "type": "workout",
    "workout": {...}
  },
  "daily_summary_updated": true
}
```

---

### POST /api/v1/log/weight

**Purpose:** Log a weight entry

**Authentication:** Required

**Request:**
```json
{
  "user_id": "user_123",
  "date": "2024-11-07",
  "logged_at": "2024-11-07T07:00:00Z",
  "weight_lbs": 185.2,
  "notes": "Feeling great!"
}
```

**Response (201 Created):**
```json
{
  "success": true,
  "weight_entry": {
    "id": "we_123",
    "weight_lbs": 185.2,
    "logged_at": "2024-11-07T07:00:00Z",
    "change_from_last": -0.5,
    "notes": "Feeling great!"
  }
}
```

---

### GET /api/v1/log/recent

**Purpose:** Get recent logs (last 14 days, for Log tab history feed)

**Authentication:** Required

**Request Parameters:**
- `user_id`: User identifier
- `limit`: (optional) Max entries (default 50)

**Response (200 OK):**
```json
{
  "entries": [
    {
      "id": "entry_456",
      "date": "2024-11-07",
      "logged_at": "2024-11-07T12:30:00Z",
      "type": "meal",
      "meal": {...}
    },
    {
      "id": "entry_457",
      "date": "2024-11-07",
      "logged_at": "2024-11-07T18:15:00Z",
      "type": "workout",
      "workout": {...}
    }
  ],
  "total_count": 42
}
```

---

### POST /api/v1/ai/parse-meal

**Purpose:** Parse meal input with AI

**Authentication:** Required

**Request:**
```json
{
  "user_input": "grilled chicken with brown rice and broccoli",
  "user_id": "user_123",
  "context": {
    "dietary_restrictions": ["vegetarian"],
    "avoided_foods": ["mushrooms"]
  }
}
```

**Response (200 OK):**
```json
{
  "success": true,
  "restaurant": null,
  "items": [
    {
      "name": "Grilled Chicken Breast",
      "portion": "6 oz",
      "preparation": "grilled",
      "calories": 280,
      "protein_g": 42,
      "carbs_g": 0,
      "fat_g": 6,
      "confidence": 0.9
    }
    // ... more items
  ],
  "total": {
    "calories": 550,
    "protein_g": 51,
    "carbs_g": 56,
    "fat_g": 8
  },
  "followup_needed": false,
  "followup_question": null
}
```

**If follow-up needed:**
```json
{
  "success": true,
  "followup_needed": true,
  "followup_question": {
    "type": "portion_size",
    "question": "How much chicken? (in ounces)",
    "options": ["3 oz", "6 oz", "8 oz", "Other"],
    "food_item": "chicken"
  },
  "partial_parse": {
    "items": [...]
  }
}
```

**Performance:** <5 seconds
**Token Budget:** ~500 tokens (~$0.001 per parse)

---

### POST /api/v1/ai/parse-workout

**Purpose:** Parse workout input with AI

**Authentication:** Required

**Request:**
```json
{
  "user_input": "30 min run",
  "user_id": "user_123"
}
```

**Response (200 OK):**
```json
{
  "success": true,
  "workout": {
    "name": "Running",
    "type": "cardio",
    "subtype": "running",
    "duration_min": 30,
    "intensity": "moderate",
    "estimated_calories": 300,
    "exercises": []
  },
  "followup_needed": false
}
```

**Performance:** <3 seconds
**Token Budget:** ~400 tokens (~$0.0008 per parse)

---

### POST /api/v1/ai/followup

**Purpose:** Send follow-up answer, continue parsing

**Authentication:** Required

**Request:**
```json
{
  "user_id": "user_123",
  "session_id": "parse_session_456",
  "question_id": "q_1",
  "answer": "6 oz"
}
```

**Response (200 OK):**
```json
{
  "success": true,
  "items": [
    // Updated items with portion filled in
  ],
  "total": {...},
  "followup_needed": false
}
```

---

### POST /api/v1/validate/meal

**Purpose:** Validate meal data before logging

**Authentication:** Required

**Request:**
```json
{
  "user_id": "user_123",
  "meal": {
    "name": "Grilled Chicken Bowl",
    "meal_type": "lunch",
    "calories": 520,
    "macros": {...}
  }
}
```

**Response (200 OK):**
```json
{
  "valid": true,
  "errors": []
}
```

**Response (400 Bad Request) - if invalid:**
```json
{
  "valid": false,
  "errors": [
    {
      "field": "calories",
      "message": "Calories must be between 0 and 5000"
    }
  ]
}
```

---

### POST /api/v1/validate/workout

**Purpose:** Validate workout data before logging

**Authentication:** Required

**Request:**
```json
{
  "user_id": "user_123",
  "workout": {
    "name": "Upper Body Strength",
    "type": "strength",
    "duration_min": 30,
    "calories_burned": 180
  }
}
```

**Response (200 OK):**
```json
{
  "valid": true,
  "errors": []
}
```

---

## Swapping System Endpoints

### POST /api/swap/undo

**Purpose:** Undo last swap (restore original meal)

**Authentication:** Required

**Request:**
```json
{
  "user_id": "user_123",
  "swap_history_id": "swap_123"
}
```

**Response (200 OK):**
```json
{
  "success": true,
  "restored_meal_plan": {
    "id": "plan_456",
    "version": 7
  }
}
```

**Performance:** <500ms

---

### GET /api/workouts/library

**Purpose:** Fetch workout library with filters

**Authentication:** Required

**Request Parameters:**
- `type`: (optional) `"strength"`, `"cardio"`, `"all"`
- `subtype`: (optional) Specific subtype
- `duration_min`: (optional) Duration filter
- `equipment`: (optional) Array of equipment
- `goal`: (optional) User goal
- `page`: Page number (default 1)
- `limit`: Items per page (default 20)

**Response (200 OK):**
```json
{
  "workouts": [
    {
      "id": "lib_workout_1",
      "name": "Chest & Triceps",
      "type": "strength",
      "workout_category": "upper_body",
      "duration_min": 30,
      "exercises": [...],
      "estimated_calories": 180,
      "equipment_required": ["dumbbells", "bench"]
    }
  ],
  "total_count": 287,
  "page": 1,
  "total_pages": 15
}
```

**Performance:** <1 second
**Caching:** Library cached locally after first load

---

### POST /api/workouts/compatibility-score

**Purpose:** Calculate compatibility score for library workouts

**Authentication:** Required

**Request:**
```json
{
  "user_id": "user_123",
  "workout_ids": ["lib_workout_1", "lib_workout_2"]
}
```

**Response (200 OK):**
```json
{
  "scores": [
    {
      "workout_id": "lib_workout_1",
      "compatibility_score": 85,
      "breakdown": {
        "equipment_match": 40,
        "duration_match": 25,
        "goal_alignment": 15,
        "fitness_level_match": 5
      }
    }
  ]
}
```

**Performance:** <500ms

---

### POST /api/workouts/swap/generate

**Purpose:** Generate AI workout alternatives

**Authentication:** Required

**Request:**
```json
{
  "user_id": "user_123",
  "original_workout": {
    "name": "Upper Body Strength",
    "type": "strength",
    "duration_min": 30,
    "estimated_calories": 180
  },
  "user_profile": {
    "available_equipment": ["dumbbells", "resistance_bands"],
    "fitness_level": "intermediate",
    "goal": "lose_weight"
  },
  "constraints": {
    "duration_range": [25, 35],
    "calorie_range": [160, 200],
    "max_alternatives": 3
  },
  "generation_count": 1
}
```

**Response (200 OK):**
```json
{
  "alternatives": [
    {
      "id": "workout_alt_1",
      "name": "HIIT Circuit",
      "type": "cardio",
      "duration_min": 30,
      "estimated_calories": 190,
      "exercises": [...]
    }
    // ... 2 more alternatives
  ],
  "generation_id": "gen_890",
  "token_usage": 300
}
```

**Performance:** <7 seconds
**Token Budget:** ~300 tokens per request (~$0.0006)

---

### PATCH /api/workouts/{workout_id}/replace

**Purpose:** Execute workout swap

**Authentication:** Required

**Request:**
```json
{
  "user_id": "user_123",
  "workout_plan_id": "wplan_456",
  "workout_plan_version": 3,
  "original_workout_id": "workout_789",
  "replacement_workout": {
    // Full workout object (AI) or { workout_id: "workout_890" } (library)
  },
  "swap_type": "library",
  "swap_timestamp": "2024-11-07T12:00:00Z"
}
```

**Response (200 OK):**
```json
{
  "success": true,
  "updated_workout_plan": {
    "id": "wplan_456",
    "version": 4
  },
  "swap_history_id": "swap_456"
}
```

**Optimistic Locking:**
- Same as meal swapping
- Returns `409 Conflict` on version mismatch

**Performance:** <500ms

---

## Weekly Planning & Grocery Endpoints

### POST /api/grocery-lists/generate

**Purpose:** Generate grocery list from meal plan

**Authentication:** Required

**Request:**
```json
{
  "user_id": "user_123",
  "meal_plan_id": "plan_456"
}
```

**Response (200 OK):**
```json
{
  "grocery_list": [
    {
      "id": "item_1",
      "name": "Chicken Breast",
      "quantity": 2.5,
      "unit": "lbs",
      "category": "proteins",
      "purchased": false
    },
    {
      "id": "item_2",
      "name": "Brown Rice",
      "quantity": 1,
      "unit": "bag",
      "category": "grains",
      "purchased": false
    }
  ],
  "total_items": 42,
  "categories": ["proteins", "vegetables", "grains", "dairy", "pantry"]
}
```

**Performance:** <2 seconds (algorithmic, not AI)

---

### PATCH /api/grocery-lists/{list_id}

**Purpose:** Update grocery list (check items, add custom items, delete)

**Authentication:** Required

**Request:**
```json
{
  "user_id": "user_123",
  "updates": [
    {
      "item_id": "item_1",
      "purchased": true
    },
    {
      "item_id": "item_2",
      "deleted": true
    }
  ],
  "custom_items": [
    {
      "name": "Protein Powder",
      "quantity": 1,
      "unit": "container",
      "category": "supplements"
    }
  ]
}
```

**Response (200 OK):**
```json
{
  "updated_grocery_list": [
    // Full updated list
  ]
}
```

---

### POST /api/grocery-lists/export

**Purpose:** Export grocery list (PDF, text, image, share)

**Authentication:** Required

**Request:**
```json
{
  "user_id": "user_123",
  "grocery_list_id": "list_456",
  "format": "pdf"
}
```

**Response (200 OK):**
```json
{
  "success": true,
  "export_url": "https://cdn.weightgpt.com/exports/grocery_list_456.pdf",
  "expires_at": "2024-11-08T00:00:00Z"
}
```

**Supported Formats:** `"pdf"`, `"text"`, `"image"`, `"share"` (native share sheet)

---

## Progress & Analytics Endpoints

### GET /api/progress/weight

**Purpose:** Fetch user's weight entries with trend line data

**Authentication:** Required

**Request Parameters:**
- `start_date`: (optional) ISO 8601 date
- `end_date`: (optional) ISO 8601 date (defaults to today)
- `range`: (optional) `"1_week"`, `"1_month"`, `"3_months"`, `"6_months"`, `"1_year"`, `"all"`

**Response (200 OK):**
```json
{
  "weight_entries": [
    {
      "id": "we_123",
      "weight_lbs": 185.2,
      "logged_at": "2024-11-05T08:30:00Z",
      "notes": "Feeling great!"
    }
  ],
  "trend_line": {
    "slope": -0.12,
    "intercept": 190.0,
    "projected_goal_date": "2025-01-15T00:00:00Z"
  },
  "progress": {
    "start_weight_lbs": 190.0,
    "current_weight_lbs": 185.2,
    "goal_weight_lbs": 175.0,
    "percent_toward_goal": 32,
    "status": "on_track"
  }
}
```

**Performance:** <1 second
**Caching:** 24 hours

---

### GET /api/progress/summary/weekly

**Purpose:** Fetch weekly summary data

**Authentication:** Required

**Request Parameters:**
- `week_start`: (optional) ISO 8601 date (Monday, defaults to current week)

**Response (200 OK):**
```json
{
  "week_start": "2024-11-04T00:00:00Z",
  "week_end": "2024-11-10T23:59:59Z",
  "meals_logged": 27,
  "workouts_logged": 5,
  "total_calories": 14350,
  "avg_calories_per_day": 2050,
  "macros": {
    "protein": { "current": 150, "target": 180 },
    "carbs": { "current": 250, "target": 300 },
    "fat": { "current": 62, "target": 70 }
  },
  "exercise": {
    "total_minutes": 210,
    "total_hours": 3.5,
    "total_calories_burned": 850
  },
  "comparison_vs_last_week": {
    "meals_diff": 2,
    "workouts_diff": 1,
    "calories_diff": 50
  },
  "days_completed": [true, true, true, true, true, false, false]
}
```

**Performance:** <1 second
**Caching:** 1 week

---

### GET /api/progress/summary/monthly

**Purpose:** Fetch monthly summary data

**Authentication:** Required

**Request Parameters:**
- `month`: (optional) YYYY-MM format (defaults to current month)

**Response (200 OK):**
```json
{
  "month": "2024-11",
  "meals_logged": 85,
  "workouts_logged": 18,
  "total_calories": 57400,
  "avg_calories_per_day": 2100,
  "macros": {...},
  "exercise": {...},
  "calendar_heatmap": [
    { "date": "2024-11-01", "completed": true },
    { "date": "2024-11-02", "completed": true }
  ],
  "comparison_vs_last_month": {
    "meals_diff": 8,
    "workouts_diff": 3
  }
}
```

**Performance:** <1.5 seconds
**Caching:** 1 month

---

### GET /api/progress/streak

**Purpose:** Fetch user's current streak and history

**Authentication:** Required

**Response (200 OK):**
```json
{
  "current_streak": 7,
  "longest_streak": 14,
  "streak_history": [
    {
      "id": "sh_456",
      "start_date": "2024-11-01",
      "end_date": "2024-11-07",
      "streak_length": 7,
      "active": true
    }
  ],
  "last_90_days_heatmap": [
    { "date": "2024-08-08", "completed": false },
    { "date": "2024-08-09", "completed": true }
  ]
}
```

**Performance:** <500ms
**Caching:** 24 hours

---

### GET /api/progress/achievements

**Purpose:** Fetch user's achievement progress and unlocked badges

**Authentication:** Required

**Response (200 OK):**
```json
{
  "unlocked_count": 4,
  "total_count": 25,
  "achievements": [
    {
      "id": "ach_1",
      "name": "First Week",
      "emoji": "🎉",
      "description": "Complete 7 consecutive days of tracking.",
      "unlock_condition": {
        "type": "streak",
        "metric": "streak_days",
        "value": 7,
        "comparison": ">="
      },
      "unlocked": true,
      "unlocked_at": "2024-10-07T12:00:00Z",
      "progress": {
        "current": 7,
        "target": 7,
        "percent": 100
      }
    }
  ]
}
```

**Performance:** <1 second
**Caching:** 1 hour

---

### GET /api/progress/insights

**Purpose:** Fetch AI-generated weekly insights

**Authentication:** Required

**Request Parameters:**
- `week_start`: (optional) ISO 8601 date (Monday, defaults to current week)
- `force_refresh`: (optional) boolean (default false, bypasses cache)

**Response (200 OK):**
```json
{
  "week_start": "2024-11-04",
  "insight_text": "You're most consistent on weekdays. Try planning ahead for weekends!",
  "generated_at": "2024-11-04T06:00:00Z",
  "expires_at": "2024-11-11T06:00:00Z",
  "cached": false
}
```

**Performance:** <5 seconds (if not cached)
**Token Budget:** ~100 tokens (~$0.00032 per insight)
**Caching:** 7 days

**Error Handling:**
- 503: AI service unavailable (show fallback message)

---

### GET /api/progress/measurements

**Purpose:** Fetch body measurements history

**Authentication:** Required

**Request Parameters:**
- `measurement_type`: (optional) `"waist"`, `"chest"`, `"hips"`, `"arms"`, `"thighs"`, `"calves"`, `"neck"` (returns all if omitted)

**Response (200 OK):**
```json
{
  "measurements": [
    {
      "id": "bm_789",
      "logged_at": "2024-11-06T10:00:00Z",
      "waist_inches": 30.5,
      "chest_inches": 41.5,
      "hips_inches": null,
      "arms_inches": 14.5,
      "thighs_inches": null,
      "calves_inches": null,
      "neck_inches": null,
      "notes": "Monthly check-in",
      "version": 1
    }
  ],
  "summary": {
    "waist": { "start": 32.0, "current": 30.5, "change": -1.5 },
    "chest": { "start": 40.0, "current": 41.5, "change": 1.5 }
  }
}
```

**Performance:** <500ms

---

### POST /api/progress/measurements

**Purpose:** Log new body measurements

**Authentication:** Required

**Request:**
```json
{
  "waist_inches": 30.5,
  "chest_inches": 41.5,
  "hips_inches": null,
  "arms_inches": 14.5,
  "thighs_inches": null,
  "calves_inches": null,
  "neck_inches": null,
  "logged_at": "2024-11-06T10:30:00Z",
  "notes": "Monthly check-in"
}
```

**Response (201 Created):**
```json
{
  "id": "bm_790",
  "logged_at": "2024-11-06T10:30:00Z",
  "waist_inches": 30.5,
  "chest_inches": 41.5,
  "notes": "Monthly check-in",
  "version": 1
}
```

**Validation:**
- Measurements: 0.1-100.0 inches
- 409 Conflict: Duplicate entry (same day already logged)

---

### POST /api/progress/export

**Purpose:** Generate export file (PDF, CSV, or share card image)

**Authentication:** Required

**Request:**
```json
{
  "user_id": "user_123",
  "export_type": "progress_report",
  "format": "pdf",
  "date_range": {
    "start_date": "2024-10-01",
    "end_date": "2024-11-06"
  },
  "include_sections": ["weight_graph", "weekly_summary", "achievements"]
}
```

**Response (202 Accepted):**
```json
{
  "success": true,
  "export_id": "export_789",
  "status": "processing",
  "estimated_time_seconds": 15
}
```

**Supported Formats:**
- `"pdf"` - Progress report (5 pages)
- `"csv"` - Raw data export
- `"share_card"` - Instagram share card (1080×1080px)

---

## History & Saved Items Endpoints

### GET /api/history/week

**Purpose:** Fetch all entries for a specific week

**Authentication:** Required

**Request:**
```json
{
  "user_id": "user_123",
  "week_start_date": "2024-11-04",
  "filter": "all"
}
```

**Response (200 OK):**
```json
{
  "week_start": "2024-11-04",
  "week_end": "2024-11-10",
  "entries": [
    {
      "id": "entry_456",
      "date": "2024-11-06",
      "logged_at": "2024-11-06T12:30:00Z",
      "type": "meal",
      "meal": {...},
      "is_favorite": true
    }
  ],
  "has_previous_week": true,
  "has_next_week": false
}
```

**Caching:**
- Cache-Control: max-age=3600 (1 hour)
- ETag support

**Performance:** <1 second

---

### GET /api/history/search

**Purpose:** Search historical entries by keyword

**Authentication:** Required

**Request:**
```json
{
  "user_id": "user_123",
  "query": "chicken",
  "filter": "all",
  "limit": 50
}
```

**Response (200 OK):**
```json
{
  "results": [
    {
      "id": "entry_456",
      "date": "2024-11-06",
      "type": "meal",
      "name": "Grilled Chicken Bowl",
      "calories": 520,
      "match_score": 0.95
    }
  ],
  "total_results": 12
}
```

**Search Algorithm:**
- Exact match: 1.0
- Starts with: 0.9
- Contains: 0.7
- Fuzzy match (Levenshtein): 0.5-0.6

**Performance:** <1 second

---

### PUT /api/history/entry/:id

**Purpose:** Edit historical entry

**Authentication:** Required

**Request:**
```json
{
  "user_id": "user_123",
  "entry_id": "entry_456",
  "updates": {
    "meal": {
      "name": "Grilled Chicken Bowl (Updated)",
      "calories": 530,
      "macros": {...}
    }
  }
}
```

**Response (200 OK):**
```json
{
  "success": true,
  "entry": {
    "id": "entry_456",
    "updated_at": "2024-11-06T14:22:00Z",
    // Full updated entry
  }
}
```

**Side Effects:**
- Recalculate daily summary
- Recalculate weekly summary
- Update streak if affected

---

### DELETE /api/history/entry/:id

**Purpose:** Delete historical entry

**Authentication:** Required

**Request:**
```json
{
  "user_id": "user_123",
  "entry_id": "entry_456"
}
```

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Entry deleted",
  "impact": {
    "streak_affected": false,
    "daily_summary_recalculated": true,
    "weekly_summary_recalculated": true
  }
}
```

**Side Effects:**
- Recalculate daily/weekly summaries
- Check if deletion breaks streak (warn user before delete)
- Remove from SavedItem if was favorited

---

### POST /api/history/export

**Purpose:** Generate and download history export

**Authentication:** Required

**Request:**
```json
{
  "user_id": "user_123",
  "date_range": {
    "start_date": "2024-10-01",
    "end_date": "2024-11-06"
  },
  "data_types": ["meals", "workouts", "weight"],
  "format": "csv"
}
```

**Response (200 OK):**
```json
{
  "success": true,
  "export_url": "https://cdn.weightgpt.com/exports/user_123_history_20241106.csv",
  "expires_at": "2024-11-07T00:00:00Z",
  "file_size_bytes": 24576
}
```

**Export Formats:**
- **CSV:** Headers: Date, Time, Type, Name, Calories, Protein (g), Carbs (g), Fat (g), Duration (min), Notes
- **PDF:** Title page, summary stats, day-by-day breakdown, charts (5-10 pages)

**Performance:** <10 seconds

---

### GET /api/history/calendar-days

**Purpose:** Get days with entries for calendar view

**Authentication:** Required

**Request:**
```json
{
  "user_id": "user_123",
  "month": "2024-11"
}
```

**Response (200 OK):**
```json
{
  "days_with_entries": [
    { "date": "2024-11-01", "entry_count": 4 },
    { "date": "2024-11-02", "entry_count": 5 },
    { "date": "2024-11-06", "entry_count": 3 }
  ]
}
```

**Performance:** <500ms

---

### GET /api/saved/items

**Purpose:** Fetch all saved (favorited) items

**Authentication:** Required

**Request:**
```json
{
  "user_id": "user_123",
  "type": "all"
}
```

**Response (200 OK):**
```json
{
  "meals": [
    {
      "id": "saved_meal_123",
      "name": "Greek Yogurt Bowl",
      "meal_type": "breakfast",
      "calories": 340,
      "macros": {...},
      "ingredients": [...],
      "recipe_steps": [...],
      "favorited_at": "2024-11-01T10:00:00Z",
      "log_count": 12
    }
  ],
  "workouts": [
    {
      "id": "saved_workout_456",
      "name": "Chest & Triceps",
      "type": "strength",
      "workout_category": "upper_body",
      "duration_min": 30,
      "exercises": [...],
      "estimated_calories": 180,
      "favorited_at": "2024-10-28T14:00:00Z",
      "log_count": 8
    }
  ]
}
```

**Caching:**
- Cache-Control: max-age=604800 (7 days)
- Invalidate on favorite/unfavorite

---

### POST /api/saved/add-to-today

**Purpose:** Quick-add saved item to today

**Authentication:** Required

**Request:**
```json
{
  "user_id": "user_123",
  "saved_item_id": "saved_meal_123",
  "item_type": "meal",
  "date": "2024-11-06",
  "meal_type": "breakfast",
  "action": "add",
  "replace_entry_id": null
}
```

**Response (200 OK):**
```json
{
  "success": true,
  "logged_entry": {
    "id": "entry_890",
    "date": "2024-11-06",
    "logged_at": "2024-11-06T16:45:00Z",
    "type": "meal",
    "meal": {...}
  },
  "daily_summary_updated": true
}
```

**Side Effects:**
- Creates new LoggedEntry
- If replace: Deletes replaced entry
- Recalculates daily summary
- Increments `log_count` on SavedItem
- Updates Home tab real-time

**Performance:** <500ms (60% API cost reduction vs AI parsing)

---

### DELETE /api/saved/item/:id

**Purpose:** Unfavorite (remove from saved)

**Authentication:** Required

**Request:**
```json
{
  "user_id": "user_123",
  "saved_item_id": "saved_meal_123"
}
```

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Item removed from favorites"
}
```

**Side Effects:**
- Deletes SavedItem record
- Invalidates saved items cache

---

## Offline Sync Endpoints

### POST /api/sync/batch

**Purpose:** Batch sync queued actions

**Authentication:** Required

**Request:**
```json
{
  "user_id": "user_123",
  "actions": [
    {
      "id": "action_1",
      "type": "log_meal",
      "priority": "critical",
      "timestamp": "2024-11-06T12:00:00Z",
      "payload": {
        "date": "2024-11-06",
        "meal": {...}
      },
      "dependencies": []
    },
    {
      "id": "action_2",
      "type": "log_workout",
      "priority": "high",
      "timestamp": "2024-11-06T18:00:00Z",
      "payload": {
        "date": "2024-11-06",
        "workout": {...}
      },
      "dependencies": ["action_1"]
    }
  ],
  "last_sync_timestamp": "2024-11-05T20:00:00Z"
}
```

**Response (200 OK):**
```json
{
  "success": true,
  "processed_actions": [
    {
      "action_id": "action_1",
      "status": "success",
      "result": {
        "entry_id": "entry_890"
      }
    },
    {
      "action_id": "action_2",
      "status": "conflict",
      "conflict_resolution": "last_write_wins",
      "result": {
        "entry_id": "entry_891"
      }
    }
  ],
  "failed_actions": [],
  "server_changes": {
    "meal_plans": [...],
    "weight_entries": [...],
    "daily_summaries": [...]
  },
  "next_sync_timestamp": "2024-11-06T18:30:00Z"
}
```

**Batch Limits:**
- Max 50 actions per batch
- Max 2 MB payload size
- Gzip compression applied

**Performance:** <10 seconds (24h offline queue)

**Conflict Resolution:**
- Last-Write-Wins (LWW) for most entities
- Field-level merge for user profile
- Deletion always wins over edit

---

## OpenAI Integration

### Models Used

| Feature | Model | Token Budget | Cost per Request |
|---------|-------|--------------|------------------|
| Meal parsing | GPT-4o-mini | ~500 tokens | ~$0.001 |
| Workout parsing | GPT-4o-mini | ~400 tokens | ~$0.0008 |
| Meal generation (alternatives) | GPT-4o-mini | ~500 tokens | ~$0.001 |
| Workout generation (alternatives) | GPT-4o-mini | ~300 tokens | ~$0.0006 |
| Weekly meal plan | GPT-4o-mini | ~4,000 tokens | ~$0.008 |
| Weekly workout plan | GPT-4o-mini | ~2,000 tokens | ~$0.004 |
| Weekly insights | GPT-4o-mini | ~100 tokens | ~$0.00032 |

### Monthly Cost Estimates

**Per Active User (Corrected Aggregation):**
- Meal logging: 3 meals/day × 30 days × $0.001 = $0.03/month *(Note: Original spec said $0.016/user/month - using that)*
- Workout logging: 4 workouts/week × 4 weeks × $0.0008 = $0.013/month
- Meal plan generation: 4 weeks × $0.008 = $0.032/month
- Workout plan generation: 4 weeks × $0.003 = $0.012/month
- Meal swapping: 2 swaps/week × 4 weeks × $0.001 = $0.008/month *(reduced to $0.003/user/month aggregate)*
- Weekly insights: 4 weeks × $0.00032 = $0.00128/month

**Aggregated Total per user: ~$0.063/month**
- AI Logging (Q3.2): $0.016/user/month
- Meal Plan Generation (Q3.4): $0.032/user/month
- Workout Plan Generation (Q3.4): $0.012/user/month
- Swapping (Q3.3): $0.003/user/month
- AI Insights (Q3.5): $0.00032/user/month

For 1,000 active users: **$63/month** (corrected from $160/month)

### Timeout & Retry

**Timeout:** 30 seconds per request
**Retry:** 3 attempts with exponential backoff (2s, 4s, 8s)
**Fallback:** Manual entry form if AI fails

---

## Caching Strategy

### Cache Locations

| Data Type | Cache Location | TTL | Invalidation Trigger |
|-----------|---------------|-----|---------------------|
| Weight graph | Client (AsyncStorage) | 24 hours | New weight logged |
| Weekly summary | Client + Server (Redis) | 1 week | New entry logged |
| Monthly summary | Client + Server (Redis) | 1 month | New entry logged |
| AI insights | Server (Redis) | 7 days | force_refresh=true |
| Saved items | Client (AsyncStorage) | 7 days | Favorite/unfavorite |
| Workout library | Client (AsyncStorage) | 30 days | Never (static data) |
| User profile | Client (AsyncStorage) | 24 hours | Profile update |
| Meal plan (current week) | Client (AsyncStorage) | Until Sunday | Regeneration |

### Cache Headers

**Standard Cache Response:**
```
Cache-Control: max-age=3600, must-revalidate
ETag: "abc123def456"
Last-Modified: Wed, 07 Nov 2024 12:00:00 GMT
```

**Conditional Requests:**
```
If-None-Match: "abc123def456"
If-Modified-Since: Wed, 07 Nov 2024 12:00:00 GMT
```

**304 Not Modified Response:**
- Empty body
- Status: 304
- Headers: Cache-Control, ETag, Last-Modified

---

## Performance Targets

### Response Times (p95)

| Endpoint Category | Target | Max Acceptable |
|-------------------|--------|----------------|
| Read (GET) | <500ms | <1s |
| Write (POST, PUT, PATCH) | <1s | <2s |
| AI parsing (meal/workout) | <5s | <10s |
| AI generation (alternatives) | <7s | <15s |
| Weekly plan generation | <20s | <30s |
| Batch sync | <10s | <20s |

### Throughput

**Concurrent Users:** 1,000
**Requests per Second:** 100
**Peak Load:** 200 req/s

### Availability

**Uptime Target:** 99.9% (43.2 minutes downtime/month)
**Error Rate:** <0.1%

---

## Summary

**Total API Endpoints:** 72

**Endpoint Categories:**
1. Authentication: 1
2. User Settings & Profile: 17
3. Support & Account: 6
4. Meal Planning: 5
5. Workout Planning: 1
6. Logging (AI-Powered): 9
7. Swapping System: 8
8. Weekly Planning & Grocery: 3
9. Progress & Analytics: 10
10. History & Saved Items: 9
11. Offline Sync: 1
12. AI-powered endpoints (subset of above): 7

**Key Technologies:**
- Authentication: Firebase Auth + JWT
- Database: PostgreSQL (25 tables)
- AI: OpenAI GPT-4o-mini
- Caching: Redis + AsyncStorage
- Rate Limiting: Token Bucket (Redis)
- API Format: RESTful JSON

**Cost Estimates:**
- AI: ~$0.063 per active user/month (aggregated from logging, generation, swapping, insights)
- Infrastructure: ~$14/month (Render.com Starter + PostgreSQL for 1,000 users)
- Total: ~$77/month for 1,000 active users ($63 OpenAI + $14 infrastructure)

---

## Next Steps

1. **Session 16:** Finalize tech stack decisions (10 pending)
2. **Session 17:** Create ARCHITECTURE.md (detailed backend + mobile architecture)
3. **Session 18:** Create PLAN.md (build order, 11 phases)
4. **Session 19:** Create CODE_STANDARDS.md (naming, testing, Git workflow)
5. **Session 20:** Create DEVELOPMENT_SETUP_GUIDE.md (local env setup)
6. **Session 21:** Create REQUIREMENTS.md (user stories, acceptance criteria)
7. **Session 22:** Create DEVELOPMENT-CONTEXT.md (dev session workflow)
8. **Session 23:** Final pre-development review
9. **Session 24+:** Development begins (Phase 1: Foundation)

---

**Document Version:** 1.0
**Created:** 2025-11-07
**Last Updated:** 2025-11-07
**Status:** Complete - Ready for Implementation
**Next Review:** After Session 16 (tech stack finalization)