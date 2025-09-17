import { useState } from 'react'
import './App.css'

function App() {
  const [currentSavings, setCurrentSavings] = useState('')
  const [monthlyContribution, setMonthlyContribution] = useState('')
  const [annualReturn, setAnnualReturn] = useState('7')
  const [yearsToRetirement, setYearsToRetirement] = useState('')
  
  // Real rate of return calculation inputs
  const [nominalReturn, setNominalReturn] = useState('')
  const [inflationRate, setInflationRate] = useState('')
  
  // Social security inputs
  const [socialSecurityMonthly, setSocialSecurityMonthly] = useState('')
  const [yearsUntilSocialSecurity, setYearsUntilSocialSecurity] = useState('')
  
  const [results, setResults] = useState(null)

  const calculateRealReturn = () => {
    const nominal = parseFloat(nominalReturn) / 100 || 0
    const inflation = parseFloat(inflationRate) / 100 || 0
    
    // Real rate = (1 + nominal) / (1 + inflation) - 1
    const realRate = ((1 + nominal) / (1 + inflation) - 1) * 100
    return realRate
  }

  const calculateRetirement = () => {
    // Convert inputs to numbers
    const currentSavingsNum = parseFloat(currentSavings) || 0
    const monthlyContributionNum = parseFloat(monthlyContribution) || 0
    const annualReturnNum = parseFloat(annualReturn) / 100
    const yearsToRetirementNum = parseInt(yearsToRetirement) || 0
    
    // Social security inputs
    const socialSecurityMonthlyNum = parseFloat(socialSecurityMonthly) || 0
    const yearsUntilSocialSecurityNum = parseInt(yearsUntilSocialSecurity) || 0

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
    
    // Calculate social security income
    const annualSocialSecurity = socialSecurityMonthlyNum * 12
    
    // Total annual income (withdrawal + social security)
    const totalAnnualIncome = annualWithdrawal + annualSocialSecurity
    const totalMonthlyIncome = totalAnnualIncome / 12

    setResults({
      totalSavings: totalRetirementSavings,
      annualWithdrawal: annualWithdrawal,
      monthlyWithdrawal: monthlyWithdrawal,
      annualSocialSecurity: annualSocialSecurity,
      monthlySocialSecurity: socialSecurityMonthlyNum,
      totalAnnualIncome: totalAnnualIncome,
      totalMonthlyIncome: totalMonthlyIncome,
      realRateOfReturn: nominalReturn && inflationRate ? calculateRealReturn() : null,
      yearsUntilSocialSecurity: yearsUntilSocialSecurityNum
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

          <div className="input-section-divider">
            <h3>Real Rate of Return Calculator</h3>
          </div>

          <div className="input-group">
            <label htmlFor="nominalReturn">Nominal Annual Return (%)</label>
            <input
              type="number"
              id="nominalReturn"
              value={nominalReturn}
              onChange={(e) => setNominalReturn(e.target.value)}
              placeholder="e.g., 10"
              step="0.1"
            />
          </div>

          <div className="input-group">
            <label htmlFor="inflationRate">Expected Inflation Rate (%)</label>
            <input
              type="number"
              id="inflationRate"
              value={inflationRate}
              onChange={(e) => setInflationRate(e.target.value)}
              placeholder="e.g., 3"
              step="0.1"
            />
          </div>

          <div className="input-section-divider">
            <h3>Social Security Income</h3>
          </div>

          <div className="input-group">
            <label htmlFor="socialSecurityMonthly">Monthly Social Security ($)</label>
            <input
              type="number"
              id="socialSecurityMonthly"
              value={socialSecurityMonthly}
              onChange={(e) => setSocialSecurityMonthly(e.target.value)}
              placeholder="e.g., 2500"
            />
          </div>

          <div className="input-group">
            <label htmlFor="yearsUntilSocialSecurity">Years Until Social Security Starts</label>
            <input
              type="number"
              id="yearsUntilSocialSecurity"
              value={yearsUntilSocialSecurity}
              onChange={(e) => setYearsUntilSocialSecurity(e.target.value)}
              placeholder="e.g., 35"
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

            {results.realRateOfReturn && (
              <div className="result-card">
                <h3>Your Real Rate of Return</h3>
                <p className="amount">{results.realRateOfReturn.toFixed(2)}%</p>
              </div>
            )}

            {results.monthlySocialSecurity > 0 && (
              <>
                <div className="result-card">
                  <h3>Monthly Social Security</h3>
                  <p className="amount">{formatCurrency(results.monthlySocialSecurity)}</p>
                  <p className="subtitle">Starting in {results.yearsUntilSocialSecurity} years</p>
                </div>

                <div className="result-card highlight">
                  <h3>Total Monthly Retirement Income</h3>
                  <p className="amount">{formatCurrency(results.totalMonthlyIncome)}</p>
                  <p className="subtitle">Withdrawal + Social Security</p>
                </div>
              </>
            )}

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
