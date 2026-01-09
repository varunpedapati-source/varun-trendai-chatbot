# EKS Chatbot Application

This repository contains a chatbot application deployed on Kubernetes.

## Architecture
- Frontend: React (Vite)
- Backend: Node.js (Express)
- LLM: OpenAI API
- Database: MongoDB
- Platform: Kubernetes (EKS Cluster)

## Repository Structure

- backend/ 
- frontend/
- k8s/


## API

POST /api/chat

Request: { "message": "Hello" }

Response: { "sessionId": "...", "response": "..." }

