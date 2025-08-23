'use client';
import Image from "next/image";
import { useState, useEffect } from "react";
import { IoBagAddOutline } from "react-icons/io5";
import { useCart } from '../context/CartContext';
import { useRouter } from 'next/navigation';
import '@/styles/ProductCard.css';

export default function DynamicProductCard({ product }) {
  const [added, setAdded] = useState(false);
  const [selectedSize, setSelectedSize] = useState('');
  const [liked, setLiked] = useState(false);
  const [showSizeError, setShowSizeError] = useState(false);
  const [showMobileModal, setShowMobileModal] = useState(false);
  const [showDesktopModal, setShowDesktopModal] = useState(false);
  const [mounted, setMounted] = useState(false);
  const { addToCart } = useCart();
  const router = useRouter();

  // التأكد من تحميل المكون
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!product) {
    return <div className="no-product">لا توجد بيانات للمنتج</div>;
  }

  // فحص وجود المقاسات
  const hasSizes = product.attributes?.some(attr =>
    attr.name.toLowerCase().includes("size") || attr.name === "المقاس"
  );

  const sizes = hasSizes
    ? product.attributes.find(attr =>
        attr.name.toLowerCase().includes("size") || attr.name === "المقاس"
      )?.options || []
    : [];

  // حساب نسبة الخصم
  const calculateDiscount = () => {
    if (product.regular_price && product.sale_price) {
      const regular = parseFloat(product.regular_price);
      const sale = parseFloat(product.sale_price);
      return Math.round(((regular - sale) / regular) * 100);
    }
    return 0;
  };

  const discount = calculateDiscount();
  const finalPrice = product.sale_price || product.price || product.regular_price;
  const originalPrice = product.regular_price;

  // بيانات التقييم من API
  const averageRating = product.average_rating || 0;
  const totalReviews = product.rating_count || 0;

  // فحص إذا كان الجهاز موبايل
  const checkIsMobile = () => {
    if (typeof window !== 'undefined') {
      return window.innerWidth <= 768;
    }
    return false;
  };

  const handleSizeSelect = (size, e) => {
    e.stopPropagation(); // منع انتشار الحدث للبطاقة الأساسية
    setSelectedSize(size);
    setShowSizeError(false);
  };

  const handleAddToCart = (e) => {
    if (e) e.stopPropagation(); // منع انتشار الحدث للبطاقة الأساسية

    if (hasSizes && !selectedSize) {
      setShowSizeError(true);
      return;
    }

    setShowSizeError(false);

    addToCart({
      id: product.id,
      name: product.name,
      price: finalPrice,
      image: product.images?.[0]?.src,
      size: selectedSize || null,
    });

    setAdded(true);
    setTimeout(() => setAdded(false), 3000);

    // إغلاق النافذة المنبثقة إذا كانت مفتوحة
    if (showMobileModal) {
      setShowMobileModal(false);
    }
    if (showDesktopModal) {
      setShowDesktopModal(false);
    }
  };

  const handleQuickAdd = (e) => {
    if (e) e.stopPropagation(); // منع انتشار الحدث للبطاقة الأساسية

    // التحقق من حجم الشاشة في الوقت الفعلي
    const isMobile = checkIsMobile();

    console.log('handleQuickAdd called', { hasSizes, isMobile, mounted }); // للتطوير

    // فتح النافذة المناسبة إذا كانت هناك مقاسات
    if (hasSizes && mounted) {
      if (isMobile) {
        console.log('Opening mobile modal'); // للتطوير
        setShowMobileModal(true);
      } else {
        console.log('Opening desktop modal'); // للتطوير
        setShowDesktopModal(true);
      }
      return;
    }

    // إضافة مباشرة للمنتجات بدون مقاسات
    console.log('Adding directly to cart'); // للتطوير
    handleAddToCart(e);
  };

  const handleModalClose = () => {
    console.log('Closing modal'); // للتطوير
    setShowMobileModal(false);
    setShowDesktopModal(false);
    setShowSizeError(false);
  };

  const handleLike = (e) => {
    e.stopPropagation(); // منع انتشار الحدث للبطاقة الأساسية
    setLiked(!liked);
    // يمكن إضافة API call هنا لحفظ المفضلة
  };

  const handleCardClick = () => {
    // الانتقال إلى صفحة المنتج
    router.push(`/products/${product.slug}`);
  };

  // عدم عرض المكون قبل التحميل الكامل للتجنب SSR issues
  if (!mounted) {
    return (
      <div className="dynamic-product-card" style={{ opacity: 0.5 }}>
        <div className="image-container">
          <div className="image-wrapper">
            <div style={{ width: '100%', height: '100%', background: '#f3f4f6' }}></div>
          </div>
        </div>
        <div className="card-content">
          <div className="rating-section">
            <button className="adding"><IoBagAddOutline /></button>
            <div className="rating-info">
              <div className="stars">
                <span>★</span>
                <span className="rating-value">0</span>
              </div>
              <span className="review-count">(0)</span>
            </div>
          </div>
          <h3 className="product-name">جاري التحميل...</h3>
          <div className="price-section">
            <div className="price-container">
              <div className="current-price">-- <span className="currency">ر.س</span></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      className="dynamic-product-card clickable-card"
      onClick={handleCardClick}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          handleCardClick();
        }
      }}
    >
      {/* شارة الخصم */}
      {discount > 0 && (
        <div className="discount-badge">
          -{discount}%
        </div>
      )}

      {/* حاوية الصورة */}
      <div className="image-container">
        {/* الصورة الرئيسية */}
        <div className="image-wrapper">
          <Image
            src={product.images?.[0]?.src || "/placeholder.jpg"}
            alt={product.name || "Product"}
            width={400}
            height={400}
            className="product-image"
          />
        </div>
      </div>

      {/* محتوى البطاقة */}
      <div className="card-content">
        {/* التقييمات والزر المصغر */}
        <div className="rating-section">


          <div className="rating-info">
            <div className="stars">
              <span>★</span>
              <span className="rating-value">{averageRating}   </span>    <span className="review-count">  ({totalReviews})</span>
            </div>

          </div>
                    <button
            className="adding"
            onClick={handleQuickAdd}
            title="إضافة سريعة للسلة"
          >
            <IoBagAddOutline/>
          </button>
        </div>

         {/* اسم المنتج */}
        <h3 className="product-name">{product.name}</h3>

        {/* الأسعار */}
        <div className="price-section">
          <div className="price-container">
            <div className="current-price">
              {finalPrice} <span className="currency">ر.س</span>
            </div>
            {originalPrice && product.sale_price && (
              <div className="original-price">
                {originalPrice} ر.س
              </div>
            )}
          </div>
        </div>
      </div>

      {/* النافذة المنبثقة للموبايل */}
      {showMobileModal && (
        <div className="mobile-modal-overlay" onClick={handleModalClose}>
          <div className="mobile-modal" onClick={(e) => e.stopPropagation()}>
            {/* مقبض الإغلاق */}
            <div className="modal-handle"></div>

            {/* محتوى النافذة */}
            <div className="modal-content">
              {/* صورة المنتج */}
              <div className="modal-image">
                <Image
                  src={product.images?.[0]?.src || "/placeholder.jpg"}
                  alt={product.name || "Product"}
                  width={120}
                  height={120}
                  className="modal-product-image"
                />
              </div>

              {/* معلومات المنتج */}
              <div className="modal-info">
                <h3 className="modal-product-name">{product.name}</h3>

                {/* السعر */}
                <div className="modal-price">
                  <span className="modal-current-price">
                    {finalPrice} <span className="modal-currency">ر.س</span>
                  </span>
                  {originalPrice && product.sale_price && (
                    <span className="modal-original-price">
                      {originalPrice} ر.س
                    </span>
                  )}
                </div>

                {/* المقاسات */}
                {hasSizes && (
                  <div className="modal-sizes-section">
                    <div className="modal-sizes-label">
                      <span>اختر المقاس</span>
                      {selectedSize && <span className="modal-selected-size">({selectedSize})</span>}
                    </div>
                    <div className="modal-sizes-grid">
                      {sizes.map((size) => (
                        <button
                          key={size}
                          onClick={(e) => handleSizeSelect(size, e)}
                          className={`modal-size-circle ${selectedSize === size ? 'selected' : ''}`}
                        >
                          {size}
                        </button>
                      ))}
                    </div>
                    {showSizeError && (
                      <p className="modal-size-error">⚠️ يرجى اختيار المقاس</p>
                    )}
                  </div>
                )}

                {/* أزرار التحكم */}
                <div className="modal-actions">
                  <button
                    className={`modal-add-to-cart-btn ${added ? 'added' : ''} ${(hasSizes && !selectedSize) ? 'disabled' : ''}`}
                    onClick={handleAddToCart}
                    disabled={hasSizes && !selectedSize}
                  >
                    <IoBagAddOutline className="modal-cart-icon" />
                    <span>{added ? 'تمت الإضافة ✨' : 'أضف إلى السلة'}</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* النافذة الجانبية للديسكتوب */}
      {showDesktopModal && (
        <div className="desktop-modal-overlay" onClick={handleModalClose}>
          <div className="desktop-modal" onClick={(e) => e.stopPropagation()}>
            {/* زر الإغلاق */}
            <button className="desktop-modal-close" onClick={handleModalClose}>
              ×
            </button>

            {/* محتوى النافذة */}
            <div className="desktop-modal-content">
              {/* صورة المنتج */}
              <div className="desktop-modal-image">
                <Image
                  src={product.images?.[0]?.src || "/placeholder.jpg"}
                  alt={product.name || "Product"}
                  width={200}
                  height={200}
                  className="desktop-modal-product-image"
                />
              </div>

              {/* معلومات المنتج */}
              <div className="desktop-modal-info">
                <h3 className="desktop-modal-product-name">{product.name}</h3>

                {/* التقييمات */}
                <div className="desktop-modal-rating">
                  <div className="stars">
                    <span>★</span>
                    <span className="rating-value">{averageRating}</span>
                  </div>
                  <span className="review-count">({totalReviews} تقييم)</span>
                </div>

                {/* السعر */}
                <div className="desktop-modal-price">
                  <span className="desktop-modal-current-price">
                    {finalPrice} <span className="desktop-modal-currency">ر.س</span>
                  </span>
                  {originalPrice && product.sale_price && (
                    <span className="desktop-modal-original-price">
                      {originalPrice} ر.س
                    </span>
                  )}
                </div>

                {/* المقاسات */}
                {hasSizes && (
                  <div className="desktop-modal-sizes-section">
                    <div className="desktop-modal-sizes-label">
                      <span>اختر المقاس</span>
                      {selectedSize && <span className="desktop-modal-selected-size">({selectedSize})</span>}
                    </div>
                    <div className="desktop-modal-sizes-grid">
                      {sizes.map((size) => (
                        <button
                          key={size}
                          onClick={(e) => handleSizeSelect(size, e)}
                          className={`desktop-modal-size-circle ${selectedSize === size ? 'selected' : ''}`}
                        >
                          {size}
                        </button>
                      ))}
                    </div>
                    {showSizeError && (
                      <p className="desktop-modal-size-error">⚠️ يرجى اختيار المقاس</p>
                    )}
                  </div>
                )}

                {/* أزرار التحكم */}
                <div className="desktop-modal-actions">
                  <button
                    className={`desktop-modal-add-to-cart-btn ${added ? 'added' : ''} ${(hasSizes && !selectedSize) ? 'disabled' : ''}`}
                    onClick={handleAddToCart}
                    disabled={hasSizes && !selectedSize}
                  >
                    <IoBagAddOutline className="desktop-modal-cart-icon" />
                    <span>{added ? 'تمت الإضافة ✨' : 'أضف إلى السلة'}</span>
                  </button>

                  <button
                    className="desktop-modal-view-product"
                    onClick={handleCardClick}
                  >
                    عرض تفاصيل المنتج
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}