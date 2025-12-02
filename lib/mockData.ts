import { ModelConfig } from '@/context/AppContext';

export const MODELS: ModelConfig[] = [
  {
    id: 'gpt-4',
    name: 'GPT-4',
    description: 'Most capable model, best for complex tasks',
    contextWindow: '8K tokens',
    speed: 'medium',
  },
  {
    id: 'gpt-3.5',
    name: 'GPT-3.5 Turbo',
    description: 'Fast and efficient for most tasks',
    contextWindow: '4K tokens',
    speed: 'fast',
  },
  {
    id: 'claude-opus',
    name: 'Claude Opus',
    description: 'Extended context, excellent for analysis',
    contextWindow: '200K tokens',
    speed: 'slow',
  },
  {
    id: 'gemini-pro',
    name: 'Gemini Pro',
    description: 'Multimodal capabilities',
    contextWindow: '32K tokens',
    speed: 'medium',
  },
];

export interface Template {
  id: string;
  name: string;
  category: string;
  description: string;
  prompt: string;
  parameters?: {
    temperature?: number;
    maxTokens?: number;
  };
}

export const TEMPLATES: Template[] = [
  {
    id: 'code-review',
    name: 'Code Review',
    category: 'Coding',
    description: 'Review code for bugs and improvements',
    prompt: 'Please review the following code and provide feedback on:\n1. Potential bugs\n2. Best practices\n3. Performance\n4. Security\n\n[Paste your code here]',
    parameters: { temperature: 0.3, maxTokens: 2000 },
  },
  {
    id: 'debug-help',
    name: 'Debug Code',
    category: 'Coding',
    description: 'Help debug and fix code issues',
    prompt: 'I\'m getting an error in my code. Here\'s the error message:\n[Error message]\n\nHere\'s the code:\n[Code]\n\nCan you help me fix it?',
    parameters: { temperature: 0.2, maxTokens: 1500 },
  },
  {
    id: 'email-draft',
    name: 'Email Draft',
    category: 'Writing',
    description: 'Draft professional emails',
    prompt: 'Please help me draft a professional email with the following details:\n\nTo: [Recipient]\nSubject: [Subject]\nPurpose: [Purpose]\nKey points: [Points]',
    parameters: { temperature: 0.7, maxTokens: 1000 },
  },
  {
    id: 'research-summary',
    name: 'Research Summary',
    category: 'Analysis',
    description: 'Summarize research topics',
    prompt: 'Please provide a comprehensive research summary on: [Topic]\n\nInclude:\n1. Overview\n2. Key findings\n3. Recent developments\n4. Implications',
    parameters: { temperature: 0.5, maxTokens: 3000 },
  },
  {
    id: 'creative-story',
    name: 'Creative Writing',
    category: 'Creative',
    description: 'Generate creative stories',
    prompt: 'Write a creative story with the following elements:\n\nGenre: [Genre]\nSetting: [Setting]\nCharacters: [Characters]\nTheme: [Theme]',
    parameters: { temperature: 0.9, maxTokens: 2500 },
  },
];