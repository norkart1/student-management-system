"use client"

import Link from "next/link"
import { 
  GraduationCap, 
  Users, 
  BookOpen, 
  Calendar, 
  BarChart3, 
  Shield, 
  Zap, 
  Clock,
  CheckCircle,
  ArrowRight,
  Sparkles
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Footer } from "@/components/footer"

export default function LandingPage() {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-md border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-[var(--color-teal)] to-[var(--color-green)] rounded-xl flex items-center justify-center shadow-lg">
                <GraduationCap className="w-6 h-6 text-white" />
              </div>
              <span className="text-xl font-bold text-foreground">SMS</span>
            </div>
            <Button asChild className="bg-[var(--color-teal)] hover:bg-[var(--color-green)] text-white">
              <Link href="/login">Login</Link>
            </Button>
          </div>
        </div>
      </header>

      <main className="flex-1">
        <section className="relative overflow-hidden py-20 sm:py-32">
          <div className="absolute inset-0 bg-gradient-to-br from-[var(--color-mint)]/30 via-background to-[var(--color-teal)]/10" />
          <div className="absolute top-20 left-10 w-72 h-72 bg-[var(--color-teal)]/20 rounded-full blur-3xl" />
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-[var(--color-green)]/20 rounded-full blur-3xl" />
          
          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-4xl mx-auto">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-[var(--color-mint)] rounded-full mb-8">
                <Sparkles className="w-4 h-4 text-[var(--color-teal)]" />
                <span className="text-sm font-medium text-[var(--color-primary-dark)]">
                  Streamline Your School Management
                </span>
              </div>
              
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-foreground leading-tight mb-6">
                Manage Your School
                <span className="block text-transparent bg-clip-text bg-gradient-to-r from-[var(--color-teal)] to-[var(--color-green)]">
                  Effortlessly
                </span>
              </h1>
              
              <p className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto mb-10">
                A comprehensive platform for managing students, teachers, library resources, 
                and academic events. Everything you need in one place.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button asChild size="lg" className="w-full sm:w-auto bg-[var(--color-teal)] hover:bg-[var(--color-green)] text-white px-8 py-6 text-lg shadow-lg shadow-[var(--color-teal)]/25">
                  <Link href="/login">
                    Get Started
                    <ArrowRight className="ml-2 w-5 h-5" />
                  </Link>
                </Button>
                <Button asChild size="lg" variant="outline" className="w-full sm:w-auto px-8 py-6 text-lg border-[var(--color-teal)] text-[var(--color-teal)] hover:bg-[var(--color-mint)]">
                  <a href="#features">Learn More</a>
                </Button>
              </div>
            </div>
          </div>
        </section>

        <section id="features" className="py-20 bg-gradient-to-b from-background to-[var(--color-mint)]/20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
                Everything You Need
              </h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Powerful features designed to simplify school administration and boost productivity.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              <FeatureCard
                icon={<Users className="w-8 h-8" />}
                title="Student Management"
                description="Complete student profiles with photos, contact details, and academic records. Easy search and filtering."
                color="from-blue-500 to-blue-600"
              />
              <FeatureCard
                icon={<GraduationCap className="w-8 h-8" />}
                title="Teacher Directory"
                description="Manage teacher information, subjects, qualifications, and contact details in one centralized system."
                color="from-[var(--color-teal)] to-[var(--color-green)]"
              />
              <FeatureCard
                icon={<BookOpen className="w-8 h-8" />}
                title="Library System"
                description="Track books, manage inventory, and keep your library organized with ISBN tracking and cover images."
                color="from-purple-500 to-purple-600"
              />
              <FeatureCard
                icon={<Calendar className="w-8 h-8" />}
                title="Event Calendar"
                description="Schedule and manage academic events, holidays, exams, and important dates with an intuitive calendar."
                color="from-orange-500 to-orange-600"
              />
              <FeatureCard
                icon={<BarChart3 className="w-8 h-8" />}
                title="Reports & Analytics"
                description="Generate detailed reports for students, teachers, and books. Print or download as PDF."
                color="from-pink-500 to-pink-600"
              />
              <FeatureCard
                icon={<Shield className="w-8 h-8" />}
                title="Secure Access"
                description="JWT-based authentication ensures your data is protected. Manage access with admin controls."
                color="from-green-500 to-green-600"
              />
            </div>
          </div>
        </section>

        <section className="py-20 bg-background">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
                How It Works
              </h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Get started in minutes with our simple three-step process.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <WorkflowStep
                number="1"
                title="Login Securely"
                description="Access the dashboard with your admin credentials. Your data is protected with industry-standard encryption."
              />
              <WorkflowStep
                number="2"
                title="Add Your Data"
                description="Import or add students, teachers, and books. Upload photos and fill in details with our easy forms."
              />
              <WorkflowStep
                number="3"
                title="Manage & Report"
                description="Use the dashboard to manage records, schedule events, and generate comprehensive reports."
              />
            </div>
          </div>
        </section>

        <section className="py-20 bg-gradient-to-br from-[var(--color-primary-dark)] to-[var(--color-teal)]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              <StatCard number="500+" label="Students Managed" />
              <StatCard number="50+" label="Teachers" />
              <StatCard number="1000+" label="Books Catalogued" />
              <StatCard number="99.9%" label="Uptime" />
            </div>
          </div>
        </section>

        <section className="py-20 bg-[var(--color-mint)]/30">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
                Why Choose Us?
              </h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
              <BenefitItem text="Easy-to-use interface designed for educators" />
              <BenefitItem text="Responsive design works on any device" />
              <BenefitItem text="Fast search and filtering capabilities" />
              <BenefitItem text="Secure data storage and backup" />
              <BenefitItem text="Generate professional PDF reports" />
              <BenefitItem text="QR code generation for quick access" />
            </div>
          </div>
        </section>

        <section className="py-20 bg-background">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <div className="bg-gradient-to-br from-[var(--color-teal)] to-[var(--color-green)] rounded-3xl p-8 sm:p-12 shadow-2xl">
              <Zap className="w-12 h-12 text-white mx-auto mb-6" />
              <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
                Ready to Get Started?
              </h2>
              <p className="text-lg text-white/90 mb-8 max-w-xl mx-auto">
                Join schools that trust our platform for their management needs. 
                Start organizing your institution today.
              </p>
              <Button asChild size="lg" className="bg-white text-[var(--color-teal)] hover:bg-[var(--color-mint)] px-10 py-6 text-lg font-semibold shadow-lg">
                <Link href="/login">
                  Login to Dashboard
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Link>
              </Button>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}

