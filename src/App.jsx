import { useState } from 'react'
import './App.css'

function App() {
  const [currentSavings, setCurrentSavings] = useState('')
  const [monthlyContribution, setMonthlyContribution] = useState('')
  const [annualReturn, setAnnualReturn] = useState('7')
  const [yearsToRetirement, setYearsToRetirement] = useState('')
  const [results, setResults] = useState(null)
  const [showRuleModal, setShowRuleModal] = useState(false)

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
              <button 
                className="learn-more-btn"
                onClick={() => setShowRuleModal(true)}
              >
                Learn More About the 4% Rule
              </button>
            </div>
          </div>
        )}

        {showRuleModal && (
          <div className="modal-overlay" onClick={() => setShowRuleModal(false)}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
              <div className="modal-header">
                <h2>The 4% Rule: A Comprehensive Guide</h2>
                <button 
                  className="modal-close-btn"
                  onClick={() => setShowRuleModal(false)}
                  aria-label="Close modal"
                >
                  ×
                </button>
              </div>
              
              <div className="modal-body">
                <section className="rule-section">
                  <h3>What is the 4% Rule?</h3>
                  <p>
                    The 4% rule is a retirement planning guideline that suggests you can safely 
                    withdraw 4% of your retirement portfolio in the first year of retirement, 
                    then adjust that amount annually for inflation. This strategy is designed 
                    to make your money last for at least 30 years.
                  </p>
                </section>

                <section className="rule-section">
                  <h3>Historical Background</h3>
                  <p>
                    The 4% rule was developed by financial advisor William Bengen in 1994. 
                    His research analyzed historical market data from 1926-1992 and found that 
                    a portfolio of 50% stocks and 50% bonds could sustain a 4% withdrawal rate 
                    through various market conditions, including the Great Depression and 
                    multiple recessions.
                  </p>
                </section>

                <section className="rule-section">
                  <h3>Key Assumptions</h3>
                  <ul>
                    <li><strong>Portfolio Composition:</strong> Typically assumes a balanced portfolio of stocks and bonds</li>
                    <li><strong>Time Horizon:</strong> Designed for a 30-year retirement period</li>
                    <li><strong>Inflation Adjustments:</strong> Annual increases to maintain purchasing power</li>
                    <li><strong>No Additional Income:</strong> Assumes no Social Security, pensions, or part-time work</li>
                    <li><strong>Consistent Withdrawals:</strong> Same percentage withdrawn regardless of market performance</li>
                  </ul>
                </section>

                <section className="rule-section">
                  <h3>Important Considerations</h3>
                  <ul>
                    <li><strong>Market Conditions:</strong> Current low interest rates and high valuations may require more conservative withdrawal rates</li>
                    <li><strong>Sequence of Returns Risk:</strong> Poor market performance early in retirement can significantly impact portfolio longevity</li>
                    <li><strong>Flexibility:</strong> The rule works best when you can adjust spending during market downturns</li>
                    <li><strong>Healthcare Costs:</strong> Rising medical expenses may require additional planning beyond the 4% rule</li>
                  </ul>
                </section>

                <section className="rule-section">
                  <h3>Alternatives and Modifications</h3>
                  <p>
                    Some experts suggest more dynamic approaches, such as the "bucket strategy" 
                    or variable withdrawal rates based on market performance. Others recommend 
                    starting with 3.5% or using a "guardrails" approach where spending adjusts 
                    based on portfolio performance.
                  </p>
                </section>

                <section className="rule-section">
                  <h3>Bottom Line</h3>
                  <p>
                    The 4% rule provides a useful starting point for retirement planning, but 
                    it should be one tool among many. Consider your unique circumstances, risk 
                    tolerance, and other income sources when planning your retirement withdrawals. 
                    Regular reviews and adjustments may be necessary based on changing market 
                    conditions and personal needs.
                  </p>
                </section>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default App
