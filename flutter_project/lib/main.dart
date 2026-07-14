import 'package:flutter/material.dart';
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
    final ColorScheme lightScheme = ColorScheme.fromSeed(
      seedColor: const Color(0xFF0F4C81),
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
        Locale('en'),
        Locale('fa'),
      ],
      locale: _locale,
      home: const SplashScreen(nextPage: HomePage()),
    );
  }
}
