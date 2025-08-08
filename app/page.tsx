'use client'

import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import {
  DownloadIcon,
  FacebookLogoIcon,
  GithubLogoIcon,
  InstagramLogoIcon,
  LinkedinLogoIcon,
  XLogoIcon,
} from '@phosphor-icons/react'
import Image from 'next/image'
import Link from 'next/link'

export default function Home() {
  return (
    <div className="flex flex-col gap-5 md:gap-20 font-sans items-center justify-items-center min-h-screen">
      <div className="flex items-center justify-between w-full h-full max-w-7xl md:mt-20 p-4 md:p-0">
        <div className="flex flex-col gap-5 md:gap-10 w-full">
          <div className="flex flex-col w-full gap-5 md:gap-10">
            <div className="flex flex-col items-start gap-1">
              <h2 className="text-2xl md:text-4xl text-neutral-700">Hello, I'm</h2>
              <h1 className="text-4xl md:text-8xl text-neutral-800 font-bold">Jacob Johnson</h1>
            </div>
            <div className="flex md:hidden justify-center items-center">
              <div className="relative flex rounded-full min-h-75 min-w-75 max-h-75 max-w-75 border-neutral-500 bg-card raised-off-page overflow-hidden items-center justify-center">
                <Image src={'/logos/portrait.jpg'} fill className="" alt="portrait" />
              </div>
            </div>
            <InfoArea />
          </div>

          <SocialLinks />
          <div className="flex justify-center md:justify-start">
            <Button
              variant="default"
              className="w-full mx-14 md:mx-0 md:w-80 p-6 bg-neutral-700 raised-off-page-dark text-white flex items-center gap-1 rounded-lg text-lg hover:bg-neutral-800"
            >
              <DownloadIcon size={32} className="text-white" />
              Download CV
            </Button>
          </div>
        </div>
        <div className="hidden relative md:flex rounded-full min-h-125 min-w-125 max-h-125 max-w-125 border-neutral-500 bg-card raised-off-page overflow-hidden items-center justify-center">
          <Image src={'/logos/portrait.jpg'} fill className="" alt="portrait" />
        </div>
      </div>
      <MetricsBar />
      <SkillsArea />
      <CareerTimeline />
    </div>
  )
}

function InfoArea() {
  return (
    <div className="flex justify-center md:justify-start items-center gap-3 mt-auto md:tracking-wide w-full p-1 md:p-0">
      <h3 className="text-sm md:text-xl text-neutral-800 pr-3 border-r-1 border-neutral-500">
        Dallas, TX
      </h3>
      <h3 className="md:hidden text-sm md:text-xl text-neutral-800 pr-3 border-r-1 border-neutral-500">
        Software Engineer
      </h3>
      <h3 className="hidden md:block text-sm md:text-xl text-neutral-800 pr-3 border-r-1 border-neutral-500">
        Full-Stack Software Engineer
      </h3>
      <h3 className="md:hidden text-sm md:text-xl text-neutral-800">Texas State</h3>
      <h3 className="hidden md:block text-sm md:text-xl text-neutral-800">
        Texas State University
      </h3>
    </div>
  )
}

function SocialLinks() {
  return (
    <div className="flex justify-center md:justify-start items-center gap-3 md:gap-5">
      <div className="flex items-center justify-center rounded-full bg-linear-to-br from-blue-500 to-blue-700 raised-off-page h-12 w-12">
        <Link href="https://www.linkedin.com/in/jacob---johnson/" className="">
          <LinkedinLogoIcon size={36} className="text-white" />
        </Link>
      </div>
      <div className="flex items-center justify-center rounded-full bg-linear-to-r from-neutral-700 to-neutral-900 raised-off-page h-12 w-12">
        <Link href="https://github.com/jtj60" className="">
          <GithubLogoIcon size={36} className="text-white" />
        </Link>
      </div>
      <div className="flex items-center justify-center rounded-full bg-gradient-to-tr from-yellow-400 via-pink-500 to-purple-600 raised-off-page h-12 w-12">
        <Link href="https://www.instagram.com/jake___j/" className="">
          <InstagramLogoIcon size={36} className="text-white" />
        </Link>
      </div>
      {/* <div className="flex items-center justify-center rounded-full bg-gradient-to-br from-sky-400 to-sky-600 raised-off-page h-12 w-12">
        <Link href="/" className="">
          <FacebookLogoIcon size={36} className="text-white" />
        </Link>
      </div> */}
      <div className="flex items-center justify-center rounded-full bg-gradient-to-br from-neutral-900 via-neutral-800 to-neutral-700 raised-off-page h-12 w-12">
        <Link href="https://x.com/jake_j1997" className="">
          <XLogoIcon size={36} className="text-white" />
        </Link>
      </div>
    </div>
  )
}

