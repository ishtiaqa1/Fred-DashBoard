import React from 'react'

function IndicatorCard({title, value, date, note}) {
  return (
    <>
        <div className='card'>
            <h3>{title}</h3>
            <p>{value}</p>
            <small>Last Updated: {date}</small>
            {note && <small style={{ display: 'block', marginTop: '0.25rem', color: 'var(--text-muted)', fontSize: '0.6rem' }}>{note}</small>}
        </div>
    </>
  )
}

export default IndicatorCard