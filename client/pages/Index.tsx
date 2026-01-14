import { useState, useMemo } from 'react';

export default function Index() {
  // Practice Configuration
  const [providers, setProviders] = useState(5);
  const [clinics, setClinics] = useState(1);
  const [isSoloPractice, setIsSoloPractice] = useState(false);
  
  // Financial Inputs
  const [annualRevenuePerProvider, setAnnualRevenuePerProvider] = useState(750000);
  const [currentDenialRate, setCurrentDenialRate] = useState(21);
  const [dailyDocTime, setDailyDocTime] = useState(2.5);
  const [medipyxisPrice, setMedipyxisPrice] = useState(500);
  
  // Current Software Stack Costs (what they're paying for 8 tools today)
  const [currentSoftwareCosts, setCurrentSoftwareCosts] = useState({
    ehr: 300,           // EHR system per user/month
    scheduling: 50,     // Scheduling software
    crm: 150,           // CRM/BD tool
    billing: 200,       // Billing/claims
    hr: 75,             // HR/Credentialing
    lms: 50,            // Training/LMS
    inventory: 100,     // Inventory management
    analytics: 75       // Analytics/Reporting
  });
  
  // Toggle for detailed view
  const [showDetailedCosts, setShowDetailedCosts] = useState(false);

  // Constants
  const SALESFORCE_HC_LICENSE = 700; // Up to $700/user/month for Health Cloud
  const SALESFORCE_UPFRONT = 250000; // Custom development
  const SALESFORCE_REPLACES = 2; // Only replaces CRM and maybe some analytics - 2 of 8 capabilities
  const MEDIPYXIS_STARTUP_STANDARD = 25000;
  const MEDIPYXIS_STARTUP_SOLO = 5000;
  const MEDIPYXIS_DENIAL_RATE = 1;
  const DOC_TIME_REDUCTION = 0.70;
  const PROVIDER_HOURLY_RATE = 150;
  const WORKING_DAYS_PER_YEAR = 250;

  // Tools Salesforce DOESN'T replace (6 of 8)
  const additionalToolsWithSalesforce = {
    ehr: { name: 'EHR System', cost: 300, replaced: false },
    scheduling: { name: 'Scheduling', cost: 50, replaced: false },
    billing: { name: 'Billing/Claims', cost: 200, replaced: false },
    hr: { name: 'HR/Credentialing', cost: 75, replaced: false },
    lms: { name: 'Training/LMS', cost: 50, replaced: false },
    inventory: { name: 'Inventory Mgmt', cost: 100, replaced: false }
  };

  const calculations = useMemo(() => {
    // Medipyxis Costs
    const medipyxisStartup = isSoloPractice ? MEDIPYXIS_STARTUP_SOLO : MEDIPYXIS_STARTUP_STANDARD;
    const medipyxisMonthly = providers * medipyxisPrice;
    const medipyxis3YearCost = medipyxisStartup + (medipyxisMonthly * 12 * 3);
    
    // Current State: Cost of 8 separate tools
    const currentMonthlyPerUser = Object.values(currentSoftwareCosts).reduce((a, b) => a + b, 0);
    const currentMonthlyTotal = currentMonthlyPerUser * providers;
    const current3YearCost = currentMonthlyTotal * 12 * 3;
    
    // Salesforce Alternative: HC license + 6 other tools they still need
    const sfAdditionalToolsCost = (
      currentSoftwareCosts.ehr + 
      currentSoftwareCosts.scheduling + 
      currentSoftwareCosts.billing + 
      currentSoftwareCosts.hr + 
      currentSoftwareCosts.lms + 
      currentSoftwareCosts.inventory
    );
    const salesforceMonthlyPerUser = SALESFORCE_HC_LICENSE + sfAdditionalToolsCost;
    const salesforceMonthlyTotal = salesforceMonthlyPerUser * providers;
    const salesforce3YearCost = SALESFORCE_UPFRONT + (salesforceMonthlyTotal * 12 * 3);
    
    // Cost Savings vs Current State
    const savingsVsCurrent = current3YearCost - medipyxis3YearCost;
    
    // Cost Savings vs Salesforce
    const savingsVsSalesforce = salesforce3YearCost - medipyxis3YearCost;
    
    // Time Savings
    const hoursSavedPerProviderPerDay = dailyDocTime * DOC_TIME_REDUCTION;
    const hoursSavedPerProviderPerYear = hoursSavedPerProviderPerDay * WORKING_DAYS_PER_YEAR;
    const totalHoursSaved3Year = hoursSavedPerProviderPerYear * providers * 3;
    const timeSavingsValue3Year = totalHoursSaved3Year * PROVIDER_HOURLY_RATE;
    
    // Revenue Gains from Reduced Denials
    const denialRateImprovement = (currentDenialRate - MEDIPYXIS_DENIAL_RATE) / 100;
    const additionalRevenuePerProviderPerYear = annualRevenuePerProvider * denialRateImprovement;
    const totalAdditionalRevenue3Year = additionalRevenuePerProviderPerYear * providers * 3;
    
    // Total Benefits (vs current state - the realistic comparison)
    const totalBenefits3Year = savingsVsCurrent + timeSavingsValue3Year + totalAdditionalRevenue3Year;
    
    // ROI vs Current State
    const roiVsCurrent = ((totalBenefits3Year) / medipyxis3YearCost) * 100;
    const netGain3Year = totalBenefits3Year;
    
    // ROI vs Salesforce (if they were considering building on SF)
    const totalBenefitsVsSalesforce = savingsVsSalesforce + timeSavingsValue3Year + totalAdditionalRevenue3Year;
    const roiVsSalesforce = ((totalBenefitsVsSalesforce) / medipyxis3YearCost) * 100;
    
    // Per Provider Metrics
    const perProviderSoftwareSavings3Year = savingsVsCurrent / providers;
    const perProviderRevGain3Year = additionalRevenuePerProviderPerYear * 3;
    const perProviderTimeSavings3Year = hoursSavedPerProviderPerYear * 3 * PROVIDER_HOURLY_RATE;
    const perProviderTotalBenefit = perProviderSoftwareSavings3Year + perProviderRevGain3Year + perProviderTimeSavings3Year;
    
    // Payback period in months
    const monthlyBenefit = (savingsVsCurrent / 36) + (timeSavingsValue3Year / 36) + (totalAdditionalRevenue3Year / 36);
    const paybackMonths = medipyxisStartup / monthlyBenefit;

    return {
      // Medipyxis
      medipyxisStartup,
      medipyxisMonthly,
      medipyxis3YearCost,
      
      // Current State
      currentMonthlyPerUser,
      currentMonthlyTotal,
      current3YearCost,
      
      // Salesforce
      salesforceMonthlyPerUser,
      salesforceMonthlyTotal,
      salesforce3YearCost,
      sfAdditionalToolsCost,
      
      // Savings
      savingsVsCurrent,
      savingsVsSalesforce,
      
      // Time
      hoursSavedPerProviderPerYear,
      totalHoursSaved3Year,
      timeSavingsValue3Year,
      
      // Revenue
      additionalRevenuePerProviderPerYear,
      totalAdditionalRevenue3Year,
      denialRateImprovement: denialRateImprovement * 100,
      
      // ROI
      totalBenefits3Year,
      roiVsCurrent,
      roiVsSalesforce,
      netGain3Year,
      paybackMonths,
      
      // Per Provider
      perProviderSoftwareSavings3Year,
      perProviderRevGain3Year,
      perProviderTimeSavings3Year,
      perProviderTotalBenefit
    };
  }, [providers, clinics, isSoloPractice, annualRevenuePerProvider, currentDenialRate, dailyDocTime, medipyxisPrice, currentSoftwareCosts]);

  const formatCurrency = (num: number) => {
    if (Math.abs(num) >= 1000000) {
      return `$${(num / 1000000).toFixed(2)}M`;
    }
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(num);
  };

  const formatNumber = (num: number) => {
    return new Intl.NumberFormat('en-US', { maximumFractionDigits: 0 }).format(num);
  };

  const ComparisonBar = ({ label, values, colors, labels }: {
    label: string;
    values: number[];
    colors: string[];
    labels: string[];
  }) => {
    const max = Math.max(...values);
    
    return (
      <div style={{ marginBottom: '24px' }}>
        <div style={{ fontSize: '13px', color: '#8893A8', marginBottom: '10px', fontWeight: '500' }}>{label}</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {values.map((value, idx) => (
            <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{ width: '120px', fontSize: '12px', color: '#212371', flexShrink: 0, fontWeight: '500' }}>{labels[idx]}</div>
              <div style={{ flex: 1, height: '32px', backgroundColor: '#EDEEF2', borderRadius: '6px', overflow: 'hidden' }}>
                <div style={{
                  width: `${(value / max) * 100}%`,
                  height: '100%',
                  background: colors[idx],
                  borderRadius: '6px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'flex-end',
                  paddingRight: '12px',
                  transition: 'width 0.5s ease',
                  minWidth: '100px'
                }}>
                  <span style={{ color: 'white', fontSize: '13px', fontWeight: '600' }}>{formatCurrency(value)}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  const updateSoftwareCost = (key: string, value: string) => {
    setCurrentSoftwareCosts(prev => ({
      ...prev,
      [key]: Number(value)
    }));
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: '#F7F8F9',
      padding: '0',
      fontFamily: "'Nunito', -apple-system, BlinkMacSystemFont, sans-serif"
    }}>
      <style>{`
        .roi-header {
          background: white;
          border-bottom: 1px solid #EDEEF2;
          padding: 16px 40px;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }
        .roi-header-buttons {
          display: flex;
          gap: 12px;
          align-items: center;
        }
        .roi-main-grid {
          display: grid;
          grid-template-columns: 420px 1fr;
          gap: 32px;
        }
        .roi-hero-metrics {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 16px;
        }
        .roi-comparison-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 16px;
        }
        .roi-provider-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 20px;
        }

        @media (max-width: 1024px) {
          .roi-main-grid {
            grid-template-columns: 1fr;
          }
          .roi-hero-metrics {
            grid-template-columns: repeat(2, 1fr);
          }
        }

        @media (max-width: 768px) {
          .roi-header {
            padding: 12px 20px;
            flex-direction: column;
            gap: 16px;
          }
          .roi-header-buttons {
            flex-wrap: wrap;
            width: 100%;
            justify-content: center;
            gap: 8px;
          }
          .roi-header-buttons a {
            flex: 1;
            min-width: 140px;
            text-align: center;
            font-size: 14px !important;
            padding: 8px 16px !important;
          }
          .roi-hero-metrics {
            grid-template-columns: 1fr;
          }
          .roi-comparison-grid {
            grid-template-columns: 1fr;
          }
          .roi-provider-grid {
            grid-template-columns: 1fr;
          }
          h1 {
            font-size: 32px !important;
          }
        }

        @media (max-width: 480px) {
          .roi-header {
            padding: 12px 16px;
          }
          .roi-header img {
            height: 32px !important;
          }
          .roi-header-buttons {
            flex-direction: column;
            width: 100%;
          }
          .roi-header-buttons a {
            width: 100%;
          }
          h1 {
            font-size: 28px !important;
          }
          p {
            font-size: 16px !important;
          }
        }

        .roi-content-wrapper {
          max-width: 1400px;
          margin: 0 auto;
          padding: 40px 20px;
        }

        .roi-hero-header {
          text-align: center;
          margin-bottom: 48px;
        }

        @media (max-width: 768px) {
          .roi-hero-header {
            margin-bottom: 32px;
          }
        }

        @media (max-width: 640px) {
          .roi-content-wrapper {
            padding: 24px 16px;
          }
          .roi-main-grid > div {
            padding: 20px !important;
          }
          .roi-hero-header {
            margin-bottom: 24px;
          }
        }
      `}</style>
      {/* Top Navigation Bar */}
      <div className="roi-header">
        <img
          src="https://cdn.builder.io/api/v1/image/assets%2Fac116b107b2244fa838b813a8e2e3216%2Fb21f5995810142abbe9cee6599bfe39a?format=webp&width=800"
          alt="Medipyxis Logo"
          style={{
            height: '40px',
            width: 'auto',
            objectFit: 'contain'
          }}
        />
        <div className="roi-header-buttons">
          <a
            href="https://storage.googleapis.com/msgsndr/gwLlGQ7RXvOTbVZjTWZs/media/6967bad4cd8665e2ca22fd56.pdf"
            target="_blank"
            rel="noopener noreferrer"
            style={{
              padding: '10px 20px',
              borderRadius: '6px',
              background: '#188bf6',
              color: 'white',
              fontSize: '15px',
              fontWeight: '600',
              textDecoration: 'none',
              transition: 'all 0.2s ease',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.background = '#1576d1';
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.background = '#188bf6';
            }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="10"/>
              <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/>
              <line x1="12" y1="17" x2="12.01" y2="17"/>
            </svg>
            0% Financing Available
          </a>
          <a
            href="https://medipyxis.com/pricing-contact-form"
            target="_blank"
            rel="noopener noreferrer"
            style={{
              padding: '10px 24px',
              borderRadius: '6px',
              border: '2px solid #37ca37',
              background: 'white',
              color: '#37ca37',
              fontSize: '15px',
              fontWeight: '600',
              textDecoration: 'none',
              transition: 'all 0.2s ease',
              cursor: 'pointer'
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.background = '#37ca37';
              e.currentTarget.style.color = 'white';
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.background = 'white';
              e.currentTarget.style.color = '#37ca37';
            }}
          >
            Get Pricing
          </a>
          <a
            href="https://medipyxis.com/schedule-a-demo-call"
            target="_blank"
            rel="noopener noreferrer"
            style={{
              padding: '10px 24px',
              borderRadius: '6px',
              background: '#37ca37',
              color: 'white',
              fontSize: '15px',
              fontWeight: '600',
              textDecoration: 'none',
              transition: 'all 0.2s ease',
              cursor: 'pointer',
              boxShadow: '0 2px 8px rgba(55, 202, 55, 0.3)'
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.background = '#2db82d';
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.background = '#37ca37';
            }}
          >
            Book a Demo
          </a>
        </div>
      </div>

      <div className="roi-content-wrapper">

        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '48px' }}>
          <h1 style={{
            fontSize: '44px',
            fontWeight: '800',
            color: '#212371',
            margin: '0 0 12px 0',
            letterSpacing: '-0.02em',
            fontFamily: "'Inter', sans-serif"
          }}>ROI Calculator</h1>
          <p style={{
            fontSize: '18px',
            color: '#8893A8',
            margin: 0,
            maxWidth: '700px',
            marginLeft: 'auto',
            marginRight: 'auto'
          }}>
            Replace 8 fragmented tools with one unified platform. See your 3-year savings.
          </p>
        </div>

        {/* Main Grid */}
        <div className="roi-main-grid">
          
          {/* Input Panel */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            
            {/* Practice Config */}
            <div style={{
              background: 'white',
              borderRadius: '12px',
              border: '1px solid #EDEEF2',
              padding: '28px',
              boxShadow: '0 1px 3px rgba(0,0,0,0.06)'
            }}>
              <h2 style={{
                fontSize: '16px',
                fontWeight: '600',
                color: '#212371',
                margin: '0 0 20px 0',
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                fontFamily: "'Inter', sans-serif"
              }}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#37ca37" strokeWidth="2">
                  <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
                  <circle cx="9" cy="7" r="4"/>
                  <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
                  <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
                </svg>
                Practice Configuration
              </h2>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                
                {/* Solo Practice Toggle */}
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '12px 16px',
                  background: isSoloPractice ? 'rgba(55, 202, 55, 0.08)' : '#F7F8F9',
                  borderRadius: '10px',
                  border: `1px solid ${isSoloPractice ? '#37ca37' : '#EDEEF2'}`,
                  cursor: 'pointer',
                  transition: 'all 0.2s ease'
                }}
                onClick={() => {
                  setIsSoloPractice(!isSoloPractice);
                  if (!isSoloPractice) setProviders(1);
                }}>
                  <span style={{ fontSize: '14px', color: '#212371' }}>Solo Practice</span>
                  <div style={{
                    width: '44px',
                    height: '24px',
                    background: isSoloPractice ? '#37ca37' : '#CBD5E0',
                    borderRadius: '12px',
                    position: 'relative',
                    transition: 'background 0.2s ease'
                  }}>
                    <div style={{
                      width: '18px',
                      height: '18px',
                      background: 'white',
                      borderRadius: '50%',
                      position: 'absolute',
                      top: '3px',
                      left: isSoloPractice ? '23px' : '3px',
                      transition: 'left 0.2s ease'
                    }}/>
                  </div>
                </div>
                
                {/* Providers */}
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                    <label style={{ fontSize: '14px', color: '#8893A8' }}>Providers</label>
                    <span style={{ fontSize: '14px', color: '#37ca37', fontWeight: '600' }}>{providers}</span>
                  </div>
                  <input
                    type="range"
                    min="1"
                    max="50"
                    value={providers}
                    onChange={(e) => setProviders(Number(e.target.value))}
                    disabled={isSoloPractice}
                    style={{
                      width: '100%',
                      height: '6px',
                      borderRadius: '3px',
                      background: `linear-gradient(to right, #37ca37 0%, #37ca37 ${(providers/50)*100}%, #EDEEF2 ${(providers/50)*100}%)`,
                      appearance: 'none',
                      cursor: isSoloPractice ? 'not-allowed' : 'pointer',
                      opacity: isSoloPractice ? 0.5 : 1
                    }}
                  />
                </div>

                {/* Clinics */}
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                    <label style={{ fontSize: '14px', color: '#8893A8' }}>Clinic Locations</label>
                    <span style={{ fontSize: '14px', color: '#37ca37', fontWeight: '600' }}>{clinics}</span>
                  </div>
                  <input
                    type="range"
                    min="1"
                    max="20"
                    value={clinics}
                    onChange={(e) => setClinics(Number(e.target.value))}
                    style={{
                      width: '100%',
                      height: '6px',
                      borderRadius: '3px',
                      background: `linear-gradient(to right, #37ca37 0%, #37ca37 ${(clinics/20)*100}%, #EDEEF2 ${(clinics/20)*100}%)`,
                      appearance: 'none',
                      cursor: 'pointer'
                    }}
                  />
                </div>

                {/* Medipyxis Price */}
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                    <label style={{ fontSize: '14px', color: '#8893A8' }}>Medipyxis Price/Provider</label>
                    <span style={{ fontSize: '14px', color: '#37ca37', fontWeight: '600' }}>${medipyxisPrice}/mo</span>
                  </div>
                  <input
                    type="range"
                    min="200"
                    max="600"
                    step="25"
                    value={medipyxisPrice}
                    onChange={(e) => setMedipyxisPrice(Number(e.target.value))}
                    style={{
                      width: '100%',
                      height: '6px',
                      borderRadius: '3px',
                      background: `linear-gradient(to right, #37ca37 0%, #37ca37 ${((medipyxisPrice-200)/400)*100}%, #EDEEF2 ${((medipyxisPrice-200)/400)*100}%)`,
                      appearance: 'none',
                      cursor: 'pointer'
                    }}
                  />
                </div>
                
                {/* Startup Cost Display */}
                <div style={{
                  padding: '14px 16px',
                  background: 'rgba(55, 202, 55, 0.08)',
                  borderRadius: '10px',
                  border: '1px solid rgba(55, 202, 55, 0.2)'
                }}>
                  <div style={{ fontSize: '12px', color: '#8893A8', marginBottom: '4px' }}>Medipyxis Startup Cost</div>
                  <div style={{ fontSize: '20px', fontWeight: '700', color: '#37ca37' }}>
                    {formatCurrency(calculations.medipyxisStartup)}
                    <span style={{ fontSize: '12px', fontWeight: '400', color: '#8893A8', marginLeft: '8px' }}>
                      ({isSoloPractice ? 'Solo' : 'Standard'})
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Financial Inputs */}
            <div style={{
              background: 'white',
              borderRadius: '12px',
              border: '1px solid #EDEEF2',
              padding: '28px',
              boxShadow: '0 1px 3px rgba(0,0,0,0.06)'
            }}>
              <h2 style={{
                fontSize: '16px',
                fontWeight: '600',
                color: '#212371',
                fontFamily: "'Inter', sans-serif",
                margin: '0 0 20px 0',
                display: 'flex',
                alignItems: 'center',
                gap: '10px'
              }}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#188bf6" strokeWidth="2">
                  <line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>
                </svg>
                Financial Metrics
              </h2>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                
                {/* Annual Revenue */}
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                    <label style={{ fontSize: '14px', color: '#8893A8' }}>Annual Revenue / Provider</label>
                    <span style={{ fontSize: '14px', color: '#188bf6', fontWeight: '600' }}>{formatCurrency(annualRevenuePerProvider)}</span>
                  </div>
                  <input
                    type="range"
                    min="250000"
                    max="2000000"
                    step="50000"
                    value={annualRevenuePerProvider}
                    onChange={(e) => setAnnualRevenuePerProvider(Number(e.target.value))}
                    style={{
                      width: '100%',
                      height: '6px',
                      borderRadius: '3px',
                      background: `linear-gradient(to right, #188bf6 0%, #188bf6 ${((annualRevenuePerProvider-250000)/1750000)*100}%, #EDEEF2 ${((annualRevenuePerProvider-250000)/1750000)*100}%)`,
                      appearance: 'none',
                      cursor: 'pointer'
                    }}
                  />
                </div>

                {/* Current Denial Rate */}
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                    <label style={{ fontSize: '14px', color: '#8893A8' }}>Current Denial Rate</label>
                    <span style={{ fontSize: '14px', color: '#f59e0b', fontWeight: '600' }}>{currentDenialRate}%</span>
                  </div>
                  <input
                    type="range"
                    min="5"
                    max="35"
                    value={currentDenialRate}
                    onChange={(e) => setCurrentDenialRate(Number(e.target.value))}
                    style={{
                      width: '100%',
                      height: '6px',
                      borderRadius: '3px',
                      background: `linear-gradient(to right, #f59e0b 0%, #f59e0b ${((currentDenialRate-5)/30)*100}%, #EDEEF2 ${((currentDenialRate-5)/30)*100}%)`,
                      appearance: 'none',
                      cursor: 'pointer'
                    }}
                  />
                </div>

                {/* Daily Doc Time */}
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                    <label style={{ fontSize: '14px', color: '#8893A8' }}>Daily Doc Time / Provider</label>
                    <span style={{ fontSize: '14px', color: '#188bf6', fontWeight: '600' }}>{dailyDocTime} hrs</span>
                  </div>
                  <input
                    type="range"
                    min="1"
                    max="5"
                    step="0.5"
                    value={dailyDocTime}
                    onChange={(e) => setDailyDocTime(Number(e.target.value))}
                    style={{
                      width: '100%',
                      height: '6px',
                      borderRadius: '3px',
                      background: `linear-gradient(to right, #188bf6 0%, #188bf6 ${((dailyDocTime-1)/4)*100}%, #EDEEF2 ${((dailyDocTime-1)/4)*100}%)`,
                      appearance: 'none',
                      cursor: 'pointer'
                    }}
                  />
                </div>
              </div>
            </div>

            {/* Current Software Stack */}
            <div style={{
              background: 'white',
              borderRadius: '12px',
              border: '1px solid #EDEEF2',
              padding: '28px',
              boxShadow: '0 1px 3px rgba(0,0,0,0.06)'
            }}>
              <div 
                style={{ 
                  display: 'flex', 
                  justifyContent: 'space-between', 
                  alignItems: 'center',
                  marginBottom: showDetailedCosts ? '20px' : '0',
                  cursor: 'pointer'
                }}
                onClick={() => setShowDetailedCosts(!showDetailedCosts)}
              >
                <h2 style={{
                  fontSize: '16px',
                  fontWeight: '600',
                  color: '#212371',
                  margin: 0,
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                  fontFamily: "'Inter', sans-serif"
                }}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#f59e0b" strokeWidth="2">
                    <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
                    <line x1="3" y1="9" x2="21" y2="9"/>
                    <line x1="9" y1="21" x2="9" y2="9"/>
                  </svg>
                  Current 8-Tool Stack
                </h2>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <span style={{ fontSize: '14px', color: '#f59e0b', fontWeight: '600' }}>
                    {formatCurrency(calculations.currentMonthlyPerUser)}/user/mo
                  </span>
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="#8893A8"
                    strokeWidth="2"
                    style={{ 
                      transform: showDetailedCosts ? 'rotate(180deg)' : 'rotate(0deg)',
                      transition: 'transform 0.2s ease'
                    }}
                  >
                    <polyline points="6 9 12 15 18 9"/>
                  </svg>
                </div>
              </div>

              {showDetailedCosts && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  {Object.entries(currentSoftwareCosts).map(([key, value]) => (
                    <div key={key} style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <span style={{
                        fontSize: '13px',
                        color: '#8893A8',
                        width: '120px',
                        textTransform: 'capitalize'
                      }}>
                        {key === 'ehr' ? 'EHR' : key === 'crm' ? 'CRM/BD' : key === 'hr' ? 'HR/Cred' : key === 'lms' ? 'LMS' : key}
                      </span>
                      <input
                        type="number"
                        value={value}
                        onChange={(e) => updateSoftwareCost(key, e.target.value)}
                        style={{
                          flex: 1,
                          padding: '8px 12px',
                          background: '#F7F8F9',
                          border: '1px solid #EDEEF2',
                          borderRadius: '6px',
                          color: '#212371',
                          fontSize: '13px'
                        }}
                      />
                      <span style={{ fontSize: '12px', color: '#8893A8' }}>/mo</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Results Panel */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            
            {/* Hero Metrics */}
            <div className="roi-hero-metrics">
              
              {/* ROI */}
              <div style={{
                background: 'white',
                borderRadius: '12px',
                border: '2px solid #37ca37',
                padding: '24px',
                textAlign: 'center',
                boxShadow: '0 4px 12px rgba(55, 202, 55, 0.15)'
              }}>
                <div style={{ fontSize: '12px', color: '#8893A8', marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: '600' }}>3-Year ROI</div>
                <div style={{
                  fontSize: '42px',
                  fontWeight: '800',
                  color: '#37ca37',
                  lineHeight: 1,
                  fontFamily: "'Inter', sans-serif"
                }}>{formatNumber(calculations.roiVsCurrent)}%</div>
                <div style={{ fontSize: '11px', color: '#8893A8', marginTop: '4px' }}>vs current stack</div>
              </div>

              {/* Net Gain */}
              <div style={{
                background: 'white',
                borderRadius: '12px',
                border: '1px solid #EDEEF2',
                padding: '24px',
                textAlign: 'center',
                boxShadow: '0 1px 3px rgba(0,0,0,0.06)'
              }}>
                <div style={{ fontSize: '12px', color: '#8893A8', marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: '600' }}>Net Gain (3yr)</div>
                <div style={{ fontSize: '32px', fontWeight: '700', color: '#37ca37', lineHeight: 1, fontFamily: "'Inter', sans-serif" }}>
                  {formatCurrency(calculations.netGain3Year)}
                </div>
              </div>

              {/* Payback */}
              <div style={{
                background: 'white',
                borderRadius: '12px',
                border: '1px solid #EDEEF2',
                padding: '24px',
                textAlign: 'center',
                boxShadow: '0 1px 3px rgba(0,0,0,0.06)'
              }}>
                <div style={{ fontSize: '12px', color: '#8893A8', marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: '600' }}>Payback Period</div>
                <div style={{ fontSize: '32px', fontWeight: '700', color: '#212371', lineHeight: 1, fontFamily: "'Inter', sans-serif" }}>
                  {calculations.paybackMonths.toFixed(1)}
                </div>
                <div style={{ fontSize: '11px', color: '#8893A8', marginTop: '4px' }}>months</div>
              </div>

              {/* Hours Saved */}
              <div style={{
                background: 'white',
                borderRadius: '12px',
                border: '1px solid #EDEEF2',
                padding: '24px',
                textAlign: 'center',
                boxShadow: '0 1px 3px rgba(0,0,0,0.06)'
              }}>
                <div style={{ fontSize: '12px', color: '#8893A8', marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: '600' }}>Hours Saved (3yr)</div>
                <div style={{ fontSize: '32px', fontWeight: '700', color: '#188bf6', lineHeight: 1, fontFamily: "'Inter', sans-serif" }}>
                  {formatNumber(calculations.totalHoursSaved3Year)}
                </div>
              </div>
            </div>

            {/* 3-Way Cost Comparison */}
            <div style={{
              background: 'white',
              borderRadius: '12px',
              border: '1px solid #EDEEF2',
              padding: '32px',
              boxShadow: '0 1px 3px rgba(0,0,0,0.06)'
            }}>
              <h3 style={{ fontSize: '16px', fontWeight: '600', color: '#212371', margin: '0 0 24px 0', fontFamily: "'Inter', sans-serif" }}>
                3-Year Total Cost Comparison
              </h3>
              
              <ComparisonBar 
                label="Total Cost Over 3 Years (Software + Startup)"
                values={[
                  calculations.medipyxis3YearCost,
                  calculations.current3YearCost,
                  calculations.salesforce3YearCost
                ]}
                labels={['Medipyxis', 'Current 8 Tools', 'Salesforce HC + 6 Tools']}
                colors={[
                  '#37ca37',
                  '#f59e0b',
                  '#ef4444'
                ]}
              />
              
              <div className="roi-comparison-grid" style={{
                marginTop: '20px',
                padding: '20px',
                background: '#F7F8F9',
                borderRadius: '12px'
              }}>
                <div>
                  <div style={{ fontSize: '11px', color: '#8893A8', marginBottom: '4px', fontWeight: '600' }}>MEDIPYXIS</div>
                  <div style={{ fontSize: '13px', color: '#212371' }}>
                    {formatCurrency(calculations.medipyxisStartup)} startup + {formatCurrency(calculations.medipyxisMonthly)}/mo
                  </div>
                  <div style={{ fontSize: '11px', color: '#37ca37', marginTop: '4px', fontWeight: '600' }}>✓ Replaces all 8 tools</div>
                </div>
                <div>
                  <div style={{ fontSize: '11px', color: '#8893A8', marginBottom: '4px', fontWeight: '600' }}>CURRENT STATE</div>
                  <div style={{ fontSize: '13px', color: '#212371' }}>
                    {formatCurrency(calculations.currentMonthlyTotal)}/mo across 8 systems
                  </div>
                  <div style={{ fontSize: '11px', color: '#f59e0b', marginTop: '4px', fontWeight: '600' }}>⚠ Fragmented, no integration</div>
                </div>
                <div>
                  <div style={{ fontSize: '11px', color: '#8893A8', marginBottom: '4px', fontWeight: '600' }}>SALESFORCE HEALTH CLOUD</div>
                  <div style={{ fontSize: '13px', color: '#212371' }}>
                    $250K + {formatCurrency(calculations.salesforceMonthlyTotal)}/mo
                  </div>
                  <div style={{ fontSize: '11px', color: '#ef4444', marginTop: '4px', fontWeight: '600' }}>✗ Only replaces 2 of 8 tools</div>
                </div>
              </div>
            </div>

            {/* Detailed Comparison Table */}
            <div style={{
              background: 'white',
              borderRadius: '12px',
              border: '1px solid #EDEEF2',
              padding: '32px',
              overflow: 'hidden',
              boxShadow: '0 1px 3px rgba(0,0,0,0.06)'
            }}>
              <h3 style={{ fontSize: '16px', fontWeight: '600', color: '#212371', margin: '0 0 24px 0', fontFamily: "'Inter', sans-serif" }}>
                Detailed Comparison
              </h3>

              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: '600px' }}>
                  <thead>
                    <tr>
                      <th style={{ textAlign: 'left', padding: '12px 16px', fontSize: '11px', color: '#8893A8', textTransform: 'uppercase', letterSpacing: '0.05em', borderBottom: '2px solid #EDEEF2', fontWeight: '600' }}>Metric</th>
                      <th style={{ textAlign: 'right', padding: '12px 16px', fontSize: '11px', color: '#37ca37', textTransform: 'uppercase', letterSpacing: '0.05em', borderBottom: '2px solid #EDEEF2', fontWeight: '600' }}>Medipyxis</th>
                      <th style={{ textAlign: 'right', padding: '12px 16px', fontSize: '11px', color: '#f59e0b', textTransform: 'uppercase', letterSpacing: '0.05em', borderBottom: '2px solid #EDEEF2', fontWeight: '600' }}>Current Stack</th>
                      <th style={{ textAlign: 'right', padding: '12px 16px', fontSize: '11px', color: '#ef4444', textTransform: 'uppercase', letterSpacing: '0.05em', borderBottom: '2px solid #EDEEF2', fontWeight: '600' }}>Salesforce HC</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td style={{ padding: '14px 16px', fontSize: '13px', color: '#8893A8', borderBottom: '1px solid #EDEEF2' }}>Upfront Cost</td>
                      <td style={{ padding: '14px 16px', fontSize: '13px', color: '#212371', textAlign: 'right', fontWeight: '500', borderBottom: '1px solid #EDEEF2' }}>{formatCurrency(calculations.medipyxisStartup)}</td>
                      <td style={{ padding: '14px 16px', fontSize: '13px', color: '#212371', textAlign: 'right', fontWeight: '500', borderBottom: '1px solid #EDEEF2' }}>$0</td>
                      <td style={{ padding: '14px 16px', fontSize: '13px', color: '#212371', textAlign: 'right', fontWeight: '500', borderBottom: '1px solid #EDEEF2' }}>$250,000</td>
                    </tr>
                    <tr>
                      <td style={{ padding: '14px 16px', fontSize: '13px', color: '#8893A8', borderBottom: '1px solid #EDEEF2' }}>Monthly Cost / Provider</td>
                      <td style={{ padding: '14px 16px', fontSize: '13px', color: '#37ca37', textAlign: 'right', fontWeight: '600', borderBottom: '1px solid #EDEEF2' }}>${medipyxisPrice}</td>
                      <td style={{ padding: '14px 16px', fontSize: '13px', color: '#212371', textAlign: 'right', fontWeight: '500', borderBottom: '1px solid #EDEEF2' }}>{formatCurrency(calculations.currentMonthlyPerUser)}</td>
                      <td style={{ padding: '14px 16px', fontSize: '13px', color: '#ef4444', textAlign: 'right', fontWeight: '500', borderBottom: '1px solid #EDEEF2' }}>{formatCurrency(calculations.salesforceMonthlyPerUser)}</td>
                    </tr>
                    <tr>
                      <td style={{ padding: '14px 16px', fontSize: '13px', color: '#8893A8', borderBottom: '1px solid #EDEEF2' }}>Tools Included</td>
                      <td style={{ padding: '14px 16px', fontSize: '13px', color: '#37ca37', textAlign: 'right', fontWeight: '600', borderBottom: '1px solid #EDEEF2' }}>8 of 8</td>
                      <td style={{ padding: '14px 16px', fontSize: '13px', color: '#f59e0b', textAlign: 'right', fontWeight: '500', borderBottom: '1px solid #EDEEF2' }}>8 (separate)</td>
                      <td style={{ padding: '14px 16px', fontSize: '13px', color: '#ef4444', textAlign: 'right', fontWeight: '500', borderBottom: '1px solid #EDEEF2' }}>2 of 8</td>
                    </tr>
                    <tr>
                      <td style={{ padding: '14px 16px', fontSize: '13px', color: '#8893A8', borderBottom: '1px solid #EDEEF2' }}>Additional Tools Needed</td>
                      <td style={{ padding: '14px 16px', fontSize: '13px', color: '#37ca37', textAlign: 'right', fontWeight: '500', borderBottom: '1px solid #EDEEF2' }}>None</td>
                      <td style={{ padding: '14px 16px', fontSize: '13px', color: '#8893A8', textAlign: 'right', fontWeight: '500', borderBottom: '1px solid #EDEEF2' }}>—</td>
                      <td style={{ padding: '14px 16px', fontSize: '13px', color: '#ef4444', textAlign: 'right', fontWeight: '500', borderBottom: '1px solid #EDEEF2' }}>6 tools (+{formatCurrency(calculations.sfAdditionalToolsCost)}/user)</td>
                    </tr>
                    <tr>
                      <td style={{ padding: '14px 16px', fontSize: '13px', color: '#8893A8', borderBottom: '1px solid #EDEEF2' }}>3-Year Total Cost</td>
                      <td style={{ padding: '14px 16px', fontSize: '13px', color: '#37ca37', textAlign: 'right', fontWeight: '600', borderBottom: '1px solid #EDEEF2' }}>{formatCurrency(calculations.medipyxis3YearCost)}</td>
                      <td style={{ padding: '14px 16px', fontSize: '13px', color: '#f59e0b', textAlign: 'right', fontWeight: '600', borderBottom: '1px solid #EDEEF2' }}>{formatCurrency(calculations.current3YearCost)}</td>
                      <td style={{ padding: '14px 16px', fontSize: '13px', color: '#ef4444', textAlign: 'right', fontWeight: '600', borderBottom: '1px solid #EDEEF2' }}>{formatCurrency(calculations.salesforce3YearCost)}</td>
                    </tr>
                    <tr>
                      <td style={{ padding: '14px 16px', fontSize: '13px', color: '#8893A8', borderBottom: '1px solid #EDEEF2' }}>Denial Rate</td>
                      <td style={{ padding: '14px 16px', fontSize: '13px', color: '#37ca37', textAlign: 'right', fontWeight: '500', borderBottom: '1px solid #EDEEF2' }}>&lt;1%</td>
                      <td style={{ padding: '14px 16px', fontSize: '13px', color: '#f59e0b', textAlign: 'right', fontWeight: '500', borderBottom: '1px solid #EDEEF2' }}>{currentDenialRate}%</td>
                      <td style={{ padding: '14px 16px', fontSize: '13px', color: '#f59e0b', textAlign: 'right', fontWeight: '500', borderBottom: '1px solid #EDEEF2' }}>{currentDenialRate}%</td>
                    </tr>
                    <tr>
                      <td style={{ padding: '14px 16px', fontSize: '13px', color: '#8893A8', borderBottom: '1px solid #EDEEF2' }}>Doc Time Reduction</td>
                      <td style={{ padding: '14px 16px', fontSize: '13px', color: '#37ca37', textAlign: 'right', fontWeight: '500', borderBottom: '1px solid #EDEEF2' }}>70%</td>
                      <td style={{ padding: '14px 16px', fontSize: '13px', color: '#8893A8', textAlign: 'right', fontWeight: '500', borderBottom: '1px solid #EDEEF2' }}>—</td>
                      <td style={{ padding: '14px 16px', fontSize: '13px', color: '#8893A8', textAlign: 'right', fontWeight: '500', borderBottom: '1px solid #EDEEF2' }}>—</td>
                    </tr>
                    <tr>
                      <td style={{ padding: '14px 16px', fontSize: '13px', color: '#8893A8' }}>Revenue Recovered (3yr)</td>
                      <td style={{ padding: '14px 16px', fontSize: '13px', color: '#37ca37', textAlign: 'right', fontWeight: '600' }}>{formatCurrency(calculations.totalAdditionalRevenue3Year)}</td>
                      <td style={{ padding: '14px 16px', fontSize: '13px', color: '#8893A8', textAlign: 'right', fontWeight: '500' }}>—</td>
                      <td style={{ padding: '14px 16px', fontSize: '13px', color: '#8893A8', textAlign: 'right', fontWeight: '500' }}>—</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            {/* Per Provider Impact */}
            <div style={{
              background: 'white',
              borderRadius: '12px',
              border: '1px solid #EDEEF2',
              padding: '32px',
              boxShadow: '0 1px 3px rgba(0,0,0,0.06)'
            }}>
              <h3 style={{ fontSize: '16px', fontWeight: '600', color: '#212371', margin: '0 0 20px 0', fontFamily: "'Inter', sans-serif" }}>
                Per Provider Impact (3 Years)
              </h3>
              
              <div className="roi-provider-grid">
                <div>
                  <div style={{ fontSize: '11px', color: '#8893A8', marginBottom: '4px', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Software Savings</div>
                  <div style={{ fontSize: '26px', fontWeight: '700', color: '#37ca37', fontFamily: "'Inter', sans-serif" }}>{formatCurrency(calculations.perProviderSoftwareSavings3Year)}</div>
                </div>
                <div>
                  <div style={{ fontSize: '11px', color: '#8893A8', marginBottom: '4px', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Time Value Saved</div>
                  <div style={{ fontSize: '26px', fontWeight: '700', color: '#188bf6', fontFamily: "'Inter', sans-serif" }}>{formatCurrency(calculations.perProviderTimeSavings3Year)}</div>
                </div>
                <div>
                  <div style={{ fontSize: '11px', color: '#8893A8', marginBottom: '4px', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Revenue Recovered</div>
                  <div style={{ fontSize: '26px', fontWeight: '700', color: '#37ca37', fontFamily: "'Inter', sans-serif" }}>{formatCurrency(calculations.perProviderRevGain3Year)}</div>
                </div>
              </div>
              
              <div style={{
                marginTop: '20px',
                paddingTop: '20px',
                borderTop: '2px solid #EDEEF2',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
              }}>
                <span style={{ fontSize: '14px', color: '#8893A8', fontWeight: '600' }}>Total Benefit Per Provider</span>
                <span style={{ fontSize: '36px', fontWeight: '800', color: '#37ca37', fontFamily: "'Inter', sans-serif" }}>{formatCurrency(calculations.perProviderTotalBenefit)}</span>
              </div>
            </div>

            {/* Executive Summary */}
            <div style={{
              background: 'white',
              borderRadius: '12px',
              border: '1px solid #EDEEF2',
              padding: '32px',
              boxShadow: '0 1px 3px rgba(0,0,0,0.06)'
            }}>
              <h3 style={{ fontSize: '16px', fontWeight: '600', color: '#212371', margin: '0 0 16px 0', fontFamily: "'Inter', sans-serif" }}>
                Executive Summary
              </h3>
              <p style={{ fontSize: '15px', color: '#212371', lineHeight: 1.8, margin: 0 }}>
                For {isSoloPractice ? 'a solo practice' : `a practice with ${providers} providers across ${clinics} ${clinics === 1 ? 'location' : 'locations'}`},
                Medipyxis delivers a <strong style={{ color: '#37ca37' }}>{formatNumber(calculations.roiVsCurrent)}% ROI</strong> over 3 years
                compared to your current 8-tool stack. By consolidating everything into one platform, reducing documentation time by 70%,
                and cutting denial rates from {currentDenialRate}% to under 1%, your total benefit is <strong style={{ color: '#37ca37' }}>{formatCurrency(calculations.netGain3Year)}</strong>.
                {' '}The {formatCurrency(calculations.medipyxisStartup)} startup investment pays back in just <strong style={{ color: '#188bf6' }}>{calculations.paybackMonths.toFixed(1)} months</strong>.
                {' '}Compared to building on Salesforce Health Cloud (which only replaces 2 of 8 tools and costs {formatCurrency(calculations.salesforce3YearCost)} over 3 years),
                Medipyxis saves you an additional <strong style={{ color: '#37ca37' }}>{formatCurrency(calculations.savingsVsSalesforce)}</strong>.
              </p>
            </div>

            {/* Disclaimer */}
            <div style={{ fontSize: '12px', color: '#8893A8', textAlign: 'center', padding: '0 20px' }}>
              * Estimates based on industry averages and typical Medipyxis outcomes. Actual results may vary based on practice specifics.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
