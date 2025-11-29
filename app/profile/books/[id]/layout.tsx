import { Metadata } from "next"

type Props = {
  params: Promise<{ id: string }>
}

async function getBook(id: string) {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 
      (process.env.REPLIT_DEV_DOMAIN ? `https://${process.env.REPLIT_DEV_DOMAIN}` : 'http://localhost:5000')
    const response = await fetch(`${baseUrl}/api/books/${id}`, { cache: 'no-store' })
    if (response.ok) {
      return response.json()
    }
  } catch (error) {
    console.error("Error fetching book for metadata:", error)
  }
  return null
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params
  const book = await getBook(id)

  if (!book) {
    return {
      title: "Book Profile",
      description: "View book details",
    }
  }

  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 
    (process.env.REPLIT_DEV_DOMAIN ? `https://${process.env.REPLIT_DEV_DOMAIN}` : 'http://localhost:5000')

  return {
    title: `${book.title} - Book`,
    description: `"${book.title}" by ${book.author}`,
    openGraph: {
      title: `${book.title} by ${book.author}`,
      description: `View "${book.title}" by ${book.author}`,
      type: "book",
      url: `${baseUrl}/profile/books/${id}`,
      images: book.imageUrl ? [
        {
          url: book.imageUrl,
          width: 300,
          height: 450,
          alt: book.title,
        }
      ] : [],
    },
    twitter: {
      card: "summary",
      title: `${book.title} by ${book.author}`,
      description: `View "${book.title}" by ${book.author}`,
      images: book.imageUrl ? [book.imageUrl] : [],
    },
  }
}

export default function BookProfileLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}
