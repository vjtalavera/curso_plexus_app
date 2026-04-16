export type IceField = 'impact' | 'confidence' | 'ease';

export type ICEValues = {
  impact: number | null;
  confidence: number | null;
  ease: number | null;
};

export type CompleteICEValues = {
  impact: number;
  confidence: number;
  ease: number;
};

export type Task = {
  id: string;
  name: string;
  description: string;
  ice: ICEValues;
};

export type TaskFormValues = {
  name: string;
  description: string;
};

export type PrioritySuggestion = {
  taskId: string;
  taskName: string;
  values: ICEValues;
};
