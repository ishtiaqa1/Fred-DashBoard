import React from 'react'

function IndicatorCard({title, value, date}) {
  return (
    <>
        <div className='card'>
            <h3>{title}</h3>
            <p>{value}</p>
            <small>Last Updated: {date}</small>
        </div>
    </>
  )
}

export default IndicatorCard