function MetricsBar() {
  return (
    <div className="flex w-full justify-center items-center bg-neutral-700 raised-off-page-dark p-4 md:py-8 md:px-0">
      <div className="flex flex-col md:flex-row w-full max-w-7xl items-center md:justify-between gap-5 md:gap-0 mx-10 md:mx-0">
        <div className="flex md:flex-col items-end md:items-start gap-5">
          <div className="text-4xl md:text-6xl text-white font-bold">3</div>
          <div className="text-sm md:text-base text-white tracking-wide md:tracking-widest pb-1 md:pb-0">
            years of experience
          </div>
        </div>
        <div className="flex md:flex-col items-end md:items-start gap-5">
          <div className="text-4xl md:text-6xl text-white font-bold">5</div>
          <div className="text-sm md:text-base text-white tracking-wide md:tracking-widest pb-1 md:pb-0">
            apps in production
          </div>
        </div>
        <div className="flex md:flex-col items-end md:items-start gap-5">
          <div className="text-4xl md:text-6xl text-white font-bold">28</div>
          <div className="text-sm md:text-base text-white tracking-wide md:tracking-widest pb-1 md:pb-0">
            projects contributed to
          </div>
        </div>
      </div>
    </div>
  )
}

function ImageChip({ src, label, className }: { src: string; label: string; className?: string }) {
  return (
    <div className="flex w-full items-center">
      <div className="relative flex rounded-full h-12 w-12 overflow-hidden bg-card raised-off-page justify-center items-center">
        <Image src={src} height={30} width={30} className="" alt="logo.png" />
      </div>
      <div
        className={cn(
          'flex rounded-2xl justify-center items-center bg-neutral-700 raised-off-page h-12 w-44 -ml-10',
          className
        )}
      >
        <div className="text-white text-base tracking-wide font-semibold pl-8">{label}</div>
      </div>
    </div>
  )
}

function SkillsArea() {
  return (
    <div className="flex flex-col md:flex-row w-full justify-between items-center md:items-start max-w-7xl p-4 md:p-0 gap-10">
      <div className="flex flex-col gap-5 items-center">
        <div className="flex w-full items-center justify-between tracking-widest font-normal text-sm text-neutral-900">
          Languages
        </div>
        <div className="grid grid-cols-2 w-full gap-2">
          <ImageChip
            src="/logos/javascript.png"
            label="JavaScript"
            className="bg-linear-to-br from-yellow-200 to-yellow-400"
          />
          <ImageChip
            src="/logos/typescript.png"
            label="TypeScript"
            className="bg-linear-to-br from-sky-500 to-sky-800"
          />
          <ImageChip
            src="/logos/python.png"
            label="Python"
            className="bg-linear-to-br from-sky-700 via-neutral-400 to-yellow-300"
          />
          <ImageChip
            src="/logos/ruby.png"
            label="Ruby"
            className="bg-linear-to-br from-red-500 to-red-800"
          />
          <ImageChip
            src="/logos/c++.png"
            label="C++"
            className="bg-linear-to-br from-blue-200 to-blue-800"
          />
        </div>
      </div>
      <div className="flex flex-col gap-5">
        <div className="flex w-full items-center justify-between tracking-widest font-normal text-sm text-neutral-900">
          Frameworks
        </div>
        <div className="grid grid-cols-2 w-full gap-2">
          <ImageChip
            src="/logos/react.png"
            label="React"
            className="bg-linear-to-br from-cyan-400 to-cyan-600"
          />
          <ImageChip
            src="/logos/nextjs.png"
            label="NextJS"
            className="bg-linear-to-b from-neutral-900 via-neutral-500 to-neutral-900"
          />
          <ImageChip
            src="/logos/node.png"
            label="NodeJS"
            className="bg-linear-to-r from-neutral-800 via-neutral-600 via-green-400 via-green-800 to-neutral-800"
          />
          <ImageChip
            src="/logos/rails.png"
            label="Ruby on Rails"
            className="bg-linear-to-br from-red-400 to-red-700"
          />
        </div>
      </div>
      <div className="flex flex-col gap-5">
        <div className="flex w-full items-center justify-between tracking-widest font-normal text-sm text-neutral-900">
          Tools and Platforms
        </div>
        <div className="grid grid-cols-2 w-full gap-2">
          <ImageChip
            src="/logos/docker.png"
            label="Docker"
            className="bg-linear-to-br from-blue-400 to-blue-600"
          />
          <ImageChip
            src="/logos/kubernetes.png"
            label="Kubernetes"
            className="bg-linear-to-br from-blue-700 to-blue-900"
          />
          <ImageChip
            src="/logos/git.png"
            label="Git"
            className="bg-linear-to-br from-orange-500 to-orange-700"
          />
          <ImageChip
            src="/logos/postgres.png"
            label="Postgres"
            className="bg-linear-to-br from-cyan-700 to-cyan-900"
          />
          <ImageChip
            src="/logos/azure.png"
            label="Azure"
            className="bg-linear-to-r from-sky-800 to-sky-300"
          />
          <ImageChip
            src="/logos/rest.png"
            label="Rest APIs"
            className="bg-linear-to-br from-cyan-400 to-cyan-600"
          />
          <ImageChip
            src="/logos/figma.png"
            label="Figma"
            className="bg-linear-to-br/longer from-orange-400 from-15% to-green-500"
          />
        </div>
      </div>
    </div>
  )
}

