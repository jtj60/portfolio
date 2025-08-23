'use client'

import SectionTitle from '@/components/custom/homepage/sectionTitle'
import Skills from '@/components/custom/homepage/skills'
import Timeline from '@/components/custom/homepage/timeline'
import { Button } from '@/components/ui/button'
import ControlPanel from '@/components/ui/control-panel'
import { GlassMountCard } from '@/components/ui/glass-mount'
import { NeonLight } from '@/components/ui/neon-lights'
import { useLightsStore } from '@/store/lightsStore'
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
  return (
    <div className="flex flex-col gap-5 md:gap-10 font-sans items-center justify-items-center min-h-screen max-w-7xl">
      <Hero />
      <div className="flex justify-center md:justify-start w-1/2"></div>
      <Skills />
      <div className="flex flex-col gap-0 w-full">
        <Timeline />
        <About />
      </div>
    </div>
  )
}

function HeroImage() {
  const { lightsOn, light } = useLightsStore()

  return (
    <div className="flex justify-center items-center w-full p-4 md:p-0">
      <div className="relative size-[360px] md:size-[500px]">
        <GlassMountCard
          className="w-full h-full relative rounded-full z-10"
          shape="circle"
          steelTheme="dark"
          blur={3}
          brightness={1.1}
          elevation={0.6}
          circleCount={6}
          circleStartDeg={60}
          circleInset={10}
          mountRadius={5}
          showRim={true}
        >
          <div className="absolute inset-0 rounded-full z-0 overflow-hidden">
            <Image src="/portraits/embossed.png" alt="portrait" fill className="object-cover z-0" />
          </div>
        </GlassMountCard>

        <NeonLight
          lightsOn={lightsOn}
          stroke={8}
          color={light.hex}
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
          className="z-20 -m-6"
          mountStartDeg={30}
          mountCount={3}
        />
      </div>
    </div>
  )
}

function Hero() {
  return (
    <>
      <div className="hidden md:flex items-center justify-between items-center w-full max-w-7xl md:mt-15 md:gap-20">
        <div className="flex flex-col gap-5 md:gap-15 w-full">
          <Name />
          <ControlPanel />
        </div>
        <HeroImage />
      </div>
      <div className="flex flex-col md:hidden items-center justify-between items-center w-full gap-10">
        <Name />
        <HeroImage />
        <ControlPanel />
      </div>
    </>
  )
}

function Name() {
  return (
    <>
      <GlassMountCard
        className="rounded-xl h-full p-8"
        rectMode="corners"
        cornerInset={14}
        steelTheme="dark"
        blur={3}
        elevation={0.2}
        brightness={1.1}
        mountRadius={5}
        showRim={true}
      >
        <div className="flex flex-col w-full gap-5 md:gap-10">
          <div className="flex flex-col items-start gap-1 w-full">
            <h2 className="text-2xl md:text-3xl text-neutral-800">Hello, I'm</h2>
            <h1 className="text-4xl md:text-6xl text-neutral-900 font-bold">Jacob Johnson</h1>
          </div>
          <Info />
        </div>
      </GlassMountCard>
    </>
  )
}

function Info() {
  return (
    <div className="flex justify-center md:justify-start items-center gap-3 mt-auto md:tracking-wide w-full p-1 md:p-0 pt-10">
      <h3 className="text-sm md:text-lg text-neutral-700">Dallas, TX</h3>
      <div className="h-9 w-[2px] bg-neutral-400 raised-off-page rounded-full" />
      <h3 className="md:hidden text-sm md:text-lg text-neutral-700">Software Engineer</h3>
      <h3 className="hidden md:block text-sm md:text-lg text-neutral-800">
        Full-Stack Software Engineer
      </h3>
      <div className="h-9 w-[2px] bg-neutral-400 raised-off-page rounded-lg" />

      <h3 className="md:hidden text-sm md:text-lg text-neutral-700">Texas State</h3>
      <h3 className="hidden md:block text-sm md:text-lg text-neutral-700">
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
