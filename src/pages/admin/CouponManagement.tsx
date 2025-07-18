import React, { useState } from 'react';
import { useAdmin } from '../../context/AdminContext';
import { Coupon } from '../../types';
import { Plus, Edit, Trash2, Copy, Calendar } from 'lucide-react';
import toast from 'react-hot-toast';
import './CouponManagement.css';

const CouponManagement: React.FC = () => {
  const { coupons, plans, addCoupon, updateCoupon, deleteCoupon } = useAdmin();
  const [showModal, setShowModal] = useState(false);
  const [editingCoupon, setEditingCoupon] = useState<Coupon | null>(null);
  const [formData, setFormData] = useState({
    code: '',
    description: '',
    discount_percentage: 10,
    applicable_plans: [] as string[],
    is_active: true,
    expires_at: '',
    usage_limit: '',
  });
 
  const handleAddCoupon = () => {
    setEditingCoupon(null);
    setFormData({
      code: '',
      description: '',
      discount_percentage: 10,
      applicable_plans: [],
      is_active: true,
      expires_at: '',
      usage_limit: '',
    });
    setShowModal(true);
  };

  const handleEditCoupon = (coupon: Coupon) => {
    setEditingCoupon(coupon);
    setFormData({
      code: coupon.code,
      description: coupon.description,
      discount_percentage: coupon.discount_percentage,
      applicable_plans: coupon.applicable_plans,
      is_active: coupon.is_active,
      expires_at: coupon.expires_at ? new Date(coupon.expires_at).toISOString().split('T')[0] : '',
      usage_limit: coupon.usage_limit?.toString() || '',
    });
    setShowModal(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const couponData = {
      code: formData.code.toUpperCase(),
      description: formData.description,
      discount_percentage: formData.discount_percentage,
      applicable_plans: formData.applicable_plans,
      is_active: formData.is_active,
      expires_at: formData.expires_at ? new Date(formData.expires_at).toISOString() : undefined,
      usage_limit: formData.usage_limit ? Number(formData.usage_limit) : undefined,
    };
    
    if (editingCoupon) {
      updateCoupon(editingCoupon.id, couponData);
    } else {
      addCoupon(couponData);
    }
    
    setShowModal(false);
    setEditingCoupon(null);
  };

  const handleDeleteCoupon = (couponId: string) => {
    if (window.confirm('Are you sure you want to delete this coupon?')) {
      deleteCoupon(couponId);
    }
  };

  const handleCopyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    toast.success('Coupon code copied to clipboard!');
  };

  const generateRandomCode = () => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let result = '';
    for (let i = 0; i < 8; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setFormData(prev => ({ ...prev, code: result }));
  };

  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleDateString();
  };

  const isExpired = (expiresAt?: number) => {
    return expiresAt ? expiresAt < Date.now() : false;
  };

  const isUsageLimitReached = (coupon: Coupon) => {
    return coupon.usage_limit ? coupon.used_count >= coupon.usage_limit : false;
  };

  return (
    <div className="coupon-management fade-in">
      <div className="coupon-management-header">
        <div>
          <h1 className="admin-page-heading">Coupon Management</h1>
          <p className="admin-subtitle">Create and manage discount coupons</p>
        </div>
        <button className="add-coupon-button" onClick={handleAddCoupon}>
          <Plus size={18} />
          <span>Add Coupon</span>
        </button>
      </div>

      <div className="coupons-table-container">
        <table className="coupons-table">
          <thead>
            <tr>
              <th>Code</th>
              <th>Description</th>
              <th>Discount</th>
              <th>Applicable Plans</th>
              <th>Usage</th>
              <th>Expires</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {coupons.map(coupon => (
              <tr key={coupon.id}>
                <td>
                  <div className="coupon-code-cell">
                    <span className="coupon-code">{coupon.code}</span>
                    <button
                      className="copy-button"
                      onClick={() => handleCopyCode(coupon.code)}
                      title="Copy code"
                    >
                      <Copy size={14} />
                    </button>
                  </div>
                </td>
                <td>
                  <span className="coupon-description">{coupon.description}</span>
                </td>
                <td>
                  <span className="discount-percentage">{coupon.discount_percentage}%</span>
                </td>
                <td>
                  <div className="applicable-plans">
                    {coupon.applicable_plans.map(planId => {
                      const plan = plans.find(p => p.id === planId);
                      return plan ? (
                        <span key={planId} className="plan-tag">
                          {plan.name}
                        </span>
                      ) : null;
                    })}
                  </div>
                </td>
                <td>
                  <div className="usage-info">
                    <span className="usage-count">{coupon.used_count}</span>
                    {coupon.usage_limit && (
                      <>
                        <span className="usage-separator">/</span>
                        <span className="usage-limit">{coupon.usage_limit}</span>
                      </>
                    )}
                    {!coupon.usage_limit && <span className="usage-unlimited">∞</span>}
                  </div>
                </td>
                <td>
                  {coupon.expires_at ? (
                     <span className={`expiry-date ${isExpired(coupon.expiresAt) ? 'expired' : ''}`}>
                      {formatDate(coupon.expiresAt)}
                    </span>
                  ) : (
                    <span className="no-expiry">Never</span>
                  )}
                </td>
                <td>
                  <span className={`coupon-status-badge ${
                    !coupon.isActive ? 'status-inactive' :
                    isExpired(coupon.expiresAt) ? 'status-expired' :
                    isUsageLimitReached(coupon) ? 'status-limit-reached' :
                    'status-active'
                  }`}>
                    {!coupon.isActive ? 'Inactive' :
                     isExpired(coupon.expiresAt) ? 'Expired' :
                     isUsageLimitReached(coupon) ? 'Limit Reached' :
                     'Active'}
                  </span>
                </td>
                <td>
                  <div className="coupon-actions">
                    <button
                      className="coupon-action-button"
                      onClick={() => handleEditCoupon(coupon)}
                      title="Edit Coupon"
                    >
                      <Edit size={16} />
                    </button>
                    <button
                      className="coupon-action-button delete"
                      onClick={() => handleDeleteCoupon(coupon.id)}
                      title="Delete Coupon"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showModal && (
        <div className="coupon-modal-overlay">
          <div className="coupon-modal">
            <div className="coupon-modal-header">
              <h2>{editingCoupon ? 'Edit Coupon' : 'Add New Coupon'}</h2>
              <button
                className="close-button"
                onClick={() => setShowModal(false)}
              >
                ×
              </button>
            </div>

            <form onSubmit={handleSubmit} className="coupon-form">
              <div className="form-grid">
                <div className="form-group">
                  <label htmlFor="code">Coupon Code</label>
                  <div className="code-input-group">
                    <input
                      type="text"
                      id="code"
                      value={formData.code}
                      onChange={(e) => setFormData(prev => ({ ...prev, code: e.target.value.toUpperCase() }))}
                      required
                      className="form-input"
                      placeholder="SAVE20"
                    />
                    <button
                      type="button"
                      className="generate-button"
                      onClick={generateRandomCode}
                    >
                      Generate
                    </button>
                  </div>
                </div>

                <div className="form-group">
                  <label htmlFor="discount_percentage">Discount Percentage</label>
                  <input
                    type="number"
                    id="discount_percentage"
                    value={formData.discount_percentage}
                    onChange={(e) => setFormData(prev => ({ ...prev, discount_percentage: Number(e.target.value) }))}
                    min="1"
                    max="100"
                    required
                    className="form-input"
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="expires_at">Expiry Date (Optional)</label>
                  <input
                    type="date"
                    id="expires_at"
                    value={formData.expires_at}
                    onChange={(e) => setFormData(prev => ({ ...prev, expires_at: e.target.value }))}
                    className="form-input"
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="usage_limit">Usage Limit (Optional)</label>
                  <input
                    type="number"
                    id="usage_limit"
                    value={formData.usage_limit}
                    onChange={(e) => setFormData(prev => ({ ...prev, usage_limit: e.target.value }))}
                    min="1"
                    className="form-input"
                    placeholder="Leave empty for unlimited"
                  />
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="description">Description</label>
                <textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  rows={3}
                  className="form-input"
                  placeholder="Describe what this coupon is for..."
                />
              </div>

              <div className="form-group">
                <label>Applicable Plans</label>
                <div className="plans-checkbox-group">
                  {plans.map(plan => (
                    <label key={plan.id} className="plan-checkbox-label">
                      <input
                        type="checkbox"
                        checked={formData.applicable_plans.includes(plan.id)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setFormData(prev => ({
                              ...prev,
                              applicable_plans: [...prev.applicable_plans, plan.id]
                            }));
                          } else {
                            setFormData(prev => ({
                              ...prev,
                              applicable_plans: prev.applicable_plans.filter(id => id !== plan.id)
                            }));
                          }
                        }}
                      />
                      <span>{plan.name} (\${plan.price}/{plan.billing_period})</span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="form-group">
                <label className="checkbox-label">
                  <input
                    type="checkbox"
                    checked={formData.is_active}
                    onChange={(e) => setFormData(prev => ({ ...prev, is_active: e.target.checked }))}
                  />
                  <span>Active Coupon</span>
                </label>
              </div>

              <div className="form-actions">
                <button
                  type="button"
                  className="button-secondary"
                  onClick={() => setShowModal(false)}
                >
                  Cancel
                </button>
                <button type="submit" className="button-primary">
                  {editingCoupon ? 'Update Coupon' : 'Create Coupon'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default CouponManagement;
