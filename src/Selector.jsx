import React from 'react'

function Selector({selector, setSelector}) {
    const handleSelection = (event) => {
        setSelector(event.target.value);
    }
  return (
    <>
        <label>
            <select name='selectedEcon' value={selector} onChange={handleSelection}>
                <option value='gdp'>GDP</option>
                <option value='unemployment'>Uneployment Rate</option>
                <option value='inflation'>Inflation Rate</option>
                <option value='interestRate'>Interest Rate</option>
            </select>
        </label>
    </>
  )
}

export default Selector