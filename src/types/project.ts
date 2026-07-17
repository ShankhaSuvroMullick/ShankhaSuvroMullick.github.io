export type Difficulty = 'easy' | 'medium' | 'hard' | 'advanced' | 'expert';
export type Status = 'active' | 'maintenance' | 'experimental' | 'archived';

export interface ChallengeItem {
  challenge: string;
  solution: string;
}

export interface CaseStudy {
  problem: string;
  constraints: string[];
  decisions: string[];
  tradeoffs: string[];
  metrics: string[];
  retrospective: string;
}

export interface Project {
  id: string;
  name: string;
  repo: string;
  demo?: string;
  description: string;
  positioning?: string;
  languages: string[];
  frameworks: string[];
  databases: string[];
  tools: string[];
  cloud: string[];
  concepts: string[];
  category: string;
  subcategory: string;
  tags: string[];
  status: Status;
  featured: boolean;
  started: string;
  last_updated: string;
  stars: number;
  benchmark?: string;
  difficulty: Difficulty;
  license?: string;
  caseStudy?: CaseStudy;
  challenges?: ChallengeItem[];
  features?: string[];
  architectureOverview?: string;
  hasDemo?: boolean;
  demoType?: 'recharts' | 'threejs' | 'terminal' | 'iframe';
}

export interface Category {
  id: string;
  label: string;
  icon: string;
  subcategories: string[];
}

export interface ProjectData {
  meta: { owner: string; github: string; last_updated: string; };
  categories: Category[];
  projects: Project[];
}

export const DIFFICULTIES: Difficulty[] = ['easy','medium','hard','advanced','expert'];
export const STATUSES: Status[] = ['active','maintenance','experimental','archived'];

export const DIFF_COLORS: Record<Difficulty, string> = {
  easy:     'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300 border-green-200 dark:border-green-800',
  medium:   'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300 border-blue-200 dark:border-blue-800',
  hard:     'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300 border-orange-200 dark:border-orange-800',
  advanced: 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300 border-purple-200 dark:border-purple-800',
  expert:   'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300 border-red-200 dark:border-red-800',
};

export const STATUS_COLORS: Record<Status, string> = {
  active:       'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800',
  maintenance:  'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300 border-amber-200 dark:border-amber-800',
  experimental: 'bg-sky-100 text-sky-800 dark:bg-sky-900/30 dark:text-sky-300 border-sky-200 dark:border-sky-800',
  archived:     'bg-zinc-100 text-zinc-600 dark:bg-zinc-900/30 dark:text-zinc-400 border-zinc-200 dark:border-zinc-700',
};

export const TECH_KEYWORDS = [
  'Python','C++','C','Java','JavaScript','TypeScript','Go','Rust','R','Scala','Julia','MATLAB',
  'Kotlin','Swift','Ruby','PHP','Haskell','C#','Dart','Lua','Bash','SQL','CUDA',
  'React','Next.js','Vue','Angular','Svelte','Astro','FastAPI','Django','Flask','Express',
  'NestJS','Spring','TensorFlow','PyTorch','Keras','scikit-learn','XGBoost','LightGBM',
  'Hugging Face','LangChain','LlamaIndex','NumPy','Pandas','Polars','SciPy','OpenCV',
  'Transformers','YOLO','Three.js','Framer Motion','Tailwind','shadcn',
  'PostgreSQL','MySQL','SQLite','MongoDB','Redis','Cassandra','DynamoDB','Elasticsearch',
  'ClickHouse','TimescaleDB','Neo4j','Pinecone','Weaviate','Chroma','Qdrant','Supabase',
  'Docker','Kubernetes','Git','GitHub','Jenkins','Terraform','Ansible','Prometheus',
  'Grafana','Airflow','Spark','Kafka','RabbitMQ','Celery','Nginx','CMake','LLVM',
  'AWS','GCP','Azure','Vercel','Netlify','Cloudflare','Lambda','S3','EC2',
  'Machine Learning','Deep Learning','LLM','RAG','Fine-tuning','Embeddings',
  'REST API','GraphQL','gRPC','Microservices','CI/CD','DevOps','MLOps',
  'System Design','Distributed Systems','Low Latency','High Frequency Trading',
  'Options Pricing','Market Making','Backtesting','Monte Carlo','Black-Scholes',
  'Reinforcement Learning','Computer Vision','NLP','Transformer','Attention',
  'Quantitative Finance','Algorithmic Trading','Risk Management','SIMD','Lock-Free',
];
