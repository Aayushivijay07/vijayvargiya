'use client'

import { useEffect, useRef, useState } from 'react'
import { ArrowRight, Copy, Gift, LayoutDashboard, Link2, Mail, MessageCircle, Monitor, MoreHorizontal, Send, Share2, Sparkles, Ticket, Users, X } from 'lucide-react'

const slices = [
  { label: 'HEADPHONES', color: '#18243d', text: '#f6d77a', image: '/images/headphones-wheel-final.png' },
  { label: 'MIXER\nGRINDER', color: '#263a58', text: '#fff', image: '/images/mixer-wheel-final.png' },
  { label: 'AIR\nCONDITIONER', color: '#123f52', text: '#d8f3ff', image: '/images/air-conditioner-wheel-replacement.png' },
  { label: 'REFRIGERATOR', color: '#1b2938', text: '#fff', image: '/images/refrigerator-wheel-replacement.png' },
  { label: 'WASHING\nMACHINE', color: '#34425a', text: '#fff0bc', image: '/images/washing-machine-wheel-replacement.png' },
  { label: 'IRON', color: '#203d5c', text: '#fff', image: '/images/iron-wheel-final.png' },
  { label: 'SPEAKER', color: '#172d46', text: '#d8f3ff', image: '/images/speaker-wheel-replacement.png' },
  { label: 'LED\nTV', color: '#8a5a08', text: '#ffe7a0', image: '/images/led-tv-wheel-replacement.png' },
  { label: 'MYSTERY\nGIFT BOX', color: '#27324a', text: '#fff4c4', image: '/images/gift-box-wheel-final.png' },
]

function BrandMark() {
  return (
  <div className="brand-mark" aria-label="Vijayvargiya Electronics">
  <span>V</span>
  <i aria-hidden="true" />
  </div>
  )
}

function PrizeWheel({ rotation, onSpin, isSpinning }: { rotation: number; onSpin: () => void; isSpinning: boolean }) {
  return (
    <div className="wheel-wrap" aria-label={isSpinning ? 'Prize wheel is spinning' : 'Click the prize wheel to spin'} role="button" tabIndex={isSpinning ? -1 : 0} onClick={onSpin} onKeyDown={(event) => { if ((event.key === 'Enter' || event.key === ' ') && !isSpinning) { event.preventDefault(); onSpin() } }}>
      <span className="sr-only">Spin the wheel to reveal a reward.</span>
      <div className="pointer" aria-hidden="true" />
      <div className="wheel" style={{ transform: `rotate(${rotation}deg)` }}>
        {slices.map((slice, index) => (
          <div
            className="wheel-slice"
            key={slice.label}
            style={{
              background: slice.color,
              color: slice.text,
              transform: `rotate(${index * 40}deg) skewY(-50deg)`,
            }}
          >
            <span style={{ transform: `skewY(50deg) rotate(20deg)` }}>
              {slice.label.split('\n').map((line) => (
                <span key={line}>{line}</span>
              ))}
            </span>
          </div>
        ))}
        <div className="wheel-labels" aria-hidden="true">
          {slices.map((slice, index) => <span className="wheel-label" key={slice.label} style={{ transform: `rotate(${index * 40 + 40}deg) translateY(max(-168px, -29vw)) rotate(${-(index * 40 + 40)}deg)`, color: slice.text }}><img src={slice.image} alt="" /><b>{slice.label.split('\n').map((line) => <span key={line}>{line}</span>)}</b></span>)}
        </div>
        <div className="wheel-center" style={{ transform: `rotate(${45 - rotation}deg)` }}><strong style={{ display: 'inline-block', transform: `rotate(${rotation - 45}deg)` }}>VE</strong></div>
      </div>
    </div>
  )
}

