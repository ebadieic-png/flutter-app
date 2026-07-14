import 'package:flutter/material.dart';
import 'package:flutter_gen/gen_l10n/app_localizations.dart';
import '../main.dart';
import '../models/calculation_model.dart';
import '../widgets/result_card.dart';

class HomePage extends StatefulWidget {
  const HomePage({super.key});

  @override
  State<HomePage> createState() => _HomePageState();
}

class _HomePageState extends State<HomePage> {
  final _formKey = GlobalKey<FormState>();

  String _material = 'AL';
  String _shape = 'Round';

  final TextEditingController _diameterController = TextEditingController();
  final TextEditingController _widthController = TextEditingController();
  final TextEditingController _thicknessController = TextEditingController();
  final TextEditingController _timeController = TextEditingController();

  CalculationResults? _results;

  @override
  void dispose() {
    _diameterController.dispose();
    _widthController.dispose();
    _thicknessController.dispose();
    _timeController.dispose();
    super.dispose();
  }

  void _calculate() {
    if (!_formKey.currentState!.validate()) {
      return;
    }

    final double diameter = double.tryParse(_diameterController.text) ?? 0.0;
    final double width = double.tryParse(_widthController.text) ?? 0.0;
    final double thickness = double.tryParse(_thicknessController.text) ?? 0.0;
    final double time = double.tryParse(_timeController.text) ?? 0.0;

    final inputs = CalculationInputs(
      material: _material,
      shape: _shape,
      diameter: diameter,
      width: width,
      thickness: thickness,
      timePerMeter: time,
    );

    setState(() {
      _results = CalculationResults.calculate(inputs);
    });
  }

  void _clear() {
    _diameterController.clear();
    _widthController.clear();
    _thicknessController.clear();
    _timeController.clear();
    setState(() {
      _results = null;
    });
  }

  String? _validateInput(String? value, BuildContext context) {
    final t = AppLocalizations.of(context)!;
    if (value == null || value.trim().isEmpty) {
      return t.errorEmpty;
    }
    final numValue = double.tryParse(value);
    if (numValue == null) {
      return t.errorInvalid;
    }
    if (numValue < 0) {
      return t.errorNegative;
    }
    if (numValue == 0) {
      return t.errorZero;
    }
    return null;
  }

