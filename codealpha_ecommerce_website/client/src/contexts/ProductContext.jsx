import React, { createContext, useState } from 'react';

export const ProductContext = createContext();

export const ProductProvider = ({ children }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [sortBy, setSortBy] = useState('newest');
  const [priceRange, setPriceRange] = useState([0, 50000]);
  const [viewMode, setViewMode] = useState('grid');
  const [selectedBrand, setSelectedBrand] = useState('');
  const [selectedRating, setSelectedRating] = useState(0);
  const [inStockOnly, setInStockOnly] = useState(false);
  const [selectedDiscount, setSelectedDiscount] = useState(0);
  const [expressOnly, setExpressOnly] = useState(false);
  const [organicOnly, setOrganicOnly] = useState(false);
  const [quickViewProduct, setQuickViewProduct] = useState(null);

  const resetFilters = () => {
    setSearchQuery('');
    setSelectedCategory('all');
    setSortBy('newest');
    setPriceRange([0, 50000]);
    setSelectedBrand('');
    setSelectedRating(0);
    setInStockOnly(false);
    setSelectedDiscount(0);
    setExpressOnly(false);
    setOrganicOnly(false);
  };

  return (
    <ProductContext.Provider
      value={{
        searchQuery,
        setSearchQuery,
        selectedCategory,
        setSelectedCategory,
        sortBy,
        setSortBy,
        priceRange,
        setPriceRange,
        viewMode,
        setViewMode,
        selectedBrand,
        setSelectedBrand,
        selectedRating,
        setSelectedRating,
        inStockOnly,
        setInStockOnly,
        selectedDiscount,
        setSelectedDiscount,
        expressOnly,
        setExpressOnly,
        organicOnly,
        setOrganicOnly,
        quickViewProduct,
        setQuickViewProduct,
        resetFilters,
      }}
    >
      {children}
    </ProductContext.Provider>
  );
};
