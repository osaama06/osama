// app/api/reviews/route.js
import { NextResponse } from 'next/server';

// إرسال تقييم جديد
export async function POST(request) {
  try {
    const { product_id, rating, comment, reviewer_name, reviewer_email } = await request.json();

    // التحقق من البيانات المطلوبة
    if (!product_id || !rating || !comment || !reviewer_name || !reviewer_email) {
      return NextResponse.json(
        { error: 'جميع الحقول مطلوبة' },
        { status: 400 }
      );
    }

    // التحقق من صحة التقييم
    if (rating < 1 || rating > 5) {
      return NextResponse.json(
        { error: 'التقييم يجب أن يكون بين 1 و 5' },
        { status: 400 }
      );
    }

    // التحقق من البريد الإلكتروني
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(reviewer_email)) {
      return NextResponse.json(
        { error: 'البريد الإلكتروني غير صحيح' },
        { status: 400 }
      );
    }

    const consumerKey = process.env.WOO_CONSUMER_KEY;
    const secretKey = process.env.WOO_SECRET_KEY;
    const baseUrl = process.env.WOO_URL;

    if (!consumerKey || !secretKey || !baseUrl) {
      return NextResponse.json(
        { error: 'خطأ في إعدادات الخادم' },
        { status: 500 }
      );
    }

    const auth = Buffer.from(`${consumerKey}:${secretKey}`).toString('base64');

    // إرسال التقييم إلى WooCommerce
    const response = await fetch(`${baseUrl}/wp-json/wc/v3/products/reviews`, {
      method: 'POST',
      headers: {
        'Authorization': `Basic ${auth}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        product_id: parseInt(product_id),
        review: comment,
        reviewer: reviewer_name,
        reviewer_email: reviewer_email,
        rating: parseInt(rating),
        status: 'approved' // تغيير من 'hold' إلى 'approved' للنشر الفوري
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('خطأ WooCommerce:', errorData);

      // إذا فشل النشر المباشر، جرب مع hold
      const fallbackResponse = await fetch(`${baseUrl}/wp-json/wc/v3/products/reviews`, {
        method: 'POST',
        headers: {
          'Authorization': `Basic ${auth}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          product_id: parseInt(product_id),
          review: comment,
          reviewer: reviewer_name,
          reviewer_email: reviewer_email,
          rating: parseInt(rating),
          status: 'hold'
        }),
      });

      if (!fallbackResponse.ok) {
        return NextResponse.json(
          { error: 'فشل في إرسال التقييم' },
          { status: response.status }
        );
      }

      const fallbackData = await fallbackResponse.json();
      return NextResponse.json({
        ...fallbackData,
        message: 'تم إرسال تقييمك بنجاح وهو في انتظار المراجعة'
      });
    }

    const reviewData = await response.json();

    return NextResponse.json({
      ...reviewData,
      message: 'تم نشر تقييمك بنجاح!'
    });

  } catch (error) {
    console.error('خطأ في API التقييمات:', error);
    return NextResponse.json(
      { error: 'حدث خطأ في الخادم' },
      { status: 500 }
    );
  }
}

// جلب التقييمات لمنتج محدد
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const productId = searchParams.get('product_id');
    const page = searchParams.get('page') || 1;
    const per_page = searchParams.get('per_page') || 10;
    const include_pending = searchParams.get('include_pending') === 'true';

    if (!productId) {
      return NextResponse.json(
        { error: 'معرف المنتج مطلوب' },
        { status: 400 }
      );
    }

    const consumerKey = process.env.WOO_CONSUMER_KEY;
    const secretKey = process.env.WOO_SECRET_KEY;
    const baseUrl = process.env.WOO_URL;

    if (!consumerKey || !secretKey || !baseUrl) {
      return NextResponse.json(
        { error: 'خطأ في إعدادات الخادم' },
        { status: 500 }
      );
    }

    const auth = Buffer.from(`${consumerKey}:${secretKey}`).toString('base64');

    // جلب التقييمات المعتمدة
    const approvedResponse = await fetch(
      `${baseUrl}/wp-json/wc/v3/products/reviews?product=${productId}&status=approved&page=${page}&per_page=${per_page}&orderby=date&order=desc`,
      {
        headers: {
          'Authorization': `Basic ${auth}`,
          'Content-Type': 'application/json',
        },
        next: {
          revalidate: 60, // دقيقة واحدة
          tags: [`reviews-${productId}`]
        },
      }
    );

    if (!approvedResponse.ok) {
      throw new Error(`HTTP ${approvedResponse.status}`);
    }

    let reviews = await approvedResponse.json();

    // إضافة التقييمات المعلقة إذا طُلب ذلك
    if (include_pending) {
      try {
        const pendingResponse = await fetch(
          `${baseUrl}/wp-json/wc/v3/products/reviews?product=${productId}&status=hold&page=1&per_page=20&orderby=date&order=desc`,
          {
            headers: {
              'Authorization': `Basic ${auth}`,
              'Content-Type': 'application/json',
            },
          }
        );

        if (pendingResponse.ok) {
          const pendingReviews = await pendingResponse.json();
          // إضافة علامة للتقييمات المعلقة
          const markedPendingReviews = pendingReviews.map(review => ({
            ...review,
            status: 'pending',
            isPending: true
          }));
          reviews = [...markedPendingReviews, ...reviews];
        }
      } catch (error) {
        console.log('لم يتم جلب التقييمات المعلقة:', error);
      }
    }

    // إحصائيات التقييمات (فقط المعتمدة)
    const approvedReviews = reviews.filter(r => r.status !== 'pending');
    const totalReviews = approvedReviews.length;
    const averageRating = totalReviews > 0
      ? (approvedReviews.reduce((sum, review) => sum + review.rating, 0) / totalReviews).toFixed(1)
      : 0;

    return NextResponse.json({
      reviews,
      stats: {
        total: totalReviews,
        average: parseFloat(averageRating),
        breakdown: {
          5: approvedReviews.filter(r => r.rating === 5).length,
          4: approvedReviews.filter(r => r.rating === 4).length,
          3: approvedReviews.filter(r => r.rating === 3).length,
          2: approvedReviews.filter(r => r.rating === 2).length,
          1: approvedReviews.filter(r => r.rating === 1).length,
        }
      }
    });

  } catch (error) {
    console.error('خطأ في جلب التقييمات:', error);
    return NextResponse.json(
      { error: 'فشل في جلب التقييمات' },
      { status: 500 }
    );
  }
}