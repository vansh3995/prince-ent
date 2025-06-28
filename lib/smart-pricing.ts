export class SmartPricing {
  calculateDynamicPrice(params: {
    distance: number
    weight: number
    serviceType: string
    demand: number
    seasonality: number
  }) {
    const basePrice = this.getBasePrice(params.distance, params.weight)
    const demandMultiplier = 1 + (params.demand * 0.1)
    const seasonalMultiplier = 1 + (params.seasonality * 0.05)
    
    return basePrice * demandMultiplier * seasonalMultiplier
  }
  
  private getBasePrice(distance: number, weight: number) {
    return (distance * 0.5) + (weight * 10)
  }
}