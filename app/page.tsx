'use client'

import SectionTitle from '@/components/custom/homepage/sectionTitle'
import Skills from '@/components/custom/homepage/skills'
import Timeline from '@/components/custom/homepage/timeline'
import { Button } from '@/components/ui/button'
import SoftGradientBackground from '@/components/ui/gradient-background'
import { ShineBorder } from '@/components/ui/shine-border'
import { cn } from '@/lib/utils'
import { useIsMobile } from '@/utils/isMobile'
import {
  DownloadIcon,
  GithubLogoIcon,
  InstagramLogoIcon,
  LinkedinLogoIcon,
  XLogoIcon,
} from '@phosphor-icons/react'
import Image from 'next/image'
import Link from 'next/link'

export default function Home() {
  const isMobile = useIsMobile()

  return (
    <div className="flex flex-col gap-5 md:gap-10 font-sans items-center justify-items-center min-h-screen max-w-7xl">
      <SoftGradientBackground
        intensity={isMobile ? 10 : 0.3}
        blur={isMobile ? 50 : 120}
        count={5}
        speed={3}
        colors={['#5a75ff', '#f176c5', '#425fff', '#ec4fb4']}
        className="bg-transparent w-full p-4 md:p-0"
      >
        <Hero />
      </SoftGradientBackground>

      <Skills />
      <div className="flex flex-col gap-0 w-full">
        <Timeline />
        <About />
      </div>
    </div>
  )
}

function HeroImage() {
  return (
    <div className="flex justify-center items-center w-full">
      <div className="relative flex rounded-full min-h-90 min-w-90 max-h-90 max-w-90 md:min-h-125 md:min-w-125 md:max-h-125 md:max-w-125 raised-off-page overflow-hidden items-center justify-center">
        <ShineBorder
          shineColor={['#5a75ff', '#f176c5', '#425fff', '#ec4fb4']}
          borderTop={2}
          borderBottom={2}
          borderRight={2}
          borderLeft={2}
          className="z-10 rounded-full"
        />
        <Image src={'/logos/portrait.jpg'} fill className="object-cover" alt="portrait" />
      </div>
    </div>
  )
}

function Hero() {
  return (
    <div className="flex items-center justify-between w-full h-full max-w-7xl md:mt-15">
      <div className="flex flex-col gap-5 md:gap-10 w-full">
        <div className="flex flex-col w-full gap-5 md:gap-10">
          <div className="flex flex-col items-start gap-1 w-full">
            <h2 className="text-2xl md:text-3xl text-neutral-800">Hello, I'm</h2>
            <h1 className="text-4xl md:text-6xl text-neutral-900 font-bold">Jacob Johnson</h1>
          </div>
          <div className="md:hidden">
            <HeroImage />
          </div>

          <Info />
        </div>

        <SocialLinks />
        <div className="flex justify-center md:justify-start w-full">
          <Button
            variant="default"
            className="relative w-full mx-14 md:mx-0 md:w-80 p-6 backdrop-blur-2xl bg-white/1 raised-off-page text-neutral-800 flex items-center gap-1 rounded-lg text-lg hover:bg-highest z-0"
          >
            <ShineBorder
              shineColor={['#5a75ff', '#f176c5', '#425fff', '#ec4fb4']}
              borderTop={2}
              borderBottom={2}
              borderRight={2}
              borderLeft={2}
              className="z-0"
            />
            <DownloadIcon size={32} className="text-neutral-800" />
            Download CV
          </Button>
        </div>
      </div>
      <div className="hidden md:flex">
        <HeroImage />
      </div>
    </div>
  )
}

function Info() {
  return (
    <div className="flex justify-center md:justify-start items-center gap-3 mt-auto md:tracking-wide w-full p-1 md:p-0">
      <h3 className="text-sm md:text-lg text-neutral-800 pr-3 border-r-1 border-neutral-500">
        Dallas, TX
      </h3>
      <h3 className="md:hidden text-sm md:text-lg text-neutral-800 pr-3 border-r-1 border-neutral-500">
        Software Engineer
      </h3>
      <h3 className="hidden md:block text-sm md:text-lg text-neutral-800 pr-3 border-r-1 border-neutral-500">
        Full-Stack Software Engineer
      </h3>
      <h3 className="md:hidden text-sm md:text-lg text-neutral-800">Texas State</h3>
      <h3 className="hidden md:block text-sm md:text-lg text-neutral-800">
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
      <div className="flex items-center justify-center rounded-full bg-linear-to-r from-neutral-300 to-neutral-100 raised-off-page h-12 w-12">
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
      <div className="flex items-center justify-center rounded-full bg-gradient-to-br from-neutral-100/90 via-neutral-100/80 to-neutral-100/70 raised-off-page h-12 w-12">
        <Link href="https://x.com/jake_j1997" className="">
          <XLogoIcon size={36} className="text-white" />
        </Link>
      </div>
    </div>
  )
}

// function MetricsBar() {
//   return (
//     <div className="flex w-full justify-center items-center p-4 md:py-8 md:px-0">
//       <div className="flex flex-col md:flex-row w-full max-w-7xl items-center md:justify-between gap-5 md:gap-0 mx-10 md:mx-0">
//         <div className="flex md:flex-col items-end md:items-start gap-5">
//           <div className="text-4xl md:text-6xl text-neutral-800 font-bold">3</div>
//           <div className="text-sm md:text-base text-neutral-700 tracking-wide md:tracking-widest pb-1 md:pb-0">
//             years of experience
//           </div>
//         </div>
//         <div className="flex md:flex-col items-end md:items-start gap-5">
//           <div className="text-4xl md:text-6xl text-neutral-800 font-bold">5</div>
//           <div className="text-sm md:text-base text-neutral-700 tracking-wide md:tracking-widest pb-1 md:pb-0">
//             apps in production
//           </div>
//         </div>
//         <div className="flex md:flex-col items-end md:items-start gap-5">
//           <div className="text-4xl md:text-6xl text-neutral-800 font-bold">28</div>
//           <div className="text-sm md:text-base text-neutral-700 tracking-wide md:tracking-widest pb-1 md:pb-0">
//             projects contributed to
//           </div>
//         </div>
//       </div>
//     </div>
//   )
// }

function About() {
  return (
    <div className="flex flex-col w-full justify-center items-center">
      <SectionTitle title="About" />
    </div>
  )
}
