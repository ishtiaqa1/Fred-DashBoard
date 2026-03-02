import React from 'react'
import { FaGithub, FaLinkedin, FaEnvelope, FaGlobe } from 'react-icons/fa';
import './Footer.css'

function Footer() {
  return (
    <footer>
        <a href="https://github.com/ishtiaqa1" target="_blank" rel="noreferrer">
            <FaGithub />
        </a>
        <a href="https://www.linkedin.com/in/ishtiaq-akanda/" target="_blank" rel="noreferrer">
            <FaLinkedin />
        </a>
        <a href='mailto:ishtiaqa2003@gmail.com' target="_blank" rel="noreferrer">
            <FaEnvelope />
        </a>
        <a href='https://ishtiaqakanda.dev/' target="_blank" rel="noreferrer">
            <FaGlobe />
        </a>
    </footer>
  )
}

export default Footer