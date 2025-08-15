import axios from "axios";
import { auth } from "./firebase";

// API base URL - use environment variable or default to local
const API_BASE_URL = process.env.REACT_APP_API_BASE || "http://localhost:8000";

// Create axios instance
export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Add auth token to requests
api.interceptors.request.use(
  async (config) => {
    const user = auth.currentUser;
    if (user) {
      const token = await user.getIdToken();
      config.headers.Authorization = `Bearer ${token}`;
    } else {
      // For development, use DEV token
      config.headers.Authorization = "Bearer DEV";
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// API functions
export const apiClient = {
  // Health check
  async healthCheck() {
    const response = await api.get("/healthz");
    return response.data;
  },

  // Upload document for ingestion
  async uploadDocument(tenantId, file) {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("tenant_id", tenantId);

    const response = await api.post("/v1/ingest/upload", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  },

  // Get answer from AI
  async getAnswer(tenantId, queryText, imageUrl = null, conversationId = null) {
    const response = await api.post("/v1/answer", {
      tenant_id: tenantId,
      query_text: queryText,
      image_url: imageUrl,
      conversation_id: conversationId,
    });
    return response.data;
  },

  // Create checkout session
  async createCheckout(tenantId, plan) {
    const response = await api.post("/v1/billing/checkout", {
      tenant_id: tenantId,
      plan: plan,
    });
    return response.data;
  },

  // Get tenant statistics
  async getTenantStats(tenantId) {
    const response = await api.get(`/v1/tenants/${tenantId}/stats`);
    return response.data;
  },
};

export default apiClient;