import QRCode from 'qrcode'
import { getBaseUrl } from '@/lib/url-utils'

export async function generateQRCode(url: string): Promise<string> {
  try {
    const qrDataUrl = await QRCode.toDataURL(url, {
      width: 200,
      margin: 2,
      color: {
        dark: '#0f172a',
        light: '#ffffff'
      },
      errorCorrectionLevel: 'M'
    })
    return qrDataUrl
  } catch (error) {
    console.error('Error generating QR code:', error)
    return ''
  }
}

export function getProfileUrl(type: 'students' | 'teachers' | 'books', id: string): string {
  const baseUrl = typeof window !== 'undefined' 
    ? window.location.origin 
    : getBaseUrl()
  
  return `${baseUrl}/profile/${type}/${id}`
}
