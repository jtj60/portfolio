import { ShineBorder } from '@/components/ui/shine-border'
import Image from 'next/image'
import SectionTitle from './sectionTitle'
import { cn } from '@/lib/utils'
import { title } from 'process'

export default function Timeline() {
  return (
    <div className="flex flex-col w-full justify-center items-center">
      <SectionTitle title="Career Timeline" />

      <div className="hidden relative md:block w-full max-w-7xl mx-auto">
        <div className="absolute left-1/2 right-1/2 -translate-x-1/2 top-0 bottom-0 pointer-events-none">
          <ShineBorder
            shineColor={['#5a75ff', '#f176c5', '#425fff', '#ec4fb4']}
            borderTop={2}
            borderBottom={2}
            borderRight={2}
            borderLeft={2}
            className="z-0 h-full w-0"
          />
        </div>
        <div className="flex flex-col gap-12">
          {timelineNodes.map((node, index) => (
            <div
              key={index}
              className="relative flex w-full justify-between items-start w-full h-full"
            >
              <>
                <div className="min-w-1/2 max-w-1/2">
                  <ParagraphItem node={node} index={index} />
                  <BigNode node={node} position="right" />
                </div>
                <div className="min-w-1/2 max-w-1/2 pt-25">
                  <ProjectItems node={node} index={index} />
                </div>
              </>
            </div>
          ))}
        </div>
      </div>

      <div className="md:hidden relative w-full max-w-7xl mx-auto">
        <div className="absolute left-8 top-0 bottom-0 pointer-events-none">
          <ShineBorder
            shineColor={['#5a75ff', '#f176c5', '#425fff', '#ec4fb4']}
            borderTop={2}
            borderBottom={2}
            borderRight={2}
            borderLeft={2}
            className="z-0 h-full w-0"
          />
        </div>
        <div className="flex flex-col gap-6 md:gap-12">
          {timelineNodes.map((node, index) => (
            <div
              key={index}
              className="relative flex w-full justify-between items-start w-full h-full"
            >
              <>
                <div className="w-full">
                  <ParagraphItem node={node} index={index} />
                  <ProjectItems node={node} index={index} />
                  <BigNode node={node} position="right" />
                </div>
              </>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

function ParagraphItem({ node, index }: { node: TimelineNode; index: number }) {
  return (
    <div className={cn('relative w-full pl-20 pr-6 md:pl-0 md:pr-20 pb-6 md:pb-0')}>
      <div className={cn('text-left md:text-right w-full')}>
        <div className="text-3xl md:text-6xl text-neutral-900 mt-1 md:mt-0 md:pb-1 font-bold">
          {node.year}
        </div>
        <div
          className={cn(
            'text-2xl md:text-4xl font-bold pb-2 md:pb-4 md:tracking-wide',
            node.titleColor
          )}
        >
          {node.title}
        </div>
        <p className={cn('text-neutral-700 text-sm md:text-base whitespace-pre-line')}>
          {node.paragraph}
        </p>
      </div>
    </div>
  )
}

function BigNode({ node, position }: { node: TimelineNode; position: string }) {
  return (
    <div
      className={cn(
        'absolute left-1.5 md:left-1/2 md:-translate-x-1/2 top-0 bottom-0 z-20 justify-self-center h-full pl-1'
      )}
    >
      <div className="hidden md:flex relative h-16 w-16 rounded-full backdrop-blur-xs bg-white/10 flex items-center justify-center raised-off-page">
        <Image
          src={node.imageUrl}
          alt={`${node.title} logo`}
          width={node.size}
          height={node.size}
          className="object-contain z-0"
        />
      </div>
      <div className="relative md:hidden h-12 w-12 rounded-full backdrop-blur-xs bg-white/10 flex items-center justify-center raised-off-page">
        <Image
          src={node.imageUrl}
          alt={`${node.title} logo`}
          width={node.mobileSize}
          height={node.mobileSize}
          className="object-contain z-0"
        />
      </div>
    </div>
  )
}

function ProjectItems({ node, index }: { node: TimelineNode; index: number }) {
  return (
    <div className="relative flex flex-col gap-6 md:gap-8 w-full md:pl-0">
      {node.projects?.map((project, proj_index) => (
        <div className={cn('relative flex flex-col w-full text-left')} key={proj_index}>
          <div className="flex flex-col w-full mx-8 rounded-xl backdrop-blur-xs bg-white/10 raised-off-page">
            {project.image !== null && (
              <div className="relative w-full h-50">
                <Image
                  src={project.image}
                  alt={`${node.title} logo`}
                  fill
                  className="object-cover z-0 rounded-t-xl w-full focus:outline-none drop-shadow-2xl"
                />
              </div>
            )}

            <div className="flex flex-col p-4">
              <div
                className={cn(
                  'text-xl md:text-2xl font-semibold md:font-bold pb-0 md:pb-1 tracking-wide text-neutral-600'
                )}
              >
                {project.year}
              </div>
              <div
                className={cn(
                  'text-lg md:text-xl font-semibold md:font-bold pb-1 md:pb-4 md:tracking-wide',
                  node.titleColor
                )}
              >
                {project.title}
              </div>

              <div className="flex items-center gap-1">
                {project.skills.map((skill, index) => (
                  <div key={index}></div>
                ))}
              </div>

              <p
                className={cn(
                  'text-neutral-700 text-sm md:text-base whitespace-pre-line',
                  index === timelineNodes.length - 1 && ''
                )}
              >
                {project.paragraph}
              </p>
            </div>
          </div>

          <SmallNode />
        </div>
      ))}
    </div>
  )
}

function SmallNode() {
  return (
    <div className="absolute z-50 md:-translate-x-1/2 top-1 left-6.5 md:left-[2px] bottom-0 h-4 w-4 md:h-6 md:w-6 rounded-full backdrop-blur-xs bg-white/10 flex items-center justify-center raised-off-page" />
  )
}

interface TimelineNode {
  imageUrl: string
  year: string
  title: string
  paragraph: string
  borderColor: string
  paragraphBorder: string
  titleColor: string
  size: number
  mobileSize: number
  projects?: TimelineNodeProject[]
}

interface TimelineNodeProject {
  title: string
  year: string
  paragraph: string
  skills: string[]
  image: string | null
}

const timelineNodes = [
  {
    imageUrl: '/logos/arkansas.png',
    year: '2016',
    title: 'University of Arkansas',
    paragraph: `I started my college career at the University of Arkansas, pursuing a degree in finance. It took me a few years, but slowly I recognized business probably wasn't for me. At the beginning of my junior year, I happened to be sitting in a lecture hall learning all about the finer points of accounting. Without quite realizing what I was doing, I stood up and walked out. On the bus home, a plan started to formulate. A few months later, I found myself in a different lecture hall — this time learning the foundations of computer science at Texas State University.`,
    borderColor: 'border-red-700',
    paragraphBorder: 'border-red-700',
    titleColor: 'text-red-700',
    size: 100,
    mobileSize: 100,
    projects: [
      {
        title: 'Business Law',
        year: 'August 2017',
        paragraph: `My favorite course across both majors, Business Law provided a foundation that would prove surprisingly valuable years later when I launched Dorado.`,
        skills: ['C++'],
        image: null,
      },
      {
        title: 'Finite Math',
        year: 'January 2018',
        paragraph: `An introduction to concepts I would later revisit in Discrete Math, this course was the first to truly challenge me academically: and I discovered I quite liked the challenge.`,
        skills: ['C++'],
        image: '/logos/no_image.jpeg',
      },
    ],
  },
  {
    imageUrl: '/logos/texas-state.png',
    year: '2019',
    title: 'Texas State University',
    paragraph: `When I started at Texas State, I knew virtually nothing about computer science or software engineering. The first semester was a steep learning curve—the coursework was far more demanding than I was used to, and adjusting to life in a new city added to the challenge. Despite the initial struggles, I persevered, and over time, everything began to click.`,
    borderColor: 'border-amber-900',
    paragraphBorder: 'border-amber-900',
    titleColor: 'text-amber-900',
    size: 45,
    mobileSize: 35,
    projects: [
      {
        title: 'Elo Rankings',
        year: 'June 2020',
        paragraph: `Built a simple program to generate matchup predictions based on league-wide match results, using the Elo rating formula popularized in chess. While functional, the model required a larger dataset and more meaningful inputs to improve accuracy.`,
        skills: ['C++'],
        image: null,
      },
      {
        title: 'NBA Scoring Margin Predictor',
        year: 'October 2021',
        paragraph: `For my Machine Learning course's final project, I worked on predicting NBA game scoring margins. We ingested box score data from the previous season, added advanced stats, normalized the dataset, and ran various ML models. Our predictions ranged from 18-21% accuracy. We identified opportunities for improvement, such as incorporating player-level data, historical player matchups, and other deeper statistical features.`,
        skills: ['Python'],
        image: null,
      },
      {
        title: 'Auction Draft Discord Bot',
        year: 'November 2021',
        paragraph: `My first substantial software development project. I approached the admins of an amateur DOTA 2 league and offered to build a Discord bot to run our seasonal player draft. With guidance from a mentor, I delivered a feature-complete bot in time for draft day. It included automated bidding logic, timers, fallback rules, and robust error handling, serving hundreds of league members in a live, downtime-free event.`,
        skills: ['Python'],
        image: null,
      },
    ],
  },

  {
    imageUrl: '/logos/sock-club.png',
    year: '2022',
    title: 'Sock Club',
    paragraph: `My professional career began at Sock Club, a small Austin-based startup specializing in custom socks. Customers would submit ideas and logos, the design team would create sock patterns, and the factory would handle production. I joined just as development began on a major new initiative: a unified storefront and customer dashboard. While I contributed to that project, my most impactful work was developing the Logo Color Converter and the Will-it-Knit tool.`,
    borderColor: 'border-red-500',
    paragraphBorder: 'border-red-500',
    titleColor: 'text-red-500',
    size: 50,
    mobileSize: 40,
    projects: [
      {
        title: 'Customer Portal',
        year: 'June 2022',
        paragraph: `Migrated the public-facing frontend from Rails to Next.js, improving site performance and user experience for over 170,000 annual visitors. This involved iterative enhancements, UI consistency improvements, and cross-browser/device compatibility fixes. I also triaged frontend bugs and resolved persistent UI inconsistencies, improving maintainability and user satisfaction.`,
        skills: ['NextJS', 'React', 'Postgres', 'Ruby on Rails'],
        image: '/websites/sockclub.png',
      },
      {
        title: 'Logo Color Converter',
        year: 'October 2022',
        paragraph: `Developed a long-requested tool to automate logo color matching. Sock Club had 52 yarn colors, but incoming logos often contained subtle variations—sometimes 10 pixels that appeared identical were actually slightly different colors. Previously, designers manually mapped each pixel to the closest yarn color, a process that could take hours. Using ImageMagick for posterization and palette mapping, I built a tool that achieved 95% accuracy in automated conversions, drastically reducing turnaround time.`,
        skills: ['Ruby on Rails'],
        image: null,
      },
      {
        title: 'Will-it-Knit Tool',
        year: 'November 2022',
        paragraph: `Created a tool to verify if a design template could be knitted by the factory's machines. Previously, templates that violated machine specifications were returned multiple times per week, wasting hours for both the design/operations team and the factory. Instead of encoding hundreds of rules as conditionals (as a previous, non-functional tool attempted), I simulated the knitting machine as a state machine. The tool has maintained a 100% approval accuracy—no template it approved has ever been rejected.`,
        skills: ['Ruby on Rails'],
        image: null,
      },
    ],
  },
  {
    imageUrl: '/logos/gmf.png',
    year: '2023',
    title: 'General Motors Financial',
    paragraph: `At GMF — the captive finance arm of General Motors—I joined the Cybersecurity organization's Vulnerability Management team. We safeguarded the company's infrastructure and applications by detecting, ingesting, and reporting vulnerabilities across the enterprise, ensuring risks were identified and addressed quickly.`,
    borderColor: 'border-blue-600',
    paragraphBorder: 'border-blue-600',
    titleColor: 'text-blue-600',
    size: 45,
    mobileSize: 35,
    projects: [
      {
        title: 'Vulnerability Management',
        year: 'March 2023',
        paragraph: `As part of my daily responsibilities, I supported developers across the company in identifying and resolving vulnerabilities. This involved reviewing and interpreting their code, pinpointing the root cause of security issues, and finally providing both clear and actionable guidance to help them implement secure remediations of their vulnerabilities.`,
        skills: ['VM Tooling', 'Azure'],
        image: null,
      },
      {
        title: 'Legacy Code and Database Maintenance',
        year: 'March 2023',
        paragraph: `Our legacy codebase was extensive and often difficult to navigate. A key initiative was cleaning and refactoring this code without disrupting critical vulnerability ingestion and reporting processes. The work involved large Python and PHP codebases, as well as complex SQL scripts. Debugging could take days to trace a single issue, followed by additional time to implement and validate a fix.`,
        skills: ['Python', 'Postgres'],
        image: null,
      },
      {
        title: 'EVMS Dashboard',
        year: 'May 2023',
        paragraph: `My primary focus at GMF was developing the EVMS dashboard alongside two other developers. Our team lead guided architectural and design decisions, while another teammate managed deployments and DevOps. My responsibilities spanned both the frontend and backend, including UI/UX design and database architecture. 
            
            Given the sensitivity of the data presented to users, we implemented strict security measures, adhering to the principle of least privilege. We integrated the organization's Azure Active Directory (Entra) via MSAL to provide a robust RBAC solution. Additionally, we were required to maintain near-perfect scores in vulnerability scans to set a security benchmark for the company. Upon release, teams across the organization gained access to real-time insights into their security vulnerabilities.`,
        skills: ['NodeJS', 'React', 'Docker', 'Kubernetes', 'Postgres', 'Azure'],
        image: null,
      },
    ],
  },
  {
    imageUrl: '/logos/dorado.png',
    year: '2025',
    title: 'Dorado Metals Exchange',
    paragraph: `Towards the end of my time at GMF, I decided to take the leap and launch a business my friend and I had been planning for years - Dorado Metals Exchange. Our mission was to bring transparency, convenience, and trust to an industry often clouded by secrecy and exploitation.`,
    borderColor: 'primary-gradient-border-left',
    paragraphBorder: 'primary-gradient-border-bottom',
    titleColor: 'text-primary-gradient',
    size: 35,
    mobileSize: 30,
    projects: [
      {
        title: 'Startup Operations',
        year: 'March 2025',
        paragraph: `Oversaw a wide range of non-technical responsibilities essential to the success of the business. This included building and maintaining customer relationships, managing social media presence and engagement, handling bookkeeping and financial tracking, and contributing to marketing strategy and campaign planning. Gained first-hand experience with the operational, financial, and strategic challenges of launching and running a startup.`,
        skills: ['Customer Engagement', 'Social Media', 'Bookkeeping', 'Marketing'],
        image: null,
      },
      {
        title: 'Platform Development',
        year: 'March 2025',
        paragraph: `Architected and delivered the Dorado Metals Exchange platform end-to-end. Built on a Node.js/Express backend with PostgreSQL and a Next.js/TypeScript frontend. Implemented full authentication and authorization using BetterAuth, including registration, password resets, email verification, JWT-based sessions, MFA, impersonation, and RBAC access control—supporting thousands of secure user sessions. Integrated multiple third-party APIs into a unified workflow, including Stripe (PCI-compliant payments, refunds, webhooks), FedEx (labels, tracking, notifications), Google Maps (geolocation/address validation), and reCAPTCHA v3 for bot prevention. Ensured accurate real-time data handling and streamlined operations. Engineered Docker-based CI/CD pipelines with PR preview environments, automated testing, and branch-specific deployments. Integrated Sentry for real-time error monitoring, performance tracing, and automated rollback on failure—achieving 99.9% uptime.`,
        skills: ['Node.js', 'Postgres', 'Next.js', 'TypeScript', 'Docker'],
        image: null,
      },
    ],
  },
]
