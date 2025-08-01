'use client'

import { FacebookIcon, InstagramIcon, XIcon } from '@/components/icons/logo'
import { Button } from '@/components/ui/button'
import formatPhoneNumber from '@/utils/formatPhoneNumber'
import Link from 'next/link'

export default function Footer() {
  return (
    <>
      <footer className="hidden lg:flex flex-col w-full bg-neutral-900 dark:bg-highest text-white px-8 py-5 raised-off-page">
        <div className="w-full mx-auto flex flex-wrap justify-between gap-10">
          <div className="flex flex-col gap-2">
            <h4 className="text-base font-medium mb-1 text-neutral-200">Resources</h4>
            
            <Link
              href="/terms-and-conditions"
              className="text-xs text-neutral-300 dark:text-neutral-700"
            >
              Terms and Conditions
            </Link>
            <Link href="/privacy-policy" className="text-xs text-neutral-300 dark:text-neutral-700">
              Privacy Policy
            </Link>

          </div>

          <div className="flex flex-col gap-2">
            <h4 className="text-lg font-medium mb-1 text-neutral-200">Socials</h4>
            <Link href="/" className="text-xs text-neutral-300 dark:text-neutral-700">
              X
            </Link>
            <Link href="/" className="text-xs text-neutral-300 dark:text-neutral-700">
              Facebook
            </Link>
            <Link
              target="_blank"
              href="https://www.instagram.com/doradometals/?utm_source=qr#"
              className="text-xs text-neutral-200 dark:text-neutral-700"
            >
              Instagram
            </Link>
          </div>

          <div className="flex flex-col gap-2">
            <h4 className="text-lg font-medium mb-1 text-neutral-200">Links</h4>
          </div>

          <div className="flex flex-col gap-2">
            <h4 className="text-lg font-medium mb-1 text-neutral-200">Organization</h4>
            <Link href="/" className="text-xs text-neutral-300 dark:text-neutral-700">
              About Us
            </Link>
          </div>

          <div className="flex flex-col gap-2">
            <h4 className="text-lg font-medium mb-1 text-neutral-200">Contact Us</h4>
            <a
              href={`tel:+${process.env.NEXT_PUBLIC_PHONE_NUMBER}`}
              className="text-xs text-neutral-300 dark:text-neutral-700"
            >
              {formatPhoneNumber(process.env.NEXT_PUBLIC_PHONE_NUMBER ?? '')}
            </a>
            <Link
              href="mailto:support@doradometals.com"
              className="text-xs text-neutral-300 dark:text-neutral-700"
            >
              jaketjohnson97@gmail.com
            </Link>
          </div>
        </div>
      </footer>

      <footer className="flex flex-col lg:hidden w-full bg-neutral-900 dark:bg-highest px-3 py-3 pt-6 raised-off-page">
        <div className="flex flex-col gap-2 w-full">
          <div className="flex w-full items-center justify-between">

            <Link
              href="/terms-and-conditions"
              className="text-xs text-neutral-200 dark:text-neutral-700"
            >
              Terms and Conditions
            </Link>
          </div>
          <div className="flex w-full items-center justify-between">
 
            <Link href="/privacy-policy" className="text-xs text-neutral-200 dark:text-neutral-700">
              Privacy Policy
            </Link>
          </div>
          <div className="flex w-full items-center justify-between">

            <Link href="/" className="text-xs text-neutral-200 dark:text-neutral-700">
              About Us
            </Link>
          </div>
          <div className="flex w-full items-center justify-between">

          </div>

          <div className="flex w-full items-center justify-between mt-4">
            <Link
              href="mailto:support@doradometals.com"
              className="text-xs text-neutral-200 dark:text-neutral-700"
            >
              jaketjohnson97@gmail.com
            </Link>
            <a
              href={`tel:+${process.env.NEXT_PUBLIC_PHONE_NUMBER}`}
              className="text-xs text-neutral-200 dark:text-neutral-700"
            >
              {formatPhoneNumber(process.env.NEXT_PUBLIC_PHONE_NUMBER ?? '')}
            </a>
          </div>
        </div>
        <div className="flex items-center w-full justify-between mt-1">
          <div className="flex items-center gap-3">
            <Button variant="ghost" className="p-0">
              <Link target="_blank" href="https://www.instagram.com/doradometals/?utm_source=qr#">
                <InstagramIcon size={20} className="text-neutral-200 dark:text-neutral-700" />
              </Link>
            </Button>
            <Button variant="ghost" className="p-0">
              <FacebookIcon size={20} className="text-neutral-200 dark:text-neutral-700" />
            </Button>
            <Button variant="ghost" className="p-0">
              <XIcon size={20} className="text-neutral-200 dark:text-neutral-700" />
            </Button>
          </div>
        </div>
      </footer>
    </>
  )
}
