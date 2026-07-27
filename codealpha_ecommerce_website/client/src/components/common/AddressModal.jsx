import React, { useState, useEffect } from 'react';
import {
  FiX,
  FiMapPin,
  FiPlus,
  FiCheck,
  FiHome,
  FiBriefcase,
  FiPhone,
  FiUser,
  FiEdit2,
  FiTrash2,
  FiAlertCircle,
  FiGlobe,
  FiMap,
  FiHash,
  FiNavigation,
} from 'react-icons/fi';

const STORAGE_KEY = 'basketly_user_addresses';
const SELECTED_ADDRESS_KEY = 'basketly_selected_address';
const LEGACY_STORAGE_KEY = 'aetheria_user_addresses';
const LEGACY_SELECTED_KEY = 'aetheria_selected_address';

export const getSavedAddresses = () => {
  try {
    const data = localStorage.getItem(STORAGE_KEY) || localStorage.getItem(LEGACY_STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  } catch (err) {
    return [];
  }
};

export const getSelectedAddress = () => {
  try {
    const data = localStorage.getItem(SELECTED_ADDRESS_KEY) || localStorage.getItem(LEGACY_SELECTED_KEY);
    if (data) return JSON.parse(data);
    const addresses = getSavedAddresses();
    return addresses[0] || null;
  } catch (err) {
    return null;
  }
};

export const saveAddressesToStorage = (addresses) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(addresses));
  localStorage.setItem(LEGACY_STORAGE_KEY, JSON.stringify(addresses));
};

export const setSelectedAddressInStorage = (address) => {
  if (address) {
    localStorage.setItem(SELECTED_ADDRESS_KEY, JSON.stringify(address));
    localStorage.setItem(LEGACY_SELECTED_KEY, JSON.stringify(address));
  } else {
    localStorage.removeItem(SELECTED_ADDRESS_KEY);
    localStorage.removeItem(LEGACY_SELECTED_KEY);
  }
};

const indianStates = [
  'Telangana',
  'Andhra Pradesh',
  'Karnataka',
  'Maharashtra',
  'Tamil Nadu',
  'Delhi NCR',
  'Gujarat',
  'Kerala',
  'West Bengal',
  'Punjab',
  'Uttar Pradesh',
  'Rajasthan',
];

