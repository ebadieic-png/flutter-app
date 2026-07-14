/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type Language = 'en' | 'fa';

export type ThemeMode = 'light' | 'dark';

export type MaterialType = 'AL' | 'CU';

export type ProductShape = 'Round' | 'Rectangular';

export interface CalculationInputs {
  material: MaterialType;
  shape: ProductShape;
  diameter: string;
  width: string;
  thickness: string;
  timePerMeter: string;
}

export interface CalculationResults {
  crossSection: number;
  weightPerMeter: number;
  speed: number;
  hourlyProduction: number;
  shiftProduction: number;
}

export interface TranslationSet {
  title: string;
  subtitle: string;
  footer: string;
  material: string;
  productShape: string;
  round: string;
  rectangular: string;
  diameter: string;
  width: string;
  thickness: string;
  timePerMeter: string;
  calculate: string;
  clear: string;
  crossSection: string;
  weightPerMeter: string;
  speed: string;
  hourlyProduction: string;
  shiftProduction: string;
  errorEmpty: string;
  errorNegative: string;
  errorZero: string;
  errorInvalid: string;
  splashText: string;
  developedBy: string;
  flutterCodeHub: string;
  flutterCodeHubDesc: string;
  apkGuide: string;
  apkGuideDesc: string;
  downloadFlutterProject: string;
  viewFile: string;
  copied: string;
  copyCode: string;
  operatorPanel: string;
  resultsPanel: string;
  materialAl: string;
  materialCu: string;
  diameterHint: string;
  widthHint: string;
  thicknessHint: string;
  timeHint: string;
  validationTitle: string;
  splashHint: string;
}
