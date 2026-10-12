const futureDate = (days) => {
  const value = new Date();
  value.setDate(value.getDate() + days);
  return value.toISOString().slice(0, 10);
};

const scenarios = (values) => [
  { name: 'Downtown weekday', values: values[0] },
  { name: 'Peak-hour plan', values: values[1] },
  { name: 'Service recovery', values: values[2] },
];

export const AI_HUB_PRESETS = {
  route: scenarios([
    { warehouseId: '1', zoneId: '1', driverId: '1', deliveryIds: '1,2,4', maxStops: '12', optimizeFor: 'balanced' },
    { warehouseId: '2', zoneId: '4', driverId: '2', deliveryIds: '5,7,9', maxStops: '8', optimizeFor: 'time' },
    { warehouseId: '3', zoneId: '6', driverId: '7', deliveryIds: '6,10,19', maxStops: '10', optimizeFor: 'fuel' },
  ]),
  'delivery-time': scenarios([
    { deliveryId: '2', pickupAddress: '200 Flushing Ave, Brooklyn, NY', deliveryAddress: '456 5th Ave, New York, NY', weight: '1.2', timeOfDay: 'morning', dayOfWeek: 'monday' },
    { deliveryId: '5', pickupAddress: '350 Kent Ave, Brooklyn, NY', deliveryAddress: '654 Bedford Ave, Brooklyn, NY', weight: '3.2', timeOfDay: 'afternoon', dayOfWeek: 'friday' },
    { deliveryId: '9', pickupAddress: '200 Flushing Ave, Brooklyn, NY', deliveryAddress: '369 Court St, Brooklyn, NY', weight: '6.8', timeOfDay: 'evening', dayOfWeek: 'saturday' },
  ]),
  demand: scenarios([
    { zoneId: '1', period: 'daily', forecastDays: '7', historicalDays: '30', includeWeather: 'true', includeEvents: 'true' },
    { zoneId: '4', period: 'weekly', forecastDays: '14', historicalDays: '60', includeWeather: 'true', includeEvents: 'false' },
    { zoneId: '6', period: 'monthly', forecastDays: '30', historicalDays: '90', includeWeather: 'false', includeEvents: 'true' },
  ]),
  cost: scenarios([
    { period: 'last_week', zoneId: '1', category: 'all', compareWith: 'previous_period' },
    { period: 'last_month', zoneId: '4', category: 'fuel', compareWith: 'budget' },
    { period: 'last_quarter', zoneId: '6', category: 'labor', compareWith: 'same_period_last_year' },
  ]),
  improvements: scenarios([
    { area: 'efficiency', zoneId: '1', urgency: 'medium', budget: '10000' },
    { area: 'customer_satisfaction', zoneId: '4', urgency: 'high', budget: '25000' },
    { area: 'fleet_utilization', zoneId: '6', urgency: 'low', budget: '15000' },
  ]),
  incident: scenarios([
    { incidentId: '3', incidentType: 'delay', description: 'A bridge closure delayed an in-transit delivery by 20 minutes; the customer has not yet received an updated ETA.', severity: 'low', location: 'Brooklyn Bridge approach, Zone 2' },
    { incidentId: '4', incidentType: 'breakdown', description: 'A delivery truck reported a tire puncture and its assigned packages require a safe transfer plan.', severity: 'high', location: 'FDR Drive, Manhattan' },
    { incidentId: '5', incidentType: 'damage', description: 'A package was visibly dented during transport; document likely causes, customer communication, and prevention steps.', severity: 'medium', location: 'Williamsburg, Zone 5' },
  ]),
  fleet: scenarios([
    { date: () => futureDate(1), zoneId: '1', expectedDemand: '120', optimizeFor: 'balanced', constraints: 'Keep urgent deliveries on active vehicles, preserve driver-hour limits, and retain one backup van.' },
    { date: () => futureDate(7), zoneId: '4', expectedDemand: '180', optimizeFor: 'coverage', constraints: 'Cover the evening peak, prioritize accessible vehicles, and avoid assigning vehicles in maintenance.' },
    { date: () => futureDate(14), zoneId: '6', expectedDemand: '90', optimizeFor: 'cost', constraints: 'Use current staff and vehicles, reserve electric bikes for short stops, and flag any uncovered demand.' },
  ]),
  performance: scenarios([
    { driverId: '1', period: 'next_week', metrics: 'all', includeRecommendations: 'true' },
    { driverId: '2', period: 'next_month', metrics: 'on_time_rate', includeRecommendations: 'true' },
    { driverId: '7', period: 'next_quarter', metrics: 'efficiency', includeRecommendations: 'false' },
  ]),
  'driver-route-match': scenarios([
    { routeId: '1' },
    { routeId: '2' },
    { routeId: '6' },
  ]),
};