export default function Page() {
  const [showNotice, setShowNotice] = useState(false)
  const [isRegistered, setIsRegistered] = useState(false)
  const [customerName, setCustomerName] = useState('')
  const [mobileNumber, setMobileNumber] = useState('')
  const [wheelRotation, setWheelRotation] = useState(0)
  const [isSpinning, setIsSpinning] = useState(false)
  const [spinCount, setSpinCount] = useState(0)
  const [referralCount, setReferralCount] = useState(0)
  const [spinResult, setSpinResult] = useState('')
  const [secondSpinNotice, setSecondSpinNotice] = useState('')
  const [showReviewPopup, setShowReviewPopup] = useState(false)
  const [showResultPopup, setShowResultPopup] = useState(false)
  const [showCouponPopup, setShowCouponPopup] = useState(false)
  const [couponCopied, setCouponCopied] = useState(false)
  const [selectedCoupon, setSelectedCoupon] = useState('')
  const [lastWinningIndex, setLastWinningIndex] = useState<number | null>(null)
  const [homeShareOpen, setHomeShareOpen] = useState(false)
  const [homeShareDraft, setHomeShareDraft] = useState('')
  const [homeShareMessage, setHomeShareMessage] = useState('')
  const reviewTabOpened = useRef(false)
  const reviewPageWasHidden = useRef(false)
  const reviewPageLostFocus = useRef(false)
  const couponCelebrationAudio = useRef<HTMLAudioElement | null>(null)
  const couponCelebrationTimer = useRef<number | null>(null)

  useEffect(() => {
    const revealCouponAfterReturn = () => {
      if (reviewTabOpened.current && (reviewPageWasHidden.current || reviewPageLostFocus.current) && document.visibilityState === 'visible') {
        reviewTabOpened.current = false
        reviewPageWasHidden.current = false
        finishReviewAndShowOffer()
      }
    }
    const handleVisibilityChange = () => {
      if (reviewTabOpened.current && document.visibilityState === 'hidden') reviewPageWasHidden.current = true
      revealCouponAfterReturn()
    }
    const handleBlur = () => { if (reviewTabOpened.current) reviewPageLostFocus.current = true }
    const handleFocus = () => window.setTimeout(revealCouponAfterReturn, 150)
    window.addEventListener('blur', handleBlur)
    window.addEventListener('focus', handleFocus)
    document.addEventListener('visibilitychange', handleVisibilityChange)
    return () => {
      window.removeEventListener('blur', handleBlur)
      window.removeEventListener('focus', handleFocus)
      document.removeEventListener('visibilitychange', handleVisibilityChange)
    }
  }, [])

  useEffect(() => {
    if (!showCouponPopup) return
    const audio = new Audio('/audio/coupon-celebration.mp3')
    audio.currentTime = 0
    audio.volume = 0.78
    couponCelebrationAudio.current = audio
    void audio.play().catch(() => {})
    couponCelebrationTimer.current = window.setTimeout(() => {
      audio.pause()
      audio.currentTime = 0
    }, 5000)
    return () => {
      audio.pause()
      audio.currentTime = 0
      if (couponCelebrationTimer.current !== null) window.clearTimeout(couponCelebrationTimer.current)
      couponCelebrationAudio.current = null
    }
  }, [showCouponPopup])

  const googleSheetWebAppUrl = 'https://script.google.com/macros/s/AKfycbwzr76jFCBsMPCTysduHm-nKPP5UC_0PS2eF0E-4O9m6wyMIMNinvTOY3sSOnMojQu_Mg/exec'
  const homeReferralUrl = typeof window === 'undefined' ? 'https://vijayavargiya.in/?ref=REWARDS25' : `${window.location.origin}/?ref=REWARDS25`
  const homePromotionalMessage = `SPIN & WIN at Vijayvargiya Electronics! Register using my referral link and get a FREE SPIN. Win exciting coupons, gifts and grand prizes like LED TV, Washing Machine and FREE AC. Register now and try your luck: ${homeReferralUrl}`

  function recordReferral() {
    setReferralCount((count) => Math.min(count + 1, 5))
  }

  function openHomeShare() {
    recordReferral()
    setHomeShareDraft(homePromotionalMessage)
    setHomeShareOpen(true)
  }

  function shareHomeTo(channel: 'whatsapp' | 'facebook' | 'telegram' | 'sms' | 'email') {
    const message = encodeURIComponent(homeShareDraft || homePromotionalMessage)
    const url = encodeURIComponent(homeReferralUrl)
    const links = { whatsapp: `https://wa.me/?text=${message}`, facebook: `https://www.facebook.com/sharer/sharer.php?u=${url}`, telegram: `https://t.me/share/url?url=${url}&text=${message}`, sms: `sms:?&body=${message}`, email: `mailto:?subject=${encodeURIComponent('SPIN & WIN - Vijayvargiya Electronics')}&body=${message}` }
    window.open(links[channel], '_blank', 'noopener,noreferrer')
  }

  async function copyHomeShare() {
    await navigator.clipboard?.writeText(homeShareDraft || homePromotionalMessage)
    setHomeShareMessage('Promotional message copied.')
    window.setTimeout(() => setHomeShareMessage(''), 1800)
  }

  async function nativeHomeShare() {
    if (navigator.share) {
      await navigator.share({ title: 'SPIN & WIN - Vijayvargiya Electronics', text: homeShareDraft || homePromotionalMessage, url: homeReferralUrl })
      return
    }
    await copyHomeShare()
  }

  function finishReviewAndShowOffer() {
  reviewTabOpened.current = false
  reviewPageWasHidden.current = false
  reviewPageLostFocus.current = false
  setShowReviewPopup(false)
  setShowCouponPopup(true)
  }

  function focusPrizeWheel() {
    document.getElementById('prizes')?.scrollIntoView({ behavior: 'smooth', block: 'center' })
  }


  function spinWheel() {
    if (!isRegistered) {
      setShowNotice(true)
      return
    }
    if (isSpinning) return
    if (spinCount >= 2) {
    setSecondSpinNotice('Share it in 5 groups to get 1 more chance of spin.')
    window.setTimeout(() => setSecondSpinNotice(''), 5000)
  return
    }
    if (spinCount === 1 && referralCount < 5) {
    setSecondSpinNotice(`Share it in ${5 - referralCount} group${5 - referralCount === 1 ? '' : 's'} to get 1 more chance of spin.`)
    setHomeShareOpen(false)
    window.setTimeout(() => setSecondSpinNotice(''), 5000)
      return
    }
  const winningIndex = slices.length - 1
  const coupon = ['VE15-OFF', 'ELECTRO15', 'VIJAY15'][Math.floor(Math.random() * 3)]
  setSelectedCoupon(coupon)
  // Always land on Mystery Gift Box; keep every other page behavior unchanged.
    const targetAngle = (360 - ((wheelRotation + winningIndex * 40 + 40) % 360)) % 360
    const targetRotation = wheelRotation + 1440 + targetAngle
    setIsSpinning(true)
    // Show the Namaste message immediately when the user taps Spin and keep it
    // over the mystery box until they dismiss it or choose Rate Now.
    setShowReviewPopup(true)
    setShowResultPopup(false)
    setLastWinningIndex(winningIndex)
    setSpinCount((count) => count + 1)
    setSpinResult('The wheel is spinning')
    setWheelRotation(targetRotation)
  window.setTimeout(() => {
  setIsSpinning(false)
  setSpinResult('Your Mystery Gift Box is ready')
    // The Namaste message is already covering the wheel from the moment Spin is tapped.
  }, 4200)
  }

  return (
    <main className="rewards-page">
      <header className="site-header">
        <a className="brand" href="#top" aria-label="Vijayvargiya Electronics home">
          <img className="brand-reference-logo" src="/images/vijayvargiya-logo-final.png" alt="Vijayvargiya Electronics" />
        </a>
        <nav aria-label="Primary navigation">
          <a href="#prizes">Grand Prizes</a>
          <a href="#refer" onClick={(event) => { event.preventDefault(); document.getElementById('refer')?.scrollIntoView({ behavior: 'smooth', block: 'center' }) }}>Refer &amp; Win</a>
          <a href="#terms">Terms</a>
        </nav>
        {isRegistered ? <a className="dashboard-header-link" href={`/dashboard?name=${encodeURIComponent(customerName)}&mobile=${encodeURIComponent(mobileNumber)}&reward=${encodeURIComponent(selectedCoupon ? 'Mystery Gift Box' : '')}&coupon=${encodeURIComponent(selectedCoupon)}&spins=${spinCount}&referrals=${referralCount}`} aria-label="Open customer dashboard"><LayoutDashboard /> <span>Dashboard</span></a> : <button className="login-button" onClick={() => setShowNotice(true)}>Login / Register</button>}
      </header>

      <section className="hero" id="top">
        <div className="hero-copy">
          <div className="eyebrow"><Sparkles size={15} /> VIJAYVARGIYA ELECTRONICS REWARDS</div>
          <h1><span>SPIN.</span><em>WIN.</em><span>SHOP</span><span>SMARTER!</span></h1>
          <p>Discover exclusive shopping coupons, exciting electronics rewards,<br className="desktop-break" /> and premium grand prizes from Vijayvargiya Electronics.</p>
          <div className="hero-actions">
            <button className="primary-action" onClick={() => { if (window.matchMedia('(min-width: 721px)').matches) spinWheel(); else focusPrizeWheel() }} disabled={isSpinning} aria-label={isSpinning ? 'Wheel is spinning' : 'Spin the prize wheel'}>{isSpinning ? 'Spinning…' : 'Spin Now'} <ArrowRight size={20} /></button>
            <button type="button" className="secondary-action" onClick={() => { recordReferral(); setHomeShareDraft(homePromotionalMessage); setHomeShareOpen(true) }} aria-haspopup="dialog" aria-controls="home-share-title"><Users size={20} /> Refer &amp; Win</button>
          </div>
        </div>

        <div className="hero-visual" id="prizes">
          <div className="reward-tag tv-tag"><Monitor size={18} /> LED TV DRAW ENTRY</div>
          <PrizeWheel rotation={wheelRotation} onSpin={spinWheel} isSpinning={isSpinning} />
          {secondSpinNotice && <div className="spin-status" role="status">{secondSpinNotice}</div>}<span className="sr-only" aria-live="polite">{spinResult || secondSpinNotice}</span>
          <div className="reward-tag ac-tag"><Gift size={18} /> FREE AC GRAND PRIZE</div>
        </div>
      </section>

      <section className="below-fold" id="refer"><span>Share the rewards. Win more together.</span><span className="referral-progress">Referral progress: {referralCount}/5</span><span id="terms">Terms apply to eligible purchases.</span></section>

      <section className="how-it-works" aria-labelledby="how-it-works-title">
        <div className="reward-ticker" aria-label="Rewards highlights">
          <div className="ticker-track"><span>SMART LED TV</span><i>◆</i><span>WASHING MACHINE</span><i>◆</i><span>SPIN. WIN. SHOP SMARTER!</span><i>◆</i><span>INSTANT COUPONS</span><i>◆</i><span>REFER &amp; UNLOCK WHEEL 2</span><i>◆</i><span>SMART LED TV</span></div>
        </div>
        <div className="steps-content">
          <p className="section-eyebrow">HOW IT WORKS</p>
          <h2 id="how-it-works-title">Three steps to your reward</h2>
          <div className="step-grid">
            <article className="step-card"><div className="step-icon"><Ticket size={25} /></div><h3>Register Free</h3><p>Create your account with name &amp; mobile number. Wheel 1 unlocks instantly with a free spin.</p></article>
            <article className="step-card"><div className="step-icon"><Sparkles size={25} /></div><h3>Spin Wheel 1</h3><p>Win genuine shopping coupons and gifts — discount caps and minimum purchase shown upfront.</p></article>
            <article className="step-card"><div className="step-icon"><Users size={25} /></div><h3>Refer &amp; Unlock Wheel 2</h3><p>Share your unique link. When your friend&apos;s purchase is verified at the store, the Referral Rewards Wheel unlocks — with LED TV, Washing Machine &amp; FREE AC draw entries.</p></article>
          </div>
        </div>
      </section>

      <section className="grand-prizes" id="grand-prizes" aria-labelledby="grand-prizes-title">
        <div className="prizes-content">
          <p className="section-eyebrow">MEGA ELECTRONICS GRAND PRIZES</p>
          <h2 id="grand-prizes-title">Grand Prize <em>Draw Entries</em></h2>
          <p className="prizes-intro">Win a draw entry on the Referral Rewards Wheel. A draw entry is a chance to win the appliance in the campaign draw — it is not a guaranteed win. Campaign: 2026-07-01 to 2026-09-30.</p>
          <div className="prize-grid">
            <article className="prize-card"><div className="prize-image"><img src="/images/prize-led-tv.png" alt="Smart LED television in a modern living room" /><span>♜ LED TV GRAND PRIZE</span></div><div className="prize-copy"><h3>55&quot; Ultra HD Smart 4K LED TV</h3><p>Suggested eligibility: qualifying purchase of ₹49,999+ gives a draw entry via the Referral Rewards Wheel. Winner selected in the campaign draw.</p></div></article>
            <article className="prize-card"><div className="prize-image"><img src="/images/prize-washing-machine.png" alt="Front-load washing machine in a bright utility room" /><span>♜ WASHING MACHINE GRAND PRIZE</span></div><div className="prize-copy"><h3>Front-Load Smart Inverter Washing Machine</h3><p>Suggested eligibility: qualifying purchase of ���29,999+ gives a draw entry via the Referral Rewards Wheel. Winner selected in the campaign draw.</p></div></article>
            <article className="prize-card"><div className="prize-image"><img src="/images/prize-ac.png" alt="White split air conditioner close-up" /><span>♜ FREE AC GRAND PRIZE</span></div><div className="prize-copy"><h3>1.5 Ton 5-Star Dual Inverter Air Conditioner</h3><p>Suggested eligibility: qualifying purchase of ₹59,999+ gives a draw entry via the Referral Rewards Wheel. Winner selected in the campaign draw.</p></div></article>
          </div>
        </div>
      </section>

      <section className="referral-section" id="referral" aria-labelledby="referral-title">
        <div className="referral-content">
          <div className="referral-copy">
            <p className="section-eyebrow">REFER &amp; WIN</p>
            <h2 id="referral-title">Share your link.<br />Unlock the <em>Grand Prize Wheel.</em></h2>
            <p>Every registered customer gets a unique referral link. Share it in your WhatsApp groups and with friends — when a friend registers through your link and their store purchase is verified, Wheel 2 unlocks for you with draw entries for the LED TV, Washing Machine and FREE AC.</p>
            <button className="primary-action">Get My Referral Link <ArrowRight size={20} /></button>
          </div>
          <div className="referral-steps">
            <article><strong>01</strong><div><h3>Copy your unique link</h3><p>Your personal /ref/YOUR-CODE link is ready in your dashboard.</p></div></article>
            <article><strong>02</strong><div><h3>Share it everywhere</h3><p>WhatsApp groups, family, friends — one tap share.</p></div></article>
            <article><strong>03</strong><div><h3>Friend registers &amp; shops</h3><p>They register via your link and make a qualifying purchase.</p></div></article>
            <article><strong>04</strong><div><h3>Store verifies — Wheel 2 unlocks</h3><p>Verified referral = spin on the Referral Rewards Wheel.</p></div></article>
          </div>
        </div>
      </section>

      <footer className="campaign-footer">
        <div className="footer-content">
          <div className="footer-brand">
            <h2>VIJAYVARGIYA ELECTRONICS</h2>
            <p>Promotional rewards campaign. All prizes subject to terms,<br />availability and verification. Draw entries are chances to win — not<br />guaranteed prizes.</p>
          </div>
          <nav className="footer-links" aria-label="Footer navigation">
            <a href="#grand-prizes">Grand Prizes</a><a href="#terms">Terms &amp; Conditions</a>
            <a href="#referral">Refer &amp; Win</a><a href="#admin">Store Admin</a>
          </nav>
        </div>
      </footer>

      {showCouponPopup && <div className="review-overlay coupon-overlay">
    <div className={`coupon-popup`} role="dialog" aria-modal="true" aria-labelledby="coupon-title">
      <button className="review-close" onClick={() => setShowCouponPopup(false)} aria-label="Close coupon offer"><X size={18} /></button>
      <div className="coupon-brand">VIJAYVARGIYA ELECTRONICS</div>
<div className="coupon-gift-art"><img src="/images/wheel-mystery-gift.png" alt="Mystery gift box" /></div>
  <h2 id="coupon-title">CONGRATULATIONS!</h2>
  <p className="coupon-unlocked">YOU UNLOCKED A MYSTERY REWARD!</p>
  <div className="coupon-value">GET 15% OFF</div>
  <div className="coupon-code"><span>Your Exclusive Coupon</span><strong>{selectedCoupon || 'VE15-OFF'}</strong><button onClick={async () => { await navigator.clipboard?.writeText(selectedCoupon || 'VE15-OFF'); setCouponCopied(true); window.setTimeout(() => setCouponCopied(false), 1800) }}>{couponCopied ? 'Copied' : 'Copy'}</button></div>
  <p className="coupon-terms"><b>Maximum discount:</b> ₹1,000<br /><b>Minimum purchase:</b> ₹3,999<br /><b>Applicable products:</b> Eligible electronic appliances only.</p>
  <a className="primary-action review-action coupon-claim-link" href="https://share.google/b7pcfXz9ZVC9BtnxQ" target="_blank" rel="noreferrer" onClick={() => setShowCouponPopup(false)}>CLAIM YOUR COUPON <ArrowRight size={18} /></a>
  <span className="coupon-store-note">Visit store to claim</span>
    </div>
  </div>}

  {showResultPopup && lastWinningIndex !== null && <div className={`review-popup result-popup`} role="dialog" aria-modal="true" aria-labelledby="result-title">
        <button className="review-close" onClick={() => setShowResultPopup(false)} aria-label="Close winning result"><X size={18} /></button>
        <div className="review-badge">WIN</div>
        <h2 id="result-title">Congratulations!</h2>
        <p>Your spin result is ready.</p>
        <div className="winning-prize">{slices[lastWinningIndex].label.replaceAll('\\n', ' ')}</div>
        <p className="result-note">Please show this result at the store to claim the applicable reward.</p>
        <button className="primary-action review-action" onClick={() => setShowResultPopup(false)}>Continue <ArrowRight size={18} /></button>
      </div>}

      {showReviewPopup && (
        <div className="review-overlay">
        <div className={`review-popup`} role="dialog" aria-modal="true" aria-labelledby="review-title">
        <div className="review-popup-content">
        <button className="review-close" onClick={finishReviewAndShowOffer} aria-label="Close review message"><X size={18} /></button>
 <h2 id="review-title">Namaste! Aapka Pyaar, Hamare 25 Saal Ke Safar Ki Sabse Badi Jeet!</h2>
 <p className="review-intro-message">25 saal ka yeh safar sirf hamare business ka nahi, balki aapke bharose, pyaar aur apnepan ki ek khoobsurat kahani hai.</p>
 <p className="review-rating-message">Is khaas mauke par, hum chahte hain ki hamari khushiyon mein aap bhi shaamil hon! Apna feedback dekar hamare 25 Years Celebration ka hissa banein!</p>
 <p className="review-rating-message">Feedback (rating) dene wale sabhi participants mein se 5 lucky winners ko <strong>4K UHD TV</strong> jeetne ka shandaar mauka milega!</p>
 <p className="review-thank-you">Aapke saath aur bharose ke liye dil se dhanyavaad!</p>
        <a className="primary-action review-action" href="https://search.google.com/local/writereview?placeid=ChIJGaDOL6-0bTkRb3r1tysc224" target="_blank" rel="noreferrer" onClick={() => { reviewTabOpened.current = true; reviewPageWasHidden.current = false; reviewPageLostFocus.current = false }}>Rate Now <ArrowRight size={18} /></a>
        <button className="review-complete-button" onClick={finishReviewAndShowOffer}>I&apos;ve completed the review</button>
        </div>
        </div>
        </div>
      )}

      {homeShareOpen && <div className="share-overlay" role="presentation" onClick={() => setHomeShareOpen(false)}>
        <section className="share-modal" role="dialog" aria-modal="true" aria-labelledby="home-share-title" onClick={(event) => event.stopPropagation()}>
          <button className="share-close" onClick={() => setHomeShareOpen(false)} aria-label="Close sharing popup"><X /></button>
          <div className="share-banner"><p>VIJAYVARGIYA ELECTRONICS</p><h2 id="home-share-title">SPIN &amp; WIN!</h2><strong>Exciting Rewards Are Waiting for You!</strong><span>Get a FREE SPIN and unlock your chance to win exciting coupons, gifts, and grand prizes.</span><div><b>LED TV</b><b>Washing Machine</b><b>FREE AC</b></div></div>
          <label className="share-label" htmlFor="home-share-message">Your share message</label>
          <textarea id="home-share-message" value={homeShareDraft} onChange={(event) => setHomeShareDraft(event.target.value)} />
          <div className="share-actions"><button onClick={() => shareHomeTo('whatsapp')}><MessageCircle /> WhatsApp</button><button onClick={() => shareHomeTo('facebook')}><Share2 /> Facebook</button><button onClick={() => shareHomeTo('telegram')}><Send /> Telegram</button><button onClick={() => shareHomeTo('sms')}><MessageCircle /> SMS</button><button onClick={() => shareHomeTo('email')}><Mail /> Email</button><button onClick={nativeHomeShare}><MoreHorizontal /> More options</button></div>
          <div className="share-copy-actions"><button onClick={copyHomeShare}><Copy /> Copy message</button><button onClick={() => { navigator.clipboard?.writeText(homeReferralUrl); setHomeShareMessage('Referral link copied.') }}><Link2 /> Copy link</button></div>
          {homeShareMessage && <p className="share-success" role="status">{homeShareMessage}</p>}
        </section>
      </div>}

      {showNotice && <div className="notice" role="dialog" aria-modal="true" aria-labelledby="register-title">
        <button className="notice-close" onClick={() => setShowNotice(false)} aria-label="Close"><X size={18} /></button>
        <Gift size={28} />
        <h2 id="register-title">Register before you spin</h2>
        <p>Create your free account to unlock Wheel 1 and claim your reward.</p>
        <form onSubmit={async (event) => {
    event.preventDefault()
    const name = customerName.trim()
    const mobile = mobileNumber.replace(/\D/g, '').slice(0, 10)
    if (!name || mobile.length !== 10) return

    setMobileNumber(mobile)
    setIsRegistered(true)
    setShowNotice(false)
    setSpinResult(`Welcome ${name}! Your free spin is unlocked.`)

    try {
      await fetch(googleSheetWebAppUrl, {
        method: 'POST',
        mode: 'no-cors',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, mobile, registeredAt: new Date().toISOString() }),
      })
    } catch {
      // Registration stays unlocked; the Apps Script request can be retried by the user.
    }
  }}>
          <label htmlFor="customer-name">Full name</label>
          <input id="customer-name" value={customerName} onChange={(event) => setCustomerName(event.target.value)} placeholder="Enter your name" required />
          <label htmlFor="customer-mobile">Mobile number</label>
          <input id="customer-mobile" type="tel" inputMode="numeric" pattern="[0-9]{10}" maxLength={10} value={mobileNumber} onChange={(event) => setMobileNumber(event.target.value.replace(/\\D/g, '').slice(0, 10))} placeholder="10-digit mobile number" required />
          <button className="primary-action" type="submit">Register &amp; Unlock <ArrowRight size={18} /></button>
        </form>
      </div>}
    </main>
  )
}
