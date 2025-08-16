import { NextResponse } from 'next/server'
import woocommerceApi from '@/lib/woocommerce'
import { cookies } from 'next/headers'
import jwt from 'jsonwebtoken'

const secret = process.env.JWT_SECRET || 'your-secret-key'

export async function POST(request) {
  try {
    const body = await request.json()
    const cookieStore = cookies()
    const token = cookieStore.get('token')?.value

    let customerId = null

    if (token) {
      try {
        const payload = jwt.verify(token, secret)
        customerId = payload.customer_id || null
        console.log('🧾 using customer_id from token:', customerId)
      } catch (err) {
        console.warn('⚠️ JWT verification failed:', err.message)
      }
    }

    const orderData = {
      payment_method: 'cod',
      payment_method_title: 'الدفع عند الاستلام',
      set_paid: false,
      billing: {
        address_1: body.address,
        city: body.city,
        state: body.state,
        postcode: body.postcode,
        country: body.country
      },
      shipping: {
        address_1: body.address,
        city: body.city,
        state: body.state,
        postcode: body.postcode,
        country: body.country
      },
      line_items: body.cartItems.map(item => ({
        product_id: item.id,
        quantity: item.quantity
      })),
      ...(customerId && { customer_id: customerId }) // ✅ من التوكن مباشرة
    }

    const { data } = await woocommerceApi.post('orders', orderData)

    return NextResponse.json(data, { status: 200 })
  } catch (error) {
    console.error('❌ Woo Error:', error.response?.data || error.message)
    return NextResponse.json(
      { error: '⚠️ فشل في إنشاء الطلب من WooCommerce.' },
      { status: 500 }
    )
  }
}
