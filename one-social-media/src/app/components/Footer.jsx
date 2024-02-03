import React from 'react'
import { footerLinks } from '../data/Data'
const Footer = () => {
  const date = new Date;
  return (
    <footer className='footer h-[10dvh] flex flex-col max-md:text-[0.5rem] text-[0.8rem] justify-center text-black-100 text-[#fff] bg-[#000]'>
    <div className='flex justify-center flex-wrap gap-4'>
      <div className='flex gap-20'>
        {footerLinks.map((link) => (
          <div key={link.title}>
            <h3 className='font-bold mb-1'>{link.title}</h3>
            {link.links.map((item) =>(
                <li  
                key={item.title} 
                href={item.url}
                className='text-gray-500 flex cursor-pointer'
                >
                <a href={item.url}
                target='_blank'
                >
                {item.title}
                </a>
                </li>
              ))}
          </div>
        ))}
      </div>
      <div>
        <p >
          @{date.getFullYear()} osm. All Rights Reserved
        </p>
        <ul
        href='/'
        className='text-gray-500'
        >
          Privacy Policy
        </ul>

        <ul
        href='/'
        className='text-gray-500'
        >
          Terms of use
        </ul>
      </div>
    </div>
  </footer>
  )
}

export default Footer
