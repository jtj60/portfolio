import { ShineBorder } from '@/components/ui/shine-border'
import Image from 'next/image'
import SectionTitle from './sectionTitle'
import { cn } from '@/lib/utils'
import { title } from 'process'

export default function Timeline() {
  return (
    <div className="flex flex-col w-full justify-center items-center">
      <SectionTitle title="Career Timeline" />

      <div className="relative w-full max-w-7xl mx-auto">
        <div className="hidden md:block absolute left-1/2 right-1/2 -translate-x-1/2 -top-9.5 -bottom-13 z-10 pointer-events-none">
          <ShineBorder
            shineColor={['#5a75ff', '#f176c5', '#425fff', '#ec4fb4']}
            borderTop={0}
            borderBottom={0}
            borderRight={0}
            borderLeft={4}
            className="z-10 h-full w-0"
          />
        </div>
        <div className="hidden md:flex flex-col gap-12">
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
                  <ProjectItems projects={node?.projects ?? []} index={index} />
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
    <div className={cn('relative w-full pr-20')}>
      <div className={cn('text-left w-full text-right')}>
        <div className="text-2xl md:text-6xl text-neutral-900 pb-1">{node.year}</div>
        <div className={cn('text-xl md:text-4xl font-bold pb-4 tracking-wide', node.titleColor)}>
          {node.title}
        </div>
        <p
          className={cn(
            'text-neutral-700 text-xs md:text-base whitespace-pre-line',
            index === timelineNodes.length - 1 && 'pb-10'
          )}
        >
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
        'absolute left-1/2 -translate-x-1/2 top-0 bottom-0 z-20 justify-self-center h-full pl-1'
      )}
    >
      <div className="relative h-14 w-14 md:h-16 md:w-16 rounded-full backdrop-blur-xs bg-white/10 flex items-center justify-center raised-off-page">
        <Image
          src={node.imageUrl}
          alt={`${node.title} logo`}
          width={node.size}
          height={node.size}
          className="object-contain z-0"
        />
      </div>
    </div>
  )
}

function ProjectItems({ projects, index }: { projects: TimelineNodeProject[]; index: number }) {
  return (
    <div className="relative flex flex-col gap-8 w-full">
      {projects?.map((project, proj_index) => (
        <div className={cn('relative flex flex-col pl-10 w-full text-left')} key={proj_index}>
          <div className={cn('text-xl md:text-2xl font-bold pb-1 tracking-wide text-neutral-600')}>
            {project.year}
          </div>
          <div className={cn('text-lg md:text-xl font-bold pb-4 tracking-wide text-neutral-900')}>
            {project.title}
          </div>

          <p
            className={cn(
              'text-neutral-700 text-xs md:text-base whitespace-pre-line',
              index === timelineNodes.length - 1 && 'pb-10'
            )}
          >
            {project.paragraph}
          </p>
          <SmallNode />
        </div>
      ))}
    </div>
  )
}

