'use client'

import SectionTitle from '@/components/custom/homepage/sectionTitle'
import Skills from '@/components/custom/homepage/skills'
import Timeline from '@/components/custom/homepage/timeline'
import { Button } from '@/components/ui/button'
import { GlowBorderSvg } from '@/components/ui/glowBorder'
import { GlowRing } from '@/components/ui/glowRing'
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
      <Hero />

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
      {/* OUTER sized wrapper */}
      <div className="relative size-[360px] md:size-[500px]">
        {/* Image inside a circular clip that fills the wrapper */}
        <div className="absolute inset-0 rounded-full overflow-hidden z-10 p-2">
          <Image src="/logos/portrait.jpg" alt="portrait" fill className="object-cover" />
        </div>

        {/* Glow ring OVERLAY (above the image, not clipped) */}
        <GlowRing
          stroke={8}
          color="#ec4fb4"
          glowBlend="screen"
          glowWidthBoost={10}
          glowSpread={10}
          bgGlowPasses={[
            { blur: 72, opacity: 0.38 },
            { blur: 140, opacity: 0.22 },
            { blur: 220, opacity: 0.1 },
          ]}
          onMs={10}
          offMs={10}
          easing="easeInOut"
          className="z-20 -m-4"
        />
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
            <h2 className="text-2xl md:text-3xl text-neutral-800 embossed-text">Hello, I'm</h2>
            <h1 className="text-4xl md:text-6xl text-neutral-900 font-bold embossed-text">
              Jacob Johnson
            </h1>
          </div>
          <div className="md:hidden">
            <HeroImage />
          </div>

          <Info />
        </div>

        <SocialLinks />
        <div className="flex justify-center md:justify-start w-full">
          <Button className="relative w-full mx-14 md:mx-0 md:w-80 p-6 bg-card text-neutral-800 raised-off-page flex items-center gap-1 rounded-lg text-lg">
            <GlowBorderSvg
              borderTop={3}
              borderBottom={3}
              borderRight={3}
              borderLeft={3}
              colors="#ec4fb4"
              glowBlend="screen"
              cap="butt"
              highlightWidth={0.5}
              highlightOpacity={0.4}
              glowWidthBoost={5}
              glowSpread={5}
              bgGlowPasses={[
                { blur: 72, opacity: 0.38 },
                { blur: 140, opacity: 0.22 },
                { blur: 220, opacity: 0.1 },
              ]}
              className="rounded-full"
            />
            <DownloadIcon size={32} className="text-white/80" />
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
    <div className="flex justify-center md:justify-start items-center gap-3 mt-auto md:tracking-wide w-full p-1 md:p-0 embossed-text">
      <h3 className="text-sm md:text-lg text-neutral-800">Dallas, TX</h3>
      <div className="h-9 w-[2px] bg-neutral-600 raised-off-page rounded-full" />
      <h3 className="md:hidden text-sm md:text-lg text-neutral-800">Software Engineer</h3>
      <h3 className="hidden md:block text-sm md:text-lg text-neutral-800">
        Full-Stack Software Engineer
      </h3>
      <div className="h-9 w-[2px] bg-neutral-600 raised-off-page rounded-lg" />

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
