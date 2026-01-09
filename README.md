# EKS Chatbot Application

This repository contains a chatbot application deployed on Kubernetes.

## Architecture
- Frontend: React (Vite)
- Backend: Node.js (Express)
- LLM: OpenAI API
- Database: MongoDB
- Platform: Kubernetes (EKS Cluster)

## Repository Structure

-.workflows
- backend/ # REST API + LLM + MongoDB
- frontend/ # Chat UI
- k8s/ # Kubernetes manifests


## API

POST /api/chat

Request: { "message": "Hello" }

Response: { "sessionId": "...", "response": "..." }

