import 'dart:math' as math;

class CalculationInputs {
  final String material; // 'AL' or 'CU'
  final String shape; // 'Round' or 'Rectangular'
  final double diameter;
  final double width;
  final double thickness;
  final double timePerMeter;

  CalculationInputs({
    required this.material,
    required this.shape,
    this.diameter = 0,
    this.width = 0,
    this.thickness = 0,
    required this.timePerMeter,
  });
}

class CalculationResults {
  final double crossSection; // mm²
  final double weightPerMeter; // kg/m
  final double speed; // m/min
  final double hourlyProduction; // kg/h
  final double shiftProduction; // kg (7.5 Hour Shift)

  CalculationResults({
    required this.crossSection,
    required this.weightPerMeter,
    required this.speed,
    required this.hourlyProduction,
    required this.shiftProduction,
  });

  factory CalculationResults.calculate(CalculationInputs inputs) {
    double area = 0.0;
    if (inputs.shape == 'Round') {
      area = (math.pi * inputs.diameter * inputs.diameter) / 4.0;
    } else {
      area = inputs.width * inputs.thickness;
    }

    double density = (inputs.material == 'AL') ? 2.7 : 8.9;
    double weight = (area * density) / 1000.0;

    double speed = 60.0 / inputs.timePerMeter;
    double hourly = (3600.0 * weight) / inputs.timePerMeter;
    double shift = hourly * 7.5;

    return CalculationResults(
      crossSection: area,
      weightPerMeter: weight,
      speed: speed,
      hourlyProduction: hourly,
      shiftProduction: shift,
    );
  }
}
