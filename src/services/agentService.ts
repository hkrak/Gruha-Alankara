/**
 * Agent Service
 * API calls for Agentic AI - Autonomous agent-based design tasks
 * Backend: Flask with LangChain and Claude for multi-agent reasoning
 */

import { get, post } from './api';

export interface DesignPlanRequest {
  room: string;
  style: string;
  budget: number;
  constraints?: string[];
}

export interface LayoutOptimizationRequest {
  room_dimensions: {
    width: number;
    height: number;
    length: number;
  };
  furniture_list: Array<{
    name: string;
    width?: number;
    height?: number;
    depth?: number;
  }>;
  style: string;
}

export interface PurchaseSuggestionRequest {
  current_items: string[];
  gaps: string[];
  budget: number;
  style: string;
}

/**
 * Use autonomous agent to plan complete design project
 */
export async function planDesignProject(request: DesignPlanRequest) {
  return post('/api/agents/plan-design', request);
}

/**
 * Use agent to optimize furniture layout
 */
export async function optimizeLayout(request: LayoutOptimizationRequest) {
  return post('/api/agents/optimize-layout', request);
}

/**
 * Use agent to suggest purchases
 */
export async function suggestPurchases(request: PurchaseSuggestionRequest) {
  return post('/api/agents/suggest-purchases', request);
}

/**
 * Use agent to make autonomous design decisions
 */
export async function makeDesignDecisions(designContext: any) {
  return post('/api/agents/make-decisions', {
    design_context: designContext
  });
}

/**
 * Use multiple agents to review design
 */
export async function reviewDesignMultiAgent(design: any) {
  return post('/api/agents/review-design', {
    design
  });
}

/**
 * Fully automate design process using agents
 */
export async function automateDesignProcess(request: any) {
  return post('/api/agents/automate-process', request);
}

export default {
  planDesignProject,
  optimizeLayout,
  suggestPurchases,
  makeDesignDecisions,
  reviewDesignMultiAgent,
  automateDesignProcess
};
