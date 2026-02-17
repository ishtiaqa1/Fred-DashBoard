import React from 'react'
import './Selector.css'

function Selector({selector, setSelector}) {
    const handleSelection = (event) => {
        setSelector(event.target.value);
    }
  return (
            <select name='selectedEcon' value={selector} onChange={handleSelection}>
                <option value='gdp'>GDP</option>
                <option value='unemployment'>Unemployment Rate</option>
                <option value='inflation'>Inflation Rate</option>
                <option value='interestRate'>Interest Rate</option>
            </select>
  )
}

export default Selector