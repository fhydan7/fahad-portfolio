// ============================================================
// INDUSTRY USE CASES — illustrative, hypothetical analytical case
// studies applying strategic, business-analysis, and data-analysis
// thinking across different Saudi Arabian industries.
//
// These are NOT real client engagements. Company names, figures,
// and "findings" are illustrative/hypothetical, written to
// demonstrate analytical approach across sectors beyond healthcare.
// Anonymized per the same convention as the Case Studies section.
// ============================================================

export interface UseCase {
  slug: string;
  industry: string;
  title: string;
  saudiContext: string;
  strategic: { priority: string; objective: string; rationale: string };
  businessAnalysis: { currentState: string; gap: string; rootCause: string; recommendation: string };
  dataAnalysis: { businessQuestion: string; data: string; method: string; kpis: string[]; finding: string };
  impact: string;
}

export const useCases: UseCase[] = [
  {
    slug: "mall-footfall-conversion",
    industry: "Retail / Shopping",
    title: "Shopping Mall Footfall & Conversion Analytics",
    saudiContext: "Large-format shopping malls remain central to Saudi retail even as e-commerce grows, but footfall doesn't automatically translate into sales.",
    strategic: {
      priority: "Retail Experience & Yield Optimization",
      objective: "Increase sales per visitor without expanding the mall's physical footprint.",
      rationale: "Footfall is already high in most anchor zones — the growth lever is conversion, not traffic.",
    },
    businessAnalysis: {
      currentState: "Entrance footfall is tracked by mall operations; sales are tracked separately by each tenant's own POS system.",
      gap: "No one can see which zones or time windows convert footfall into sales best, because the two datasets are never joined.",
      rootCause: "Footfall and tenant sales data sit in disconnected systems with no shared time/zone key.",
      recommendation: "Build a unified footfall-to-sales conversion model at the hourly, zone-level grain before deciding on tenant mix or promotion timing.",
    },
    dataAnalysis: {
      businessQuestion: "Which mall zones and time windows have high footfall but low conversion, and what's different about them?",
      data: "Entrance counter data, tenant sales feeds (aggregated, anonymized), and Wi-Fi-based dwell-time data.",
      method: "Join footfall and sales at the hourly-zone grain; compute conversion rate and compare against dwell time.",
      kpis: ["Footfall", "Conversion Rate", "Sales per Visitor", "Average Dwell Time"],
      finding: "In this illustrative scenario, weekday evening footfall in the anchor zone was strong but converted at roughly half the weekend rate — pointing to a browsing-not-buying pattern worth targeting with time-specific promotions.",
    },
    impact: "A conversion-rate lens like this turns 'footfall is high' from a vanity metric into a targeted promotion and tenant-mix decision.",
  },
  {
    slug: "ecommerce-cart-abandonment",
    industry: "E-Commerce / Shopping",
    title: "Customer Segmentation & Cart Abandonment Analysis",
    saudiContext: "Saudi e-commerce has grown quickly, and cart abandonment remains one of the largest sources of lost revenue for online retailers in the market.",
    strategic: {
      priority: "Digital Revenue Growth",
      objective: "Reduce revenue lost to cart abandonment without discounting broadly across all customers.",
      rationale: "A blanket discount strategy erodes margin; the more defensible path is fixing friction for the segments that actually abandon.",
    },
    businessAnalysis: {
      currentState: "Cart abandonment is reported as a single aggregate rate across the whole customer base.",
      gap: "There's no segmentation by customer type, device, or payment method, so it's unclear who is abandoning and why.",
      rootCause: "Checkout friction hasn't been isolated by segment — a single average hides very different underlying behaviors.",
      recommendation: "Segment abandonment by device and payment method, then design segment-specific checkout interventions (e.g., a smoother cash-on-delivery flow for the segment that relies on it).",
    },
    dataAnalysis: {
      businessQuestion: "Which customer segments abandon carts most, and at which specific checkout step?",
      data: "Clickstream data, order data, and payment-method data.",
      method: "Funnel analysis of the checkout flow, broken out by customer segment.",
      kpis: ["Cart Abandonment Rate", "Checkout Completion Rate by Step", "Average Order Value"],
      finding: "In this illustrative scenario, mobile users paying cash-on-delivery dropped off disproportionately at the address-confirmation step — a UX issue, not a pricing one.",
    },
    impact: "Segment-specific fixes recover more revenue than a store-wide discount, and don't erode margin on customers who were never going to abandon.",
  },
  {
    slug: "restaurant-chain-performance",
    industry: "Food & Beverage",
    title: "Restaurant Chain Performance Across Cities",
    saudiContext: "Delivery-first restaurant concepts have expanded quickly across Riyadh, Jeddah, and Dammam, fueled by third-party delivery platforms.",
    strategic: {
      priority: "Disciplined Multi-City Expansion",
      objective: "Replicate the best-performing branch's economics before opening further branches in new cities.",
      rationale: "Expansion without a repeatable performance model just scales whatever is currently working — and whatever isn't.",
    },
    businessAnalysis: {
      currentState: "Each branch reports its own P&L, with menu-item costing calculated slightly differently branch to branch.",
      gap: "There's no standard KPI set to compare branches on a like-for-like basis.",
      rootCause: "Inconsistent ingredient costing and portioning assumptions across branches distort margin comparisons.",
      recommendation: "Standardize a branch KPI scorecard and menu-item costing methodology before evaluating the next city for expansion.",
    },
    dataAnalysis: {
      businessQuestion: "Which branches and menu items drive the best margin per order, and which cities lag?",
      data: "Order-level POS data, delivery-platform commission data, and ingredient cost data.",
      method: "Menu engineering (a profitability-vs-popularity matrix) plus branch-level benchmarking.",
      kpis: ["Margin per Order", "Average Order Value", "Delivery Mix %", "Menu Item Contribution Margin"],
      finding: "In this illustrative scenario, one city's branches had strong order volume but the lowest margin per order — high delivery-platform commission mix was eating into a menu that looked profitable on paper.",
    },
    impact: "Fixing the costing model before expanding prevents scaling a branch economics problem into three more cities.",
  },
  {
    slug: "coffee-shop-site-selection",
    industry: "Coffee Shops",
    title: "Specialty Coffee Chain Expansion & Site Performance",
    saudiContext: "Specialty coffee shops have become a fast-growing 'third place' category in Riyadh, Jeddah, and Al Khobar, with expansion often outpacing data-driven site selection.",
    strategic: {
      priority: "Disciplined Store Growth",
      objective: "Pick new locations with the highest predicted revenue per seat, rather than growing on instinct alone.",
      rationale: "In a category with strong brand loyalty but thin real-estate economics, site selection is the single biggest driver of a new branch's payback period.",
    },
    businessAnalysis: {
      currentState: "New site selection currently relies on informal judgment — visible foot traffic, gut feel about the neighborhood.",
      gap: "There's no data-driven link between a location's attributes and how a branch actually performs after opening.",
      rootCause: "Historical branch performance has never been systematically connected back to the location attributes that predicted it.",
      recommendation: "Build a site-scoring model using existing branch performance against location attributes (nearby office density, competitor count, foot-traffic proxies).",
    },
    dataAnalysis: {
      businessQuestion: "Which location attributes best predict a new branch's revenue per seat in its first six months?",
      data: "Historical branch revenue, location attributes, and opening-cohort performance data.",
      method: "Driver analysis of branch performance against location attributes.",
      kpis: ["Revenue per Seat", "Payback Period", "Customer Visit Frequency"],
      finding: "In this illustrative scenario, nearby office density predicted early performance far better than raw foot-traffic counts — a weekday lunch-and-laptop customer mattered more than passersby.",
    },
    impact: "A scoring model turns site selection from an opinion into a comparable number across candidate locations.",
  },
  {
    slug: "football-club-fan-value",
    industry: "Sports / Football",
    title: "Football Club Commercial & Fan Engagement Analytics",
    saudiContext: "Significant investment and rising global attention on the Saudi Pro League has shifted focus toward commercial performance beyond ticket sales — sponsorship, merchandise, and digital fan engagement.",
    strategic: {
      priority: "Commercial Revenue Diversification",
      objective: "Grow non-matchday revenue (merchandise, digital, sponsorship) as a share of total club revenue.",
      rationale: "Matchday revenue is capped by stadium capacity and fixture count; commercial revenue is the growth lever.",
    },
    businessAnalysis: {
      currentState: "Matchday ticket revenue is tracked closely; merchandising, digital, and sponsorship revenue are tracked separately by different internal teams.",
      gap: "There's no single view of how much total value a given fan segment generates across all channels.",
      rootCause: "Fan data is fragmented across ticketing, e-commerce, and social/app platforms with no shared fan identifier.",
      recommendation: "Build a unified fan profile linking ticketing, merchandise purchases, and digital engagement to a single fan ID.",
    },
    dataAnalysis: {
      businessQuestion: "Which fan segments generate the most total value across tickets, merchandise, and engagement — and how can the club grow them?",
      data: "Ticketing data, merchandise sales data, and app/social engagement metrics.",
      method: "Fan lifetime value modeling and segmentation across the unified fan profile.",
      kpis: ["Non-Matchday Revenue Share", "Merchandise Revenue per Fan", "Digital Engagement Rate", "Season-Ticket Renewal Rate"],
      finding: "In this illustrative scenario, a mid-tier ticket segment with low matchday spend turned out to have the highest merchandise and app engagement — the highest-value fans weren't the most obvious ones.",
    },
    impact: "A unified fan view redirects marketing spend toward the segments actually worth the investment, not just the loudest ones.",
  },
  {
    slug: "public-service-delivery",
    industry: "Government",
    title: "Public Service Delivery Performance Dashboard",
    saudiContext: "Vision 2030's digital government agenda has put citizen-experience KPIs — not just service availability — at the center of public-sector performance.",
    strategic: {
      priority: "Citizen Experience Excellence",
      objective: "Reduce average service completion time and improve first-contact resolution across channels.",
      rationale: "Digital transformation only delivers value for citizens if it measurably shortens their actual journey, not just adds a new channel.",
    },
    businessAnalysis: {
      currentState: "Service requests are tracked independently within each department's own case-management system.",
      gap: "There's no cross-department view of how long a citizen's end-to-end journey actually takes when a request touches more than one department.",
      rootCause: "Departments use separate systems with no shared definition of 'resolved.'",
      recommendation: "Build a cross-department service KPI dashboard on a shared definition of resolution, modeled on stage-by-stage journey analysis.",
    },
    dataAnalysis: {
      businessQuestion: "Where in the citizen service journey does the most delay accumulate, and which channels perform best?",
      data: "Service request timestamps by stage and channel (in-person, app, call center).",
      method: "Stage-duration and bottleneck analysis across the end-to-end journey.",
      kpis: ["Average Resolution Time", "First-Contact Resolution Rate", "Channel Satisfaction Score", "SLA Compliance"],
      finding: "In this illustrative scenario, the app channel resolved single-department requests fastest, but multi-department requests were slower on every channel — the bottleneck was handoffs, not the channel itself.",
    },
    impact: "This reframes the fix from 'improve the app' to 'fix the handoff process' — a materially different (and cheaper) intervention.",
  },
  {
    slug: "b2b-sales-territory-performance",
    industry: "Sales / B2B Distribution",
    title: "B2B Distribution Sales Pipeline & Territory Performance",
    saudiContext: "FMCG and B2B distribution is a large, competitive sector in Saudi Arabia, typically organized into sales territories with dedicated reps.",
    strategic: {
      priority: "Sales Productivity",
      objective: "Grow revenue per sales rep without growing headcount.",
      rationale: "Adding reps is the default lever; fixing pipeline conversion is usually cheaper and faster.",
    },
    businessAnalysis: {
      currentState: "Pipeline stages are tracked inconsistently — different reps interpret 'qualified' or 'negotiating' differently.",
      gap: "It's not possible to tell which pipeline stage has the highest drop-off by territory, because the stage definitions aren't standardized.",
      rootCause: "No standard CRM stage definitions exist across territories.",
      recommendation: "Standardize CRM stage definitions platform-wide, then track stage-to-stage conversion by territory.",
    },
    dataAnalysis: {
      businessQuestion: "Which sales territories and pipeline stages have the lowest conversion, and why?",
      data: "CRM opportunity data by stage, territory, and rep.",
      method: "Funnel and conversion-rate analysis by territory.",
      kpis: ["Win Rate", "Average Deal Size", "Sales Cycle Length", "Revenue per Rep"],
      finding: "In this illustrative scenario, one territory had a win rate in line with peers but a sales cycle nearly twice as long — the problem wasn't losing deals, it was how long they took to close.",
    },
    impact: "Distinguishing a 'losing deals' problem from a 'slow deals' problem changes the coaching focus for that territory entirely.",
  },
  {
    slug: "hotel-revenue-management",
    industry: "Hospitality / Tourism",
    title: "Hotel Revenue Management & Occupancy Optimization",
    saudiContext: "Tourism is a fast-growing sector under Vision 2030, with highly seasonal demand driven by religious tourism, national holidays, and giga-project-driven leisure travel.",
    strategic: {
      priority: "Revenue Management Maturity",
      objective: "Grow RevPAR (revenue per available room) without relying on price cuts in low season.",
      rationale: "Discounting protects occupancy but erodes margin; a demand-aware pricing approach protects both.",
    },
    businessAnalysis: {
      currentState: "Room rates are set manually by season, with limited input from actual booking-demand signals.",
      gap: "There's no systematic link between booking lead-time patterns and the pricing decision.",
      rootCause: "No formal demand-forecasting process exists to inform pricing ahead of the season.",
      recommendation: "Introduce a lead-time-based dynamic pricing framework informed by channel and booking-pattern data.",
    },
    dataAnalysis: {
      businessQuestion: "How do booking lead time and channel (direct, OTA, corporate) affect achieved rate and occupancy?",
      data: "Booking data — lead time, channel, rate, and length of stay.",
      method: "Demand-curve analysis by channel and lead-time bucket.",
      kpis: ["RevPAR", "Average Daily Rate (ADR)", "Occupancy Rate", "Booking Lead Time"],
      finding: "In this illustrative scenario, late-booking direct guests paid a premium rate consistently, while early-booking OTA guests were the most price-sensitive — suggesting room to hold rate longer before discounting.",
    },
    impact: "A lead-time-aware pricing approach protects RevPAR in a way a flat seasonal rate card can't.",
  },
  {
    slug: "last-mile-delivery-performance",
    industry: "Logistics",
    title: "Last-Mile Delivery Performance for E-Commerce",
    saudiContext: "E-commerce growth has put sustained pressure on last-mile delivery networks across dense urban centers like Riyadh and Jeddah.",
    strategic: {
      priority: "Delivery Reliability as a Competitive Advantage",
      objective: "Reduce the late-delivery rate without increasing cost per delivery.",
      rationale: "In a market where customers can switch retailers easily, delivery reliability is now a retention driver, not just an operations metric.",
    },
    businessAnalysis: {
      currentState: "Late deliveries are tracked in aggregate at the city level.",
      gap: "There's no visibility into which specific hubs, routes, or drivers are driving the majority of the delay.",
      rootCause: "Route- and hub-level performance has never been systematically compared against each other.",
      recommendation: "Build a route/hub-level late-delivery scorecard to target the specific source of delay rather than the whole city network.",
    },
    dataAnalysis: {
      businessQuestion: "Which delivery hubs, routes, or time windows contribute most to late deliveries?",
      data: "Delivery timestamps, route/hub assignment, and order density by zone.",
      method: "Root-cause and driver analysis by hub and time window.",
      kpis: ["On-Time Delivery Rate", "Cost per Delivery", "Average Delivery Time", "First-Attempt Success Rate"],
      finding: "In this illustrative scenario, one hub's late-delivery rate was double the network average, concentrated entirely in a single evening time window — a staffing gap, not a citywide traffic problem.",
    },
    impact: "Fixing one hub's evening staffing is far cheaper than a citywide investment aimed at a problem that was actually local.",
  },
  {
    slug: "residential-market-pricing",
    industry: "Real Estate",
    title: "Residential Market Pricing & Demand Analysis",
    saudiContext: "Vision 2030's housing program has driven significant residential development, alongside a need to track demand at a finer grain than city-wide averages.",
    strategic: {
      priority: "Data-Driven Development Planning",
      objective: "Align new housing supply with actual demand by district and price band, rather than by city-level averages.",
      rationale: "A city can look balanced on average while individual districts are badly oversupplied or undersupplied.",
    },
    businessAnalysis: {
      currentState: "Pricing and demand are currently tracked using broad city-level averages.",
      gap: "There's no district-level view of where price and demand are actually out of balance.",
      rootCause: "Listing data and transaction data are never joined at the district/price-band grain.",
      recommendation: "Build a district-level supply-demand-price dashboard to guide where new development is actually needed.",
    },
    dataAnalysis: {
      businessQuestion: "Which districts and price bands show demand outpacing available supply?",
      data: "Property listing data, transaction/sale data, and time-on-market by district.",
      method: "Supply-demand balance analysis by district and price band.",
      kpis: ["Days on Market", "Price per Square Meter", "Absorption Rate", "Supply-Demand Ratio"],
      finding: "In this illustrative scenario, a mid-price band in one district sold in a third of the average time-on-market citywide — a clear undersupply signal that a city-wide average had been hiding.",
    },
    impact: "District-level analysis turns a vague 'housing demand is strong' narrative into a specific, actionable development priority.",
  },
];

export const useCaseIndustries = Array.from(new Set(useCases.map((u) => u.industry)));
