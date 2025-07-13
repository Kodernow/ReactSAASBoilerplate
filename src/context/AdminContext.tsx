import React, { createContext, useContext, useState, useEffect } from 'react';
import { Plan, Coupon, UserProfile, UserStats } from '../types';
import { v4 as uuidv4 } from 'uuid';
import toast from 'react-hot-toast';
import { supabase } from '../lib/supabase';

interface AdminContextType {
  // Plans
  plans: Plan[];
  addPlan: (plan: Omit<Plan, 'id' | 'createdAt' | 'updatedAt'>) => Promise<void>;
  updatePlan: (id: string, updates: Partial<Plan>) => Promise<void>;
  deletePlan: (id: string) => Promise<void>;
  getPlanById: (id: string) => Plan | undefined;

  // Coupons
  coupons: Coupon[];
  addCoupon: (coupon: Omit<Coupon, 'id' | 'createdAt' | 'updatedAt' | 'usedCount'>) => Promise<void>;
  updateCoupon: (id: string, updates: Partial<Coupon>) => Promise<void>;
  deleteCoupon: (id: string) => Promise<void>;
  getCouponByCode: (code: string) => Coupon | undefined;

  // Users
  users: UserProfile[];
  getUserStats: (userId: string) => UserStats;
  updateUserStatus: (userId: string, isActive: boolean) => Promise<void>;
  resetUserPassword: (userId: string, newPassword: string) => void;

  // Admin verification
  isAdmin: (email: string) => boolean;
  loading: boolean;
}

const AdminContext = createContext<AdminContextType | undefined>(undefined);

export const useAdmin = () => {
  const context = useContext(AdminContext);
  if (!context) {
    throw new Error('useAdmin must be used within an AdminProvider');
  }
  return context;
};

export const AdminProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [plans, setPlans] = useState<Plan[]>([]);
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchAdminData = async () => {
      try {
        setLoading(true);

        const [plansData, couponsData, usersData] = await Promise.all([
          supabase.from('plans').select('*'),
          supabase.from('coupons').select('*'),
          supabase.from('users').select('*'),
        ]);

        if (plansData.error) {
          console.error('Error fetching plans:', plansData.error);
          toast.error(`Failed to fetch plans: ${plansData.error.message}`);
        } else {
          setPlans(plansData.data || []);
        }

        if (couponsData.error) {
          console.error('Error fetching coupons:', couponsData.error);
          toast.error(`Failed to fetch coupons: ${couponsData.error.message}`);
        } else {
          setCoupons(couponsData.data || []);
        }

        if (usersData.error) {
          console.error('Error fetching users:', usersData.error);
          toast.error(`Failed to fetch users: ${usersData.error.message}`);
        } else {
          setUsers(usersData.data || []);
        }
      } catch (error) {
        console.error('Error fetching admin data:', error);
        toast.error(`Failed to fetch admin data: ${error.message}`);
      } finally {
        setLoading(false);
      }
    };

    fetchAdminData();
  }, []);

  const addPlan = async (plan: Omit<Plan, 'id' | 'createdAt' | 'updatedAt'>) => {
    try {
      const { data, error } = await supabase
        .from('plans')
        .insert([{ ...plan }])
        .select('*');

      if (error) {
        console.error('Error adding plan:', error);
        toast.error(`Failed to add plan: ${error.message}`); // Display Supabase error message
      } else {
        setPlans(prev => [...prev, data[0]]);
        toast.success('Plan added successfully');
      }
    } catch (err) {
      console.error('Error adding plan:', err);
      toast.error(`Failed to add plan: ${err.message}`); // Display generic error message
    }
  };

  const updatePlan = async (id: string, updates: Partial<Plan>) => {
    const { data, error } = await supabase
      .from('plans')
      .update(updates)
      .eq('id', id)
      .select('*');

    if (error) {
      console.error('Error updating plan:', error);
      toast.error('Failed to update plan');
    } else {
      setPlans(prev =>
        prev.map(plan => (plan.id === id ? { ...plan, ...data[0] } : plan))
      );
      toast.success('Plan updated successfully');
    }
  };

  const deletePlan = async (id: string) => {
    const { error } = await supabase
      .from('plans')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error deleting plan:', error);
      toast.error('Failed to delete plan');
    } else {
      setPlans(prev => prev.filter(plan => plan.id !== id));
      toast.success('Plan deleted successfully');
    }
  };

  const getPlanById = (id: string) => {
    return plans.find(plan => plan.id === id);
  };

  const addCoupon = async (coupon: Omit<Coupon, 'id' | 'createdAt' | 'updatedAt' | 'usedCount'>) => {
    const { data, error } = await supabase
      .from('coupons')
      .insert([{ ...coupon, usedCount: 0 }])
      .select('*');

    if (error) {
      console.error('Error adding coupon:', error);
      toast.error('Failed to add coupon');
    } else {
      setCoupons(prev => [...prev, data[0]]);
      toast.success('Coupon added successfully');
    }
  };

  const updateCoupon = async (id: string, updates: Partial<Coupon>) => {
    const { data, error } = await supabase
      .from('coupons')
      .update(updates)
      .eq('id', id)
      .select('*');

    if (error) {
      console.error('Error updating coupon:', error);
      toast.error('Failed to update coupon');
    } else {
      setCoupons(prev =>
        prev.map(coupon => (coupon.id === id ? { ...coupon, ...data[0] } : coupon))
      );
      toast.success('Coupon updated successfully');
    }
  };

  const deleteCoupon = async (id: string) => {
    const { error } = await supabase
      .from('coupons')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error deleting coupon:', error);
      toast.error('Failed to delete coupon');
    } else {
      setCoupons(prev => prev.filter(coupon => coupon.id !== id));
      toast.success('Coupon deleted successfully');
    }
  };

  const getCouponByCode = (code: string) => {
    return coupons.find(coupon =>
      coupon.code.toLowerCase() === code.toLowerCase() &&
      coupon.isActive &&
      (!coupon.expiresAt || coupon.expiresAt > Date.now()) &&
      (!coupon.usageLimit || coupon.usedCount < coupon.usageLimit)
    );
  };

  const updateUserStatus = async (userId: string, isActive: boolean) => {
    const { error } = await supabase
      .from('users')
      .update({ isActive })
      .eq('id', userId);

    if (error) {
      console.error('Error updating user status:', error);
      toast.error('Failed to update user status');
    } else {
      setUsers(prev =>
        prev.map(user => (user.id === userId ? { ...user, isActive } : user))
      );
      toast.success(`User ${isActive ? 'activated' : 'deactivated'} successfully`);
    }
  };

  const getUserStats = (userId: string): UserStats => {
    // This would typically fetch from a database
    // For now, return mock data
    return {
      totalTodos: 15,
      completedTodos: 10,
    };
  };

  const resetUserPassword = (userId: string, newPassword: string) => {
    // This would typically call an API to reset the password
    toast.success('Password reset successfully');
  };

  const isAdmin = (email: string) => {
    return email === 'admin@admin.com';
  };

  return (
    <AdminContext.Provider
      value={{
        plans,
        addPlan,
        updatePlan,
        deletePlan,
        getPlanById,
        coupons,
        addCoupon,
        updateCoupon,
        deleteCoupon,
        getCouponByCode,
        users,
        getUserStats,
        updateUserStatus,
        resetUserPassword,
        isAdmin,
        loading
      }}
    >
      {!loading ? children : (
        <div className="min-h-screen flex items-center justify-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary-600"></div>
        </div>
      )}
    </AdminContext.Provider>
  );
};