function TimelineSection({
  imageUrl,
  year,
  title,
  paragraph,
  border,
}: {
  imageUrl: string
  year: string
  title: string
  paragraph: string
  border: boolean
}) {
  return (
    <div className="flex items-start w-full gap-4 md:gap-10">
      <div
        className="relative flex rounded-full bg-card justify-center items-center raised-off-page overflow-hidden
                   min-h-10 min-w-10 max-h-10 max-w-10 
                   md:min-h-12 md:min-w-12 md:max-h-12 md:max-w-12
                   -ml-5 md:-ml-6.5"
      >
        <Image
          src={imageUrl}
          height={30}
          width={30}
          alt="logo.png"
        />
      </div>
      <div className="flex flex-col md:flex-row md:justify-between w-full items-start">
        <div className="flex flex-col items-start">
          <div className="text-3xl md:text-6xl text-neutral-100">{year}</div>
          <div className="text-lg md:text-2xl text-neutral-100 font-bold">{title}</div>
        </div>
        <div className="flex flex-col md:-mt-4 gap-4">
          <div className={cn('hidden md:block', border && 'border-t-1 border-border')} />

          <p className="text-neutral-300 text-xs md:text-base text-left md:w-160 whitespace-pre-line tracking-wide">
            {paragraph}
          </p>
        </div>
      </div>
    </div>
  )
}

