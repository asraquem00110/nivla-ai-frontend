export type Prompt = {
  role: string;
  message: string;
};

export type PromptTools = {
  [key: string]: {
    name: string;
    description: string;
    parameters: {
      type: string;
      properties?: Record<string, any>;
      required?: string[];
    };
  };
};
