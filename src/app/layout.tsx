import '@/app/globals.css'
import { Noto_Sans_KR } from 'next/font/google'

const notoSansKr = Noto_Sans_KR({
  subsets: ['latin'],
  weight: ['400', '500', '700']
})

export const metadata = {
  title: '글쓰기 나침반',
  description: '글쓰기 능력 향상을 위한 맞춤형 분석 도우미',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ko">
      <head>
        <link
          href="https://cdnjs.cloudflare.com/ajax/libs/tailwindcss/2.2.19/tailwind.min.css"
          rel="stylesheet"
        />
      </head>
      <body className={notoSansKr.className}>
        {children}
      </body>
    </html>
  )
}