function SmallNode() {
  return (
    <div className="absolute z-50 -translate-x-1/2 top-1 left-[2px] bottom-0 h-4 w-4 md:h-6 md:w-6 rounded-full backdrop-blur-xs bg-white/10 flex items-center justify-center raised-off-page" />
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
}

const timelineNodes = [
  {
    imageUrl: '/logos/arkansas.png',
    year: '2016',
    title: 'University of Arkansas',
    paragraph: `I started my college career at the University of Arkansas, pursuing a degree infinance. I spent the first year mostly doing general education requirements, with a sprinkling of business classes thrown in. The second year was more business focused, and I slowly started realizing that business probably wasn't for me. Close to the start of the third year, I was sitting in the lecture hall listening to the professor discuss the finer points of accounting. Without quite realizing what I was doing, I stood up and walked out. On the bus home, the plan started to formulate. I was going to transfer to Texas State, and switch my major to philosophy! That night I called my parents. They were fine with the school switch, but not so much the major. I needed a more practical major if I wanted to go through with my plan.`,
    borderColor: 'border-red-700',
    paragraphBorder: 'border-red-700',
    titleColor: 'text-red-700',
    size: 100,
    mobileSize: 100,
  },
  {
    imageUrl: '/logos/texas-state.png',
    year: '2019',
    title: 'Texas State University',
    paragraph: `The search for a new major didn't take long. After the philosophy veto, I proposed my backup — computer science — which they accepted without issue. I didn't know the first thing about computer science or software engineering; it was essentially a whim based on “well I've always liked computers...” The first semester was rough. The classes themselves were more challenging than what I was used to, and, coupled with being in an entirely new city, I struggled quite a bit. The following summer, I realized it was time to buckle down, and that's what I did. Something finally clicked with computer science, and I began devoting all my spare time to it.`,
    borderColor: 'border-amber-900',
    paragraphBorder: 'border-amber-900',
    titleColor: 'text-amber-900',
    size: 45,
    mobileSize: 35,
    projects: [
      {
        title: 'Elo Rankings',
        year: 'June 2020',
        paragraph: `A simple project that outputs matchup predictions based on leaguewide match results up to thatp point. It utilizes a basic Elo formula popularized by Chess rankings. Needs larger sample size and more meaningful input to increase accuracy.`,

        skills: ['C++'],
      },
      {
        title: 'NBA Scoring Margin Predictor',
        year: 'October 2021',
        paragraph: `Final project for my Machine Learning course. We decided to attempt predicting the scoring margin of NBA games. The process was straightfoward: ingest all box score data (game stats) from the previous season, add additional advanced stats, manipulate and normalize data, and run various ML models. Our resulting scores ranged from 18-21%. For better accuracy, we would need to dive deeper into the data. Using players instead of teams, historical matchups between players, etc...`,
        skills: ['Python'],
      },
    ],
  },

  {
    imageUrl: '/logos/sock-club.png',
    year: '2022',
    title: 'Sock Club',
    paragraph: `My professional career began at a small startup in Austin, called Sock Club. They were a custom sock company. Essentially, customers would send in ideas and logos, the design team would come up with sock designs, and then they would be sent off to the factory for production. I joined the team just as development began on their new major effort, a joint storefront and customer dashboard. While I aided in that effort - fixing UI bugs and helping with the migration to NextJS, most of my time was spent building two things - a Logo Color Converter and a Design Knittability Tool. 
                     
            The Logo Color Converter was something the CEO desired for a long time. Sock Club had 52 yarn colors, but logos would come in with an incredible amount of variation between pixels. The design team had to manually convert each pixel into a yarn color, and this could take hours and hours for each logo. Using ImageMagick color manipulations and palette mapping, my tool achieved a 95% accuracy on logo conversions.
            
            The Design Knittability tool had also been long-desired. Our factory machines had certain specifications and rules, and if those rules were broken, a template could not be used. Our designs were sent back multiple times per week, and it was a pain for both our design team and for the factories. My product manager and I sat down to brainstorm, and realized that instead of trying to recreate the rules with a ton of conditionals, we just needed to simulate the machine itself. I built a state machine to run the templates through, and it predicted 'knittability' with 100% confidence. As far as I'm aware, none of the templates that my tool approved have been sent back to date.  
            `,
    borderColor: 'border-red-500',
    paragraphBorder: 'border-red-500',
    titleColor: 'text-red-500',
    size: 50,
    mobileSize: 45,
  },
  {
    imageUrl: '/logos/gmf.png',
    year: '2023',
    title: 'General Motors Financial',
    paragraph: `I continued my journey at GMF, the captive finance arm of General Motors. Among many things, GMF handles financing for General Motors vehicles. I joined the Cybersecurity organization as a member of the vulnerability management team. Our team was responsible for detecting and reporting all infrastructure and software vulnerabilities across the company. We used a variety of tools to achieve this, and I was hired to put the results of those tools onto an Internal Dashboard for use by all infrastructure and development teams across the company.
                     
            There were three developers working on this project with me. Our lead had many responsibilities outside of this project, but he was there to guide me on architecture and design decisions. Another member of our team handled most of the dev ops work. I was responsible for building both the frontend and backend, along with designing the UI/UX, and architecting the database. 
            
            Due to the nature of the data we were providing to our users, this app required extensive security protocols. We were required to abide by the principle of least access, and employed the organization's Azure Active Directory (Entra) via MSAL to handle the RBAC solution. Furthermore, we had to have near perfect scores within our vulnerability tools to 'set an example'. Upon release, teams across the company had access to their real-time vulnerabilities.
            `,
    borderColor: 'border-blue-600',
    paragraphBorder: 'border-blue-600',
    titleColor: 'text-blue-600',
    size: 45,
    mobileSize: 40,
  },
  {
    imageUrl: '/logos/dorado.png',
    year: '2025',
    title: 'Dorado Metals Exchange',
    paragraph: `Towards the end of my time at GMF, my manager let the whole team know that most of the software engineering responsibilities were going away. I figured I was at a good point in my career to try and strike out on my own. I decided to form the business a buddy and I had been discussing for several years - Dorado Metals Exchange was born. Our goal was to take the shady business that is buying and selling precious metals, and build a company that customers can trust. Transparency, convenience, trustworthiness - these would (and do) help us stand out from the rest. I'm ostensibly the CTO, and handle all of the development. Although as with any startup, I've been required to wear many hats. Talking to customers, handling social media, balancing our books - I've done it all.

            On the development side, I decided to go with a stack I was comfortable with - Express/NodeJS/Postgres on the backend, NextJS and Typescript on the frontend. As the only developer on our team, I've handled everything. Authentication and authorization, database architecture and management, UI/UX design, 3rd party API integration, dev ops, testing... If I had known all what it would take when I began, I'm not sure I would have started in the first place.

            While Dorado is going to remain in operation, my part in it is over. Like most startups, it hasn't taken off quite the way we wanted/expected/hoped. The development is 'done', and any maintenance work that pops up can be done in my spare time. I'm extremely proud of Dorado, it might represent a short period of my life, but I've learned more during it than at any other point.
            `,
    borderColor: 'primary-gradient-border-left',
    paragraphBorder: 'primary-gradient-border-bottom',
    titleColor: 'text-primary-gradient',
    size: 35,
    mobileSize: 35,
  },
]
