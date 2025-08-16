'use client';

import React, { useState, useEffect } from "react";
import { useCart } from "@/app/context/CartContext";
import { useReviews } from "@/app/hooks/reviews";
import Image from "next/image";
import { Star, Heart, Share2, Truck, Shield, RotateCcw, Award, Plus, Minus, X, ChevronLeft, ChevronRight } from "lucide-react";
import ReviewForm from "@/app/components/ReviewForm";
import ProductSlider from "@/app/components/ProductSlider/page";
import '@/styles/ProductPage.css';

export default function ProductContent({ product, variations }) {
  const { addToCart } = useCart();
  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedSize, setSelectedSize] = useState('');
  const [selectedVariationId, setSelectedVariationId] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState('description');
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [showSizeError, setShowSizeError] = useState(false);
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [submittingReview, setSubmittingReview] = useState(false);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [loadingRelated, setLoadingRelated] = useState(false);
  const [touchStart, setTouchStart] = useState(null);
  const [touchEnd, setTouchEnd] = useState(null);
  const [imageTransform, setImageTransform] = useState(0);

  // استخدام hook التقييمات
  const {
    reviews,
    reviewStats,
    loading: reviewsLoading,
    error: reviewsError,
    submitReview,
    formatDate,
  } = useReviews(product.id);

  // جلب المنتجات المتعلقة
  useEffect(() => {
    const fetchRelatedProducts = async () => {
      if (!product.categories?.[0]?.id) return;

      setLoadingRelated(true);
      try {
        const response = await fetch(
          `/api/related-products?category=${product.categories[0].id}&exclude=${product.id}&per_page=8`
        );

        if (response.ok) {
          const data = await response.json();
          setRelatedProducts(data);
        }
      } catch (error) {
        console.error('خطأ في جلب المنتجات المتعلقة:', error);
      } finally {
        setLoadingRelated(false);
      }
    };

    fetchRelatedProducts();
  }, [product.id, product.categories]);

  const hasSizes = product.attributes?.some(attr =>
    attr.name.toLowerCase().includes("size") || attr.name === "المقاس"
  );
  const sizes = hasSizes
    ? product.attributes.find(attr =>
        attr.name.toLowerCase().includes("size") || attr.name === "المقاس"
      ).options
    : [];

  const hasColors = product.attributes?.some(attr =>
    attr.name.toLowerCase().includes("color") || attr.name === "اللون"
  );
  const colors = hasColors
    ? product.attributes.find(attr =>
        attr.name.toLowerCase().includes("color") || attr.name === "اللون"
      ).options
    : [];

  const handleSizeChange = (size) => {
    setSelectedSize(size);
    setShowSizeError(false);

    const match = variations?.find(v =>
      v.attributes.some(attr =>
        (attr.name.toLowerCase().includes("size") || attr.name === "المقاس") &&
        attr.option === size
      )
    );
    setSelectedVariationId(match ? match.id : null);
  };

  const handleAddToCart = () => {
    if (hasSizes && !selectedVariationId) {
      setShowSizeError(true);
      return;
    }

    setShowSizeError(false);

    for (let i = 0; i < quantity; i++) {
      addToCart({
        id: selectedVariationId || product.id,
        name: product.name,
        price: product.price,
        image: product.images?.[0]?.src,
        size: selectedSize || null,
      });
    }

    alert(`✅ تمت إضافة ${quantity} قطعة إلى السلة`);
  };

  const handleQuantityChange = (change) => {
    setQuantity(Math.max(1, quantity + change));
  };

  const handleReviewSubmit = async (reviewData) => {
    setSubmittingReview(true);
    try {
      const result = await submitReview(reviewData);
      alert('✅ ' + result.message);
      setShowReviewForm(false);
    } catch (error) {
      alert('❌ ' + error.message);
    } finally {
      setSubmittingReview(false);
    }
  };

  // Touch handlers للسلايدر في الجوال
  const handleTouchStart = (e) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };

  const handleTouchMove = (e) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = () => {
    if (!touchStart || !touchEnd) return;

    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > 50;
    const isRightSwipe = distance < -50;

    if (isLeftSwipe && selectedImage < (product.images?.length || 1) - 1) {
      setSelectedImage(prev => prev + 1);
    }
    if (isRightSwipe && selectedImage > 0) {
      setSelectedImage(prev => prev - 1);
    }
  };

  // Navigation functions للأسهم
  const goToNextImage = () => {
    if (selectedImage < (product.images?.length || 1) - 1) {
      setSelectedImage(prev => prev + 1);
    }
  };

  const goToPrevImage = () => {
    if (selectedImage > 0) {
      setSelectedImage(prev => prev - 1);
    }
  };

  const calculateDiscount = () => {
    if (product.regular_price && product.sale_price) {
      const regular = parseFloat(product.regular_price);
      const sale = parseFloat(product.sale_price);
      return Math.round(((regular - sale) / regular) * 100);
    }
    return 0;
  };

  const discount = calculateDiscount();

  return (
    <div className="productContainer">
      {/* Breadcrumb */}
      <nav className="breadcrumb">
        <span>الرئيسية</span> / <span>المنتجات</span> / <span>{product.categories?.[0]?.name || 'عام'}</span>
      </nav>

      <div className="productGrid">
        {/* Product Images */}
        <div className="imageSection">
          <div className="mainImageContainer"
               onTouchStart={handleTouchStart}
               onTouchMove={handleTouchMove}
               onTouchEnd={handleTouchEnd}>
            {product.images && product.images.length > 0 ? (
              <Image
                src={product.images[selectedImage]?.src || product.images[0]?.src}
                alt={product.name}
                width={600}
                height={600}
                className="mainImage"
              />
            ) : (
              <div className="mainImage" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#565959' }}>
                لا توجد صورة
              </div>
            )}

            {/* Mobile Navigation Arrows */}
            {product.images && product.images.length > 1 && (
              <>
                <button
                  className="mobileImageNav mobileImageNavPrev"
                  onClick={goToPrevImage}
                  disabled={selectedImage === 0}
                  style={{ display: selectedImage === 0 ? 'none' : 'flex' }}
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
                <button
                  className="mobileImageNav mobileImageNavNext"
                  onClick={goToNextImage}
                  disabled={selectedImage === (product.images?.length || 1) - 1}
                  style={{ display: selectedImage === (product.images?.length || 1) - 1 ? 'none' : 'flex' }}
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
              </>
            )}

            <div className="imageOverlayButtons">
              <button
                onClick={() => setIsWishlisted(!isWishlisted)}
                className={`overlayButton ${isWishlisted ? 'liked' : ''}`}
              >
                <Heart className="w-4 h-4" fill={isWishlisted ? "currentColor" : "none"} />
              </button>

              <button className="overlayButton">
                <Share2 className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Mobile Image Dots */}
          {product.images && product.images.length > 1 && (
            <div className="mobileImageDots">
              {product.images.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedImage(index)}
                  className={`imageDot ${selectedImage === index ? 'active' : ''}`}
                />
              ))}
            </div>
          )}

          {/* Desktop Thumbnails */}
          {product.images && product.images.length > 1 && (
            <div className="thumbnailGrid">
              {product.images.map((img, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedImage(index)}
                  className={`thumbnail ${selectedImage === index ? 'active' : ''}`}
                >
                  <Image
                    src={img.src}
                    alt={`صورة ${index + 1}`}
                    width={100}
                    height={100}
                    className="thumbnailImage"
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Product Info */}
        <div className="productInfo">
          <div className="productHeader">
            <h1>{product.name}</h1>

            <div className="ratingSection">
              <div className="stars">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`star ${i < Math.floor(reviewStats.average) ? 'filled' : 'empty'}`}
                  />
                ))}
                <span className="ratingValue">{reviewStats.average}</span>
              </div>
              <span className="reviewCount">({reviewStats.total} تقييم)</span>
            </div>

            <div className="priceSection">
              <span className="currentPrice">
                {product.sale_price || product.price} ريال
              </span>
              {product.regular_price && product.sale_price && (
                <>
                  <span className="originalPrice">
                    {product.regular_price} ريال
                  </span>
                  <span className="discountBadge">
                    -{discount}%
                  </span>
                </>
              )}
            </div>
          </div>

          {hasColors && (
            <div className="colorSection">
              <h3 className="sectionTitle">اللون: </h3>
              <div className="colorOptions">
                {colors.map((color, index) => (
                  <div key={index} className="colorOption" title={color}>
                    {color}
                  </div>
                ))}
              </div>
            </div>
          )}

          {hasSizes && (
            <div className="sizeSection">
              <h3 className="sectionTitle">المقاس: {selectedSize && <span style={{fontWeight: 'normal'}}>{selectedSize}</span>}</h3>
              <div className="sizeGrid">
                {sizes.map((size) => (
                  <button
                    key={size}
                    onClick={() => handleSizeChange(size)}
                    className={`sizeOption ${selectedSize === size ? 'selected' : ''}`}
                  >
                    {size}
                  </button>
                ))}
              </div>
              {showSizeError && (
                <p className="sizeError">يرجى اختيار المقاس</p>
              )}
            </div>
          )}

          {product.short_description && (
            <div className="featuresBox">
              <h3>نبذة عن المنتج</h3>
              <div dangerouslySetInnerHTML={{ __html: product.short_description }}></div>
            </div>
          )}

          {product.attributes && product.attributes.length > 0 && (
            <div className="featuresBox">
              <h3>مواصفات المنتج</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {product.attributes.slice(0, 5).map((attr, index) => (
                  <div key={index} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px' }}>
                    <span style={{ fontWeight: '700', color: '#0f1111' }}>{attr.name}:</span>
                    <span style={{ color: '#565959' }}>
                      {Array.isArray(attr.options) ? attr.options.join(', ') : attr.options}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {product.stock_status && (
            <div className="stockStatus">
              <div className={`stockDot ${
                product.stock_status === 'instock' ? 'inStock' : 'outOfStock'
              }`}></div>
              <span className={`stockText ${
                product.stock_status === 'instock' ? 'inStock' : 'outOfStock'
              }`}>
                {product.stock_status === 'instock' ? 'متوفر في المخزن' : 'غير متوفر'}
              </span>
              {product.stock_quantity && (
                <span className="stockQuantity">({product.stock_quantity} قطعة متبقية)</span>
              )}
            </div>
          )}

          <div className="shippingInfo">
            <div className="shippingGrid">
              <div className="shippingItem">
                <Truck className="shippingIcon green" />
                <span>توصيل مجاني للطلبات فوق 200 ريال</span>
              </div>
              <div className="shippingItem">
                <RotateCcw className="shippingIcon blue" />
                <span>إرجاع مجاني خلال 30 يوم</span>
              </div>
              <div className="shippingItem">
                <Shield className="shippingIcon purple" />
                <span>ضمان الجودة مضمون</span>
              </div>
            </div>
          </div>

          {/* Mobile Sticky Action Box */}
          <div className="mobileActionBox">
            <div className="mobileQuantitySection">
              <div className="mobileQuantityControls">
                <button
                  onClick={() => handleQuantityChange(-1)}
                  className="mobileQuantityButton"
                >
                  <Minus className="w-4 h-4" />
                </button>
                <span className="mobileQuantityValue">{quantity}</span>
                <button
                  onClick={() => handleQuantityChange(1)}
                  className="mobileQuantityButton"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
            </div>

            <button onClick={handleAddToCart} className="mobileAddToCartBtn">
              🛒 أضف إلى السلة
            </button>
          </div>
        </div>

        {/* Desktop Buy Box */}
        <div className="buyBox">
          <div className="buyBoxPrice">
            {product.sale_price || product.price} ريال
          </div>

          {product.regular_price && product.sale_price && (
            <div style={{marginBottom: '8px'}}>
              <span className="originalPrice" style={{fontSize: '14px'}}>
                {product.regular_price} ريال
              </span>
              <span className="discountBadge" style={{marginLeft: '8px', fontSize: '12px'}}>
                -{discount}%
              </span>
            </div>
          )}

          <div className="buyBoxShipping">
            <Truck className="w-4 h-4" />
            توصيل مجاني للطلبات فوق 200 ريال
          </div>

          <div className="buyBoxStock">
            <div className={`stockDot ${
              product.stock_status === 'instock' ? 'inStock' : 'outOfStock'
            }`}></div>
            <span className={`stockText ${
              product.stock_status === 'instock' ? 'inStock' : 'outOfStock'
            }`}>
              {product.stock_status === 'instock' ? 'متوفر في المخزن' : 'غير متوفر'}
            </span>
          </div>

          <div className="buyBoxQuantity">
            <h4>الكمية:</h4>
            <div className="quantityControls">
              <button
                onClick={() => handleQuantityChange(-1)}
                className="quantityButton"
              >
                <Minus className="w-3 h-3" />
              </button>
              <span className="quantityValue">{quantity}</span>
              <button
                onClick={() => handleQuantityChange(1)}
                className="quantityButton"
              >
                <Plus className="w-3 h-3" />
              </button>
            </div>
          </div>

          {hasSizes && (
            <div className="buyBoxSize">
              <h4>المقاس:</h4>
              <div className="sizeGrid">
                {sizes.map((size) => (
                  <button
                    key={size}
                    onClick={() => handleSizeChange(size)}
                    className={`sizeOption ${selectedSize === size ? 'selected' : ''}`}
                    style={{fontSize: '12px', padding: '6px 12px'}}
                  >
                    {size}
                  </button>
                ))}
              </div>
              {showSizeError && (
                <p className="sizeError">يرجى اختيار المقاس</p>
              )}
            </div>
          )}

          <div className="buyBoxActions">
            <button onClick={handleAddToCart} className="buyBoxAddToCart">
              🛒 أضف إلى السلة
            </button>
          </div>
        </div>
      </div>

      {/* Tabs Section */}
      <div className="tabsSection">
        <div className="tabsHeader">
          <button
            onClick={() => setActiveTab('description')}
            className={`tabButton ${activeTab === 'description' ? 'active' : ''}`}
          >
            وصف المنتج
          </button>
          <button
            onClick={() => setActiveTab('specifications')}
            className={`tabButton ${activeTab === 'specifications' ? 'active' : ''}`}
          >
            المواصفات التقنية
          </button>
          <button
            onClick={() => setActiveTab('reviews')}
            className={`tabButton ${activeTab === 'reviews' ? 'active' : ''}`}
          >
            التقييمات ({reviewStats.total})
          </button>
        </div>

        <div className="tabContent">
          {activeTab === 'description' && (
            <div className="descriptionContent">
              <h3>تفاصيل المنتج</h3>
              {product.description ? (
                <div
                  className="descriptionText"
                  dangerouslySetInnerHTML={{ __html: product.description }}
                ></div>
              ) : (
                <p style={{ color: '#565959' }}>لا يوجد وصف تفصيلي لهذا المنتج حالياً.</p>
              )}
            </div>
          )}

          {activeTab === 'specifications' && (
            <div>
              <h3 className="sectionTitle">المواصفات التقنية</h3>
              {product.attributes && product.attributes.length > 0 ? (
                <table className="specificationsTable">
                  <tbody>
                    {product.attributes.map((attr, index) => (
                      <tr key={index}>
                        <td className="specName">{attr.name}</td>
                        <td>{Array.isArray(attr.options) ? attr.options.join(', ') : attr.options}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <p style={{ color: '#565959' }}>لا توجد مواصفات تقنية متاحة لهذا المنتج.</p>
              )}
            </div>
          )}

          {activeTab === 'reviews' && (
            <div>
              <div className="reviewsHeader">
                <h3 className="reviewsTitle">تقييمات العملاء</h3>
                <button
                  className="writeReviewBtn"
                  onClick={() => setShowReviewForm(true)}
                >
                  اكتب تقييماً
                </button>
              </div>

              {reviewsError && (
                <div style={{
                  padding: '16px',
                  backgroundColor: '#fef2f2',
                  color: '#dc2626',
                  borderRadius: '8px',
                  marginBottom: '16px',
                  border: '1px solid #fecaca'
                }}>
                  {reviewsError}
                </div>
              )}

              {reviewStats.total > 0 && (
                <div className="ratingSummary">
                  <div className="summaryHeader">
                    <div className="overallRating">{reviewStats.average}</div>
                    <div>
                      <div className="summaryStars">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`star ${i < Math.floor(reviewStats.average) ? 'filled' : 'empty'}`}
                          />
                        ))}
                      </div>
                      <div className="summaryText">بناءً على {reviewStats.total} تقييم</div>
                    </div>
                  </div>

                  <div className="ratingBreakdown">
                    {[5, 4, 3, 2, 1].map((stars) => (
                      <div key={stars} className="breakdownRow">
                        <span className="breakdownStars">{stars}</span>
                        <Star className="breakdownIcon" />
                        <div style={{
                          flex: 1,
                          backgroundColor: '#e7e7e7',
                          borderRadius: '4px',
                          height: '8px'
                        }}>
                          <div
                            className="breakdownFill"
                            style={{
                              width: reviewStats.total > 0
                                ? `${(reviewStats.breakdown[stars] / reviewStats.total) * 100}%`
                                : '0%'
                            }}
                          ></div>
                        </div>
                        <span className="breakdownCount">{reviewStats.breakdown[stars] || 0}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="reviewsList">
                {reviewsLoading ? (
                  <div className="loadingReviews">
                    <div className="loadingSpinner"></div>
                    <p>جاري تحميل التقييمات...</p>
                  </div>
                ) : reviews.length > 0 ? (
                  reviews.map((review) => (
                    <div key={review.id} className="reviewItem">
                      <div className="reviewHeader">
                        <div>
                          <div className="reviewerName">
                            {review.reviewer}
                            <span className="verifiedBadge">
                              <Award className="w-3 h-3" />
                              موثق
                            </span>
                          </div>
                        </div>
                        <span className="reviewDate">{formatDate(review.date_created)}</span>
                      </div>

                      <div className="reviewRating">
                        <div className="reviewStars">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              className={`reviewStar star ${i < review.rating ? 'filled' : 'empty'}`}
                            />
                          ))}
                        </div>
                      </div>

                      <div
                        className="reviewText"
                        dangerouslySetInnerHTML={{ __html: review.review }}
                      />
                    </div>
                  ))
                ) : (
                  <div className="emptyReviews">
                    <h4>لا توجد تقييمات بعد</h4>
                    <p>كن أول من يقيم هذا المنتج</p>
                    <button
                      className="writeReviewBtn"
                      onClick={() => setShowReviewForm(true)}
                    >
                      اكتب أول تقييم
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Review Form Modal */}
      {showReviewForm && (
        <div className="reviewFormOverlay" onClick={(e) => e.target === e.currentTarget && setShowReviewForm(false)}>
          <div className="reviewFormModal">
            <div className="reviewFormHeader">
              <h3>اكتب تقييماً للمنتج</h3>
              <button
                className="reviewFormClose"
                onClick={() => setShowReviewForm(false)}
                disabled={submittingReview}
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="reviewFormContent">
              <ReviewForm
                isOpen={showReviewForm}
                onClose={() => setShowReviewForm(false)}
                onSubmit={handleReviewSubmit}
                isSubmitting={submittingReview}
                productName={product.name}
              />
            </div>
          </div>
        </div>
      )}

      {/* Related Products */}
      {!loadingRelated && relatedProducts.length > 0 && (
        <ProductSlider
          category={{
            id: product.categories[0]?.id,
            slug: product.categories[0]?.slug,
            name: `منتجات مشابهة`,
          }}
          products={relatedProducts}
        />
      )}
    </div>
  );
}