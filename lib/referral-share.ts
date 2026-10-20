export const REFERRAL_BASE_URL = 'https://vijayvargiya.vercel.app'
export const REFERRAL_HOOK = '*_Grand Prize me TV, AC, Washing Machine - aisa mauka roz nahi milta, ek try toh banta hai yaar!_* 📺❄️🎁🔥'

export function getReferralUrl(referralCode: string) {
  return `${REFERRAL_BASE_URL}?ref=${encodeURIComponent(referralCode)}`
}

export function getReferralMessage(referralCode: string) {
  return `SPIN & WIN at Vijayvargiya Electronics! Register using my referral link and get a FREE SPIN. Win exciting coupons, gifts and grand prizes like LED TV, Washing Machine and FREE AC. Register now and try your luck: ${getReferralUrl(referralCode)}\n\n${REFERRAL_HOOK}`
}