  @override
  Widget build(BuildContext context) {
    final t = AppLocalizations.of(context)!;
    final theme = Theme.of(context);
    final isFa = EicApp.getLocale(context).languageCode == 'fa';

    return Scaffold(
      backgroundColor: theme.colorScheme.background,
      appBar: AppBar(
        title: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text(
              t.title,
              style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 20),
            ),
            Text(
              t.subtitle,
              style: const TextStyle(fontSize: 10, letterSpacing: 0.5, opacity: 0.8),
            ),
          ],
        ),
        actions: [
          IconButton(
            icon: Icon(
              EicApp.getTheme(context) == ThemeMode.dark
                  ? Icons.light_mode
                  : Icons.dark_mode,
            ),
            onPressed: () {
              final newMode = EicApp.getTheme(context) == ThemeMode.dark
                  ? ThemeMode.light
                  : ThemeMode.dark;
              EicApp.setTheme(context, newMode);
            },
          ),
          TextButton(
            onPressed: () {
              final currentLocale = EicApp.getLocale(context);
              final nextLocale = currentLocale.languageCode == 'fa'
                  ? const Locale('en')
                  : const Locale('fa');
              EicApp.setLocale(context, nextLocale);
            },
            child: Text(
              isFa ? 'EN' : 'FA',
              style: TextStyle(
                color: theme.colorScheme.onPrimaryContainer,
                fontWeight: FontWeight.bold,
              ),
            ),
          ),
          const SizedBox(width: 8),
        ],
        backgroundColor: theme.colorScheme.primaryContainer,
        elevation: 0,
      ),
      body: SafeArea(
        child: SingleChildScrollView(
          padding: const EdgeInsets.all(16.0),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.stretch,
            children: [
              Center(
                child: Container(
                  padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 12),
                  decoration: BoxDecoration(
                    color: theme.colorScheme.primary.withOpacity(0.1),
                    borderRadius: BorderRadius.circular(12),
                    border: Border.all(color: theme.colorScheme.primary.withOpacity(0.2)),
                  ),
                  child: Row(
                    mainAxisSize: MainAxisSize.min,
                    children: [
                      Icon(Icons.factory, color: theme.colorScheme.primary),
                      const SizedBox(width: 12),
                      const Text(
                        'E I C',
                        style: TextStyle(
                          fontSize: 22,
                          fontWeight: FontWeight.w900,
                          letterSpacing: 2.0,
                        ),
                      ),
                    ],
                  ),
                ),
              ),
              const SizedBox(height: 20),
              Card(
                child: Padding(
                  padding: const EdgeInsets.all(16.0),
                  child: Form(
                    key: _formKey,
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.stretch,
                      children: [
                        Text(
                          t.operatorPanel,
                          style: theme.textTheme.titleMedium?.copyWith(
                            color: theme.colorScheme.primary,
                            fontWeight: FontWeight.bold,
                          ),
                        ),
                        const Divider(height: 24),
                        Text(
                          t.material,
                          style: const TextStyle(fontWeight: FontWeight.bold),
                        ),
                        const SizedBox(height: 8),
                        Row(
                          children: [
                            Expanded(
                              child: ChoiceChip(
                                label: Text(t.materialAl, style: const TextStyle(fontWeight: FontWeight.bold)),
                                selected: _material == 'AL',
                                onSelected: (selected) {
                                  if (selected) setState(() => _material = 'AL');
                                },
                              ),
                            ),
                            const SizedBox(width: 12),
                            Expanded(
                              child: ChoiceChip(
                                label: Text(t.materialCu, style: const TextStyle(fontWeight: FontWeight.bold)),
                                selected: _material == 'CU',
                                onSelected: (selected) {
                                  if (selected) setState(() => _material = 'CU');
                                },
                              ),
                            ),
                          ],
                        ),
                        const SizedBox(height: 16),
                        Text(
                          t.productShape,
                          style: const TextStyle(fontWeight: FontWeight.bold),
                        ),
                        const SizedBox(height: 8),
                        Row(
                          children: [
                            Expanded(
                              child: ChoiceChip(
                                label: Text(t.round, style: const TextStyle(fontWeight: FontWeight.bold)),
                                selected: _shape == 'Round',
                                onSelected: (selected) {
                                  if (selected) setState(() => _shape = 'Round');
                                },
                              ),
                            ),
                            const SizedBox(width: 12),
                            Expanded(
                              child: ChoiceChip(
                                label: Text(t.rectangular, style: const TextStyle(fontWeight: FontWeight.bold)),
                                selected: _shape == 'Rectangular',
                                onSelected: (selected) {
                                  if (selected) setState(() => _shape = 'Rectangular');
                                },
                              ),
                            ),
                          ],
                        ),
                        const SizedBox(height: 20),
                        AnimatedSwitcher(
                          duration: const Duration(milliseconds: 300),
                          child: _shape == 'Round'
                              ? TextFormField(
                                  key: const ValueKey('diameter'),
                                  controller: _diameterController,
                                  decoration: InputDecoration(
                                    labelText: t.diameter,
                                    prefixIcon: const Icon(Icons.circle_outlined),
                                    border: const OutlineInputBorder(),
                                  ),
                                  keyboardType: const TextInputType.numberWithOptions(decimal: true),
                                  validator: (val) => _validateInput(val, context),
                                )
                              : Column(
                                  key: const ValueKey('rectangular'),
                                  children: [
                                    TextFormField(
                                      controller: _widthController,
                                      decoration: InputDecoration(
                                        labelText: t.width,
                                        prefixIcon: const Icon(Icons.swap_horiz),
                                        border: const OutlineInputBorder(),
                                      ),
                                      keyboardType: const TextInputType.numberWithOptions(decimal: true),
                                      validator: (val) => _validateInput(val, context),
                                    ),
                                    const SizedBox(height: 16),
                                    TextFormField(
                                      controller: _thicknessController,
                                      decoration: InputDecoration(
                                        labelText: t.thickness,
                                        prefixIcon: const Icon(Icons.swap_vert),
                                        border: const OutlineInputBorder(),
                                      ),
                                      keyboardType: const TextInputType.numberWithOptions(decimal: true),
                                      validator: (val) => _validateInput(val, context),
                                    ),
                                  ],
                                ),
                        ),
                        const SizedBox(height: 16),
                        TextFormField(
                          controller: _timeController,
                          decoration: InputDecoration(
                            labelText: t.timePerMeter,
                            prefixIcon: const Icon(Icons.timer_outlined),
                            border: const OutlineInputBorder(),
                          ),
                          keyboardType: const TextInputType.numberWithOptions(decimal: true),
                          validator: (val) => _validateInput(val, context),
                        ),
                        const SizedBox(height: 24),
                        Row(
                          children: [
                            Expanded(
                              flex: 2,
                              child: ElevatedButton.icon(
                                onPressed: _calculate,
                                icon: const Icon(Icons.calculate, size: 24),
                                label: Text(
                                  t.calculate,
                                  style: const TextStyle(fontSize: 16, fontWeight: FontWeight.bold),
                                ),
                                style: ElevatedButton.styleFrom(
                                  padding: const EdgeInsets.symmetric(vertical: 16),
                                  backgroundColor: theme.colorScheme.primary,
                                  foregroundColor: theme.colorScheme.onPrimary,
                                  elevation: 2,
                                  shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
                                ),
                              ),
                            ),
                            const SizedBox(width: 12),
                            Expanded(
                              flex: 1,
                              child: OutlinedButton.icon(
                                onPressed: _clear,
                                icon: const Icon(Icons.refresh),
                                label: Text(t.clear),
                                style: OutlinedButton.styleFrom(
                                  padding: const EdgeInsets.symmetric(vertical: 16),
                                  side: BorderSide(color: theme.colorScheme.outline),
                                  shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
                                ),
                              ),
                            ),
                          ],
                        ),
                      ],
                    ),
                  ),
                ),
              ),
              const SizedBox(height: 24),
              if (_results != null) ...[
                Text(
                  t.resultsPanel,
                  style: theme.textTheme.titleMedium?.copyWith(
                    fontWeight: FontWeight.bold,
                    color: theme.colorScheme.primary,
                  ),
                ),
                const SizedBox(height: 12),
                ResultCard(
                  title: t.crossSection,
                  value: _results!.crossSection,
                  unit: 'mm²',
                  icon: Icons.square_foot,
                ),
                ResultCard(
                  title: t.weightPerMeter,
                  value: _results!.weightPerMeter,
                  unit: 'kg/m',
                  icon: Icons.scale,
                ),
                ResultCard(
                  title: t.speed,
                  value: _results!.speed,
                  unit: 'm/min',
                  icon: Icons.speed,
                ),
                ResultCard(
                  title: t.hourlyProduction,
                  value: _results!.hourlyProduction,
                  unit: 'kg/h',
                  icon: Icons.hourglass_bottom,
                ),
                ResultCard(
                  title: t.shiftProduction,
                  value: _results!.shiftProduction,
                  unit: 'kg',
                  icon: Icons.work_history,
                ),
              ],
              const SizedBox(height: 32),
              Center(
                child: Text(
                  t.footer,
                  style: const TextStyle(
                    fontSize: 12,
                    fontWeight: FontWeight.w500,
                    letterSpacing: 0.5,
                    color: Colors.grey,
                  ),
                ),
              ),
              const SizedBox(height: 16),
            ],
          ),
        ),
      ),
    );
  }
}
