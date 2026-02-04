import Image from 'next/image';

const socialLinks = [
  {
    name: 'GitHub',
    href: 'https://github.com/CyberWorld-builders',
    ariaLabel: 'Follow CyberWorld Builders on GitHub',
    icon: (
      <svg className="w-6 h-6" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
        <g clipPath="url(#clip0_github)">
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M24.0005 1C18.303 1.00296 12.7923 3.02092 8.45374 6.69305C4.11521 10.3652 1.23181 15.452 0.319089 21.044C-0.593628 26.636 0.523853 32.3684 3.47174 37.2164C6.41963 42.0643 11.0057 45.7115 16.4099 47.5059C17.6021 47.7272 18.0512 46.9883 18.0512 46.36C18.0512 45.7317 18.0273 43.91 18.0194 41.9184C11.3428 43.3608 9.93197 39.101 9.93197 39.101C8.84305 36.3349 7.26927 35.6078 7.26927 35.6078C5.09143 34.1299 7.43223 34.1576 7.43223 34.1576C9.84455 34.3275 11.1123 36.6194 11.1123 36.6194C13.2504 40.2667 16.7278 39.2116 18.0949 38.5952C18.3095 37.0501 18.9335 35.999 19.621 35.4023C14.2877 34.8017 8.68408 32.7548 8.68408 23.6108C8.65102 21.2394 9.53605 18.9461 11.156 17.2054C10.9096 16.6047 10.087 14.1785 11.3905 10.8829C11.3905 10.8829 13.4054 10.2427 17.9916 13.3289C21.9253 12.2592 26.0757 12.2592 30.0095 13.3289C34.5917 10.2427 36.6026 10.8829 36.6026 10.8829C37.9101 14.1706 37.0875 16.5968 36.8411 17.2054C38.4662 18.9464 39.353 21.2437 39.317 23.6187C39.317 32.7824 33.7015 34.8017 28.3602 35.3905C29.2186 36.1334 29.9856 37.5836 29.9856 39.8122C29.9856 43.0051 29.9578 45.5736 29.9578 46.36C29.9578 46.9962 30.391 47.7391 31.6071 47.5059C37.0119 45.7113 41.5984 42.0634 44.5462 37.2147C47.4941 32.3659 48.611 26.6326 47.6972 21.0401C46.7835 15.4476 43.8986 10.3607 39.5587 6.68921C35.2187 3.01771 29.7067 1.00108 24.0085 1H24.0005Z"
            fill="#A6E102"
          />
        </g>
        <defs>
          <clipPath id="clip0_github">
            <rect width="48" height="48" fill="white" />
          </clipPath>
        </defs>
      </svg>
    ),
  },
  {
    name: 'YouTube',
    href: 'https://youtube.com/@cyberbuilders',
    ariaLabel: 'Subscribe to CyberWorld Builders on YouTube',
    icon: (
      <svg className="w-6 h-6" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
        <path d="M43.2 12.4C42.9 11.3 42.3 10.3 41.5 9.5C40.7 8.7 39.7 8.1 38.6 7.8C35.5 7 24 7 24 7C24 7 12.5 7 9.4 7.8C8.3 8.1 7.3 8.7 6.5 9.5C5.7 10.3 5.1 11.3 4.8 12.4C4 15.5 4 23 4 23C4 23 4 30.5 4.8 33.6C5.1 34.7 5.7 35.7 6.5 36.5C7.3 37.3 8.3 37.9 9.4 38.2C12.5 39 24 39 24 39C24 39 35.5 39 38.6 38.2C39.7 37.9 40.7 37.3 41.5 36.5C42.3 35.7 42.9 34.7 43.2 33.6C44 30.5 44 23 44 23C44 23 44 15.5 43.2 12.4Z" fill="#A6E102"/>
        <path d="M20 30L31 23L20 16V30Z" fill="#181818"/>
      </svg>
    ),
  },
  {
    name: 'X',
    href: 'https://x.com/cyberbuilders',
    ariaLabel: 'Follow CyberWorld Builders on X (formerly Twitter)',
    isImage: true,
    imageSrc: '/images/x-icon.png',
  },
  {
    name: 'Facebook',
    href: 'https://www.facebook.com/cyberworldbuilders',
    ariaLabel: 'Follow CyberWorld Builders on Facebook',
    icon: (
      <svg className="w-6 h-6" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
        <path
          d="M48 24C48 10.7452 37.2548 0 24 0C10.7452 0 0 10.7452 0 24C0 35.9789 8.77641 45.908 20.25 47.7084V30.9375H14.1562V24H20.25V18.7125C20.25 12.6975 23.8331 9.375 29.3152 9.375C31.9402 9.375 34.6875 9.84375 34.6875 9.84375V15.75H31.6613C28.68 15.75 27.75 17.6002 27.75 19.5V24H34.4062L33.3422 30.9375H27.75V47.7084C39.2236 45.908 48 35.9789 48 24Z"
          fill="#A6E102"
        />
      </svg>
    ),
  },
  {
    name: 'Upwork',
    href: 'https://www.upwork.com/freelancers/jaylongcyberworld',
    ariaLabel: 'Hire Jay Long on Upwork for software engineering services',
    icon: (
      <svg className="w-6 h-6" viewBox="0 0 48 47" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
        <g clipPath="url(#clip0_upwork)">
          <path
            d="M44.4557 0H3.54624C1.58784 0 0 1.50776 0 3.36708V43.631C0 45.4922 1.58784 47 3.54624 47H44.4557C46.4141 47 48 45.4904 48 43.631V3.36708C48 1.50776 46.4141 0 44.4557 0Z"
            fill="#A6E102"
          />
          <path
            d="M35.2244 27.3295C33.3351 27.3295 31.5668 26.5456 29.9579 25.2691L30.3495 23.468L30.3668 23.4022C30.7163 21.4846 31.8222 18.2642 35.2244 18.2642C37.7761 18.2642 39.8516 20.3002 39.8516 22.8006C39.8439 25.2935 37.7684 27.3295 35.2244 27.3295ZM35.2244 13.6676C30.8775 13.6676 27.5079 16.4368 26.139 20.9902C24.0462 17.9126 22.4641 14.2184 21.5367 11.107H16.8596V23.0413C16.8596 25.3931 14.9031 27.3107 12.5031 27.3107C10.1031 27.3107 8.14858 25.3931 8.14858 23.0413V11.107H3.46954V23.0413C3.45226 27.9293 7.51114 31.9412 12.4955 31.9412C17.4798 31.9412 21.5387 27.9293 21.5387 23.0413V21.0391C22.4487 22.8984 23.5623 24.7746 24.9159 26.4441L22.0494 39.6548H26.8398L28.9153 30.0725C30.7355 31.2155 32.8283 31.9318 35.2283 31.9318C40.3585 31.9318 44.5345 27.8108 44.5345 22.7818C44.5307 17.7622 40.3547 13.6676 35.2244 13.6676Z"
            fill="#181818"
          />
        </g>
        <defs>
          <clipPath id="clip0_upwork">
            <rect width="48" height="47" fill="white" />
          </clipPath>
        </defs>
      </svg>
    ),
  },
];

export default function SocialLinks() {
  return (
    <div className="flex justify-center gap-6">
      {socialLinks.map((link) => (
        <a
          key={link.name}
          href={link.href}
          target="_blank"
          rel="noopener noreferrer"
          className="text-[#00ff00] hover:text-[#00cc00] transition"
          aria-label={link.ariaLabel}
        >
          {link.isImage ? (
            <Image
              src={link.imageSrc!}
              alt={link.ariaLabel}
              className="w-6 h-6"
              width={24}
              height={24}
              loading="lazy"
            />
          ) : (
            link.icon
          )}
        </a>
      ))}
    </div>
  );
}
