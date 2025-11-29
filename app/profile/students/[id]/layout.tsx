import { Metadata } from "next"

type Props = {
  params: Promise<{ id: string }>
}

async function getStudent(id: string) {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 
      (process.env.REPLIT_DEV_DOMAIN ? `https://${process.env.REPLIT_DEV_DOMAIN}` : 'http://localhost:5000')
    const response = await fetch(`${baseUrl}/api/students/${id}`, { cache: 'no-store' })
    if (response.ok) {
      return response.json()
    }
  } catch (error) {
    console.error("Error fetching student for metadata:", error)
  }
  return null
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params
  const student = await getStudent(id)

  if (!student) {
    return {
      title: "Student Profile",
      description: "View student profile",
    }
  }

  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 
    (process.env.REPLIT_DEV_DOMAIN ? `https://${process.env.REPLIT_DEV_DOMAIN}` : 'http://localhost:5000')

  return {
    title: `${student.fullName} - Student Profile`,
    description: `View ${student.fullName}'s student profile. Contact: ${student.email}`,
    openGraph: {
      title: `${student.fullName} - Student Profile`,
      description: `View ${student.fullName}'s student profile`,
      type: "profile",
      url: `${baseUrl}/profile/students/${id}`,
      images: student.imageUrl ? [
        {
          url: student.imageUrl,
          width: 200,
          height: 200,
          alt: student.fullName,
        }
      ] : [],
    },
    twitter: {
      card: "summary",
      title: `${student.fullName} - Student Profile`,
      description: `View ${student.fullName}'s student profile`,
      images: student.imageUrl ? [student.imageUrl] : [],
    },
  }
}

export default function StudentProfileLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}
