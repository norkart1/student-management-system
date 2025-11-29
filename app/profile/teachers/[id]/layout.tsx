import { Metadata } from "next"
import { getBaseUrl } from "@/lib/url-utils"

type Props = {
  params: Promise<{ id: string }>
}

async function getTeacher(id: string) {
  try {
    const baseUrl = getBaseUrl()
    const response = await fetch(`${baseUrl}/api/teachers/${id}`, { cache: 'no-store' })
    if (response.ok) {
      return response.json()
    }
  } catch (error) {
    console.error("Error fetching teacher for metadata:", error)
  }
  return null
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params
  const teacher = await getTeacher(id)

  if (!teacher) {
    return {
      title: "Teacher Profile",
      description: "View teacher profile",
    }
  }

  const baseUrl = getBaseUrl()

  return {
    title: `${teacher.fullName} - Teacher Profile`,
    description: `View ${teacher.fullName}'s teacher profile. Contact: ${teacher.email}`,
    openGraph: {
      title: `${teacher.fullName} - Teacher Profile`,
      description: `View ${teacher.fullName}'s teacher profile`,
      type: "profile",
      url: `${baseUrl}/profile/teachers/${id}`,
      images: teacher.imageUrl ? [
        {
          url: teacher.imageUrl,
          width: 200,
          height: 200,
          alt: teacher.fullName,
        }
      ] : [],
    },
    twitter: {
      card: "summary",
      title: `${teacher.fullName} - Teacher Profile`,
      description: `View ${teacher.fullName}'s teacher profile`,
      images: teacher.imageUrl ? [teacher.imageUrl] : [],
    },
  }
}

export default function TeacherProfileLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}
