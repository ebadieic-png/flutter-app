/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface FlutterFile {
  path: string;
  description: string;
  code: string;
}

export const flutterFiles: FlutterFile[] = [
  {
    path: 'pubspec.yaml',
    description: 'Flutter project dependencies and configuration, including Material 3 icons and localization.',
    code: `name: eic_calculator
description: EIC (Ebadi Industrial Consultants) production calculator for factory operators.
version: 1.0.0+1

environment:
  sdk: '>=3.0.0 <4.0.0'

dependencies:
  flutter:
    sdk: flutter
  flutter_localizations:
    sdk: flutter
  intl: ^0.18.1
  shared_preferences: ^2.2.2
  cupertino_icons: ^1.0.6

dev_dependencies:
  flutter_test:
    sdk: flutter
  flutter_lints: ^3.0.0

flutter:
  uses-material-design: true
  generate: true # Enables automatic localization generation from .arb files
`
  },
  {
    path: 'android/app/src/main/AndroidManifest.xml',
    description: 'Android application manifest defining the app name, icon, themes, and RTL support.',
    code: `<manifest xmlns:android="http://schemas.android.com/apk/res/android"
    package="com.ebadi.eic">
    <application
        android:label="EIC"
        android:name="\${applicationName}"
        android:icon="@mipmap/ic_launcher"
        android:supportsRtl="true"
        android:theme="@style/LaunchTheme">
        <meta-data
            android:name="flutterEmbedding"
            android:value="2" />
        <activity
            android:name=".MainActivity"
            android:exported="true"
            android:launchMode="singleTop"
            android:theme="@style/LaunchTheme"
            android:configChanges="orientation|keyboardHidden|keyboard|screenSize|smallestScreenSize|locale|layoutDirection|fontScale|screenLayout|density|uiMode"
            android:hardwareAccelerated="true"
            android:windowSoftInputMode="adjustResize">
            <meta-data
                android:name="io.flutter.embedding.android.NormalTheme"
                android:resource="@style/NormalTheme"/>
            <intent-filter>
                <action android:name="android.intent.action.MAIN"/>
                <category android:name="android.intent.category.LAUNCHER"/>
            </intent-filter>
        </activity>
    </application>
</manifest>
`
  },
  {
    path: 'lib/main.dart',
    description: 'Application entry point, state initialization, SharedPreferences checking, and Material Theme 3 configuration.',
    code: `import 'package:flutter/material.dart';
import 'package:flutter_localizations/flutter_localizations.dart';
import 'package:flutter_gen/gen_l10n/app_localizations.dart';
import 'pages/home_page.dart';
import 'services/storage_service.dart';
import 'widgets/splash_screen.dart';

void main() async {
  WidgetsFlutterBinding.ensureInitialized();
  await StorageService.init();
  runApp(const EicApp());
}

class EicApp extends StatefulWidget {
  const EicApp({super.key});

  static void setLocale(BuildContext context, Locale newLocale) {
    _EicAppState? state = context.findAncestorStateOfType<_EicAppState>();
    state?.changeLocale(newLocale);
  }

  static void setTheme(BuildContext context, ThemeMode newThemeMode) {
    _EicAppState? state = context.findAncestorStateOfType<_EicAppState>();
    state?.changeTheme(newThemeMode);
  }

  static Locale getLocale(BuildContext context) {
    _EicAppState? state = context.findAncestorStateOfType<_EicAppState>();
    return state?._locale ?? const Locale('fa');
  }

  static ThemeMode getTheme(BuildContext context) {
    _EicAppState? state = context.findAncestorStateOfType<_EicAppState>();
    return state?._themeMode ?? ThemeMode.light;
  }

  @override
  State<EicApp> createState() => _EicAppState();
}

class _EicAppState extends State<EicApp> {
  Locale _locale = const Locale('fa');
  ThemeMode _themeMode = ThemeMode.light;

  @override
  void initState() {
    super.initState();
    _locale = StorageService.getLocale();
    _themeMode = StorageService.getThemeMode();
  }

  void changeLocale(Locale locale) {
    setState(() {
      _locale = locale;
      StorageService.setLocale(locale.languageCode);
    });
  }

  void changeTheme(ThemeMode mode) {
    setState(() {
      _themeMode = mode;
      StorageService.setThemeMode(mode == ThemeMode.dark);
    });
  }

  @override
  Widget build(BuildContext context) {
    // Custom Blue and White industrial color themes
    final ColorScheme lightScheme = ColorScheme.fromSeed(
      seedColor: const Color(0xFF0F4C81), // Industrial Classic Blue
      primary: const Color(0xFF0F4C81),
      secondary: const Color(0xFF1E88E5),
      surface: Colors.white,
      background: const Color(0xFFF5F9FC),
    );

    final ColorScheme darkScheme = ColorScheme.fromSeed(
      seedColor: const Color(0xFF1E88E5),
      primary: const Color(0xFF90CAF9),
      secondary: const Color(0xFF42A5F5),
      surface: const Color(0xFF121B24),
      background: const Color(0xFF0A0F14),
      brightness: Brightness.dark,
    );

    return MaterialApp(
      title: 'EIC',
      debugShowCheckedModeBanner: false,
      themeMode: _themeMode,
      theme: ThemeData(
        useMaterial3: true,
        colorScheme: lightScheme,
        fontFamily: _locale.languageCode == 'fa' ? 'Vazir' : 'Roboto',
        cardTheme: CardTheme(
          elevation: 2,
          shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
        ),
      ),
      darkTheme: ThemeData(
        useMaterial3: true,
        colorScheme: darkScheme,
        fontFamily: _locale.languageCode == 'fa' ? 'Vazir' : 'Roboto',
        cardTheme: CardTheme(
          elevation: 3,
          shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
        ),
      ),
      localizationsDelegates: const [
        AppLocalizations.delegate,
        GlobalMaterialLocalizations.delegate,
        GlobalWidgetsLocalizations.delegate,
        GlobalCupertinoLocalizations.delegate,
      ],
      supportedLocales: const [
        Locale('en'), // English
        Locale('fa'), // Persian (Default)
      ],
      locale: _locale,
      home: const SplashScreen(nextPage: HomePage()),
    );
  }
}
`
  },
  {
    path: 'lib/models/calculation_model.dart',
    description: 'Data model and pure math logic that handles Cross Section, Weight per Meter, Speed, and Shift Production.',
    code: `import 'dart:math' as math;

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
    // 1. Cross Section Area (mm²)
    double area = 0.0;
    if (inputs.shape == 'Round') {
      area = (math.pi * inputs.diameter * inputs.diameter) / 4.0;
    } else {
      area = inputs.width * inputs.thickness;
    }

    // 2. Weight per Meter (kg/m)
    // Density: AL = 2.7 g/cm³ (2.7 / 1000 for mm² conversion to kg/m)
    // Density: CU = 8.9 g/cm³ (8.9 / 1000 for mm² conversion to kg/m)
    double density = (inputs.material == 'AL') ? 2.7 : 8.9;
    double weight = (area * density) / 1000.0;

    // 3. Speed (m/min)
    // Speed = 60 / Time required for moving 1 meter
    double speed = 60.0 / inputs.timePerMeter;

    // 4. Hourly Production (kg/h)
    // Hourly Production = (3600 * Weight) / Time
    double hourly = (3600.0 * weight) / inputs.timePerMeter;

    // 5. Shift Production (kg) in 7.5 Hour Shift
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
`
  },
  {
    path: 'lib/services/storage_service.dart',
    description: 'Local persistence service using SharedPreferences to remember the selected language and theme.',
    code: `import 'package:flutter/material.dart';
import 'package:shared_preferences/shared_preferences.dart';

class StorageService {
  static late SharedPreferences _prefs;
  static const String _localeKey = 'eic_locale';
  static const String _darkModeKey = 'eic_dark_mode';

  static Future<void> init() async {
    _prefs = await SharedPreferences.getInstance();
  }

  // Locale (Language) Persistence
  static Locale getLocale() {
    final String? code = _prefs.getString(_localeKey);
    if (code == 'en') {
      return const Locale('en');
    }
    return const Locale('fa'); // Persian default
  }

  static Future<void> setLocale(String languageCode) async {
    await _prefs.setString(_localeKey, languageCode);
  }

  // Dark Mode Persistence
  static ThemeMode getThemeMode() {
    final bool? isDark = _prefs.getBool(_darkModeKey);
    if (isDark == true) {
      return ThemeMode.dark;
    }
    return ThemeMode.light; // Light theme default
  }

  static Future<void> setThemeMode(bool isDark) async {
    await _prefs.setBool(_darkModeKey, isDark);
  }
}
`
  },
  {
    path: 'lib/pages/home_page.dart',
    description: 'The main user interface featuring reactive Material 3 components, inputs validation, responsive tabs, and Persian localization support.',
    code: `import 'package:flutter/material.dart';
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

  // State Variables
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

    // Parse input fields safely
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
          // Theme Switcher Button
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
            tooltip: 'Toggle Theme',
          ),
          // Language Switcher Button
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
              // Welcome Banner / Logo EIC
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

              // Form inputs in a rounded card
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

                        // Material Selection (AL / CU)
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

                        // Product Shape Selection (Round / Rectangular)
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

                        // Shape specific inputs
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

                        // Time Required
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

                        // Operator-friendly huge buttons
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

              // Results Panel
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
              // Developed by Footer
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
`
  },
  {
    path: 'lib/widgets/result_card.dart',
    description: 'Component for displaying output values beautifully inside modern cards with formatting and animated icons.',
    code: `import 'package:flutter/material.dart';

class ResultCard extends StatelessWidget {
  final String title;
  final double value;
  final String unit;
  final IconData icon;

  const ResultCard({
    super.key,
    required this.title,
    required this.value,
    required this.unit,
    required this.icon,
  });

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    final formattedValue = value.toStringAsFixed(3);

    return Card(
      margin: const EdgeInsets.only(bottom: 12),
      clipBehavior: Clip.antiAlias,
      child: Container(
        decoration: BoxDecoration(
          border: Border(
            left: BorderSide(
              color: theme.colorScheme.secondary,
              width: 5,
            ),
          ),
        ),
        child: ListTile(
          leading: CircleAvatar(
            backgroundColor: theme.colorScheme.secondary.withOpacity(0.1),
            child: Icon(icon, color: theme.colorScheme.secondary),
          ),
          title: Text(
            title,
            style: const TextStyle(fontSize: 13, color: Colors.grey, fontWeight: FontWeight.w500),
          ),
          trailing: Text(
            '$formattedValue $unit',
            style: theme.textTheme.titleMedium?.copyWith(
              fontWeight: FontWeight.bold,
              fontFamily: 'monospace', // Ideal for clean numeric alignment
              color: theme.colorScheme.onSurface,
            ),
          ),
        ),
      ),
    );
  }
}
`
  },
  {
    path: 'lib/widgets/splash_screen.dart',
    description: 'Bilingual animated splash screen with professional logo transitions introducing Ebadi Industrial Consultants.',
    code: `import 'package:flutter/material.dart';
import 'package:flutter_gen/gen_l10n/app_localizations.dart';

class SplashScreen extends StatefulWidget {
  final Widget nextPage;
  const SplashScreen({super.key, required this.nextPage});

  @override
  State<SplashScreen> createState() => _SplashScreenState();
}

class _SplashScreenState extends State<SplashScreen> with SingleTickerProviderStateMixin {
  late AnimationController _controller;
  late Animation<double> _scaleAnimation;
  late Animation<double> _opacityAnimation;

  @override
  void initState() {
    super.initState();
    _controller = AnimationController(
      vsync: this,
      duration: const Duration(milliseconds: 1800),
    );

    _scaleAnimation = Tween<double>(begin: 0.5, end: 1.0).animate(
      CurvedAnimation(parent: _controller, curve: Curves.elasticOut),
    );

    _opacityAnimation = Tween<double>(begin: 0.0, end: 1.0).animate(
      CurvedAnimation(parent: _controller, curve: const Interval(0.0, 0.7, curve: Curves.easeIn)),
    );

    _controller.forward();

    // Navigate to homepage after 3 seconds
    Future.delayed(const Duration(seconds: 3), () {
      if (mounted) {
        Navigator.of(context).pushReplacement(
          PageRouteBuilder(
            pageBuilder: (context, animation, secondaryAnimation) => widget.nextPage,
            transitionsBuilder: (context, animation, secondaryAnimation, child) {
              return FadeTransition(opacity: animation, child: child);
            },
            transitionDuration: const Duration(milliseconds: 650),
          ),
        );
      }
    });
  }

  @override
  void dispose() {
    _controller.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    final t = AppLocalizations.of(context)!;

    return Scaffold(
      backgroundColor: theme.colorScheme.primary,
      body: Center(
        child: Column(
          mainAxisAlignment: MainState.center,
          children: [
            const Spacer(flex: 3),
            ScaleTransition(
              scale: _scaleAnimation,
              child: FadeTransition(
                opacity: _opacityAnimation,
                child: Container(
                  width: 120,
                  height: 120,
                  decoration: BoxDecoration(
                    color: Colors.white,
                    borderRadius: BorderRadius.circular(24),
                    boxShadow: [
                      BoxShadow(
                        color: Colors.black.withOpacity(0.15),
                        blurRadius: 15,
                        offset: const Offset(0, 8),
                      ),
                    ],
                  ),
                  child: Center(
                    child: Text(
                      'EIC',
                      style: TextStyle(
                        fontSize: 40,
                        fontWeight: FontWeight.w900,
                        color: theme.colorScheme.primary,
                        letterSpacing: 2,
                      ),
                    ),
                  ),
                ),
              ),
            ),
            const SizedBox(height: 24),
            FadeTransition(
              opacity: _opacityAnimation,
              child: Text(
                t.title,
                style: const TextStyle(
                  fontSize: 28,
                  fontWeight: FontWeight.bold,
                  color: Colors.white,
                  letterSpacing: 1.5,
                ),
              ),
            ),
            const SizedBox(height: 8),
            FadeTransition(
              opacity: _opacityAnimation,
              child: Padding(
                padding: const EdgeInsets.symmetric(horizontal: 24.0),
                child: Text(
                  t.subtitle,
                  textAlign: TextAlign.center,
                  style: const TextStyle(
                    fontSize: 12,
                    color: Colors.white70,
                    letterSpacing: 1,
                  ),
                ),
              ),
            ),
            const Spacer(flex: 2),
            FadeTransition(
              opacity: _opacityAnimation,
              child: Column(
                children: [
                  const SizedBox(
                    width: 32,
                    height: 32,
                    child: CircularProgressIndicator(
                      color: Colors.white,
                      strokeWidth: 3,
                    ),
                  ),
                  const SizedBox(height: 16),
                  Text(
                    t.footer,
                    style: const TextStyle(
                      fontSize: 12,
                      color: Colors.white60,
                    ),
                  ),
                ],
              ),
            ),
            const Spacer(flex: 1),
          ],
        ),
      ),
    );
  }
}
`
  },
  {
    path: 'lib/l10n/app_en.arb',
    description: 'English localizable string values key-value map.',
    code: `{
  "title": "EIC",
  "subtitle": "EBADI INDUSTRIAL CONSULTANTS",
  "footer": "Developed by Salah Ebadi",
  "material": "Material Type",
  "productShape": "Product Shape",
  "round": "Round",
  "rectangular": "Rectangular",
  "diameter": "Diameter (mm)",
  "width": "Width (mm)",
  "thickness": "Thickness (mm)",
  "timePerMeter": "Time required for moving 1 meter (Seconds)",
  "calculate": "Calculate",
  "clear": "Clear",
  "crossSection": "Cross Section Area",
  "weightPerMeter": "Weight per Meter",
  "speed": "Speed",
  "hourlyProduction": "Hourly Production",
  "shiftProduction": "7.5 Hour Shift Production",
  "errorEmpty": "Please fill in all required fields.",
  "errorNegative": "Values cannot be negative.",
  "errorZero": "Values must be greater than zero.",
  "errorInvalid": "Please enter a valid numeric value.",
  "operatorPanel": "Factory Operator Panel",
  "resultsPanel": "Production Results",
  "materialAl": "AL (Aluminium)",
  "materialCu": "CU (Copper)"
}
`
  },
  {
    path: 'lib/l10n/app_fa.arb',
    description: 'Persian (Farsi) localizable string values key-value map for native RTL layout support.',
    code: `{
  "title": "EIC",
  "subtitle": "مشاوران صنعتی عبادی",
  "footer": "توسعه یافته توسط صلاح عبادی",
  "material": "نوع متریال (ماده)",
  "productShape": "شکل محصول",
  "round": "گرد",
  "rectangular": "تخت (مستطیل)",
  "diameter": "قطر (میلی‌متر)",
  "width": "عرض (میلی‌متر)",
  "thickness": "ضخامت (میلی‌متر)",
  "timePerMeter": "زمان مورد نیاز برای حرکت ۱ متر (ثانیه)",
  "calculate": "محاسبه",
  "clear": "پاک کردن",
  "crossSection": "مساحت سطح مقطع",
  "weightPerMeter": "وزن در هر متر",
  "speed": "سرعت خط تولید",
  "hourlyProduction": "تولید ساعتی",
  "shiftProduction": "تولید در شیفت ۷.۵ ساعته",
  "errorEmpty": "لطفاً تمامی فیلدهای الزامی را پر کنید.",
  "errorNegative": "مقادیر نمی‌توانند منفی باشند.",
  "errorZero": "مقادیر باید بزرگتر از صفر باشند.",
  "errorInvalid": "لطفاً یک عدد معتبر وارد کنید.",
  "operatorPanel": "پنل اپراتور کارخانه",
  "resultsPanel": "نتایج محاسبات تولید",
  "materialAl": "AL (آلومینیوم)",
  "materialCu": "CU (مس)"
}
`
  }
];
