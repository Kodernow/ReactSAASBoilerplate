export enum TodoStatus {
  TODO = 'todo',
  IN_PROGRESS = 'in_progress',
  DONE = 'done',
}

export interface Todo {
  id: string;
  title: string;
  description?: string;
  status: TodoStatus;
  createdAt: number;
  dueDate?: number;
}

export interface BackupData {
  todos: Todo[];
  lastBackupDate: number;
}

// Admin and Plan Management Types
export interface Plan {
  id: string;
  name: string;
  description: string;
  price: number;
  currency: string;
  billing_period: 'monthly' | 'yearly';
  features: PlanFeatures;
  is_active: boolean;
  created_at: number;
  updated_at: number;
}

export interface PlanFeatures {
  todoboard_enabled: boolean;
  custom_domain: boolean;
  priority_support: boolean;
}

export interface Coupon {
  id: string;
  code: string;
  description: string;
  discount_percentage: number;
  applicable_plans: string[];
  is_active: boolean;
  expires_at?: number;
  usage_limit?: number;
  used_count: number;
  created_at: number;
  updated_at: number;
}

export interface UserSubscription {
  id: string;
  user_id: string;
  plan_id: string;
  status: 'active' | 'cancelled' | 'expired';
  start_date: number;
  end_date: number;
  payment_method?: string;
  stripe_subscription_id?: string;
  razorpay_subscription_id?: string;
  created_at: number;
  updated_at: number;
}

export interface UserProfile {
  id: string;
  email: string;
  full_name: string;
  is_admin: boolean;
  subscription?: UserSubscription;
  created_at: number;
  last_login_at: number;
  is_active: boolean;
}

export interface UserStats {
  totalTodos: number;
  completedTodos: number;
}

export interface PaymentIntent {
  id: string;
  user_id: string;
  plan_id: string;
  coupon_id?: string;
  amount: number;
  currency: string;
  status: 'pending' | 'succeeded' | 'failed';
  payment_method: 'stripe' | 'razorpay';
  created_at: number;
}