function FeatureCard({ 
  icon, 
  title, 
  description, 
  color 
}: { 
  icon: React.ReactNode
  title: string
  description: string
  color: string 
}) {
  return (
    <div className="group bg-card rounded-2xl p-6 shadow-lg border border-border hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
      <div className={`w-14 h-14 bg-gradient-to-br ${color} rounded-xl flex items-center justify-center text-white mb-5 group-hover:scale-110 transition-transform`}>
        {icon}
      </div>
      <h3 className="text-xl font-semibold text-foreground mb-3">{title}</h3>
      <p className="text-muted-foreground">{description}</p>
    </div>
  )
}

function WorkflowStep({ 
  number, 
  title, 
  description 
}: { 
  number: string
  title: string
  description: string 
}) {
  return (
    <div className="text-center">
      <div className="w-16 h-16 bg-gradient-to-br from-[var(--color-teal)] to-[var(--color-green)] rounded-full flex items-center justify-center text-white text-2xl font-bold mx-auto mb-6 shadow-lg">
        {number}
      </div>
      <h3 className="text-xl font-semibold text-foreground mb-3">{title}</h3>
      <p className="text-muted-foreground">{description}</p>
    </div>
  )
}

function StatCard({ 
  number, 
  label 
}: { 
  number: string
  label: string 
}) {
  return (
    <div className="text-center">
      <div className="text-4xl sm:text-5xl font-bold text-white mb-2">{number}</div>
      <div className="text-white/80">{label}</div>
    </div>
  )
}

function BenefitItem({ text }: { text: string }) {
  return (
    <div className="flex items-center gap-3 bg-card rounded-xl p-4 shadow-sm border border-border">
      <div className="w-8 h-8 bg-[var(--color-green)] rounded-full flex items-center justify-center flex-shrink-0">
        <CheckCircle className="w-5 h-5 text-white" />
      </div>
      <span className="text-foreground font-medium">{text}</span>
    </div>
  )
}
