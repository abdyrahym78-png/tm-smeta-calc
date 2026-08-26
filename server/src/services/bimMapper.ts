export interface BimMappingResult {
  bimSystem: string;
  bimCode: string;
  rateCode: string;
  confidence: 'EXACT' | 'FALLBACK' | 'NONE';
}

export class BimMapper {
  private static dictionary: Record<string, string> = {
    'Pr_20_31': 'R-CONCRETE-01',
    'Pr_20_31_15': 'R-CONCRETE-02',
    '23.15.10': 'R-STEEL-01',
    'IfcWall': 'R-WALL-GENERIC',
  };

  static mapCode(bimSystem: string, bimCode: string): BimMappingResult {
    if (this.dictionary[bimCode]) {
      return { bimSystem, bimCode, rateCode: this.dictionary[bimCode], confidence: 'EXACT' };
    }

    const parts = bimCode.split('_');
    if (parts.length > 1) {
      const parentCode = parts.slice(0, -1).join('_');
      if (this.dictionary[parentCode]) {
        return { bimSystem, bimCode, rateCode: this.dictionary[parentCode], confidence: 'FALLBACK' };
      }
    }

    return { bimSystem, bimCode, rateCode: 'R-GENERIC-DEFAULT', confidence: 'NONE' };
  }
}
