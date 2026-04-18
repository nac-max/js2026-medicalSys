# MediCareAI System Architecture Diagram Generation Prompt

## System Overview
Generate a comprehensive system architecture diagram for **MediCareAI**, an intelligent disease management system with AI-powered diagnosis, RAG-enhanced knowledge retrieval, and multi-platform support (Patient/Doctor/Admin).

---

## 1. High-Level System Architecture

### Components to Include:

#### **Frontend Layer (Multi-Platform)**
- **Patient Portal** (Port 80)
  - React + TypeScript + Vite
  - Symptom submission interface
  - Document upload (PDF/images)
  - AI diagnosis history
  - Medical record management
  
- **Doctor Portal** (Port 8081)
  - Shared case review
  - @mention collaboration system
  - Professional comment threads
  - Research data access
  
- **Admin Portal** (Port 8080)
  - System monitoring dashboard
  - Doctor verification workflow
  - Knowledge base management
  - AI model configuration
  - Email service configuration

#### **API Gateway Layer**
- **Nginx Reverse Proxy**
  - Routes: /api/v1/* → Backend
  - Multi-port routing (80, 8080, 8081)
  - SSL/TLS termination
  - Load balancing

#### **Backend Layer (FastAPI)**
- **Core Services**:
  - Authentication Service (JWT + Session Management)
  - AI Diagnosis Service (Multi-provider support)
  - Document Processing Service (MinerU extraction)
  - RAG Service (Vector search + Reranking)
  - Email Notification Service
  - System Monitoring Service
  
- **API Endpoints**:
  - `/api/v1/auth/*` - Authentication
  - `/api/v1/ai/*` - AI diagnosis
  - `/api/v1/kb/*` - Knowledge base
  - `/api/v1/admin/*` - Admin operations
  - `/api/v1/vector/*` - Vector embedding

#### **Data Layer**
- **PostgreSQL + pgvector**
  - User accounts (patients/doctors/admins)
  - Medical cases & documents
  - AI diagnosis history
  - Knowledge base chunks (vectorized)
  - Audit logs
  - Vector embeddings (pgvector extension)
  
- **Redis Cache**
  - Session storage
  - API rate limiting
  - Reranking result cache (5 min TTL)
  - Temporary data

- **Alibaba Cloud OSS**
  - Patient document storage
  - Medical report files
  - Secure file access

#### **External Services**
- **AI Model Providers**
  - OpenAI / Zhipu / Kimi / DeepSeek / Ollama
  - Configurable via admin panel
  - Multi-provider adapter pattern
  
- **Vector Embedding Providers**
  - Qwen API (default)
  - OpenAI-compatible endpoints
  - Dimension: 1536
  
- **Reranking Services**
  - Alibaba Bailian (阿里云百炼)
  - Bocha AI (博查)
  - Cohere
  - Jina AI
  
- **Document Extraction**
  - MinerU API (PDF/image OCR)
  - PII detection & cleaning
  
- **Email Services**
  - SMTP (configurable)
  - Verification emails
  - Doctor approval notifications

#### **Monitoring Stack**
- **Prometheus**
  - Metrics collection
  - API latency tracking
  - Resource usage monitoring
  
- **Grafana**
  - Real-time dashboards
  - System health visualization
  - Alert management

---

## 2. RAG (Retrieval-Augmented Generation) Architecture

### RAG Pipeline Flow:

```
User Query (Symptoms + Documents)
    ↓
[1] Document Processing
    ├─ MinerU Extraction (PDF/images → text)
    ├─ PII Detection & Cleaning
    └─ Text Chunking
    ↓
[2] Query Enhancement (RAG Enhancement Service)
    ├─ HyDE (Hypothetical Document Embeddings)
    │   └─ Generate hypothetical medical document using LLM
    ├─ Query Rewriting
    │   └─ Expand with medical synonyms
    └─ Medical Entity Extraction
        └─ Extract symptoms, diseases, test results
    ↓
[3] Vector Embedding Generation
    ├─ Query Embedding (via Vector Embedding Service)
    ├─ Document Embedding (batch processing)
    └─ Model: Qwen API / OpenAI-compatible
    ↓
[4] Hybrid Search (Generic RAG Selector)
    ├─ Vector Search (pgvector cosine similarity)
    │   └─ Search across ALL knowledge base categories
    ├─ Full-Text Search (PostgreSQL tsvector)
    │   └─ Term-based matching
    └─ Retrieve top 20 candidate chunks
    ↓
[5] Reranking (Reranking Service)
    ├─ External API Reranking
    │   ├─ Alibaba Bailian
    │   ├─ Bocha AI
    │   ├─ Cohere
    │   └─ Jina AI
    ├─ Fallback: RRF (Reciprocal Rank Fusion)
    └─ Cache results (5 min TTL)
    ↓
[6] Context Compression
    ├─ Extract relevant content from chunks
    ├─ Remove redundant information
    └─ Optimize for LLM context window
    ↓
[7] AI Diagnosis Generation
    ├─ Combine: Patient info + Symptoms + Documents + RAG context
    ├─ Send to AI Model (OpenAI/Zhipu/etc.)
    └─ Generate diagnosis with evidence citations
    ↓
[8] Response to User
    ├─ Diagnosis result
    ├─ Knowledge source citations
    └─ Confidence scores
```

### Key RAG Components:

#### **Vector Embedding Service**
- **Purpose**: Generate embeddings for text chunks
- **Features**:
  - Multi-provider support (Qwen, OpenAI-compatible)
  - Batch processing
  - Connection testing
  - Dimension: 1536
  - Max input: 8192 tokens

#### **Knowledge Base Vectorization Service**
- **Purpose**: Manage knowledge base chunks
- **Features**:
  - Document chunking (500-1000 chars)
  - Batch vectorization
  - Category management (diseases, guidelines)
  - Full-text search index (tsvector)

#### **Generic RAG Selector**
- **Purpose**: Intelligent knowledge retrieval without hardcoded keywords
- **Strategy**:
  1. Extract medical entities (symptoms, diseases, tests)
  2. Build enhanced query with synonyms
  3. Hybrid search (vector + term-based)
  4. Re-rank by document relevance
  5. Group by category and select top sources

#### **RAG Enhancement Service**
- **Purpose**: Improve retrieval quality
- **Techniques**:
  - **HyDE**: Generate hypothetical documents for better vector matching
  - **Query Rewriting**: Expand queries with medical terminology
  - **Context Compression**: Extract relevant content from chunks

#### **Reranking Service**
- **Purpose**: Improve retrieval precision
- **Features**:
  - Multi-provider adapter pattern
  - Automatic fallback to RRF
  - Result caching (5 min)
  - 10-20% accuracy improvement

---

## 3. Data Flow Diagrams

### 3.1 Patient Diagnosis Flow
```
Patient → Submit Symptoms + Upload Documents
    ↓
Frontend → POST /api/v1/ai/diagnose
    ↓
Backend → Authenticate (JWT)
    ↓
Document Processing → MinerU Extraction + PII Cleaning
    ↓
RAG Pipeline → Query Enhancement → Vector Search → Reranking
    ↓
AI Service → Combine context + Call AI Model
    ↓
Database → Save diagnosis result
    ↓
Response → Return diagnosis + citations
```

### 3.2 Knowledge Base Management Flow
```
Admin → Upload Medical Guideline (PDF)
    ↓
Backend → POST /api/v1/kb/upload
    ↓
Document Processing → Extract text + Chunk
    ↓
Vector Embedding Service → Generate embeddings
    ↓
PostgreSQL → Store chunks + vectors (pgvector)
    ↓
Full-Text Index → Create tsvector index
    ↓
Response → Vectorization complete
```

### 3.3 Doctor Collaboration Flow
```
Patient → Share case with doctors
    ↓
Backend → Create shared_medical_cases (anonymized)
    ↓
Doctor → View shared case + @mention another doctor
    ↓
Backend → Create comment thread
    ↓
Email Service → Notify mentioned doctor
    ↓
Doctor 2 → Add professional comment
    ↓
Patient → View all doctor comments
```

---

## 4. Database Schema (Key Tables)

### Core Tables:
- **users**: Unified user accounts (patient/doctor/admin roles)
- **medical_cases**: Patient medical records
- **medical_documents**: Uploaded files with PII-cleaned content
- **ai_feedbacks**: AI diagnosis results
- **knowledge_base_chunks**: Vectorized knowledge base (with pgvector)
- **vector_embedding_configs**: Vector model configurations
- **shared_medical_cases**: Anonymized shared cases for doctors
- **audit_logs**: Security audit trail
- **system_resource_logs**: System monitoring data

### Vector Storage:
- **pgvector extension**: Stores 1536-dimensional embeddings
- **Indexes**: 
  - Vector similarity index (HNSW/IVFFlat)
  - Full-text search index (tsvector)
  - Category index for filtering

---

## 5. Security & Privacy Architecture

### Security Layers:
1. **Authentication**: JWT tokens + session management
2. **Authorization**: Role-based access control (RBAC)
3. **PII Protection**: Automatic detection & cleaning
4. **Data Encryption**: 
   - In-transit: TLS/SSL
   - At-rest: PostgreSQL encryption + OSS encryption
5. **Audit Logging**: All actions logged with IP tracking
6. **Rate Limiting**: Redis-based API throttling

### Privacy Features:
- **Anonymization**: Patient data anonymized for sharing
- **Consent Management**: Explicit data sharing agreements
- **Access Control**: Doctors only see their own threads
- **PII Cleaning**: Names, IDs, phones, addresses removed

---

## 6. Deployment Architecture

### Docker Compose Stack:
```
├─ nginx (Reverse Proxy)
├─ frontend (React + Vite)
├─ backend (FastAPI + Uvicorn, 4 workers)
├─ postgres (PostgreSQL 17 + pgvector)
├─ redis (Redis 7.4)
├─ prometheus (Metrics)
└─ grafana (Dashboards)
```

### Network:
- **medicare_network**: Bridge network for inter-container communication
- **Ports**:
  - 80: Patient portal
  - 8080: Admin portal
  - 8081: Doctor portal
  - 8000: Backend API
  - 5432: PostgreSQL
  - 6379: Redis
  - 9090: Prometheus
  - 3001: Grafana

---

## 7. AI Model Integration Architecture

### Multi-Provider Adapter Pattern:
```
AI Service (Unified Interface)
    ↓
Provider Adapter Factory
    ├─ OpenAI Adapter
    ├─ Zhipu Adapter
    ├─ Kimi Adapter
    ├─ DeepSeek Adapter
    ├─ Ollama Adapter
    └─ Custom Adapter
    ↓
HTTP Client → External AI API
```

### Configuration Management:
- **Database-driven**: AI model configs stored in `ai_model_configurations` table
- **Admin UI**: Configure providers without code changes
- **Fallback**: Environment variables as backup
- **Encryption**: API keys encrypted at rest

---

## 8. Monitoring & Observability

### Metrics Collected:
- **API Metrics**: Request count, latency, error rate
- **System Metrics**: CPU, memory, disk usage
- **AI Metrics**: Diagnosis count, token usage, latency
- **RAG Metrics**: Vector search time, reranking accuracy
- **Database Metrics**: Query performance, connection pool

### Dashboards:
- **System Health**: Resource usage, service status
- **API Performance**: Endpoint latency, throughput
- **AI Usage**: Model calls, token consumption
- **User Activity**: Active users, diagnosis trends

---

## Diagram Generation Instructions

### Recommended Tools:
- **Draw.io / Diagrams.net**: For detailed architecture diagrams
- **Mermaid**: For code-based diagrams
- **PlantUML**: For UML diagrams
- **Lucidchart**: For professional diagrams

### Diagram Types to Generate:
1. **System Architecture Diagram**: All components + connections
2. **RAG Pipeline Flowchart**: Step-by-step RAG process
3. **Data Flow Diagram**: Request/response flows
4. **Database ER Diagram**: Table relationships
5. **Deployment Diagram**: Docker containers + networks
6. **Security Architecture**: Authentication + authorization layers

### Visual Style Recommendations:
- Use **color coding**: Frontend (blue), Backend (green), Data (orange), External (purple)
- Show **data flow arrows** with labels
- Include **technology logos** (PostgreSQL, Redis, FastAPI, React)
- Highlight **RAG components** in a separate section
- Use **dashed lines** for optional/fallback paths
- Add **annotations** for key features (pgvector, reranking, PII cleaning)

---

## Key Differentiators to Highlight

1. **Generic RAG Selector**: No hardcoded disease keywords, universal vector search
2. **Multi-Provider Support**: Flexible AI model and reranking provider integration
3. **HyDE Enhancement**: Hypothetical document generation for better retrieval
4. **Hybrid Search**: Vector + full-text search combination
5. **Reranking Layer**: External API reranking with automatic fallback
6. **PII Protection**: Automatic detection and cleaning for privacy
7. **Multi-Platform**: Separate portals for patients, doctors, and admins
8. **Doctor Collaboration**: @mention system with email notifications
9. **Admin Configurability**: All AI models configurable via UI
10. **Enterprise Monitoring**: Prometheus + Grafana integration

---

## Technical Stack Summary

| Layer | Technology |
|-------|-----------|
| Frontend | React 18 + TypeScript + Vite + Tailwind CSS |
| Backend | FastAPI + Python 3.11 + Uvicorn |
| Database | PostgreSQL 17 + pgvector extension |
| Cache | Redis 7.4 |
| Storage | Alibaba Cloud OSS |
| Vector Search | pgvector (HNSW/IVFFlat) |
| AI Models | OpenAI / Zhipu / Kimi / DeepSeek / Ollama |
| Embedding | Qwen API / OpenAI-compatible |
| Reranking | Bailian / Bocha / Cohere / Jina |
| Document OCR | MinerU API |
| Monitoring | Prometheus + Grafana |
| Deployment | Docker + Docker Compose |
| Proxy | Nginx |

---

**Author**: Su Yeqin (苏业钦)  
**Project**: MediCareAI - Intelligent Disease Management System  
**Version**: 2.0.0
