'use client'

import { useSearchParams } from 'next/navigation'
import { Suspense, useState } from 'react'
import { ArrowUpRight, Copy, Gift, History, Link2, LogOut, Mail, Menu, MessageCircle, MoreHorizontal, Pencil, Send, Share2, Sparkles, Trophy, UserRound, X } from 'lucide-react'

const spins = [
  { reward: '25% OFF Coupon', date: 'Today, 10:42 AM', status: 'Claimed' },
  { reward: '₹1,000 OFF Coupon', date: '18 Sep 2026, 4:12 PM', status: 'Used' },
  { reward: 'Free LED Bulb', date: '12 Sep 2026, 12:08 PM', status: 'Expired' },
]

function DashboardContent() {
  const searchParams = useSearchParams()
  const [copied, setCopied] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const [shareMessage, setShareMessage] = useState('')
  const [shareOpen, setShareOpen] = useState(false)
  const [shareDraft, setShareDraft] = useState('')
  const [profileEditOpen, setProfileEditOpen] = useState(false)
  const [editedName, setEditedName] = useState('')
  const [editedMobile, setEditedMobile] = useState('')
  const [profileMessage, setProfileMessage] = useState('')
  const [referralCount, setReferralCount] = useState(0)
  const referralTarget = 5
  const referralPercent = Math.round((referralCount / referralTarget) * 100)
  const customerName = searchParams.get('name') || 'Customer'
  const customerMobile = searchParams.get('mobile') || 'Mobile number not provided'
  const rewardName = searchParams.get('reward') || ''
  const rewardCoupon = searchParams.get('coupon') || ''
  const hasReward = Boolean(rewardName)
  const firstName = customerName.trim().split(/\s+/)[0] || 'Customer'
  const initials = customerName.trim().split(/\s+/).map((part) => part[0]).join('').slice(0, 2).toUpperCase() || 'C'
  const referralCode = firstName.toUpperCase().replace(/[^A-Z0-9]/g, '').slice(0, 8) || 'CUSTOMER'
  const referralLink = `vijayavargiya.in/ref/${referralCode}25`

  const referralUrl = `https://vijayavargiya.in/?ref=${encodeURIComponent(referralCode + '25')}`
  const promotionalMessage = `🎉 SPIN & WIN at Vijayavargiya Electronics! 🎁\n\n🔥 Register using my referral link and get a FREE SPIN! 🎡\n\n🎁 Win exciting coupons, amazing gifts & GRAND PRIZES like 📺 LED TV, 🧺 Washing Machine & ❄️ FREE AC!\n\n😍 Don’t miss your chance to win big! Share the excitement with your friends and family! 🎊\n\n👇 REGISTER NOW & TRY YOUR LUCK! 🍀\n🔗 ${referralUrl}`
  const shareText = promotionalMessage

  function openSharePopup() {
    setShareDraft(promotionalMessage)
    setShareOpen(true)
  }

  function openProfileEditor() {
    setEditedName(customerName === 'Customer' ? '' : customerName)
    setEditedMobile(customerMobile === 'Mobile number not provided' ? '' : customerMobile)
    setProfileEditOpen(true)
  }

  async function saveProfile(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const name = editedName.trim()
    const mobile = editedMobile.replace(/\D/g, '').slice(0, 10)
    if (name.length < 2 || mobile.length !== 10) {
      setProfileMessage('Please enter a valid name and 10-digit mobile number.')
      return
    }
    try {
      await fetch('https://script.google.com/macros/s/AKfycbwIx8d0nkp0QSOSmQp54Ztm_04Qg10jztTJoMy6ujlW-3Fiiv-oGeLATMMczUIDEHkWAw/exec', {
        method: 'POST',
        mode: 'no-cors',
        headers: { 'Content-Type': 'text/plain;charset=utf-8' },
        body: JSON.stringify({ action: 'update', name, mobile, previousName: customerName, previousMobile: customerMobile }),
      })
      setProfileMessage('Profile updated. Your Google Sheet will be updated.')
      setProfileEditOpen(false)
    } catch {
      setProfileMessage('Could not save right now. Please try again.')
    }
  }

  async function copyCoupon() {
    if (!rewardCoupon) return
    await navigator.clipboard?.writeText(rewardCoupon)
    setCopied(true)
    window.setTimeout(() => setCopied(false), 1800)
  }

  async function copyReferralMessage() {
    await navigator.clipboard?.writeText(shareDraft || promotionalMessage)
    setShareMessage('Promotional message copied.')
    window.setTimeout(() => setShareMessage(''), 1800)
  }

  async function nativeShare() {
    if (navigator.share) {
      await navigator.share({ title: 'SPIN & WIN - Vijayavargiya Electronics', text: shareDraft || promotionalMessage, url: referralUrl })
      return
    }
    await copyLink()
  }

  function shareTo(channel: 'whatsapp' | 'facebook' | 'telegram' | 'sms' | 'email') {
    const message = encodeURIComponent(shareDraft || promotionalMessage)
    const url = encodeURIComponent(referralUrl)
    const links = {
      whatsapp: `https://wa.me/?text=${message}`,
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${url}`,
      telegram: `https://t.me/share/url?url=${url}&text=${message}`,
      sms: `sms:?&body=${message}`,
      email: `mailto:?subject=${encodeURIComponent('SPIN & WIN - Vijayavargiya Electronics')}&body=${message}`,
    }
    window.open(links[channel], '_blank', 'noopener,noreferrer')
  }

  async function copyLink() {
    await navigator.clipboard?.writeText(referralUrl)
    setCopied(true)
    window.setTimeout(() => setCopied(false), 1800)
  }

  async function shareReferral() {
    if (navigator.share) {
      await navigator.share({ title: 'Vijayavargiya Electronics Rewards', text: shareText, url: referralUrl })
      return
    }
    await copyLink()
    setShareMessage('Referral link copied. Share it on WhatsApp, Bluetooth, or any app from your phone.')
    window.setTimeout(() => setShareMessage(''), 3200)
  }

  return (
    <main className="dashboard-page">
      <aside className={`dashboard-sidebar ${menuOpen ? 'is-open' : ''}`}>
        <div className="dashboard-logo"><span className="dashboard-brand-logo" aria-label="Vijayavargiya Electronics"><strong>VIJAYAVARGIYA</strong><small>ELECTRONICS</small></span></div>
        <button className="dashboard-close" onClick={() => setMenuOpen(false)} aria-label="Close menu"><X /></button>
        <nav className="dashboard-nav" aria-label="Dashboard navigation">
          <a className="active" href="#overview"><Sparkles /> Overview</a>
          <a href="#rewards"><Gift /> My Rewards</a>
          <a href="#referrals"><Share2 /> Referrals</a>
          <a href="#history"><History /> Spin History</a>
          <a href="#profile"><UserRound /> Profile</a>
        </nav>
        <button className="dashboard-logout"><LogOut /> Log out</button>
      </aside>
      {menuOpen && <button className="dashboard-scrim" onClick={() => setMenuOpen(false)} aria-label="Close navigation" />}

      <section className="dashboard-main" id="overview">
        <header className="dashboard-header">
          <a className="dashboard-back" href="/" aria-label="Back to rewards page">← Back</a>
          <button className="dashboard-menu" onClick={() => setMenuOpen(true)} aria-label="Open menu"><Menu /></button>
          <div><p className="dashboard-kicker">CUSTOMER DASHBOARD</p><h1>Namaste, {firstName}.</h1><p className="dashboard-subtitle">Your rewards, referrals and lucky spins — all in one place.</p></div>
          <div className="dashboard-avatar">{initials}</div>
        </header>

        <div className="dashboard-stats">
          <article><span className="stat-icon gold"><Trophy /></span><div><small>Total rewards</small><strong>03</strong></div></article>
          <article><span className="stat-icon purple"><Gift /></span><div><small>Available coupon</small><strong>01</strong></div></article>
          <article><span className="stat-icon blue"><Share2 /></span><div><small>Successful referrals</small><strong>02</strong></div></article>
        </div>

        <div className="dashboard-grid">
          <article className="dashboard-card reward-card" id="rewards">
            <div className="card-heading"><div><p className="dashboard-kicker">LATEST WIN</p><h2>{hasReward ? 'Your reward is ready' : 'Nothing won yet'}</h2></div>{hasReward && <span className="live-pill">ACTIVE</span>}</div>
            {hasReward ? <>
              <div className="reward-highlight"><div className="reward-gift"><Gift /></div><div><strong>{rewardName}</strong><span>Customer&apos;s latest wheel reward</span></div><button aria-label="View reward"><ArrowUpRight /></button></div>
              <div className="coupon-code"><span>Coupon code</span><strong>{rewardCoupon || 'Not available'}</strong><button onClick={copyCoupon} aria-label="Copy coupon code" disabled={!rewardCoupon}><Copy /></button></div>
            </> : <p className="card-description">Spin the wheel to win a reward. Your winning gift and coupon code will appear here.</p>}
          </article>

          <article className="dashboard-card referral-card" id="referrals">
            <div className="card-heading"><div><p className="dashboard-kicker">REFER &amp; WIN</p><h2>Unlock Wheel 2</h2></div><Share2 className="heading-icon" /></div>
            <p className="card-description">Invite {Math.max(referralTarget - referralCount, 0)} more friend{referralTarget - referralCount === 1 ? '' : 's'} to unlock Wheel 2 and grand prize draw entries.</p>
            <div className="progress-row"><span>{referralCount} of {referralTarget} referrals</span><strong>{referralPercent}%</strong></div><div className="progress-track"><span style={{ width: `${referralPercent}%` }} /></div>
            <div className="referral-link"><Link2 /><span>{referralUrl}</span><button onClick={copyLink}>{copied ? 'Copied' : 'Copy'}</button></div>
            <button className="share-referral-button" onClick={() => { setReferralCount((count) => Math.min(count + 1, referralTarget)); openSharePopup() }}><Share2 /> Refer &amp; Win <ArrowUpRight /></button>
            {shareMessage && <p className="share-message" role="status">{shareMessage}</p>}
          </article>
        </div>

        <section className="dashboard-card history-card" id="history">
          <div className="card-heading"><div><p className="dashboard-kicker">ACTIVITY</p><h2>Spin history</h2></div><a href="#history">View all <ArrowUpRight /></a></div>
          <div className="history-list">{hasReward ? <div className="history-row" key={`${rewardName}-latest`}><span className="history-gift"><Gift /></span><div><strong>{rewardName}</strong><small>Latest spin</small></div><span className="history-status claimed">Claimed</span></div> : <div className="history-empty"><Gift /><strong>No spins yet</strong><span>Your won rewards will appear here after you spin the wheel.</span></div>}</div>
        </section>

        <section className="dashboard-card profile-card" id="profile">
          <div className="profile-heading"><span className="profile-avatar">{initials}</span><div><p className="dashboard-kicker">REGISTERED CUSTOMER</p><h2>{customerName}</h2><span>{customerMobile}</span></div><button onClick={openProfileEditor}><Pencil /> Edit profile</button></div>
          <div className="profile-details"><span>Member since <strong>September 2026</strong></span><span>Registration status <strong className="verified">Verified</strong></span></div>
        </section>
      </section>
      {profileMessage && <p className="profile-save-message" role="status">{profileMessage}</p>}
      {profileEditOpen && <div className="share-overlay" role="presentation" onClick={() => setProfileEditOpen(false)}>
        <section className="profile-edit-modal" role="dialog" aria-modal="true" aria-labelledby="profile-edit-title" onClick={(event) => event.stopPropagation()}>
          <button className="share-close" onClick={() => setProfileEditOpen(false)} aria-label="Close profile editor"><X /></button>
          <p className="dashboard-kicker">PROFILE SETTINGS</p><h2 id="profile-edit-title">Update your details</h2><p>Changes are saved to your registration record.</p>
          <form onSubmit={saveProfile} className="profile-edit-form"><label htmlFor="profile-name">Full name</label><input id="profile-name" value={editedName} onChange={(event) => setEditedName(event.target.value)} required /><label htmlFor="profile-mobile">Mobile number</label><input id="profile-mobile" inputMode="numeric" maxLength={10} value={editedMobile} onChange={(event) => setEditedMobile(event.target.value.replace(/\\D/g, ''))} required /><button className="share-referral-button" type="submit">Save changes</button></form>
        </section>
      </div>}
      {shareOpen && <div className="share-overlay" role="presentation" onClick={() => setShareOpen(false)}>
        <section className="share-modal" role="dialog" aria-modal="true" aria-labelledby="share-title" onClick={(event) => event.stopPropagation()}>
          <button className="share-close" onClick={() => setShareOpen(false)} aria-label="Close sharing popup"><X /></button>
          <div className="share-banner"><p>VIJAYAVARGIYA ELECTRONICS</p><h2 id="share-title">SPIN &amp; WIN!</h2><strong>Exciting Rewards Are Waiting for You!</strong><span>Get a FREE SPIN and unlock your chance to win exciting coupons, gifts, and grand prizes.</span><div><b>LED TV</b><b>Washing Machine</b><b>FREE AC</b></div></div>
          <label className="share-label" htmlFor="share-message">Your share message</label>
          <textarea id="share-message" value={shareDraft} onChange={(event) => setShareDraft(event.target.value)} />
          <div className="share-actions"><button onClick={() => shareTo('whatsapp')}><MessageCircle /> WhatsApp</button><button onClick={() => shareTo('facebook')}><Share2 /> Facebook</button><button onClick={() => shareTo('telegram')}><Send /> Telegram</button><button onClick={() => shareTo('sms')}><MessageCircle /> SMS</button><button onClick={() => shareTo('email')}><Mail /> Email</button><button onClick={nativeShare}><MoreHorizontal /> More options</button></div>
          <div className="share-copy-actions"><button onClick={copyReferralMessage}><Copy /> Copy message</button><button onClick={copyLink}><Link2 /> Copy link</button></div>
          {shareMessage && <p className="share-success" role="status">{shareMessage}</p>}
        </section>
      </div>}
    </main>
  )
}

export default function DashboardPage() {
  return (
    <Suspense fallback={<main className="dashboard-page" aria-busy="true" />}>
      <DashboardContent />
    </Suspense>
  )
}
