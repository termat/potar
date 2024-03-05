import { Inter } from 'next/font/google'
import './globals.css'
 
export const viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
}

const inter = Inter({ subsets: ['latin'] })

document.addEventListener("gesturestart", function (e) {
	e.preventDefault();
    document.body.style.zoom = 0.99;
});

document.addEventListener("gesturechange", function (e) {
	e.preventDefault();

  document.body.style.zoom = 0.99;
});
document.addEventListener("gestureend", function (e) {
	  e.preventDefault();
    document.body.style.zoom = 1;
});

export const metadata = {
  title: 'Potar',
  description: 'ポタリングの記録',
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
