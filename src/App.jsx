import { useState } from 'react'
import './App.css'

function App() {
  const [withdrawalStrategy, setWithdrawalStrategy] = useState('4percent')
  const [currentSavings, setCurrentSavings] = useState('')
  const [monthlyContribution, setMonthlyContribution] = useState('')
  const [annualReturn, setAnnualReturn] = useState('7')
  const [yearsToRetirement, setYearsToRetirement] = useState('')
  const [retirementDuration, setRetirementDuration] = useState('30')
  const [results, setResults] = useState(null)

  const calculateRetirement = () => {
    // Convert inputs to numbers
    const currentSavingsNum = parseFloat(currentSavings) || 0
    const monthlyContributionNum = parseFloat(monthlyContribution) || 0
    const annualReturnNum = parseFloat(annualReturn) / 100
    const yearsToRetirementNum = parseInt(yearsToRetirement) || 0
    const retirementDurationNum = parseInt(retirementDuration) || 30

    // Calculate future value of current savings
    const futureValueCurrentSavings = currentSavingsNum * Math.pow(1 + annualReturnNum, yearsToRetirementNum)

    // Calculate future value of monthly contributions (annuity)
    const monthlyReturnRate = annualReturnNum / 12
    const totalMonths = yearsToRetirementNum * 12
    const futureValueContributions = monthlyContributionNum * 
      ((Math.pow(1 + monthlyReturnRate, totalMonths) - 1) / monthlyReturnRate)

    // Total retirement savings
    const totalRetirementSavings = futureValueCurrentSavings + futureValueContributions

    // Calculate withdrawals based on selected strategy
    let annualWithdrawal = 0
    let strategyName = ''
    let strategyDescription = ''

    switch (withdrawalStrategy) {
      case '4percent': {
        annualWithdrawal = totalRetirementSavings * 0.04
        strategyName = '4% Rule'
        strategyDescription = 'The 4% rule suggests that you can safely withdraw 4% of your retirement portfolio each year without running out of money for at least 30 years. This calculation assumes your investments continue to grow during retirement.'
        break
      }
      case '1overN': {
        annualWithdrawal = totalRetirementSavings / retirementDurationNum
        strategyName = '1/N Withdrawal'
        strategyDescription = `The 1/N strategy divides your total retirement savings by the number of years you expect to be retired (${retirementDurationNum} years). This provides a simple way to ensure your money lasts exactly as long as planned, but doesn't account for investment growth during retirement.`
        break
      }
      case 'cape': {
        // Simplified CAPE-based withdrawal (using a market valuation adjustment)
        // Assume current CAPE ratio of 25 (average), adjust withdrawal rate accordingly
        const capeRatio = 25 // This could be made dynamic in a real implementation
        const normalCape = 16 // Historical average
        const adjustmentFactor = normalCape / capeRatio
        const adjustedRate = 0.04 * adjustmentFactor
        annualWithdrawal = totalRetirementSavings * Math.max(0.02, Math.min(0.06, adjustedRate))
        strategyName = 'CAPE-Based Withdrawal'
        strategyDescription = `CAPE-based withdrawal adjusts your withdrawal rate based on market valuation. When markets are expensive (high CAPE ratio), you withdraw less. When they're cheap, you can withdraw more. This helps reduce sequence of returns risk. Current estimated safe withdrawal rate: ${(Math.max(0.02, Math.min(0.06, adjustedRate)) * 100).toFixed(1)}%.`
        break
      }
      default: {
        annualWithdrawal = totalRetirementSavings * 0.04
        strategyName = '4% Rule'
        strategyDescription = 'The 4% rule suggests that you can safely withdraw 4% of your retirement portfolio each year without running out of money for at least 30 years.'
      }
    }

    const monthlyWithdrawal = annualWithdrawal / 12

    setResults({
      totalSavings: totalRetirementSavings,
      annualWithdrawal: annualWithdrawal,
      monthlyWithdrawal: monthlyWithdrawal,
      strategyName: strategyName,
      strategyDescription: strategyDescription
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
        <h1>Retirement Withdrawal Calculator</h1>
        <p>Calculate how much you can safely withdraw in retirement using different strategies</p>
      </header>

      <div className="calculator">
        <div className="input-section">
          <h2>Your Financial Information</h2>
          
          <div className="input-group">
            <label htmlFor="withdrawalStrategy">Withdrawal Strategy</label>
            <select
              id="withdrawalStrategy"
              value={withdrawalStrategy}
              onChange={(e) => setWithdrawalStrategy(e.target.value)}
              className="strategy-select"
            >
              <option value="4percent">4% Rule</option>
              <option value="1overN">1/N Withdrawals</option>
              <option value="cape">CAPE-Based</option>
            </select>
          </div>
          
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

          {withdrawalStrategy === '1overN' && (
            <div className="input-group">
              <label htmlFor="retirementDuration">Expected Years in Retirement</label>
              <input
                type="number"
                id="retirementDuration"
                value={retirementDuration}
                onChange={(e) => setRetirementDuration(e.target.value)}
                placeholder="e.g., 30"
              />
            </div>
          )}

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
              <h3>Annual Withdrawal ({results.strategyName})</h3>
              <p className="amount">{formatCurrency(results.annualWithdrawal)}</p>
            </div>

            <div className="result-card">
              <h3>Monthly Withdrawal</h3>
              <p className="amount">{formatCurrency(results.monthlyWithdrawal)}</p>
            </div>

            <div className="explanation">
              <h3>About {results.strategyName}</h3>
              <p>
                {results.strategyDescription}
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default App
