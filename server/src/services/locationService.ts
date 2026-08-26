export interface LocationCoeff {
  regionCode: string;
  name: string;
  coeff: number;
}

export class LocationService {
  private static regions: Record<string, LocationCoeff> = {
    'TM-AS': { regionCode: 'TM-AS', name: 'г. Ашхабад', coeff: 1.0 },
    'TM-AH': { regionCode: 'TM-AH', name: 'Ахалский велаят', coeff: 1.05 },
    'TM-BN': { regionCode: 'TM-BN', name: 'Балканский велаят', coeff: 1.12 },
    'TM-DZ': { regionCode: 'TM-DZ', name: 'Дашогузский велаят', coeff: 1.10 },
    'TM-LB': { regionCode: 'TM-LB', name: 'Лебапский велаят', coeff: 1.08 },
    'TM-MR': { regionCode: 'TM-MR', name: 'Марыйский велаят', coeff: 1.06 },
  };

  static getCoefficient(regionCode: string): number {
    return this.regions[regionCode]?.coeff || 1.0;
  }

  static listRegions(): LocationCoeff[] {
    return Object.values(this.regions);
  }
}
