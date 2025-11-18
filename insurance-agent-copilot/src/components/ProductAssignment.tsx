import { useState } from 'react';
import { Tag, X } from 'lucide-react';

interface ProductAssignmentProps {
  leadId: string;
  currentProducts: string[];
  onProductsUpdate: (products: string[]) => void;
}

const LIC_PRODUCTS = {
  'Endowment Plans': [
    { name: "LIC's Bima Lakshmi", uin: "512N389V01" },
    { name: "LIC's New Endowment Plan", uin: "512N279V02" },
    { name: "LIC's Jeevan Shiromani", uin: "512N315V02" }
  ],
  'Whole Life Plans': [
    { name: "LIC's Jeevan Umang", uin: "512N312V03" },
    { name: "LIC's Jeevan Labh", uin: "512N297V02" },
    { name: "LIC's Jeevan Anand", uin: "512N137V02" }
  ],
  'Money Back Plans': [
    { name: "LIC's Bima Ratna", uin: "512N345V02" },
    { name: "LIC's New Money Back Plan", uin: "512N283V02" },
    { name: "LIC's Jeevan Shiromani", uin: "512N315V02" }
  ],
  'Term Assurance Plans': [
    { name: "LIC's Digi Term", uin: "512N356V02" },
    { name: "LIC's Digi Credit Life", uin: "512N358V01" },
    { name: "LIC's Tech Term", uin: "512N348V02" },
    { name: "LIC's Saral Jeevan Bima", uin: "512N350V02" }
  ]
};

export default function ProductAssignment({ leadId, currentProducts, onProductsUpdate }: ProductAssignmentProps) {
  const [selectedProducts, setSelectedProducts] = useState<string[]>(currentProducts);
  const [isMultiSelect, setIsMultiSelect] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedProduct, setSelectedProduct] = useState('');

  const handleAddProduct = () => {
    if (!selectedProduct) return;
    
    if (!selectedProducts.includes(selectedProduct)) {
      const newProducts = [...selectedProducts, selectedProduct];
      setSelectedProducts(newProducts);
      onProductsUpdate(newProducts);
    }
    
    setSelectedProduct('');
    setSelectedCategory('');
  };

  const handleRemoveProduct = (productToRemove: string) => {
    const newProducts = selectedProducts.filter(p => p !== productToRemove);
    setSelectedProducts(newProducts);
    onProductsUpdate(newProducts);
  };

  const handleQuickAdd = (productName: string) => {
    if (!selectedProducts.includes(productName)) {
      const newProducts = [...selectedProducts, productName];
      setSelectedProducts(newProducts);
      onProductsUpdate(newProducts);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <label className="text-sm font-medium text-primary-content">Assign LIC Products</label>
        <button 
          onClick={() => setIsMultiSelect(!isMultiSelect)}
          className={`text-xs px-2 py-1 rounded transition-all ${
            isMultiSelect 
              ? 'bg-primary text-white' 
              : 'text-primary hover:underline'
          }`}
        >
          {isMultiSelect ? 'Single Mode' : '+ Add Multiple'}
        </button>
      </div>
      
      {/* Current Products */}
      {selectedProducts.length > 0 && (
        <div className="mb-4">
          <div className="text-xs text-secondary-content mb-2">Assigned Products</div>
          <div className="flex flex-wrap gap-2">
            {selectedProducts.map((product, index) => (
              <span
                key={index}
                className="px-3 py-1 bg-primary/20 text-primary rounded-full text-xs flex items-center gap-1"
              >
                {product}
                <button
                  onClick={() => handleRemoveProduct(product)}
                  className="hover:bg-primary/30 rounded-full p-0.5"
                >
                  <X size={10} />
                </button>
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Product Selection */}
      <div className="space-y-3">
        {/* Category Selection */}
        <select
          value={selectedCategory}
          onChange={(e) => {
            setSelectedCategory(e.target.value);
            setSelectedProduct('');
          }}
          className="w-full glass-effect rounded-lg px-4 py-3 text-sm text-primary-content outline-none focus:ring-2 focus:ring-primary/50 border border-dark-border hover:border-primary/30 transition-all"
        >
          <option value="">Choose a product category...</option>
          {Object.keys(LIC_PRODUCTS).map((category) => (
            <option key={category} value={category}>
              {category}
            </option>
          ))}
        </select>

        {/* Product Selection */}
        {selectedCategory && (
          <select
            value={selectedProduct}
            onChange={(e) => setSelectedProduct(e.target.value)}
            className="w-full glass-effect rounded-lg px-4 py-3 text-sm text-primary-content outline-none focus:ring-2 focus:ring-primary/50 border border-dark-border hover:border-primary/30 transition-all"
          >
            <option value="">Choose a product...</option>
            {LIC_PRODUCTS[selectedCategory as keyof typeof LIC_PRODUCTS].map((product) => (
              <option key={product.name} value={product.name}>
                {product.name} (UIN: {product.uin})
              </option>
            ))}
          </select>
        )}
        
        {/* Add Button */}
        <button 
          onClick={handleAddProduct}
          disabled={!selectedProduct}
          className={`w-full rounded-lg py-2.5 text-sm font-medium transition-all flex items-center justify-center gap-2 ${
            selectedProduct
              ? 'bg-primary text-white hover:bg-primary-dark'
              : 'bg-gray-500/20 text-gray-500 cursor-not-allowed'
          }`}
        >
          <Tag size={14} />
          Add Product
        </button>
      </div>

      {/* Quick Product Suggestions */}
      <div className="bg-primary/5 rounded-lg p-3">
        <div className="text-xs text-secondary-content mb-2">AI Recommended Products</div>
        <div className="flex flex-wrap gap-2">
          <button 
            onClick={() => handleQuickAdd("LIC's Jeevan Umang")}
            className="px-3 py-1.5 bg-primary/20 text-primary rounded-full text-xs hover:bg-primary/30 transition-all"
          >
            LIC's Jeevan Umang
          </button>
          <button 
            onClick={() => handleQuickAdd("LIC's Bima Ratna")}
            className="px-3 py-1.5 bg-primary/20 text-primary rounded-full text-xs hover:bg-primary/30 transition-all"
          >
            LIC's Bima Ratna
          </button>
          <button 
            onClick={() => handleQuickAdd("LIC's Digi Term")}
            className="px-3 py-1.5 bg-primary/20 text-primary rounded-full text-xs hover:bg-primary/30 transition-all"
          >
            LIC's Digi Term
          </button>
        </div>
      </div>
    </div>
  );
}