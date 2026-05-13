import emailjs from '@emailjs/browser'

const SERVICE_ID  = import.meta.env.VITE_EMAILJS_SERVICE_ID
const BOOKING_TPL = import.meta.env.VITE_EMAILJS_BOOKING_TEMPLATE_ID
const CONFIRM_TPL = import.meta.env.VITE_EMAILJS_CONFIRM_TEMPLATE_ID
const PUBLIC_KEY  = import.meta.env.VITE_EMAILJS_PUBLIC_KEY

function isConfigured() {
  return SERVICE_ID && PUBLIC_KEY
}

function formatDate(dateStr) {
  return new Date(dateStr + 'T00:00:00').toLocaleDateString('en-GB', {
    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
  })
}

// Sent to customer immediately after they book
export async function sendBookingConfirmation(apt) {
  if (!isConfigured() || !BOOKING_TPL) return
  await emailjs.send(SERVICE_ID, BOOKING_TPL, {
    to_name:      apt.userName,
    to_email:     apt.userEmail,
    service_name: apt.serviceName,
    date:         formatDate(apt.date),
    time:         apt.time,
    duration:     apt.duration,
    price:        apt.price,
    notes:        apt.notes || 'None',
  }, PUBLIC_KEY)
}

// Sent to customer when admin confirms their appointment
export async function sendAdminConfirmation(apt) {
  if (!isConfigured() || !CONFIRM_TPL) return
  try {
    await emailjs.send(SERVICE_ID, CONFIRM_TPL, {
      to_name:      apt.userName,
      to_email:     apt.userEmail,
      service_name: apt.serviceName,
      date:         formatDate(apt.date),
      time:         apt.time,
      duration:     apt.serviceDuration ?? apt.duration ?? '',
      price:        apt.servicePrice ?? apt.price ?? '',
    }, PUBLIC_KEY)
  } catch (err) {
    console.error('EmailJS sendAdminConfirmation failed:', err)
    throw err
  }
}
