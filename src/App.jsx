import { useState } from 'react'
import './App.css'

function App() {
  const [currentSavings, setCurrentSavings] = useState('')
  const [monthlyContribution, setMonthlyContribution] = useState('')
  const [annualReturn, setAnnualReturn] = useState('7')
  const [yearsToRetirement, setYearsToRetirement] = useState('')
  const [results, setResults] = useState(null)

  const calculateRetirement = () => {
    // Convert inputs to numbers
    const currentSavingsNum = parseFloat(currentSavings) || 0
    const monthlyContributionNum = parseFloat(monthlyContribution) || 0
    const annualReturnNum = parseFloat(annualReturn) / 100
    const yearsToRetirementNum = parseInt(yearsToRetirement) || 0

    // Calculate future value of current savings
    const futureValueCurrentSavings = currentSavingsNum * Math.pow(1 + annualReturnNum, yearsToRetirementNum)

    // Calculate future value of monthly contributions (annuity)
    const monthlyReturnRate = annualReturnNum / 12
    const totalMonths = yearsToRetirementNum * 12
    const futureValueContributions = monthlyContributionNum * 
      ((Math.pow(1 + monthlyReturnRate, totalMonths) - 1) / monthlyReturnRate)

    // Total retirement savings
    const totalRetirementSavings = futureValueCurrentSavings + futureValueContributions

    // 4% rule calculations
    const annualWithdrawal = totalRetirementSavings * 0.04
    const monthlyWithdrawal = annualWithdrawal / 12

    setResults({
      totalSavings: totalRetirementSavings,
      annualWithdrawal: annualWithdrawal,
      monthlyWithdrawal: monthlyWithdrawal
    })
  }

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount)
  }

  return (
    <div className="app">
      <header>
        <h1>4% Retirement Rule Calculator</h1>
        <p>Calculate how much you can safely withdraw in retirement using the 4% rule</p>
      </header>

      <div className="calculator">
        <div className="input-section">
          <h2>Your Financial Information</h2>
          
          <div className="input-group">
            <label htmlFor="currentSavings">Current Retirement Savings ($)</label>
            <input
              type="number"
              id="currentSavings"
              value={currentSavings}
              onChange={(e) => setCurrentSavings(e.target.value)}
              placeholder="e.g., 50000"
            />
          </div>

          <div className="input-group">
            <label htmlFor="monthlyContribution">Monthly Contribution ($)</label>
            <input
              type="number"
              id="monthlyContribution"
              value={monthlyContribution}
              onChange={(e) => setMonthlyContribution(e.target.value)}
              placeholder="e.g., 1000"
            />
          </div>

          <div className="input-group">
            <label htmlFor="annualReturn">Expected Annual Return (%)</label>
            <input
              type="number"
              id="annualReturn"
              value={annualReturn}
              onChange={(e) => setAnnualReturn(e.target.value)}
              placeholder="e.g., 7"
              step="0.1"
            />
          </div>

          <div className="input-group">
            <label htmlFor="yearsToRetirement">Years Until Retirement</label>
            <input
              type="number"
              id="yearsToRetirement"
              value={yearsToRetirement}
              onChange={(e) => setYearsToRetirement(e.target.value)}
              placeholder="e.g., 30"
            />
          </div>

          <button onClick={calculateRetirement} className="calculate-btn">
            Calculate Retirement
          </button>
        </div>

        {results && (
          <div className="results-section">
            <h2>Your Retirement Projection</h2>
            
            <div className="result-card">
              <h3>Total Retirement Savings</h3>
              <p className="amount">{formatCurrency(results.totalSavings)}</p>
            </div>

            <div className="result-card">
              <h3>Annual Withdrawal (4% Rule)</h3>
              <p className="amount">{formatCurrency(results.annualWithdrawal)}</p>
            </div>

            <div className="result-card">
              <h3>Monthly Withdrawal</h3>
              <p className="amount">{formatCurrency(results.monthlyWithdrawal)}</p>
            </div>

            <div className="explanation">
              <h3>About the 4% Rule</h3>
              <p>
                The 4% rule suggests that you can safely withdraw 4% of your retirement portfolio 
                each year without running out of money for at least 30 years. This calculation 
                assumes your investments continue to grow during retirement.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default App
