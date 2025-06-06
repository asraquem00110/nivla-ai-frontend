export type Prompt = {
  role: string;
  message: string;
  tools?: PromptTools[];
};

export type PromptTools = {
  name: string;
  description: string;
  parameters: {
    type: string;
    properties?: Record<string, any>;
    required?: string[];
  };
};
