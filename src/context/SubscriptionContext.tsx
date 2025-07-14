import React, { createContext, useContext, useState, useEffect } from 'react';
import { Plan, UserSubscription, Coupon } from '../types';
import { useAuth } from './AuthContext';
import { useAdmin } from './AdminContext';
import toast from 'react-hot-toast';

interface SubscriptionContextType {
  currentSubscription: UserSubscription | null;
  currentPlan: Plan | null;
  availablePlans: Plan[];
  applyCoupon: (couponCode: string, planId: string) => Promise<{ discountedPrice: number; coupon: Coupon } | null>;
  upgradePlan: (planId: string, couponId?: string) => Promise<void>;
  cancelSubscription: () => Promise<void>;
  isFeatureEnabled: (feature: keyof Plan['features']) => boolean;
}

const SubscriptionContext = createContext<SubscriptionContextType | undefined>(undefined);

export const useSubscription = () => {
  const context = useContext(SubscriptionContext);
  if (!context) {
    throw new Error('useSubscription must be used within a SubscriptionProvider');
  }
  return context;
};

export const SubscriptionProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const { plans, getCouponByCode } = useAdmin();
  const [currentSubscription, setCurrentSubscription] = useState<UserSubscription | null>(null);

  const availablePlans = plans.filter(plan => plan.is_active);
  
  const currentPlan = currentSubscription 
    ? plans.find(plan => plan.id === currentSubscription.plan_id) || null
    : plans.find(plan => plan.name === 'Free') || null; // Default to free plan

  useEffect(() => {
    if (user) {
      // Load user subscription from localStorage (in real app, this would be from API)
      const savedSubscription = localStorage.getItem(`subscription_${user.id}`);
      if (savedSubscription) {
        setCurrentSubscription(JSON.parse(savedSubscription));
      } else {
        // Create default free subscription
        const freePlan = plans.find(plan => plan.name === 'Free');
        if (freePlan) {
          const defaultSubscription: UserSubscription = {
            id: `sub_${user.id}`,
            user_id: user.id,
            plan_id: freePlan.id,
            status: 'active',
            start_date: Date.now(),
            end_date: Date.now() + (365 * 24 * 60 * 60 * 1000), // 1 year
            created_at: Date.now(),
            updated_at: Date.now(),
          };
          setCurrentSubscription(defaultSubscription);
          localStorage.setItem(`subscription_${user.id}`, JSON.stringify(defaultSubscription));
        }
      }
    }
  }, [user, plans]);

  const applyCoupon = async (couponCode: string, planId: string) => {
    const coupon = getCouponByCode(couponCode);
    if (!coupon) {
      toast.error('Invalid or expired coupon code');
      return null;
    }

    if (!coupon.applicable_plans.includes(planId)) {
      toast.error('This coupon is not applicable to the selected plan');
      return null;
    }

    const plan = plans.find(p => p.id === planId);
    if (!plan) {
      toast.error('Plan not found');
      return null;
    }

    const discountedPrice = plan.price * (1 - coupon.discount_percentage / 100);
    toast.success(`Coupon applied! ${coupon.discount_percentage}% discount`);
    
    return { discountedPrice, coupon };
  };

  const upgradePlan = async (planId: string, couponId?: string) => {
    if (!user) {
      toast.error('Please sign in to upgrade your plan');
      return;
    }

    const plan = plans.find(p => p.id === planId);
    if (!plan) {
      toast.error('Plan not found');
      return;
    }

    // Create new subscription
    const newSubscription: UserSubscription = {
      id: `sub_${user.id}_${Date.now()}`,
      user_id: user.id,
      plan_id: plan.id,
      status: 'active',
      start_date: Date.now(),
      end_date: Date.now() + (plan.billing_period === 'yearly' ? 365 : 30) * 24 * 60 * 60 * 1000,
      created_at: Date.now(),
      updated_at: Date.now(),
    };

    setCurrentSubscription(newSubscription);
    localStorage.setItem(`subscription_${user.id}`, JSON.stringify(newSubscription));
    
    toast.success(`Successfully upgraded to ${plan.name} plan!`);
  };

  const cancelSubscription = async () => {
    if (!currentSubscription) return;

    const updatedSubscription = {
      ...currentSubscription,
      status: 'cancelled' as const,
      updated_at: Date.now(),
    };

    setCurrentSubscription(updatedSubscription);
    localStorage.setItem(`subscription_${user?.id}`, JSON.stringify(updatedSubscription));
    
    toast.success('Subscription cancelled successfully');
  };

  const isFeatureEnabled = (feature: keyof Plan['features']) => {
    if (!currentPlan) return false;
    return currentPlan.features[feature];
  };

  return (
    <SubscriptionContext.Provider
      value={{
        currentSubscription,
        currentPlan,
        availablePlans,
        applyCoupon,
        upgradePlan,
        cancelSubscription,
        isFeatureEnabled,
      }}
    >
      {children}
    </SubscriptionContext.Provider>
  );
};
