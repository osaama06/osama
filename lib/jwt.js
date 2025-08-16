import jwt from 'jsonwebtoken'

const secret = process.env.JWT_SECRET || '@#Yt5$Dsdg6@!#dfghASD987@#Yt5$Dsdg6@!#dfghASD987'

export function verifyJwt(token) {
  return jwt.verify(token, secret)
}
