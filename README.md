# 🚀 Webhook Processing System

A backend system that receives webhook events, processes them through configurable pipelines, and delivers results to subscribers.

---

## 📌 Overview

This system allows users to:

* Create pipelines with different processing actions
* Receive webhook payloads
* Process jobs asynchronously using a worker
* Deliver processed results to external subscribers

---

## 🏗️ Architecture

The project follows a layered architecture:

```text
Handler → Service → Query → Database
             ↓
          Worker → Processing → Delivery
```

### Structure

```text
src/
  api/            # Errors, middleware, response helpers
  handlers/       # HTTP request handlers (Express)
  services/       # Business logic
  worker/         # Background job processor
  db/             # Schema and queries
  processors/     # Pipeline actions (filter, extract, transform)
  enums/          # System constants
  utils/          # Helper functions
```

---

## ⚙️ Features

* 🔄 Webhook ingestion
* 🧩 Configurable pipelines:

  * FILTER
  * EXTRACT
  * TRANSFORM
* ⚡ Asynchronous job processing
* 📡 Delivery to multiple subscribers
* 🔁 Retry mechanism with delay
* ⏱️ Timeout handling for external requests
* 🧱 Clean layered architecture
* 🐳 Dockerized environment
* 🔁 CI/CD with GitHub Actions

---

## 📡 API Endpoints

### Create Pipeline

```http
POST /pipelines
```

```json
{
  "name": "My Pipeline",
  "action_type": "FILTER",
  "config": {
    "field": "amount",
    "operator": ">",
    "value": 100
  },
  "subscribers": ["https://example.com/webhook"]
}
```

---

### Get All Pipelines

```http
GET /pipelines
```

---

### Get Pipeline by ID

```http
GET /pipelines/:pipelineId
```

---

### Update Pipeline

```http
PUT /pipelines/:pipelineId
```

---

### Delete Pipeline

```http
DELETE /pipelines/:pipelineId
```

---

### Send Webhook

```http
POST /webhooks/:sourceKey
```

```json
{
  "amount": 220
}
```

---

### Get Job

```http
GET /jobs/:jobId
```

---

### Get All Jobs

```http
GET /jobs
```

---

### Get Delivery Attempts

```http
GET /jobs/:jobId/delivery-attempts
```

---

## ⚙️ Pipeline Actions

### FILTER

Filters payload based on numeric condition.

```json
{
  "field": "amount",
  "operator": ">",
  "value": 100
}
```

---

### EXTRACT

Extracts specific fields from payload.

```json
{
  "fields": ["amount", "currency"]
}
```

---

### TRANSFORM

Formats payload using a template.

```json
{
  "template": "Amount is {{amount}}"
}
```

---

## 🔄 Job Processing Flow

1. Webhook received
2. Job created in database
3. Worker picks pending job
4. Pipeline logic applied
5. Job marked as completed/failed/skipped
6. Result delivered to subscribers

---

## 📦 Delivery System

* Sends HTTP POST to each subscriber
* Retries up to 3 times
* 10-second delay between retries
* Logs each attempt in database
* Handles:

  * network failures
  * HTTP errors

---

## 🐳 Docker Setup

### Run the project

```bash
docker compose up --build
```

### Services

* API → `http://localhost:3000`
* PostgreSQL → port `5432`
* Worker → background processing

---

## 🧪 Local Development

```bash
npm install
npm run dev
```

Run worker separately:

```bash
npm run worker
```

---

## 🔁 CI/CD

GitHub Actions pipeline includes:

* Install dependencies
* Build project
* Lint checks
* (Optional) tests

---

## ⚠️ Design Decisions

### Why require subscribers?

A pipeline without subscribers has no output destination, so creation is rejected.

---

### Why separate worker?

Worker runs independently to process jobs asynchronously and improve scalability.

---

### Why service layer?

Keeps business logic separate from HTTP and database layers.

---

## 🚀 Future Improvements

* Exponential backoff for retries
* Dead-letter queue for failed jobs
* Authentication for endpoints
* Rate limiting
* Monitoring & logging system

---

## 🧠 Summary

This system demonstrates:

* Clean backend architecture
* Asynchronous processing
* Reliable delivery mechanisms
* Scalable design principles
