// import crypto from 'crypto'

// export function generateOAuthSignature({
//   url,
//   method = 'POST',
//   params = {},
//   consumerKey = process.env.WC_CONSUMER_KEY,
//   consumerSecret = process.env.WC_CONSUMER_SECRET,
// }) {
//   const oauthParams = {
//     oauth_consumer_key: consumerKey,
//     oauth_nonce: crypto.randomBytes(16).toString('hex'),
//     oauth_signature_method: 'HMAC-SHA1',
//     oauth_timestamp: Math.floor(Date.now() / 1000).toString(),
//     oauth_version: '1.0',
//     ...params,
//   }

//   const baseString = [
//     method.toUpperCase(),
//     encodeURIComponent(url),
//     encodeURIComponent(
//       Object.keys(oauthParams)
//         .sort()
//         .map((key) => `${encodeURIComponent(key)}=${encodeURIComponent(oauthParams[key])}`)
//         .join('&')
//     ),
//   ].join('&')

//   const signingKey = `${encodeURIComponent(consumerSecret)}&`
//   const signature = crypto
//     .createHmac('sha1', signingKey)
//     .update(baseString)
//     .digest('base64')

//   return {
//     ...oauthParams,
//     oauth_signature: signature,
//   }
// }