const AddressModal = ({ isOpen, onClose, onAddressSelect }) => {
  const [addresses, setAddresses] = useState(getSavedAddresses());
  const [selectedAddr, setSelectedAddr] = useState(getSelectedAddress());
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);

  const initialForm = {
    fullName: '',
    phone: '',
    houseNo: '',
    building: '',
    landmark: '',
    city: 'Hyderabad',
    state: 'Telangana',
    pincode: '',
    type: 'Home',
    isDefault: false,
  };

  const [formData, setFormData] = useState(initialForm);
  const [formError, setFormError] = useState('');

  useEffect(() => {
    if (isOpen) {
      const saved = getSavedAddresses();
      const currentSel = getSelectedAddress();
      setAddresses(saved);
      setSelectedAddr(currentSel);

      // If user has no addresses, default to showing the Add Form directly
      if (saved.length === 0) {
        setShowForm(true);
        setEditingId(null);
        setFormData(initialForm);
      } else {
        setShowForm(false);
      }
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSelect = (addr) => {
    setSelectedAddr(addr);
    setSelectedAddressInStorage(addr);
    if (onAddressSelect) onAddressSelect(addr);
    onClose();
  };

  const handleStartAdd = () => {
    setEditingId(null);
    setFormData(initialForm);
    setFormError('');
    setShowForm(true);
  };

  const handleStartEdit = (e, addr) => {
    e.stopPropagation();
    setEditingId(addr.id);
    setFormData({
      fullName: addr.fullName || '',
      phone: addr.phone || '',
      houseNo: addr.houseNo || '',
      building: addr.building || addr.street || '',
      landmark: addr.landmark || '',
      city: addr.city || 'Hyderabad',
      state: addr.state || 'Telangana',
      pincode: addr.pincode || '',
      type: addr.type || 'Home',
      isDefault: addr.isDefault || false,
    });
    setFormError('');
    setShowForm(true);
  };

  const handleDelete = (e, id) => {
    e.stopPropagation();
    const updated = addresses.filter((a) => a.id !== id);
    setAddresses(updated);
    saveAddressesToStorage(updated);

    if (selectedAddr?.id === id) {
      const nextSel = updated[0] || null;
      setSelectedAddr(nextSel);
      setSelectedAddressInStorage(nextSel);
      if (onAddressSelect) onAddressSelect(nextSel);
    }
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    setFormError('');

    // Validation checks
    if (!formData.fullName.trim()) {
      setFormError('Please enter full name');
      return;
    }
    if (!/^\d{10}$/.test(formData.phone.trim())) {
      setFormError('Please enter a valid 10-digit mobile number');
      return;
    }
    if (!formData.houseNo.trim()) {
      setFormError('Please enter House / Flat / Apartment number');
      return;
    }
    if (!formData.building.trim()) {
      setFormError('Please enter Building / Street / Locality');
      return;
    }
    if (!/^\d{6}$/.test(formData.pincode.trim())) {
      setFormError('Please enter a valid 6-digit PIN code');
      return;
    }

    let updatedAddresses = [];

    const addressRecord = {
      ...formData,
      street: `${formData.houseNo}, ${formData.building}${
        formData.landmark ? `, Near ${formData.landmark}` : ''
      }`,
    };

    if (editingId) {
      updatedAddresses = addresses.map((item) =>
        item.id === editingId ? { ...addressRecord, id: editingId } : item
      );
    } else {
      const newAddr = {
        id: `addr-${Date.now()}`,
        ...addressRecord,
      };
      updatedAddresses = [newAddr, ...addresses];
    }

    // Default Address handling
    if (formData.isDefault) {
      const currentTargetId = editingId || updatedAddresses[0].id;
      updatedAddresses = updatedAddresses.map((a) => ({
        ...a,
        isDefault: a.id === currentTargetId,
      }));
    }

    setAddresses(updatedAddresses);
    saveAddressesToStorage(updatedAddresses);

    const savedTarget = editingId
      ? updatedAddresses.find((a) => a.id === editingId)
      : updatedAddresses[0];

    handleSelect(savedTarget);
    setShowForm(false);
  };

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-slate-950/80 backdrop-blur-xl animate-fadeIn"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-2xl bg-slate-900/95 border border-slate-700/70 rounded-[24px] shadow-2xl shadow-emerald-950/50 p-6 sm:p-8 backdrop-blur-2xl transition-all"
      >
        {/* Ambient Gradient Glow Accents */}
        <div className="absolute -top-12 -right-12 w-48 h-48 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-12 -left-12 w-48 h-48 bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />

        {/* Clear Top-Right Close (×) Button */}
        <button
          onClick={onClose}
          aria-label="Close Address Panel"
          className="absolute top-5 right-5 p-2.5 rounded-full bg-slate-800/80 text-slate-400 hover:text-white hover:bg-rose-600 transition-all border border-slate-700/80 cursor-pointer shadow-md z-10"
        >
          <FiX className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="flex items-center gap-3.5 mb-6">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-emerald-500/20 via-teal-500/15 to-emerald-400/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center shadow-inner flex-shrink-0">
            <FiMapPin className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight">
              {showForm
                ? editingId
                  ? 'Edit Delivery Address'
                  : 'Add Delivery Address'
                : 'Select Delivery Address'}
            </h2>
            <p className="text-xs text-slate-400 font-medium">
              {showForm
                ? 'Enter your shipping address for instant 10-minute doorstep delivery'
                : 'Choose a saved delivery address or add a new shipping location'}
            </p>
          </div>
        </div>

        {/* MODE 1: SAVED ADDRESSES LIST */}
        {!showForm ? (
          <div className="space-y-4">
            {addresses.length === 0 ? (
              <div className="py-10 px-6 text-center space-y-4 bg-slate-950/60 rounded-2xl border border-dashed border-slate-800">
                <div className="w-14 h-14 mx-auto rounded-2xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center justify-center">
                  <FiMapPin className="w-7 h-7" />
                </div>
                <div className="space-y-1">
                  <h3 className="text-base font-bold text-white">No Saved Address Found</h3>
                  <p className="text-xs text-slate-400 leading-relaxed max-w-xs mx-auto">
                    Add your delivery address to proceed with instant doorstep dispatch.
                  </p>
                </div>
                <button
                  onClick={handleStartAdd}
                  className="mt-2 py-2.5 px-5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 text-white font-bold text-xs shadow-lg hover:from-emerald-400 hover:to-teal-400 transition-all cursor-pointer inline-flex items-center gap-2"
                >
                  <FiPlus className="w-4 h-4" />
                  <span>Add Delivery Address</span>
                </button>
              </div>
            ) : (
              <div className="space-y-3 max-h-[380px] overflow-y-auto pr-1">
                {addresses.map((addr) => {
                  const isSelected = selectedAddr?.id === addr.id;
                  return (
                    <div
                      key={addr.id}
                      onClick={() => handleSelect(addr)}
                      className={`p-4 rounded-2xl border cursor-pointer transition-all flex items-start justify-between gap-3 ${
                        isSelected
                          ? 'bg-emerald-950/40 border-emerald-500/80 shadow-lg ring-1 ring-emerald-500/50'
                          : 'bg-slate-950/60 border-slate-800 hover:border-slate-700'
                      }`}
                    >
                      <div className="space-y-1 text-xs flex-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="font-bold text-white text-sm">{addr.fullName}</span>
                          <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 font-extrabold text-[10px] uppercase">
                            {addr.type || 'Home'}
                          </span>
                          {addr.isDefault && (
                            <span className="px-2.5 py-0.5 rounded-full bg-teal-500/20 text-teal-300 font-bold text-[10px] uppercase">
                              Default
                            </span>
                          )}
                        </div>
                        <p className="text-slate-300 leading-snug">
                          {addr.houseNo ? `${addr.houseNo}, ` : ''}
                          {addr.building || addr.street}
                          {addr.landmark ? `, Near ${addr.landmark}` : ''}
                        </p>
                        <p className="text-slate-400 font-semibold">
                          {addr.city}, {addr.state} -{' '}
                          <strong className="text-white">{addr.pincode}</strong>
                        </p>
                        <p className="text-slate-400 font-medium">Mobile: {addr.phone}</p>
                      </div>

                      <div className="flex items-center gap-1.5 self-start">
                        <button
                          type="button"
                          onClick={(e) => handleStartEdit(e, addr)}
                          title="Edit Address"
                          className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
                        >
                          <FiEdit2 className="w-4 h-4" />
                        </button>
                        <button
                          type="button"
                          onClick={(e) => handleDelete(e, addr.id)}
                          title="Delete Address"
                          className="p-2 rounded-xl text-slate-400 hover:text-rose-400 hover:bg-rose-950/60 transition-colors cursor-pointer"
                        >
                          <FiTrash2 className="w-4 h-4" />
                        </button>
                        <div
                          className={`p-2 rounded-full ml-1 transition-all ${
                            isSelected
                              ? 'bg-emerald-500 text-slate-950 font-black'
                              : 'bg-slate-800 text-slate-500'
                          }`}
                        >
                          <FiCheck className="w-4 h-4" />
                        </div>
                      </div>
                    </div>
                  );
                })}

                <button
                  onClick={handleStartAdd}
                  className="w-full py-3 px-4 rounded-2xl border-2 border-dashed border-slate-700/80 text-slate-300 hover:border-emerald-500 hover:text-emerald-400 font-bold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer bg-slate-950/30"
                >
                  <FiPlus className="w-4 h-4" />
                  <span>Add New Address</span>
                </button>
              </div>
            )}
          </div>
        ) : (
          /* MODE 2: REDESIGNED ADD / EDIT ADDRESS FORM (NO INTERNAL SCROLLBAR) */
          <form onSubmit={handleFormSubmit} className="space-y-4">
            {formError && (
              <div className="p-3 rounded-xl bg-rose-950/70 border border-rose-800/80 text-rose-300 text-xs font-semibold flex items-center gap-2">
                <FiAlertCircle className="w-4 h-4 flex-shrink-0 text-rose-400" />
                <span>{formError}</span>
              </div>
            )}

            {/* Row 1: Full Name & Mobile Number */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-300 mb-1">
                  Full Name <span className="text-emerald-400">*</span>
                </label>
                <div className="relative flex items-center">
                  <FiUser className="absolute left-3.5 text-slate-400 w-4 h-4 pointer-events-none" />
                  <input
                    type="text"
                    placeholder="Recipient's full name"
                    value={formData.fullName}
                    onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                    className="w-full bg-slate-950/70 border border-slate-700/80 rounded-xl pl-10 pr-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 transition-all"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-300 mb-1">
                  Mobile Number <span className="text-emerald-400">*</span>
                </label>
                <div className="relative flex items-center">
                  <FiPhone className="absolute left-3.5 text-slate-400 w-4 h-4 pointer-events-none" />
                  <input
                    type="tel"
                    placeholder="10-digit mobile number"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full bg-slate-950/70 border border-slate-700/80 rounded-xl pl-10 pr-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 transition-all"
                    required
                  />
                </div>
              </div>
            </div>

            {/* Row 2: House / Flat Number & Building / Street / Locality */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-300 mb-1">
                  House / Flat / Apt No. <span className="text-emerald-400">*</span>
                </label>
                <div className="relative flex items-center">
                  <FiHome className="absolute left-3.5 text-slate-400 w-4 h-4 pointer-events-none" />
                  <input
                    type="text"
                    placeholder="e.g. Flat 402, B-Block"
                    value={formData.houseNo}
                    onChange={(e) => setFormData({ ...formData, houseNo: e.target.value })}
                    className="w-full bg-slate-950/70 border border-slate-700/80 rounded-xl pl-10 pr-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 transition-all"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-300 mb-1">
                  Building / Street / Locality <span className="text-emerald-400">*</span>
                </label>
                <div className="relative flex items-center">
                  <FiMapPin className="absolute left-3.5 text-slate-400 w-4 h-4 pointer-events-none" />
                  <input
                    type="text"
                    placeholder="e.g. Jubilee Hills Road No 36"
                    value={formData.building}
                    onChange={(e) => setFormData({ ...formData, building: e.target.value })}
                    className="w-full bg-slate-950/70 border border-slate-700/80 rounded-xl pl-10 pr-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 transition-all"
                    required
                  />
                </div>
              </div>
            </div>

            {/* Row 3: Landmark (Optional) & Pincode */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-300 mb-1">
                  Landmark (Optional)
                </label>
                <div className="relative flex items-center">
                  <FiNavigation className="absolute left-3.5 text-slate-400 w-4 h-4 pointer-events-none" />
                  <input
                    type="text"
                    placeholder="e.g. Near Metro Station / Park"
                    value={formData.landmark}
                    onChange={(e) => setFormData({ ...formData, landmark: e.target.value })}
                    className="w-full bg-slate-950/70 border border-slate-700/80 rounded-xl pl-10 pr-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-300 mb-1">
                  Pincode <span className="text-emerald-400">*</span>
                </label>
                <div className="relative flex items-center">
                  <FiHash className="absolute left-3.5 text-slate-400 w-4 h-4 pointer-events-none" />
                  <input
                    type="text"
                    placeholder="6-digit PIN code"
                    value={formData.pincode}
                    onChange={(e) => setFormData({ ...formData, pincode: e.target.value })}
                    className="w-full bg-slate-950/70 border border-slate-700/80 rounded-xl pl-10 pr-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 transition-all"
                    required
                  />
                </div>
              </div>
            </div>

            {/* Row 4: City & State */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-300 mb-1">
                  City <span className="text-emerald-400">*</span>
                </label>
                <div className="relative flex items-center">
                  <FiGlobe className="absolute left-3.5 text-slate-400 w-4 h-4 pointer-events-none" />
                  <input
                    type="text"
                    placeholder="e.g. Hyderabad"
                    value={formData.city}
                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                    className="w-full bg-slate-950/70 border border-slate-700/80 rounded-xl pl-10 pr-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 transition-all"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-300 mb-1">
                  State <span className="text-emerald-400">*</span>
                </label>
                <div className="relative flex items-center">
                  <FiMap className="absolute left-3.5 text-slate-400 w-4 h-4 pointer-events-none" />
                  <select
                    value={formData.state}
                    onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                    className="w-full bg-slate-950/70 border border-slate-700/80 text-white rounded-xl pl-10 pr-3.5 py-2.5 text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 transition-all cursor-pointer"
                  >
                    {indianStates.map((st) => (
                      <option key={st} value={st} className="bg-slate-900 text-white">
                        {st}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* Row 5: Address Type Tag Selector */}
            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-300 mb-1.5">
                Address Type
              </label>
              <div className="grid grid-cols-3 gap-3">
                {[
                  { type: 'Home', icon: FiHome },
                  { type: 'Work', icon: FiBriefcase },
                  { type: 'Other', icon: FiMapPin },
                ].map(({ type, icon: TypeIcon }) => {
                  const isSelected = formData.type === type;
                  return (
                    <button
                      key={type}
                      type="button"
                      onClick={() => setFormData({ ...formData, type })}
                      className={`py-2.5 px-3 rounded-xl border font-bold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer ${
                        isSelected
                          ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white border-emerald-500 shadow-md shadow-emerald-950/40 ring-1 ring-emerald-400/50'
                          : 'bg-slate-950/60 border-slate-700/70 text-slate-400 hover:text-white hover:bg-slate-800/80'
                      }`}
                    >
                      <TypeIcon className={`w-4 h-4 ${isSelected ? 'text-white' : 'text-slate-400'}`} />
                      <span>{type}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Row 6: Default Address Checkbox */}
            <div className="flex items-center justify-between pt-1 bg-slate-950/40 p-3 rounded-xl border border-slate-800/80">
              <div
                className="flex items-center gap-2.5 cursor-pointer"
                onClick={() => setFormData({ ...formData, isDefault: !formData.isDefault })}
              >
                <input
                  type="checkbox"
                  id="isDefault"
                  checked={formData.isDefault}
                  onChange={(e) => setFormData({ ...formData, isDefault: e.target.checked })}
                  className="w-4 h-4 rounded accent-emerald-500 cursor-pointer"
                />
                <label htmlFor="isDefault" className="text-xs text-slate-200 font-semibold cursor-pointer">
                  Set as default delivery address
                </label>
              </div>
            </div>

            {/* Row 7: Actions Row - Cancel & Primary CTA Save Address */}
            <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-800/80">
              <button
                type="button"
                onClick={() => (addresses.length > 0 ? setShowForm(false) : onClose())}
                className="px-5 py-2.5 rounded-xl border border-slate-700 bg-slate-800/80 text-slate-300 hover:text-white hover:bg-slate-700 font-bold text-xs transition-all cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 via-teal-500 to-emerald-600 hover:from-emerald-400 hover:to-teal-500 text-white font-extrabold text-xs shadow-lg shadow-emerald-950/50 hover:shadow-emerald-500/20 active:scale-[0.98] transition-all cursor-pointer flex items-center gap-2"
              >
                <FiCheck className="w-4 h-4" />
                <span>{editingId ? 'Update & Select Address' : 'Save Address'}</span>
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default AddressModal;