function CareerTimeline() {
  return (
    <div className="flex flex-col w-full justify-center items-center p-8 md:py-8 md:px-8 bg-neutral-700 raised-off-page-dark">
      <div className="flex flex-col w-full max-w-7xl items-start border-l-2 md:border-l-3 border-card gap-10 pb-10">
        <TimelineSection
          imageUrl="/logos/arkansas.png"
          year="2016"
          title="University of Arkansas"
          paragraph="I started my college career at the University of Arkansas, pursuing a degree in
              finance. I spent the first year mostly doing general education requirements, with a
              sprinkling of business classes thrown in. The second year was more business focused,
              and I slowly started realizing that business probably wasn't for me. Close to the
              start of the third year, I was sitting in the lecture hall listening to the professor
              discuss the finer points of accounting. Without quite realizing what I was doing, I
              stood up and walked out. On the bus home, the plan started to formulate. I was going
              to transfer to Texas State, and switch my major to philosophy! That night I called my
              parents. They were fine with the school switch, but not so much the major. I
              needed a more practical major if I wanted to go through with my plan."
          border={false}
        />

        <TimelineSection
          imageUrl="/logos/texas-state.png"
          year="2019"
          title="Texas State University"
          paragraph="The search for a new major didn't take long. After the philosophy veto, I proposed my 
                    backup—computer science—which they accepted without issue. I didn't know the first thing 
                    about computer science or software engineering; it was essentially a whim based on “well 
                    I've always liked computers...” The first semester was rough. The classes themselves were 
                    more challenging than what I was used to, and, coupled with being in an entirely new city, 
                    I struggled quite a bit. The following summer, I realized it was time to buckle down, and 
                    that's what I did. Something finally clicked with computer science, and I began devoting 
                    all my spare time to it."
          border={true}
        />
        <TimelineSection
          imageUrl="/logos/sock-club-alt.png"
          year="2022"
          title="Sock Club"
          paragraph={`My professional career began at a small startup in Austin, called Sock Club. They were a custom sock company. Essentially, customers would send in ideas and logos, the design team would come up with sock designs, and then they would be sent off to the factory for production. I joined the team just as development began on their new major effort, a joint storefront and customer dashboard. While I aided in that effort - fixing UI bugs and helping with the migration to NextJS, most of my time was spent building two things - a Logo Color Converter and a Design Knittability Tool. 
                     
            The Logo Color Converter was something the CEO desired for a long time. Sock Club had 52 yarn colors, but logos would come in with an incredible amount of variation between pixels. The design team had to manually convert each pixel into a yarn color, and this could take hours and hours for each logo. Using ImageMagick color manipulations and palette mapping, my tool achieved a 95% accuracy on logo conversions.
            
            The Design Knittability tool had also been long-desired. Our factory machines had certain specifications and rules, and if those rules were broken, a template could not be used. Our designs were sent back multiple times per week, and it was a pain for both our design team and for the factories. My product manager and I sat down to brainstorm, and realized that instead of trying to recreate the rules with a ton of conditionals, we just needed to simulate the machine itself. I built a state machine to run the templates through, and it predicted 'knittability' with 100% confidence. As far as I'm aware, none of the templates that my tool approved have been sent back to date.  
            `}
          border={true}
        />

        <TimelineSection
          imageUrl="/logos/gmf.png"
          year="2023"
          title="General Motors Financial"
          paragraph={`I continued my journey at GMF, the captive finance arm of General Motors. Among many things, GMF handles financing for General Motors vehicles. I joined the Cybersecurity organization as a member of the vulnerability management team. Our team was responsible for detecting and reporting all infrastructure and software vulnerabilities across the company. We used a variety of tools to achieve this, and I was hired to put the results of those tools onto an Internal Dashboard for use by all infrastructure and development teams across the company.
                     
            There were three developers working on this project with me. Our lead had many responsibilities outside of this project, but he was there to guide me on architecture and design decisions. Another member of our team handled most of the dev ops work. I was responsible for building both the frontend and backend, along with designing the UI/UX, and architecting the database. 
            
            Due to the nature of the data we were providing to our users, this app required extensive security protocols. We were required to abide by the principle of least access, and employed the organization's Azure Active Directory (Entra) via MSAL to handle the RBAC solution. Furthermore, we had to have near perfect scores within our vulnerability tools to 'set an example'. Upon release, teams across the company had access to their real-time vulnerabilities.
            `}
          border={true}
        />
      </div>
      <div className="flex flex-col w-full max-w-7xl items-start border-l-2 md:border-l-3 border-transparent gap-10 pb-10">
        <TimelineSection
          imageUrl="/logos/dorado.png"
          year="2025"
          title="Dorado Metals Exchange"
          paragraph={`Towards the end of my time at GMF, my manager let the whole team know that most of the software engineering responsibilities were going away. I figured I was at a good point in my career to try and strike out on my own. I decided to form the business a buddy and I had been discussing for several years - Dorado Metals Exchange was born. Our goal was to take the shady business that is buying and selling precious metals, and build a company that customers can trust. Transparency, convenience, trustworthiness - these would (and do) help us stand out from the rest. I'm ostensibly the CTO, and handle all of the development. Although as with any startup, I've been required to wear many hats. Talking to customers, handling social media, balancing our books - I've done it all.
                     
            On the development side, I decided to go with a stack I was comfortable with - Express/NodeJS/Postgres on the backend, NextJS and Typescript on the frontend. As the only developer on our team, I've handled everything. Authentication and authorization, database architecture and management, UI/UX design, 3rd party API integration, dev ops, testing... If I had known all what it would take when I began, I'm not sure I would have started in the first place.
            
            While Dorado is going to remain 'operating', my part in it is over. Like most startups, it hasn't taken off quite the way we wanted/expected/hoped. The development is 'done', and any maintenance work that pops up can be done in my spare time. I'm extremely proud of Dorado, it might represent a short period of my life, but I've learned more during it than at any other point.
            `}
          border={true}
        />
      </div>
    </div>
  )
}