export const AI_TOOL_PRESETS = {
  'anomaly-detection': scenarios([
    { window: '7', context: 'Review downtown deliveries for unusual delay clusters, repeated failed attempts, and route deviations. Separate confirmed records from hypotheses.' },
    { window: '30', context: 'Compare peak-hour delivery volume, incident frequency, and completion time by zone. Highlight material outliers and missing evidence.' },
    { window: '90', context: 'Look for recurring service failures after weather events and vehicle maintenance incidents. Recommend reviewable operational follow-up.' },
  ]),
  'customer-churn-predictor': scenarios([
    { customerId: '1', lookbackDays: '30', context: 'Assess recent delivery reliability, complaint history, order frequency, and practical retention actions without inventing customer intent.' },
    { customerId: '5', lookbackDays: '90', context: 'Review a high-frequency customer after two delayed deliveries. Prioritize evidence, risk factors, and proportionate outreach.' },
    { customerId: '10', lookbackDays: '180', context: 'Evaluate a newer customer with declining order frequency. Identify missing information and low-risk retention experiments.' },
  ]),
  'dynamic-pricing-recommender': scenarios([
    { zoneId: '1', slaTier: 'same-day', currentDemand: '42', capacityUtilizationPct: '84', context: 'Morning business-district demand is elevated; preserve SLA fairness and explain cost and capacity assumptions.' },
    { zoneId: '4', slaTier: 'express', currentDemand: '58', capacityUtilizationPct: '92', context: 'Friday peak demand is near capacity. Compare a limited surcharge with staffing and routing alternatives.' },
    { zoneId: '6', slaTier: 'standard', currentDemand: '24', capacityUtilizationPct: '61', context: 'Demand is moderate and price sensitivity is high. Recommend a transparent, reviewable price with safeguards.' },
  ]),
  'vehicle-maintenance-alert': scenarios([
    { vehicleId: '1', mileage: '15230', ageYears: '3', context: 'Routine inspection due soon; no active warning lights. Review service timing and evidence needed before removing the van from service.' },
    { vehicleId: '4', mileage: '67800', ageYears: '6', context: 'Vehicle is currently in maintenance after repeated brake-temperature alerts. Prioritize safety and authorized inspection.' },
    { vehicleId: '8', mileage: '2100', ageYears: '2', context: 'Electric cargo bike reported intermittent battery-range loss during cold weather. Distinguish observations from likely causes.' },
  ]),
};

export const SLA_PRESETS = scenarios([
  { deliveryId: '2' },
  { deliveryId: '5' },
  { deliveryId: '9' },
]);

export function createPresetControls(fields, presets, applyValues) {
  return (presets || []).map((preset) => ({
    name: preset.name,
    fill: () => {
      const next = {};
      fields.forEach((field) => {
        const example = preset.values[field.key];
        next[field.key] = typeof example === 'function' ? example() : example;
      });
      applyValues(next);
      return { filled: fields.length, manual: [] };
    },
  }));
}
