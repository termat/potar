import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'Potar',
  description: 'ポタリングの記録',
  viewport:'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=0',
  twitter:{
    card:'summary_large_image',
    site:'@t_mat'
  },
  openGraph: {
    url: 'https://termat.github.io/potar/',
    title: 'potar：ポタリングの記録',
    description:'ポタリングした地域を3D地図上で俯瞰するWebアプリの実験サイトです。',
    image:'https://termat.github.io/potar/icons/back2.jpg'
  },
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>{children}</body>
    </html>
  )
}
