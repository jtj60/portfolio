import Image from 'next/image'
import SectionTitle from './sectionTitle'
import { cn } from '@/lib/utils'

export default function Skills() {
  return (
    <div className="flex flex-col w-full items-center justify-center">
      <SectionTitle title="Skills" />

      <div className="flex flex-col md:flex-row w-full justify-between items-center md:items-start max-w-7xl gap-10">
        <div className="flex flex-col gap-5 items-center">
          <div className="flex w-full items-center justify-between tracking-widest font-normal text-base text-neutral-900">
            Languages
          </div>
          <div className="grid grid-cols-2 w-full gap-2">
            <ImageChip
              src="/logos/javascript.svg"
              label="JavaScript"
              className="bg-linear-to-br from-yellow-200 to-yellow-400"
            />
            <ImageChip
              src="/logos/typescript.svg"
              label="TypeScript"
              className="bg-linear-to-br from-sky-500 to-sky-800"
            />
            <ImageChip
              src="/logos/python.svg"
              label="Python"
              className="bg-linear-to-br from-sky-700 via-neutral-400 to-yellow-300"
            />
            <ImageChip
              src="/logos/ruby.svg"
              label="Ruby"
              className="bg-linear-to-br from-red-500 to-red-800"
            />
            <ImageChip
              src="/logos/c++.svg"
              label="C++"
              className="bg-linear-to-br from-blue-200 to-blue-800"
            />
          </div>
        </div>
        <div className="flex flex-col gap-5">
          <div className="flex w-full items-center justify-between tracking-widest font-normal text-base text-neutral-900">
            Frameworks
          </div>
          <div className="grid grid-cols-2 w-full gap-2">
            <ImageChip
              src="/logos/react.svg"
              label="React"
              className="bg-linear-to-br from-cyan-400 to-cyan-600"
            />
            <ImageChip
              src="/logos/nextjs.svg"
              label="NextJS"
              className="bg-linear-to-b from-neutral-100 via-neutral-300 to-neutral-100"
            />
            <ImageChip
              src="/logos/node.svg"
              label="NodeJS"
              className="bg-linear-to-r from-neutral-100 from-15% via-lime-800 to-neutral-100"
            />
            <ImageChip
              src="/logos/rails.svg"
              label="Ruby on Rails"
              className="bg-linear-to-br from-red-400 to-red-700"
            />
          </div>
        </div>
        <div className="flex flex-col gap-5">
          <div className="flex w-full items-center justify-between tracking-widest font-normal text-base text-neutral-900">
            Tools and Platforms
          </div>
          <div className="grid grid-cols-2 w-full gap-2">
            <ImageChip
              src="/logos/docker.svg"
              label="Docker"
              className="bg-linear-to-br from-blue-400 to-blue-600"
            />
            <ImageChip
              src="/logos/kubernetes.svg"
              label="Kubernetes"
              className="bg-linear-to-br from-blue-700 to-blue-900"
            />
            <ImageChip
              src="/logos/git.svg"
              label="Git"
              className="bg-linear-to-br from-orange-500 to-orange-700"
            />
            <ImageChip
              src="/logos/postgres.svg"
              label="Postgres"
              className="bg-linear-to-br from-cyan-700 to-cyan-900"
            />
            <ImageChip
              src="/logos/azure.svg"
              label="Azure"
              className="bg-linear-to-r from-sky-800 to-sky-300"
            />
            <ImageChip
              src="/logos/figma.svg"
              label="Figma"
              className="bg-linear-to-br/longer from-orange-400 from-15% to-green-500"
            />
          </div>
        </div>
      </div>
    </div>
  )
}

function ImageChip({ src, label, className }: { src: string; label: string; className?: string }) {
  return (
    <div className="flex w-full items-center">
      <div className="relative flex rounded-full h-12 w-12 overflow-hidden bg-white raised-off-page-dark justify-center items-center">
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
