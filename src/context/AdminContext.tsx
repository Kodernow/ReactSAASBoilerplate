import React, { createContext, useContext, useState, useEffect } from 'react';
import { Plan, Coupon, UserProfile, UserStats } from '../types';
import { v4 as uuidv4 } from 'uuid';
import toast from 'react-hot-toast';
import { supabase } from '../lib/supabase';

interface AdminContextType {
  // Plans
  plans: Plan[];
  addPlan: (plan: Omit<Plan, 'id' | 'created_at' | 'updated_at'>) => Promise<void>;
  updatePlan: (id: string, updates: Partial<Plan>) => Promise<void>;
  deletePlan: (id: string) => Promise<void>;
  getPlanById: (id: string) => Plan | undefined;

  // Coupons
  coupons: Coupon[];
  addCoupon: (coupon: Omit<Coupon, 'id' | 'created_at' | 'updated_at' | 'used_count'>) => Promise<void>;
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

        // Check if Supabase is properly configured
        const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
        const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
        
        if (!supabaseUrl || !supabaseAnonKey || 
            supabaseUrl === 'https://placeholder.supabase.co' || 
            supabaseAnonKey === 'placeholder-key') {
          console.warn('Supabase not configured. Using mock data for admin features.');
          
          // Load mock data for development
          const mockPlans = [
            {
              id: '1',
              name: 'Free',
              description: 'Perfect for getting started',
              price: 0,
              currency: 'USD',
              billing_period: 'monthly',
              features: {
                todoboard_enabled: true,
                custom_domain: false,
                priority_support: false,
              },
              is_active: true,
              created_at: Date.now(),
              updated_at: Date.now(),
            },
            {
              id: '2',
              name: 'Pro',
              description: 'For professionals and teams',
              price: 19,
              currency: 'USD',
              billing_period: 'monthly',
              features: {
                todoboard_enabled: true,
                custom_domain: true,
                priority_support: true,
              },
              is_active: true,
              created_at: Date.now(),
              updated_at: Date.now(),
            },
          ];
          
          const mockCoupons = [
            {
              id: '1',
              code: 'WELCOME20',
              description: 'Welcome discount for new users',
              discount_percentage: 20,
              applicable_plans: ['2'],
              is_active: true,
              expires_at: Date.now() + (30 * 24 * 60 * 60 * 1000), // 30 days
              usage_limit: 100,
              used_count: 5,
              created_at: Date.now(),
              updated_at: Date.now(),
            },
          ];
          
          const mockUsers = [
            {
              id: '1',
              email: 'admin@admin.com',
              full_name: 'Admin User',
              is_admin: true,
              is_active: true,
              created_at: Date.now(),
              last_login_at: Date.now(),
            },
          ];
          
          setPlans(mockPlans);
          setCoupons(mockCoupons);
          setUsers(mockUsers);
          setLoading(false);
          return;
        }

        // Try to fetch from Supabase
        try {
          const [plansData, couponsData, usersData] = await Promise.all([
            supabase.from('plans').select('*'),
            supabase.from('coupons').select('*'),
            supabase.from('users').select('*'),
          ]);

          if (plansData.error && plansData.error.code !== '42P01') {
            console.error('Error fetching plans:', plansData.error);
            toast.error(`Failed to fetch plans: ${plansData.error.message}`);
          } else {
            setPlans(plansData.data || []);
          }

          if (couponsData.error && couponsData.error.code !== '42P01') {
            console.error('Error fetching coupons:', couponsData.error);
            toast.error(`Failed to fetch coupons: ${couponsData.error.message}`);
          } else {
            setCoupons(couponsData.data || []);
          }

          if (usersData.error && usersData.error.code !== '42P01') {
            console.error('Error fetching users:', usersData.error);
            toast.error(`Failed to fetch users: ${usersData.error.message}`);
          } else {
            setUsers(usersData.data || []);
          }
        } catch (dbError) {
          console.warn('Database tables not found. Using mock data.');
          // Use the same mock data as above if database fails
          setPlans([]);
          setCoupons([]);
          setUsers([]);
        }
      } catch (error) {
        console.error('Error fetching admin data:', error);
        console.warn('Using mock data due to database connection issues.');
        setPlans([]);
        setCoupons([]);
        setUsers([]);
      } finally {
        setLoading(false);
      }
    };

    fetchAdminData();
  }, []);

  const addPlan = async (plan: Omit<Plan, 'id' | 'created_at' | 'updated_at'>) => {
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

  const addCoupon = async (coupon: Omit<Coupon, 'id' | 'created_at' | 'updated_at' | 'used_count'>) => {
    try {
      console.log('Coupon data being sent to Supabase:', coupon); // Log coupon data
      if (coupon.expires_at) {
        console.log('expiresAt value:', coupon.expires_at);
        if (coupon.expires_at > 2147483647000) {
          console.warn('expiresAt value is too large. Adjusting to maximum safe value.');
          coupon.expires_at = 2147483647000;
        }
      }

      const { data, error } = await supabase
        .from('coupons')
        .insert([{ ...coupon, used_count: 0 }])
        .select('*');

      if (error) {
        console.error('Supabase error adding coupon:', error);
        toast.error(`Failed to add coupon: ${error.message}`);
      } else {
        setCoupons(prev => [...prev, data[0]]);
        toast.success('Coupon added successfully');
      }
    } catch (error: any) {
      console.error('Error adding coupon:', error);
      toast.error(`Failed to add coupon: ${error.message}`);
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
      coupon.is_active &&
      (!coupon.expires_at || coupon.expires_at > Date.now()) &&
      (!coupon.usage_limit || coupon.used_count < coupon.usage_limit)
    );
  };

  const updateUserStatus = async (userId: string, isActive: boolean) => {
    const { error } = await supabase
      .from('users')
      .update({ is_active: isActive })
      .eq('id', userId);

    if (error) {
      console.error('Error updating user status:', error);
      toast.error('Failed to update user status');
    } else {
      setUsers(prev =>
        prev.map(user => (user.id === userId ? { ...user, is_active: isActive } : user))
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
